import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const maxDuration = 30

const WA_URL = 'https://wa.me/552140421350'
const BLOG_BASE = 'https://www.simplessolucao.com.br/blog'

function para(text, bold = false) {
  return {
    type: 'PARAGRAPH',
    content: { style: { textAlign: 'AUTO' } },
    nodes: [{ type: 'TEXT', content: { text, style: bold ? { bold: true } : {} }, nodes: [] }],
  }
}

function heading(text, level = 2) {
  return {
    type: 'HEADING',
    content: { level, style: { textAlign: 'AUTO' } },
    nodes: [{ type: 'TEXT', content: { text, style: {} }, nodes: [] }],
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const ctaSugerido = body.ctaSugerido || null

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

    // 1. Busca artigo
    const { data: article, error: fetchError } = await supabase
      .from('posts')
      .select('id, slug, title, content_url, main_keyword, keywords')
      .eq('id', id)
      .single()

    if (fetchError || !article) {
      return NextResponse.json({ error: 'Artigo não encontrado' }, { status: 404 })
    }

    // 2. Busca JSON do Storage
    const contentRes = await fetch(article.content_url)
    if (!contentRes.ok) {
      return NextResponse.json({ error: 'Não foi possível buscar o conteúdo do artigo no Storage' }, { status: 500 })
    }
    const contentJson = await contentRes.json()

    // 3. Verifica se CTA já foi aplicado
    if (JSON.stringify(contentJson.richContent).includes(WA_URL)) {
      return NextResponse.json({ success: false, alreadyApplied: true, message: 'WhatsApp CTA já foi aplicado anteriormente neste artigo.' })
    }

    // 4. Busca artigos relacionados por keyword
    const baseKeyword = (article.main_keyword || article.title || '').split(' ')[0]
    let { data: related } = await supabase
      .from('posts')
      .select('slug, title')
      .neq('id', id)
      .ilike('main_keyword', `%${baseKeyword}%`)
      .not('title', 'is', null)
      .limit(4)

    if (!related || related.length < 2) {
      const { data: recent } = await supabase
        .from('posts')
        .select('slug, title')
        .neq('id', id)
        .not('seo_title', 'is', null)
        .limit(4)
      related = recent || []
    }

    const relatedSlice = related.slice(0, 3)

    // 5. Monta novos nós a adicionar ao final do richContent
    const cta = ctaSugerido
      ? `${ctaSugerido} Fale com a Simples Solução TI agora pelo WhatsApp: ${WA_URL}`
      : `Precisa de suporte de TI para sua empresa? Nossa equipe está pronta para atender! Fale agora com um especialista pelo WhatsApp: ${WA_URL}`

    const newNodes = [
      para(' '),
      ...(relatedSlice.length > 0 ? [
        heading('Leia Também'),
        ...relatedSlice.map(a => para(`• ${a.title}  →  ${BLOG_BASE}/${a.slug}`)),
        para(' '),
      ] : []),
      heading('Fale com um Especialista em TI'),
      para(cta, true),
      para(' '),
    ]

    // 6. Upload do JSON atualizado de volta ao Storage
    const updatedContent = {
      ...contentJson,
      richContent: [...contentJson.richContent, ...newNodes],
    }

    const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY
    const supabaseUpload = createClient(process.env.SUPABASE_URL, key)

    const { error: uploadError } = await supabaseUpload.storage
      .from('posts')
      .upload(`${article.slug}.json`, JSON.stringify(updatedContent), {
        contentType: 'application/json',
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json({
        success: false,
        error: `Erro ao salvar no Storage: ${uploadError.message}. Adicione SUPABASE_SERVICE_KEY ao .env e Vercel para permissão de escrita.`,
        preview: newNodes,
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Melhorias aplicadas! ${relatedSlice.length} artigos relacionados + CTA WhatsApp adicionados ao final do artigo.`,
      related: relatedSlice,
    })

  } catch (err) {
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 })
  }
}
