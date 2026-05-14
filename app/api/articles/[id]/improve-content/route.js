import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

export const maxDuration = 30

const SYSTEM_PROMPT = [
  {
    type: 'text',
    text: `Você é um especialista em marketing de conteúdo e SEO para empresas de TI brasileiras B2B.
A "Simples Solução TI" é uma empresa de TI no Rio de Janeiro especializada em: infraestrutura de rede, segurança cibernética, suporte técnico, cloud, CFTV, PABX, backup e gestão de TI para PMEs.

Forneça um relatório JSON com exatamente estas chaves:
- pontos_fortes: array de 2-3 strings
- melhorias_sugeridas: array de 3-4 strings
- estrutura_ideal: array de 4-6 strings (H2/H3 sugeridos)
- palavras_chave_semanticas: array de 5-8 strings
- cta_sugerido: string curta
- score_estimado: número inteiro de 1 a 10

Responda APENAS com JSON válido. Sem markdown, sem texto extra.`,
    cache_control: { type: 'ephemeral' },
  },
]

export async function POST(request, { params }) {
  try {
    const { id } = await params

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'SUPABASE_URL ou SUPABASE_KEY não configurados' }, { status: 500 })
    }
    if (!anthropicKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY não configurado' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: article, error: fetchError } = await supabase
      .from('posts')
      .select('id, slug, title, seo_title, seo_description, main_keyword, keywords')
      .eq('id', id)
      .single()

    if (fetchError || !article) {
      return NextResponse.json({ error: 'Artigo não encontrado' }, { status: 404 })
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey })

    const title = article.title || article.slug.replace(/-/g, ' ')

    const context = [
      `Título: ${title}`,
      `Slug: ${article.slug}`,
      article.main_keyword ? `Keyword principal: ${article.main_keyword}` : null,
      article.keywords ? `Keywords secundárias: ${article.keywords}` : null,
      article.seo_title ? `SEO Title: ${article.seo_title}` : null,
      article.seo_description ? `Meta Description: ${article.seo_description}` : null,
    ].filter(Boolean).join('\n')

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Analise este artigo:\n\n${context}` }],
    })

    const text = response.content[0]?.text?.trim()
    if (!text) return NextResponse.json({ error: 'Resposta vazia da IA' }, { status: 500 })

    const clean = text.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim()

    let suggestions
    try {
      suggestions = JSON.parse(clean)
    } catch {
      return NextResponse.json({ error: 'IA retornou formato inválido', raw: clean }, { status: 500 })
    }

    return NextResponse.json({ success: true, suggestions, article: { title, slug: article.slug } })

  } catch (err) {
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 })
  }
}
