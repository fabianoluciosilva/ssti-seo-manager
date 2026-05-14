import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_KEY
  if (!url || !key) return NextResponse.json({ error: 'SUPABASE_URL ou SUPABASE_KEY não configurados no .env' }, { status: 500 })
  const supabase = createClient(url, key)

  const { data, error } = await supabase.from('posts').select('id, seo_title, main_keyword')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const total = data.length
  const withSEO = data.filter(a => a.seo_title && a.main_keyword).length
  const partial = data.filter(a => (a.seo_title && !a.main_keyword) || (!a.seo_title && a.main_keyword)).length
  const pending = total - withSEO - partial

  return NextResponse.json({ total, withSEO, partial, pending })
}
