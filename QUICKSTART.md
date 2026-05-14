# ⚡ Quick Start Guide

Comece em **5 minutos**!

---

## 🎯 Opção 1: Web (Mais Rápido - Nenhuma Instalação)

### 1. Abrir Arquivo
```bash
# Clique duplo em:
seo-manager.html
```

### 2. Configurar Credenciais Supabase
- Vá para: https://app.supabase.com
- Settings → API
- Copie: **Project URL** e **anon public key**
- Cole no formulário

### 3. Testar Conexão
- Clique em "🔗 Testar Conexão"
- ✅ Pronto!

### 4. Selecionar e Otimizar
1. Clique no artigo
2. Preencha as 3 abas
3. Veja o score aumentar
4. Clique em "💾 Salvar"

---

## 🚀 Opção 2: GitHub Actions (Automático - 5 minutos)

### 1. Criar Repositório
```bash
# Vá para: https://github.com/new
# Nome: ssti-seo-manager
# Crie repositório
```

### 2. Upload de Arquivos
```bash
# Faça upload destes arquivos:
- package.json
- update-seo-supabase.js
- seo-manager.html
- seo-templates.js
- .env.example
- .gitignore
# E pastas:
- .github/workflows/
- scripts/
```

### 3. Adicionar Secrets
```bash
# Settings → Secrets and variables → Actions
# New repository secret:

SUPABASE_URL = https://sshwjdhnjlevwxqaeqqa.supabase.co
SUPABASE_KEY = (sua chave aqui)
```

### 4. Executar
```bash
# Actions → SEO Optimization Runner → Run workflow
```

**Pronto! Agora executa automaticamente toda segunda-feira às 09:00 UTC**

---

## 💻 Opção 3: CLI Node.js (Mais Controle - 2 minutos)

### 1. Instalar
```bash
npm install
```

### 2. Configurar .env
```bash
# Copie .env.example → .env
# Preencha:
SUPABASE_URL=https://sshwjdhnjlevwxqaeqqa.supabase.co
SUPABASE_KEY=sua_chave_aqui
```

### 3. Executar
```bash
npm start
```

---

## 📊 Próximos Passos

### Depois de tomar uma ação:

✅ **Verifique Resultados**
- HTML: Veja o SEO Score aumentar
- GitHub: Actions → Artifacts → seo-report.json
- CLI: Veja relatório no terminal

✅ **Customize Templates**
- Edite `seo-templates.js`
- Adicione seus artigos
- Rode validação: `npm run validate`

✅ **Configure Notificações** (Opcional)
- Email: Veja GITHUB_SECRETS.md
- Slack: Veja GITHUB_SECRETS.md

---

## 🆘 Problemas?

### "Failed to fetch" (HTML)
**Solução**: Use Option 2 (GitHub) ou Option 3 (Node.js)

### "Could not get JWT" (qualquer opção)
**Solução**: Regenere chave em Supabase Settings → API

### Workflow não executa
**Solução**:
1. Verifique se secrets estão adicionados
2. Aguarde 10 minutos
3. Refresh a página

### Erro ao conectar Supabase
**Solução**:
1. Verifique URL (exatamente: `https://sshwjdhnjlevwxqaeqqa.supabase.co`)
2. Regenere chave
3. Teste manualmente em https://app.supabase.com

---

## 📚 Documentação Completa

- **README.md** → Documentação completa
- **GITHUB_SETUP.md** → Passo a passo GitHub
- **GITHUB_SECRETS.md** → Configuração de secrets
- **CHANGELOG.md** → Histórico de versões

---

## 🎉 Sucesso!

Você agora tem:
- ✅ SEO Manager instalado
- ✅ Conectado ao Supabase
- ✅ Pronto para otimizar artigos
- ✅ Automação (se GitHub)

**Próximo passo**: Otimize seu primeiro artigo!

---

**Dúvidas? Abra uma Issue: https://github.com/SEU_USUARIO/ssti-seo-manager/issues**
