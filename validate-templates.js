#!/usr/bin/env node

/**
 * Script de Validação de Templates SEO
 * Verifica se todos os templates estão corretos e completos
 */

const fs = require('fs');
const path = require('path');

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}\n`)
};

/**
 * Validar template individual
 */
function validateTemplate(slug, template) {
  const errors = [];
  
  // Validar campos obrigatórios
  if (!template.titleTag) {
    errors.push('titleTag faltando');
  } else if (template.titleTag.length < 30) {
    errors.push(`titleTag muito curto (${template.titleTag.length}/30 mín)`);
  } else if (template.titleTag.length > 60) {
    errors.push(`titleTag muito longo (${template.titleTag.length}/60 máx)`);
  }

  if (!template.metaDescription) {
    errors.push('metaDescription faltando');
  } else if (template.metaDescription.length < 120) {
    errors.push(`metaDescription muito curta (${template.metaDescription.length}/120 mín)`);
  } else if (template.metaDescription.length > 160) {
    errors.push(`metaDescription muito longa (${template.metaDescription.length}/160 máx)`);
  }

  if (!template.mainKeyword) {
    errors.push('mainKeyword faltando');
  }

  if (!template.secondaryKeywords) {
    errors.push('secondaryKeywords faltando');
  }

  if (!template.h1) {
    errors.push('h1 faltando');
  }

  // Validar conteúdo do title e description
  if (template.titleTag && !template.titleTag.includes(template.mainKeyword)) {
    errors.push(`titleTag não inclui mainKeyword "${template.mainKeyword}"`);
  }

  if (template.metaDescription && !template.metaDescription.toLowerCase().includes(template.mainKeyword.toLowerCase())) {
    errors.push(`metaDescription não inclui mainKeyword "${template.mainKeyword}"`);
  }

  return errors;
}

/**
 * Validar todos templates
 */
function validateAllTemplates() {
  log.header('🔍 Validando Templates SEO');

  try {
    // Tentar carregar o arquivo como módulo
    const templatesPath = path.join(__dirname, '../seo-templates.js');
    
    if (!fs.existsSync(templatesPath)) {
      log.warning('Arquivo seo-templates.js não encontrado');
      return true;
    }

    // Ler o arquivo e extrair templates (método simples)
    const content = fs.readFileSync(templatesPath, 'utf-8');
    
    // Procurar por padrões de templates
    const templatePattern = /'{1}([a-z0-9\-]+)'{1}\s*:\s*{/g;
    const matches = [...content.matchAll(templatePattern)];

    if (matches.length === 0) {
      log.warning('Nenhum template encontrado no arquivo');
      return true;
    }

    log.info(`${matches.length} templates encontrados\n`);

    let totalErrors = 0;
    let validTemplates = 0;

    matches.forEach(match => {
      const slug = match[1];
      
      // Validações simples via regex
      const hasTitle = new RegExp(`'${slug}'[\\s\\S]*titleTag[\\s\\S]*'[^']{30,60}'`).test(content);
      const hasDescription = new RegExp(`'${slug}'[\\s\\S]*metaDescription[\\s\\S]*'[^']{120,160}'`).test(content);
      const hasKeyword = new RegExp(`'${slug}'[\\s\\S]*mainKeyword[\\s\\S]*'[^']+'`).test(content);
      const hasH1 = new RegExp(`'${slug}'[\\s\\S]*h1[\\s\\S]*'[^']+'`).test(content);

      const errors = [];
      if (!hasTitle) errors.push('titleTag inválido (30-60 chars)');
      if (!hasDescription) errors.push('metaDescription inválida (120-160 chars)');
      if (!hasKeyword) errors.push('mainKeyword faltando');
      if (!hasH1) errors.push('h1 faltando');

      if (errors.length === 0) {
        log.success(`${slug}`);
        validTemplates++;
      } else {
        log.error(`${slug}`);
        errors.forEach(e => console.log(`   └─ ${e}`));
        totalErrors += errors.length;
      }
    });

    log.header('📊 Resultado da Validação');
    console.log(`Total de templates: ${matches.length}`);
    console.log(`✅ Válidos: ${validTemplates}`);
    console.log(`❌ Erros encontrados: ${totalErrors}\n`);

    return totalErrors === 0;
  } catch (error) {
    log.error(`Erro ao validar templates: ${error.message}`);
    return false;
  }
}

/**
 * Validar env
 */
function validateEnv() {
  log.header('🔐 Validando Variáveis de Ambiente');

  const required = ['SUPABASE_URL', 'SUPABASE_KEY'];
  let missingVars = [];

  required.forEach(varName => {
    if (process.env[varName]) {
      log.success(`${varName} configurado`);
    } else {
      log.warning(`${varName} não encontrado`);
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    log.info(`\nVariáveis faltantes: ${missingVars.join(', ')}`);
    log.info('Crie um arquivo .env com essas variáveis');
  }
}

/**
 * Executar validações
 */
function main() {
  console.log(`\n${colors.bold}${colors.cyan}🚀 SEO Template Validator${colors.reset}\n`);

  const templatesValid = validateAllTemplates();
  validateEnv();

  log.header('✨ Resumo');
  if (templatesValid) {
    log.success('Todas as validações passaram!');
    process.exit(0);
  } else {
    log.error('Existem erros a corrigir');
    process.exit(1);
  }
}

main();
