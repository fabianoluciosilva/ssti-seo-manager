# 🤝 Contribuindo para SEO Manager

Obrigado por se interessar em contribuir! Este arquivo descreve como participar do projeto.

---

## 📋 Código de Conduta

- Seja respeitoso e inclusivo
- Evite linguagem ofensiva
- Aceite críticas construtivas
- Foque no melhor para o projeto

---

## 🚀 Como Começar

### 1. Fork o Repositório
```bash
# No GitHub, clique em "Fork"
```

### 2. Clone sua Fork
```bash
git clone https://github.com/SEU_USUARIO/ssti-seo-manager.git
cd ssti-seo-manager
```

### 3. Crie uma Branch
```bash
git checkout -b feature/sua-feature
# ou
git checkout -b fix/seu-fix
```

### 4. Instale Dependências
```bash
npm install
```

### 5. Faça suas Mudanças

Edite o código, adicione testes, atualize documentação.

### 6. Valide seu Código
```bash
npm run validate
npm run lint
npm test
```

### 7. Commit com Mensagem Clara
```bash
git commit -m "feat: adicionar nova feature"
git commit -m "fix: corrigir bug em validation"
git commit -m "docs: melhorar README"
```

### 8. Push para sua Fork
```bash
git push origin feature/sua-feature
```

### 9. Abra um Pull Request
- Vá ao seu repositório no GitHub
- Clique em "Pull Request"
- Descreva suas mudanças
- Aguarde revisão

---

## 📝 Padrões de Commit

Use **Conventional Commits**:

```
type(scope): subject

feat:       nova feature
fix:        correção de bug
docs:       documentação
style:      formatação, sem mudança de lógica
refactor:   refatoração sem mudança de funcionalidade
perf:       melhoria de performance
test:       adicionar testes
chore:      atualizar dependências, build, etc
```

### Exemplos
```bash
git commit -m "feat(validation): adicionar check de keywords"
git commit -m "fix(supabase): corrigir erro de conexão"
git commit -m "docs(readme): atualizar instruções"
```

---

## 🐛 Reportar Bugs

### Título Claro
```
❌ "Não funciona"
✅ "seo-manager.html não conecta ao Supabase"
```

### Descrição Detalhada

Inclua:
1. **Sistema**: Windows/Mac/Linux
2. **Versão Node**: `node --version`
3. **Erro Exato**: Copie a mensagem de erro
4. **Steps para Reproduzir**:
   ```
   1. Abri seo-manager.html
   2. Colei credenciais
   3. Cliquei em "Testar Conexão"
   4. Erro: "Failed to fetch"
   ```
5. **Comportamento Esperado**: O que deveria acontecer
6. **Screenshots**: Se possível

---

## 💡 Sugerir Melhorias

### Template de Sugestão

```markdown
**Descrição**: O que você quer?

**Problema**: Por que é necessário?

**Solução Proposta**: Como implementar?

**Alternativas**: Outras abordagens?

**Contexto Adicional**: Links, exemplos, etc.
```

---

## 📖 Melhorar Documentação

### Áreas que Precisam de Ajuda
- Tradução para outros idiomas
- Exemplos de uso adicionais
- Screenshots/GIFs
- Vídeos tutoriais
- FAQs

### Como Contribuir com Docs
1. Edite arquivo `.md`
2. Valide formatação Markdown
3. Teste links
4. Abra Pull Request

---

## 🔍 Revisar Pull Requests

Você pode ajudar revisando PRs de outros!

Ao revisar:
- ✅ Testa o código funciona?
- ✅ Segue os padrões do projeto?
- ✅ Tem testes adequados?
- ✅ Documentação foi atualizada?
- ✅ Commit messages seguem padrão?

---

## 🧪 Testes

### Executar Testes
```bash
npm test
```

### Escrever Testes
- Crie arquivo em `tests/`
- Siga padrão existing
- Use nomes descritivos

---

## 🎯 Áreas de Oportunidade

Procuramos contribuidores para:

### Desenvolvimento
- [ ] Componente React para Next.js
- [ ] Dashboard web
- [ ] API REST
- [ ] Webhooks

### Documentação
- [ ] Tradução para Espanhol/Inglês
- [ ] Vídeos tutoriais
- [ ] Guias avançados
- [ ] Blog posts

### QA & Testing
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Performance testing
- [ ] Security audits

### DevOps
- [ ] Docker container
- [ ] Kubernetes deployment
- [ ] CI/CD improvements
- [ ] Monitoring setup

---

## 📞 Perguntas?

- **Discussions**: https://github.com/ssti/seo-manager/discussions
- **Issues**: https://github.com/ssti/seo-manager/issues
- **Email**: fabiano@simplessolucao.com.br

---

## 📋 Checklist antes de submeter PR

- [ ] Código testado localmente
- [ ] `npm run validate` passou
- [ ] `npm run lint` passou
- [ ] Documentação atualizada
- [ ] Commits seguem padrão
- [ ] Sem conflitos com `main`
- [ ] PR descrição clara

---

**Obrigado por contribuir! 💜**
