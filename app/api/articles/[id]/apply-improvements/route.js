import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const maxDuration = 30

const WA_URL = 'https://wa.me/552140421350'

function para(text) {
  return {
    type: 'PARAGRAPH',
    content: { style: { textAlign: 'AUTO' } },
    nodes: [{ type: 'TEXT', content: { text, style: {} }, nodes: [] }],
  }
}

function heading(text, level = 2) {
  return {
    type: 'HEADING',
    content: { level, style: { textAlign: 'AUTO' } },
    nodes: [{ type: 'TEXT', content: { text, style: {} }, nodes: [] }],
  }
}

const MARKER_TEXTS = ['Leia Também', 'Fale com um Especialista em TI']

export async function POST(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const ctaSugerido = body.ctaSugerido || null

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

    // 1. Busca artigo
    const { data: article, error: fetchError } = await supabase
      .from('posts')
      .select('id, slug, title, content_url, main_keyword')
      .eq('id', id)
      .single()

    if (fetchError || !article) {
      return NextResponse.json({ error: 'Artigo não encontrado' }, { status: 404 })
    }

    // 2. Busca JSON do Storage (ignora cache-buster)
    const storageUrl = article.content_url.split('?')[0]
    const contentRes = await fetch(storageUrl)
    if (!contentRes.ok) {
      return NextResponse.json({ error: 'Não foi possível buscar o conteúdo do artigo no Storage' }, { status: 500 })
    }
    const contentJson = await contentRes.json()

    // 3. Remove seções anteriores que possamos ter adicionado (idempotente)
    let baseContent = contentJson.richContent
    const cutIndex = baseContent.findIndex(node => {
      const str = JSON.stringify(node)
      return MARKER_TEXTS.some(m => str.includes(m)) || str.includes(WA_URL)
    })
    if (cutIndex !== -1) {
      baseContent = baseContent.slice(0, cutIndex)
    }

    // 4. Monta CTA com WhatsApp como link clicável (formato Wix Ricos decorations)
    const ctaPrefix = ctaSugerido
      ? `${ctaSugerido} Fale agora com a Simples Solução TI pelo WhatsApp: `
      : 'Precisa de suporte de TI para sua empresa? Fale agora com um especialista pelo WhatsApp: '

    const ctaNode = {
      type: 'PARAGRAPH',
      content: { style: { textAlign: 'AUTO' } },
      nodes: [
        {
          type: 'TEXT',
          content: { text: ctaPrefix, style: { bold: true } },
          nodes: [],
        },
        {
          type: 'TEXT',
          content: { text: '(21) 4042-1350', style: { bold: true } },
          decorations: [{ type: 'LINK', linkData: { link: { url: WA_URL, target: '_blank' } } }],
          nodes: [],
        },
      ],
    }

    const newNodes = [
      para(' '),
      heading('Fale com um Especialista em TI'),
      ctaNode,
      para(' '),
    ]

    // 5. Upload do JSON atualizado ao Storage
    const updatedContent = { ...contentJson, richContent: [...baseContent, ...newNodes] }

    const supabaseUpload = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY
    )

    const { error: uploadError } = await supabaseUpload.storage
      .from('posts')
      .upload(`${article.slug}.json`, JSON.stringify(updatedContent), {
        contentType: 'application/json',
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json({
        success: false,
        error: `Erro ao salvar no Storage: ${uploadError.message}`,
        preview: newNodes,
      }, { status: 500 })
    }

    // 6. Atualiza content_url com cache-buster para invalidar CDN (max-age=3600)
    await supabase
      .from('posts')
      .update({ content_url: `${storageUrl}?v=${Date.now()}` })
      .eq('id', id)

    return NextResponse.json({
      success: true,
      message: 'CTA WhatsApp adicionado ao final do artigo com sucesso!',
    })

  } catch (err) {
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 })
  }
}
