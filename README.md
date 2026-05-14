# 🔍 SEO Manager - Simples Solução TI

![GitHub Release](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node Version](https://img.shields.io/badge/node->=16.0.0-brightgreen)

Gerenciador completo e automatizado para otimizar artigos do blog com melhores práticas de SEO, conectando-se diretamente ao Supabase com CI/CD via GitHub Actions.

**🚀 Deploy Ready | 🤖 CI/CD Automático | 📊 Relatórios | 🔒 Seguro**

---

## ⚡ Início Rápido

### Opção 1: Interface Web (Sem instalação)
```bash
# Abra no navegador (clique duplo)
seo-manager.html
```

### Opção 2: Automação com GitHub
```bash
# Crie repositório e configure secrets (veja GITHUB_SETUP.md)
# Executa automaticamente toda segunda-feira
# Ou manualmente via GitHub Actions
```

### Opção 3: CLI Node.js
```bash
npm install
npm start
```

---

## 📋 O que você precisa

1. **Credenciais do Supabase**:
   - URL do projeto
   - Chave de API (anon public)

2. **Node.js 16+** (para o script automático)
   - OU
   - Navegador moderno (para interface HTML)

---

## 🚀 Opção 1: Usar a Interface HTML (Mais Fácil)

### Passo 1: Abrir o arquivo
```bash
# No Windows:
start seo-manager.html

# No macOS:
open seo-manager.html

# No Linux:
xdg-open seo-manager.html
```

**OU** clique duplo em `seo-manager.html`

### Passo 2: Obter credenciais Supabase

1. Abra https://app.supabase.com
2. Selecione seu projeto
3. Vá para **Settings → API**
4. Copie:
   - **Project URL**: `https://sshwjdhnjlevwxqaeqqa.supabase.co`
   - **anon public key**: `eyJhbGc...`

### Passo 3: Cole no formulário

- Cole a URL em "URL do Projeto Supabase"
- Cole a chave em "Chave de API"
- Clique em **Testar Conexão** ✅

### Passo 4: Selecione e otimize

1. Seus artigos carregarão na lista
2. Clique em um artigo para editar
3. Preencha as 3 abas:
   - **Meta Tags**: Title, Description, Keywords, Slug
   - **Conteúdo**: H1, Keywords, Introdução
   - **Checklist**: Marque os itens implementados
4. Veja o SEO Score aumentar em tempo real
5. Quando atingir 70%+, clique em **Salvar no Supabase**

---

## 🔧 Opção 2: Usar Script Node.js (Para Automação)

### Passo 1: Instalar dependências

```bash
# Abra terminal na pasta do arquivo
npm install
```

### Passo 2: Configurar credenciais

Abra `update-seo-supabase.js` com um editor (VSCode, Notepad++, etc)

Procure esta linha:
```javascript
const SUPABASE_KEY = 'seu_anon_key_aqui'; // Cole sua chave aqui
```

Cole sua chave real:
```javascript
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Passo 3: Adicionar otimizações

No mesmo arquivo, procure por `SEO_OPTIMIZATIONS`:

```javascript
const SEO_OPTIMIZATIONS = {
  'migracao-de-sistema-contabil': {
    titleTag: 'Migração de Sistema Contábil (Ex: Prosoft): Guia Seguro 2026',
    metaDescription: 'Migre do Prosoft sem perda de dados...',
    mainKeyword: 'migração de sistema contábil',
    secondaryKeywords: 'prosoft, migração contábil, ...',
    h1: 'Migração de Sistema Contábil...'
  },
  
  // Adicione mais artigos:
  'seu-outro-artigo': {
    titleTag: '...',
    metaDescription: '...',
    // etc
  }
};
```

### Passo 4: Rodar o script

```bash
npm start
```

Ou:

```bash
node update-seo-supabase.js
```

### O que acontece:

✅ Testa conexão com Supabase  
✅ Carrega todos os artigos  
✅ Analisa SEO atual (score por artigo)  
✅ Aplica otimizações definidas  
✅ Gera relatório JSON  
✅ Mostra resumo final  

---

## 📊 Estrutura do Supabase

Seus artigos estão na tabela `posts` com essa estrutura:

```json
{
  "id": "uuid",
  "slug": "migracao-de-sistema-contabil",
  "title": "Migração de Sistema Contábil...",
  "seoData": {
    "title": "Meta title tag...",
    "description": "Meta description..."
  },
  "richContent": [...],
  "keywords": "prosoft, contabilidade, segurança",
  "main_keyword": "migração sistema contábil",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-05-14T12:30:00Z"
}
```

---

## ✅ Checklist de SEO

Implemente todos os 8 itens para atingir 100%:

1. **Keyword no H1 e primeiras 100 palavras**
   - A palavra-chave deve aparecer naturalmente no título e abertura
   - Exemplo: "Migração de **sistema contábil** (Ex: Prosoft): Guia Seguro"

2. **Meta description com call-to-action**
   - Inclua um CTA ("Descubra como", "Comece agora", "Leia agora")
   - Máximo 160 caracteres
   - Exemplo: "Migre do Prosoft sem perda de dados. Descubra 5 passos comprovados... Comece agora"

3. **Estrutura com H2 e H3**
   - Mínimo 3 seções H2
   - Cada H2 com 2-3 H3
   - Use keywords secundárias nos H2/H3

4. **URLs otimizadas (slug)**
   - Descritivo: `migracao-de-sistema-contabil`
   - Sem acentos, números ou underscores
   - Com keyword principal

5. **Links internos (2-4 por artigo)**
   - Aponte para posts relacionados
   - Use âncoras descritivas (não "clique aqui")
   - Exemplo: `[Veja nosso guia de integração com ERP](#)`

6. **Imagem com alt text**
   - Pelo menos 1 imagem
   - Alt text descritivo com keyword
   - Exemplo: `alt="Migração segura de sistema contábil Prosoft"`

7. **Tamanho de conteúdo (mínimo 800 palavras)**
   - 800-2000+ palavras ranqueia melhor
   - Estruture em seções bem definidas
   - Use listas, tabelas e exemplos práticos

8. **Schema Markup (JSON-LD)**
   - Adicione schema.org no `<head>` ou footer
   - Tipo: `Article` ou `BlogPosting`
   - Exemplo no final deste arquivo

---

## 🎯 Métricas de SEO

Após aplicar as otimizações, monitore:

### Antes (Sem otimização)
```
❌ Title Tag: faltando
❌ Meta Description: faltando
❌ H1: faltando
❌ Slug: genérico
⚠️ Keyword: não identificada
Score: 20%
```

### Depois (Com otimização)
```
✅ Title Tag: "Migração de Sistema Contábil (Prosoft): Guia 2026"
✅ Meta Description: "Migre sem perda de dados. Descubra 5 passos... Comece agora"
✅ H1: único e com keyword
✅ Slug: otimizado
✅ Keyword: nos primeiros 100 caracteres
Score: 95%
```

---

## 📈 Implementar Schema Markup

Cole este código no seu Next.js/HTML (dentro de `<head>`):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Migração de Sistema Contábil (Ex: Prosoft): Guia Seguro 2026",
  "description": "Migre do Prosoft sem perda de dados. Descubra 5 passos comprovados para garantir segurança...",
  "image": "https://seusite.com/imagem.jpg",
  "author": {
    "@type": "Organization",
    "name": "Simples Solução TI"
  },
  "datePublished": "2024-01-01",
  "dateModified": "2024-05-14"
}
</script>
```

---

## 🔐 Segurança

**IMPORTANTE**: 
- Nunca compartilhe sua chave Supabase
- Use a chave `anon public` (não admin)
- Se vazar, regenere em Settings → API

---

## ❓ Troubleshooting

### Erro: "Failed to fetch"
**Solução**: Use a interface HTML (navegador) em vez de curl/Postman

### Erro: "Could not get JWT"
**Solução**: Sua chave expirou ou é inválida. Regenere em Supabase

### Artigos não carregam
1. Verifique conexão internet
2. Confirme que tabela `posts` existe
3. Teste credenciais em https://app.supabase.com

### SEO Score muito baixo
1. Preencha Title e Description
2. Adicione H1 e Keywords
3. Marque itens no Checklist

---

## 📚 Recursos Adicionais

- **Supabase Docs**: https://supabase.com/docs
- **Google SEO Starter Guide**: https://developers.google.com/search/docs/beginner/seo-starter-guide
- **Schema.org**: https://schema.org/BlogPosting

---

## 📞 Suporte

Se tiver dúvidas:
1. Verifique este README
2. Confirme credenciais Supabase
3. Teste conexão novamente

---

## 📝 Changelog

### v1.0.0 (2024-05-14)
- ✅ Interface HTML completa com abas
- ✅ Script Node.js para automação
- ✅ Análise de SEO em tempo real
- ✅ Relatório JSON com métricas
- ✅ 8-item SEO Checklist

---

## 🚀 Setup GitHub Actions (Automação)

### Passo 1: Criar Repositório

Siga o guia completo em **GITHUB_SETUP.md**:

```bash
# Resumido:
1. Vá para https://github.com/new
2. Nome: ssti-seo-manager
3. Crie repositório
4. Faça upload dos arquivos
```

### Passo 2: Configurar Secrets

Vá para **Settings → Secrets and variables → Actions**

Adicione:
- `SUPABASE_URL`: https://sshwjdhnjlevwxqaeqqa.supabase.co
- `SUPABASE_KEY`: Sua chave anon public

Veja **GITHUB_SECRETS.md** para detalhes.

### Passo 3: Ativar Workflows

1. Vá para **Actions** no repositório
2. Você verá 2 workflows automáticos:
   - 📊 **SEO Optimization Runner** (toda segunda às 09:00 UTC)
   - ✅ **SEO Validation on Push** (a cada commit)

### Passo 4: Executar Manualmente

```
GitHub → Actions → SEO Optimization Runner → Run workflow
```

---

## 📊 Workflows Inclusos

### 1. SEO Optimization Runner
**Quando executa**: Toda segunda-feira às 09:00 UTC (ou manual)
**O que faz**:
- ✅ Testa conexão Supabase
- ✅ Carrega todos artigos
- ✅ Analisa SEO atual
- ✅ Aplica otimizações
- ✅ Gera relatório JSON
- ✅ (Opcional) Envia email/Slack

**Tempo de execução**: 2-5 minutos

### 2. SEO Validation on Push
**Quando executa**: Toda vez que você edita `seo-templates.js` ou `update-seo-supabase.js`
**O que faz**:
- ✅ Valida sintaxe JavaScript
- ✅ Verifica templates SEO
- ✅ Lint de código
- ✅ Bloqueia merge se houver erros

---

## 📁 Estrutura do Repositório

```
ssti-seo-manager/
├── .github/
│   └── workflows/
│       ├── seo-optimization.yml      # 📊 Execução automática
│       └── validate.yml              # ✅ Validação em push
├── scripts/
│   └── validate-templates.js         # 🔍 Validador
├── seo-manager.html                  # 🌐 Interface web
├── update-seo-supabase.js            # ⚙️  Script automação
├── seo-templates.js                  # 📝 Templates SEO
├── package.json                      # 📦 Dependências
├── .env.example                      # 🔑 Config exemplo
├── .gitignore                        # 📌 Git config
├── README.md                         # 📖 Documentação
├── GITHUB_SETUP.md                   # 🚀 Setup GitHub
└── GITHUB_SECRETS.md                 # 🔐 Secrets
```

---

## 🔄 Fluxo Contínuo

```
1️⃣ Toda segunda-feira
   └─ GitHub Actions executa SEO Optimization Runner
   
2️⃣ Analisa todos artigos no Supabase
   └─ Gera relatório de SEO atual
   
3️⃣ Aplica otimizações
   └─ Title, Description, Keywords
   
4️⃣ Salva no Supabase
   └─ Atualiza artigos automaticamente
   
5️⃣ Gera relatório JSON
   └─ Disponível em Actions → Artifacts
   
6️⃣ Notifica (opcional)
   └─ Email ou Slack com resultado
```

---

## 🔐 Segurança

✅ **Protegido por**:
- GitHub Secrets (credenciais criptografadas)
- Chaves anon public (não admin)
- Sem .env em repositório
- RLS policies no Supabase

✅ **Boas práticas**:
- Never commit `.env` real
- Regenere chaves regularmente
- Use .env.example como template
- Role-based access no Supabase

---

## 📞 Documentação Adicional

- **GITHUB_SETUP.md** → Como criar repositório e configurar
- **GITHUB_SECRETS.md** → Como adicionar credenciais seguras
- **seo-templates.js** → Templates de otimizações prontos
- Seção anterior deste README → Todos os detalhes

---

**Desenvolvido com 💜 por Simples Solução TI**
