import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = [
  {
    type: 'text',
    text: `Você é um especialista em marketing de conteúdo e SEO para empresas de TI brasileiras B2B.
A "Simples Solução TI" é uma empresa de TI no Rio de Janeiro especializada em: infraestrutura de rede, segurança cibernética, suporte técnico, cloud, CFTV, PABX, backup e gestão de TI para PMEs.

Ao analisar um artigo, forneça um relatório de melhoria de conteúdo com:
- pontos_fortes: o que o artigo já faz bem (array de strings)
- melhorias_sugeridas: sugestões concretas de melhoria (array de strings)
- estrutura_ideal: estrutura de seções recomendada (array com H2/H3 sugeridos)
- palavras_chave_semanticas: palavras-chave relacionadas a incluir no conteúdo (array)
- cta_sugerido: chamada para ação recomendada para o final do artigo (string)
- score_estimado: nota de 1-10 estimada para o conteúdo atual (número)

Responda APENAS com JSON válido, sem markdown, sem explicações.`,
    cache_control: { type: 'ephemeral' },
  },
]

export async function POST(request, { params }) {
  const { id } = await params

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

  const { data: article, error: fetchError } = await supabase
    .from('posts')
    .select('id, slug, title, seo_title, seo_description, main_keyword, keywords')
    .eq('id', id)
    .single()

  if (fetchError || !article) {
    return NextResponse.json({ error: 'Artigo não encontrado' }, { status: 404 })
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const slugTitle = article.slug.replace(/-/g, ' ')
  const title = article.title || slugTitle

  const context = [
    `Título: ${title}`,
    `Slug: ${article.slug}`,
    article.main_keyword ? `Keyword principal: ${article.main_keyword}` : null,
    article.keywords ? `Keywords secundárias: ${article.keywords}` : null,
    article.seo_title ? `SEO Title: ${article.seo_title}` : null,
    article.seo_description ? `Meta Description: ${article.seo_description}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Analise este artigo e forneça sugestões de melhoria de conteúdo:\n\n${context}`,
      },
    ],
  })

  const text = response.content[0].text.trim()
  const clean = text.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '').trim()
  const suggestions = JSON.parse(clean)

  return NextResponse.json({ success: true, suggestions, article: { title, slug: article.slug } })
}
