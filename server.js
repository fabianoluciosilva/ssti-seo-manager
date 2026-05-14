#!/usr/bin/env node

/**
 * Dashboard Server - SEO Manager SSTI
 * Interface web para gerenciar e executar otimizações de SEO
 *
 * Uso: npm run dashboard
 */

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Erro: SUPABASE_URL e SUPABASE_KEY são necessários no .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// ============ API ============

app.get('/api/stats', async (req, res) => {
  try {
    const { data, error } = await supabase.from('posts').select('*');
    if (error) return res.status(500).json({ error: error.message });

    const total = data.length;
    const withSEO = data.filter(a => a.seo_title && a.main_keyword).length;
    const pending = total - withSEO;

    const recent = data
      .filter(a => a.seo_title)
      .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
      .slice(0, 5)
      .map(a => ({ slug: a.slug, seo_title: a.seo_title, main_keyword: a.main_keyword }));

    res.json({ total, withSEO, pending, recent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SSE: roda o gerador e transmite o progresso em tempo real
app.get('/api/generate/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (type, data) => {
    res.write(`data: ${JSON.stringify({ type, data })}\n\n`);
  };

  send('start', 'Iniciando geração de SEO com IA...');

  const child = spawn(
    process.execPath,
    ['--env-file=.env', 'auto-seo-generator.js'],
    { cwd: __dirname, env: process.env }
  );

  child.stdout.on('data', chunk => {
    const lines = chunk.toString().split('\n').filter(l => l.trim());
    lines.forEach(line => send('log', line));
  });

  child.stderr.on('data', chunk => {
    send('error', chunk.toString().trim());
  });

  child.on('close', code => {
    send('done', code === 0 ? 'Concluído com sucesso!' : `Processo encerrado com código ${code}`);
    res.end();
  });

  req.on('close', () => child.kill());
});

// ============ START ============

app.listen(PORT, () => {
  console.log(`\nDashboard SEO rodando em: http://localhost:${PORT}\n`);
});
