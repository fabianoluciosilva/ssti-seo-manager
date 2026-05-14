import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
  const status = searchParams.get('status') || 'all'
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'newest'

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

  let query = supabase.from('posts').select('*', { count: 'exact' })

  if (search) {
    query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%,main_keyword.ilike.%${search}%`)
  }

  if (status === 'with-seo') {
    query = query.not('seo_title', 'is', null)
  } else if (status === 'without-seo') {
    query = query.is('seo_title', null)
  }

  const ascending = sort === 'oldest'
  query = query.order('created_at', { ascending })

  const from = (page - 1) * limit
  query = query.range(from, from + limit - 1)

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const withSEO = data.filter(a => a.seo_title && a.main_keyword).length

  return NextResponse.json({
    articles: data,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    pageWithSEO: withSEO,
  })
}
