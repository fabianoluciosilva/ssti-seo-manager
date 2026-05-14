import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

  const { data, error } = await supabase.from('posts').select('id, seo_title, main_keyword')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const total = data.length
  const withSEO = data.filter(a => a.seo_title && a.main_keyword).length
  const partial = data.filter(a => (a.seo_title && !a.main_keyword) || (!a.seo_title && a.main_keyword)).length
  const pending = total - withSEO - partial

  return NextResponse.json({ total, withSEO, partial, pending })
}
