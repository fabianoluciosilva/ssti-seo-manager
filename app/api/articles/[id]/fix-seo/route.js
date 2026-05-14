import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

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

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Slug: ${article.slug}\nTítulo atual: ${title}\n\nGere o JSON com: titleTag, metaDescription, mainKeyword, secondaryKeywords, h1`,
      },
    ],
  })

  const text = response.content[0].text.trim()
  const clean = text.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '').trim()
  const seo = JSON.parse(clean)

  const { error: updateError } = await supabase
    .from('posts')
    .update({
      seo_title: seo.titleTag,
      seo_description: seo.metaDescription,
      main_keyword: seo.mainKeyword,
      keywords: seo.secondaryKeywords,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, seo })
}
