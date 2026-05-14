#!/usr/bin/env node

/**
 * Gerador Automático de SEO com IA - Simples Solução TI
 * Usa Claude para gerar title tag, meta description e keywords para todos os artigos
 *
 * Uso: npm run generate
 */

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

// ============ CONFIGURAÇÃO ============
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !ANTHROPIC_API_KEY) {
  console.error('Erro: SUPABASE_URL, SUPABASE_KEY e ANTHROPIC_API_KEY são necessários no .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const BATCH_SIZE = 5;   // requisições paralelas por vez
const DELAY_MS = 1500;  // pausa entre batches (ms)

// System prompt com cache para economizar tokens
const SYSTEM_PROMPT = [
  {
    type: 'text',
    text: `Você é um especialista em SEO para empresas de TI brasileiras B2B.
Gere otimizações de SEO para artigos do blog da "Simples Solução TI", empresa de TI localizada no Rio de Janeiro (RJ), especializada em: infraestrutura de rede, segurança cibernética, suporte técnico, cloud, CFTV, PABX, backup e gestão de TI para PMEs.

Regras obrigatórias:
- titleTag: máximo 60 caracteres, keyword principal no início
- metaDescription: entre 120 e 160 caracteres, termine com um CTA ("Solicite orçamento.", "Saiba mais.", "Fale com especialista.", etc.)
- mainKeyword: 2 a 4 palavras em português, foco em intenção de busca
- secondaryKeywords: 5 a 8 keywords separadas por vírgula, sem espaço após vírgula
- h1: título principal otimizado, pode ser mais descritivo que o titleTag

Responda APENAS com JSON válido, sem markdown, sem explicações.`,
    cache_control: { type: 'ephemeral' }
  }
];

// ============ FUNÇÕES ============

async function generateSEO(article) {
  const slugWords = article.slug.replace(/-/g, ' ');
  const title = article.title || slugWords;

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Slug: ${article.slug}\nTítulo atual: ${title}\n\nGere o JSON com: titleTag, metaDescription, mainKeyword, secondaryKeywords, h1`
      }
    ]
  });

  const text = response.content[0].text.trim();
  // Remove possíveis blocos markdown caso o modelo adicione
  const clean = text.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '').trim();
  return JSON.parse(clean);
}

async function updateArticle(article, seo) {
  const { error } = await supabase
    .from('posts')
    .update({
      seo_title: seo.titleTag,
      seo_description: seo.metaDescription,
      main_keyword: seo.mainKeyword,
      keywords: seo.secondaryKeywords
    })
    .eq('id', article.id);

  if (error) throw new Error(error.message);
}

async function processBatch(batch, counter, total) {
  const results = await Promise.allSettled(
    batch.map(async (article) => {
      const seo = await generateSEO(article);
      await updateArticle(article, seo);
      return article.slug;
    })
  );

  results.forEach((result, i) => {
    const num = counter + i + 1;
    if (result.status === 'fulfilled') {
      console.log(`[${num}/${total}] OK: ${result.value}`);
    } else {
      console.error(`[${num}/${total}] ERRO: ${batch[i].slug} — ${result.reason?.message}`);
    }
  });

  return results.filter(r => r.status === 'fulfilled').length;
}

async function loadArticlesNeedingSEO() {
  const { data, error } = await supabase
    .from('posts')
    .select('*');

  if (error) throw new Error(error.message);

  return data.filter(a => !a.seo_title || !a.main_keyword);
}

// ============ MAIN ============
async function main() {
  console.log('Gerador Automático de SEO com IA\n');

  console.log('Carregando artigos sem SEO...');
  const articles = await loadArticlesNeedingSEO();

  if (articles.length === 0) {
    console.log('Todos os artigos já estão otimizados!');
    return;
  }

  const batches = Math.ceil(articles.length / BATCH_SIZE);
  const estimatedMin = Math.round((articles.length * 2) / 60);
  console.log(`${articles.length} artigos para processar em ${batches} batches de ${BATCH_SIZE}`);
  console.log(`Tempo estimado: ~${estimatedMin} minutos\n`);

  let totalDone = 0;

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    const done = await processBatch(batch, i, articles.length);
    totalDone += done;

    if (i + BATCH_SIZE < articles.length) {
      await new Promise(res => setTimeout(res, DELAY_MS));
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Concluído: ${totalDone}/${articles.length} artigos otimizados`);
  console.log(`${'='.repeat(50)}`);
}

main().catch(err => {
  console.error('Erro fatal:', err.message);
  process.exit(1);
});
