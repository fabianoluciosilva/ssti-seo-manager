# 🚀 Guia Completo: Criar Repositório GitHub com SEO Manager

Instruções passo a passo para criar um repositório profissional e automatizado.

---

## 📋 Pré-requisitos

- Conta GitHub (gratuita em https://github.com)
- Git instalado no seu computador
- Credenciais Supabase

---

## 🎯 Opção 1: Criar Repositório via Web (Mais Fácil)

### Passo 1: Acessar GitHub

1. Vá para https://github.com/new
2. Faça login (se necessário)

### Passo 2: Criar novo repositório

- **Repository name**: `ssti-seo-manager`
- **Description**: "Gerenciador de SEO para Blog - Simples Solução TI"
- **Visibility**: Private (se quiser privado) ou Public (recomendado)
- **Initialize this repository with**:
  - ✅ Add a README file
  - ✅ Add .gitignore
  - ✅ Choose a license → MIT

Clique em **Create repository**

### Passo 3: Fazer upload dos arquivos

Na página do repositório:

1. Clique em **Add file** → **Upload files**
2. Arraste ou selecione estes arquivos:
   ```
   package.json
   update-seo-supabase.js
   seo-manager.html
   seo-templates.js
   README.md
   .env.example
   .gitignore
   ```

3. Commit message: `Initial commit: SEO Manager setup`
4. Clique em **Commit changes**

### Passo 4: Criar pasta `.github/workflows`

1. Clique em **Add file** → **Create new file**
2. Nome: `.github/workflows/seo-optimization.yml`
3. Cole o conteúdo do arquivo workflow
4. Commit

Repita para: `.github/workflows/validate.yml`

### Passo 5: Criar pasta `scripts`

1. Clique em **Add file** → **Create new file**
2. Nome: `scripts/validate-templates.js`
3. Cole o conteúdo do validador
4. Commit

---

## 🖥️ Opção 2: Usar Git CLI (Para Desenvolvedores)

### Passo 1: Criar repositório no GitHub

Acesse https://github.com/new e siga os passos da Opção 1, mas **SEM** inicializar com README.

### Passo 2: Clonar e adicionar arquivos localmente

```bash
# Crie uma pasta para o projeto
mkdir ssti-seo-manager
cd ssti-seo-manager

# Inicialize Git
git init

# Adicione seu repositório remoto
git remote add origin https://github.com/SEU_USUARIO/ssti-seo-manager.git

# Copie todos os arquivos para esta pasta:
# - package.json
# - update-seo-supabase.js
# - seo-manager.html
# - seo-templates.js
# - README.md
# - .env.example
# - .gitignore
# - scripts/validate-templates.js
# - .github/workflows/seo-optimization.yml
# - .github/workflows/validate.yml

# Adicione os arquivos ao Git
git add .

# Crie commit inicial
git commit -m "Initial commit: SEO Manager setup"

# Envie para GitHub
git branch -M main
git push -u origin main
```

### Passo 3: Criar branches de desenvolvimento

```bash
# Crie branch develop
git checkout -b develop
git push -u origin develop

# Volte para main
git checkout main
```

---

## 🔐 Configurar Secrets

### Passo 1: Ir para Secrets

1. Acesse https://github.com/SEU_USUARIO/ssti-seo-manager/settings/secrets/actions
2. Clique em **New repository secret**

### Passo 2: Adicionar SUPABASE_URL

- **Name**: `SUPABASE_URL`
- **Secret**: `https://sshwjdhnjlevwxqaeqqa.supabase.co`
- Clique em **Add secret**

### Passo 3: Adicionar SUPABASE_KEY

- **Name**: `SUPABASE_KEY`
- **Secret**: Cole sua chave anon public (obtenha em Supabase Settings → API)
- Clique em **Add secret**

### Passo 4: (Opcional) Adicionar Slack/Email

Para notificações, adicione:
- `SLACK_WEBHOOK` (sua URL do Slack)
- `EMAIL_RECIPIENT` (seu email)

---

## ✅ Validar Configuração

### Passo 1: Verificar Workflows

1. Vá para a aba **Actions** do repositório
2. Você deve ver 2 workflows:
   - 📊 SEO Optimization Runner
   - ✅ SEO Validation on Push

### Passo 2: Testar Validação

1. Edite um arquivo (ex: adicione espaço em `README.md`)
2. Commit com mensagem: `test: validate workflow`
3. Vá para **Actions** e veja o workflow rodar

### Passo 3: Executar SEO Optimization Manualmente

1. Vá para **Actions**
2. Selecione **SEO Optimization Runner**
3. Clique em **Run workflow**
4. Aguarde 2-5 minutos
5. Verifique o resultado

---

## 📊 Estrutura do Repositório Final

```
ssti-seo-manager/
├── .github/
│   └── workflows/
│       ├── seo-optimization.yml      # Executa SEO toda segunda
│       └── validate.yml              # Valida em cada push
├── scripts/
│   └── validate-templates.js         # Script de validação
├── seo-manager.html                  # Interface web
├── update-seo-supabase.js            # Script de automação
├── seo-templates.js                  # Templates pré-prontos
├── package.json                      # Dependências Node
├── .env.example                      # Exemplo de variáveis
├── .gitignore                        # Arquivos a ignorar
├── README.md                         # Documentação
├── GITHUB_SECRETS.md                 # Guia de secrets
└── GITHUB_SETUP.md                   # Este arquivo
```

---

## 🔄 Fluxo de Trabalho (Workflow)

### Automação Semanal

Toda **segunda-feira às 09:00 UTC**:
1. GitHub Actions executa o script
2. Analisa todos artigos
3. Aplica otimizações
4. Gera relatório JSON
5. (Opcional) Envia email/Slack

### Manual (Sob Demanda)

1. Vá para **Actions** → **SEO Optimization Runner**
2. Clique em **Run workflow**
3. Preencha artigos (deixe em branco para todos)
4. Clique em **Run workflow**

### Validação em Cada Push

1. Edite `seo-templates.js` ou `update-seo-supabase.js`
2. Faça push
3. GitHub Actions valida automaticamente
4. Só permite merge se passar na validação

---

## 📈 Monitorar Execuções

### Aba Actions

1. Clique em **Actions** no seu repositório
2. Veja histórico de execuções
3. Clique em uma execução para ver logs detalhados
4. Baixe relatórios (seo-report.json)

### Configurar Notificações

**Email**:
- GitHub → Settings → Notifications
- ✅ "Send me email notifications"
- ✅ "Include your own updates"

**Slack** (se configurado):
- Receberá automáticamente após cada execução

---

## 🚨 Troubleshooting

### Workflows não aparecem
**Solução:**
- Aguarde 5-10 minutos após push
- Refresh a página (Ctrl+Shift+R)
- Verifique se arquivo está em `.github/workflows/`

### Erro: "Could not get JWT"
**Solução:**
- Chave SUPABASE_KEY expirou
- Regenere em https://app.supabase.com → Settings → API
- Atualize secret no GitHub

### Workflow falha
**Como verificar:**
1. Clique em **Actions**
2. Selecione o workflow que falhou
3. Clique em **seo-optimization** (job)
4. Verifique os logs

### Relatório não salva
**Solução:**
- Verifique conectividade do Supabase
- Confirme que tabela `posts` existe
- Verifique permissões RLS no Supabase

---

## 🎓 Próximos Passos

### 1. Integrar com Next.js (Optional)
```bash
# Se quiser componente React para seu site
npm install --save ssti-seo-manager
```

### 2. Adicionar CI/CD para Deploy
Crie workflow `deploy.yml` para deploy automático após validação

### 3. Integrar com Seu Slack
Configure notificações automáticas para a equipe

### 4. Dashboard de Monitoramento
Use GitHub Insights/Actions para ver tendências de SEO

---

## 📚 Recursos

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Supabase JavaScript Library](https://supabase.com/docs/reference/javascript/introduction)
- [Git Documentation](https://git-scm.com/doc)

---

## 💬 Suporte

Se tiver dúvidas:
1. Verifique este guia
2. Leia GITHUB_SECRETS.md
3. Abra uma Issue no repositório
4. Procure ajuda em https://stackoverflow.com ou https://github.com/discussions

---

**Desenvolvido com 💜 por Simples Solução TI**

**Última atualização:** 2024-05-14
