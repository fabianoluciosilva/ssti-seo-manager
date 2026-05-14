# 🔐 Configurar Secrets no GitHub

Para que os workflows automáticos funcionem, você precisa adicionar variáveis secretas ao repositório.

## Passo 1: Acessar Configurações do Repositório

1. Abra seu repositório no GitHub
2. Vá para **Settings** (⚙️)
3. Clique em **Secrets and variables** → **Actions**
4. Clique em **New repository secret**

## Passo 2: Adicionar Secrets Obrigatórios

### `SUPABASE_URL`
- **Valor**: `https://sshwjdhnjlevwxqaeqqa.supabase.co`
- **Descrição**: URL do seu projeto Supabase
- Obtenha em: https://app.supabase.com → Settings → API

### `SUPABASE_KEY`
- **Valor**: Cole sua chave anon public
- **Descrição**: Chave de API pública do Supabase
- **⚠️ IMPORTANTE**: Nunca compartilhe esta chave em público!
- Obtenha em: https://app.supabase.com → Settings → API

## Passo 3: Adicionar Secrets Opcionais

### `SLACK_WEBHOOK` (Para notificações no Slack)
- **Valor**: `https://hooks.slack.com/services/...`
- Obtenha em: https://api.slack.com/apps → Incoming Webhooks

### `EMAIL_SERVER`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_RECIPIENT`
- Para receber relatórios por email

## Verificar Secrets Adicionados

```bash
# No GitHub CLI (se instalado):
gh secret list
```

## Executar Workflow Manualmente

1. Vá para a aba **Actions**
2. Selecione o workflow **SEO Optimization Runner**
3. Clique em **Run workflow**
4. Aguarde a execução

## Troubleshooting

### Erro: "Could not get JWT"
- Chave expirou ou é inválida
- Regenere em Supabase Settings → API

### Workflow não executa
- Verifique se os secrets estão configurados
- Verifique se a branch é `main` ou `develop`

### Relatório não salva
- Verifique permissões de escrita
- Confirme que a table `posts` existe no Supabase

## Segurança

✅ **Boas práticas**:
- Nunca committe `.env` com secrets reais
- Use `.env.example` como template
- Regenere chaves regularmente
- Use role-based access no Supabase (RLS policies)

❌ **Nunca faça**:
- Coloque secrets em código
- Compartilhe secrets em emails/chats
- Use secrets em public repos sem proteção
