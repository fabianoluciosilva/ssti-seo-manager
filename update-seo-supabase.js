#!/usr/bin/env node

/**
 * Script de Atualização de SEO - Simples Solução TI
 * Conecta ao Supabase e otimiza artigos com melhores práticas de SEO
 *
 * Uso: npm start  (ou: node --env-file=.env update-seo-supabase.js)
 */

import { createClient } from '@supabase/supabase-js';
import { SEO_OPTIMIZATIONS } from './seo-templates.js';

// ============ CONFIGURAÇÃO ============
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERRO: Variáveis SUPABASE_URL e SUPABASE_KEY não encontradas.');
  console.error('Crie um arquivo .env com essas variáveis (veja .env.example).');
  process.exit(1);
}

// ============ INICIALIZAÇÃO ============
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('Iniciando atualização de SEO...\n');

// ============ FUNÇÕES PRINCIPAIS ============

async function testConnection() {
  try {
    console.log('Testando conexão com Supabase...');
    const { data, error } = await supabase
      .from('posts')
      .select('id, slug')
      .limit(1);

    if (error) {
      console.error('Erro na conexão:', error.message);
      return false;
    }

    console.log('Conexão estabelecida!\n');
    return true;
  } catch (err) {
    console.error('Erro ao conectar:', err.message);
    return false;
  }
}

async function loadArticles() {
  try {
    console.log('Carregando artigos do banco...');
    const { data, error } = await supabase
      .from('posts')
      .select('*');

    if (error) {
      console.error('Erro ao carregar artigos:', error.message);
      return [];
    }

    console.log(`${data.length} artigos carregados\n`);
    return data;
  } catch (err) {
    console.error('Erro:', err.message);
    return [];
  }
}

function analyzeSEO(article) {
  const issues = [];
  const score = { value: 0, max: 100 };

  if (!article.seoData?.title) {
    issues.push('Title tag faltando');
  } else if (article.seoData.title.length < 30) {
    issues.push('Title tag muito curto (mín 30 chars)');
  } else if (article.seoData.title.length > 60) {
    issues.push('Title tag muito longo (máx 60 chars)');
  } else {
    score.value += 20;
  }

  if (!article.seoData?.description) {
    issues.push('Meta description faltando');
  } else if (article.seoData.description.length < 120) {
    issues.push('Meta description muito curta (mín 120 chars)');
  } else if (article.seoData.description.length > 160) {
    issues.push('Meta description muito longa (máx 160 chars)');
  } else {
    score.value += 20;
  }

  if (!article.title) {
    issues.push('H1 (title) faltando');
  } else {
    score.value += 15;
  }

  if (!article.slug) {
    issues.push('Slug faltando');
  } else if (!/^[a-z0-9-]+$/.test(article.slug)) {
    issues.push('Slug com caracteres inválidos (use apenas a-z, 0-9, hífen)');
  } else {
    score.value += 15;
  }

  if (article.main_keyword) score.value += 15;
  else issues.push('Palavra-chave principal faltando');

  if (article.keywords) score.value += 15;
  else issues.push('Palavras-chave secundárias faltando');

  return { issues, score };
}

async function updateArticleWithSEO(article, optimization) {
  try {
    const updatedData = {
      title: optimization.h1,
      slug: article.slug,
      seoData: {
        title: optimization.titleTag,
        description: optimization.metaDescription,
        keywords: optimization.secondaryKeywords
      },
      main_keyword: optimization.mainKeyword,
      keywords: optimization.secondaryKeywords,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('posts')
      .update(updatedData)
      .eq('id', article.id);

    if (error) {
      console.error(`Erro ao atualizar ${article.slug}:`, error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`Erro ao atualizar ${article.slug}:`, err.message);
    return false;
  }
}

async function generateSEOReport(articles) {
  console.log('\n' + '='.repeat(70));
  console.log('RELATÓRIO DE SEO ATUAL');
  console.log('='.repeat(70) + '\n');

  let totalScore = 0;
  let articlesOptimized = 0;

  for (const article of articles) {
    const { issues, score } = analyzeSEO(article);
    totalScore += score.value;

    console.log(`Artigo: ${article.slug}`);
    console.log(`   Score: ${score.value}/${score.max} (${Math.round((score.value / score.max) * 100)}%)`);

    if (issues.length > 0) {
      console.log(`   Problemas:`);
      issues.forEach(issue => console.log(`     - ${issue}`));
    } else {
      console.log(`   Otimizado!`);
      articlesOptimized++;
    }
    console.log('');
  }

  const avgScore = Math.round(totalScore / articles.length);
  console.log('='.repeat(70));
  console.log(`Média de Score: ${avgScore}%`);
  console.log(`Artigos Otimizados: ${articlesOptimized}/${articles.length}`);
  console.log('='.repeat(70) + '\n');

  return avgScore;
}

async function applyBatchOptimizations() {
  console.log('Aplicando otimizações de SEO...\n');

  const articles = await loadArticles();
  if (articles.length === 0) return;

  let successCount = 0;
  let skipCount = 0;

  for (const article of articles) {
    const optimization = SEO_OPTIMIZATIONS[article.slug];

    if (optimization) {
      console.log(`Atualizando: ${article.slug}`);
      const success = await updateArticleWithSEO(article, optimization);
      if (success) {
        console.log(`  OK: ${article.slug}\n`);
        successCount++;
      }
    } else {
      console.log(`  Sem template definido para: ${article.slug} (pulado)\n`);
      skipCount++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('RESULTADO DA ATUALIZAÇÃO');
  console.log('='.repeat(70));
  console.log(`Atualizados: ${successCount}`);
  console.log(`Pulados:     ${skipCount}`);
  console.log('='.repeat(70) + '\n');
}

async function exportSEOReport(articles) {
  const report = {
    timestamp: new Date().toISOString(),
    totalArticles: articles.length,
    articles: articles.map(article => ({
      slug: article.slug,
      title: article.title,
      seoData: article.seoData,
      mainKeyword: article.main_keyword,
      ...analyzeSEO(article)
    }))
  };

  const fs = await import('fs');
  fs.writeFileSync('seo-report.json', JSON.stringify(report, null, 2));
  console.log('Relatório salvo em: seo-report.json\n');
}

// ============ EXECUÇÃO PRINCIPAL ============
async function main() {
  const connected = await testConnection();
  if (!connected) process.exit(1);

  const articles = await loadArticles();
  if (articles.length === 0) process.exit(1);

  await generateSEOReport(articles);
  await applyBatchOptimizations();
  await exportSEOReport(await loadArticles());

  console.log('Processo concluído com sucesso!');
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
