'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── paleta ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#0f172a',
  card: '#1e293b',
  border: '#334155',
  borderLight: '#475569',
  blue: '#3b82f6',
  blueHover: '#2563eb',
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  success: '#065f46',
  successBg: '#d1fae5',
  warning: '#78350f',
  warningBg: '#fef3c7',
  danger: '#7f1d1d',
  dangerBg: '#fee2e2',
}

// ─── utils ────────────────────────────────────────────────────────────────────
function trunc(str, n) {
  if (!str) return '—'
  return str.length > n ? str.slice(0, n) + '…' : str
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function seoStatus(a) {
  if (a.seo_title && a.main_keyword) return 'complete'
  if (a.seo_title || a.main_keyword) return 'partial'
  return 'missing'
}

// ─── componentes menores ──────────────────────────────────────────────────────
function Badge({ status }) {
  const map = {
    complete: { label: 'SEO OK', bg: C.success, color: '#6ee7b7' },
    partial: { label: 'Parcial', bg: '#4a2700', color: '#fbbf24' },
    missing: { label: 'Sem SEO', bg: '#450a0a', color: '#fca5a5' },
  }
  const { label, bg, color } = map[status]
  return (
    <span style={{ background: bg, color, borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 20px', flex: 1, minWidth: 120 }}>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || C.text }}>{value ?? '…'}</div>
      {sub && <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function Spinner({ size = 16 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      border: `2px solid ${C.border}`, borderTopColor: C.blue,
      borderRadius: '50%', animation: 'spin 0.7s linear infinite',
    }} />
  )
}

function Btn({ onClick, disabled, loading, children, variant = 'primary', small }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    border: 'none', borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 600, fontSize: small ? 12 : 13,
    padding: small ? '4px 10px' : '7px 14px',
    opacity: disabled ? 0.5 : 1, transition: 'background 0.15s',
  }
  const variants = {
    primary: { background: C.blue, color: '#fff' },
    success: { background: '#047857', color: '#fff' },
    warning: { background: '#b45309', color: '#fff' },
    ghost: { background: C.card, color: C.textMuted, border: `1px solid ${C.border}` },
  }
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>
      {loading ? <Spinner size={12} /> : null}
      {children}
    </button>
  )
}

// ─── painel lateral de resultado ──────────────────────────────────────────────
function ResultPanel({ data, onClose }) {
  if (!data) return null
  const { type, result, articleTitle } = data

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end',
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: 520, background: C.card, overflowY: 'auto',
        padding: '24px', boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>
              {type === 'fix-seo' ? 'SEO Corrigido' : 'Sugestões de Conteúdo'}
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{articleTitle}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 20, padding: '0 4px' }}>✕</button>
        </div>

        {type === 'fix-seo' && result.seo && <SeoResult seo={result.seo} />}
        {type === 'improve-content' && result.suggestions && <ContentResult s={result.suggestions} />}
      </div>
    </div>
  )
}

function SeoResult({ seo }) {
  const rows = [
    { label: 'Title Tag', value: seo.titleTag, limit: 60 },
    { label: 'Meta Description', value: seo.metaDescription, limit: 160 },
    { label: 'Keyword Principal', value: seo.mainKeyword },
    { label: 'Keywords Secundárias', value: seo.secondaryKeywords },
    { label: 'H1', value: seo.h1 },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {rows.map(({ label, value, limit }) => (
        <div key={label} style={{ background: '#0f172a', borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
            <span>{label}</span>
            {limit && <span style={{ color: value?.length > limit ? C.red : C.green }}>{value?.length || 0}/{limit}</span>}
          </div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{value || '—'}</div>
        </div>
      ))}
    </div>
  )
}

function ContentResult({ s }) {
  const scoreColor = s.score_estimado >= 7 ? C.green : s.score_estimado >= 5 ? C.yellow : C.red
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#0f172a', borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: scoreColor }}>{s.score_estimado}</div>
        <div>
          <div style={{ fontSize: 12, color: C.textMuted }}>Score estimado</div>
          <div style={{ fontSize: 11, color: C.textDim }}>de 10 pontos</div>
        </div>
      </div>
      {s.pontos_fortes?.length > 0 && <Section title="Pontos Fortes" items={s.pontos_fortes} color={C.green} icon="✓" />}
      {s.melhorias_sugeridas?.length > 0 && <Section title="Melhorias Sugeridas" items={s.melhorias_sugeridas} color={C.yellow} icon="→" />}
      {s.estrutura_ideal?.length > 0 && <Section title="Estrutura Recomendada" items={s.estrutura_ideal} color={C.blue} icon="#" />}
      {s.palavras_chave_semanticas?.length > 0 && (
        <div style={{ background: '#0f172a', borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Keywords Semânticas</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {s.palavras_chave_semanticas.map(k => (
              <span key={k} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: '2px 8px', fontSize: 11, color: C.textMuted }}>{k}</span>
            ))}
          </div>
        </div>
      )}
      {s.cta_sugerido && (
        <div style={{ background: '#0f172a', borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>CTA Sugerido</div>
          <div style={{ fontSize: 13, color: C.text, fontStyle: 'italic' }}>"{s.cta_sugerido}"</div>
        </div>
      )}
    </div>
  )
}

function Section({ title, items, color, icon }) {
  return (
    <div style={{ background: '#0f172a', borderRadius: 8, padding: '12px 14px' }}>
      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>{title}</div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: C.text }}>
            <span style={{ color, flexShrink: 0, fontWeight: 700 }}>{icon}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── página principal ─────────────────────────────────────────────────────────
export default function Home() {
  const [articles, setArticles] = useState([])
  const [stats, setStats] = useState(null)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('newest')
  const [limit] = useState(10)
  const [actionLoading, setActionLoading] = useState({})
  const [panel, setPanel] = useState(null)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      if (!data.error) setStats(data)
    } catch {}
  }, [])

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit, status, sort })
      if (search) params.set('search', search)
      const res = await fetch(`/api/articles?${params}`)
      const data = await res.json()
      if (!data.error) {
        setArticles(data.articles || [])
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 1)
      }
    } finally {
      setLoading(false)
    }
  }, [page, limit, status, sort, search])

  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { fetchArticles() }, [fetchArticles])

  function handleSearch(e) {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  function handleFilter(key, val) {
    if (key === 'status') setStatus(val)
    if (key === 'sort') setSort(val)
    setPage(1)
  }

  async function runAction(article, type) {
    const key = `${article.id}-${type}`
    setActionLoading(p => ({ ...p, [key]: true }))
    try {
      const res = await fetch(`/api/articles/${article.id}/${type}`, { method: 'POST' })
      const data = await res.json()
      if (data.error) {
        alert(`Erro: ${data.error}`)
      } else {
        setPanel({ type, result: data, articleTitle: article.title || article.slug })
        if (type === 'fix-seo') {
          fetchArticles()
          fetchStats()
        }
      }
    } catch (err) {
      alert(`Erro inesperado: ${err.message}`)
    } finally {
      setActionLoading(p => ({ ...p, [key]: false }))
    }
  }

  const pct = stats ? Math.round((stats.withSEO / stats.total) * 100) : 0

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        input, select { outline: none; }
        input:focus, select:focus { border-color: ${C.blue} !important; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.text }}>
            SEO Manager
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textMuted }}>
            Simples Solução TI — gerenciamento de SEO dos artigos do blog
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <StatCard label="Total de Artigos" value={stats?.total} />
          <StatCard label="SEO Completo" value={stats?.withSEO} color={C.green} sub={`${pct}% do total`} />
          <StatCard label="SEO Parcial" value={stats?.partial} color={C.yellow} />
          <StatCard label="Sem SEO" value={stats?.pending} color={C.red} />
        </div>

        {/* Barra de progresso */}
        {stats && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: C.textMuted }}>
              <span>Progresso de otimização</span>
              <span style={{ color: C.text, fontWeight: 600 }}>{pct}%</span>
            </div>
            <div style={{ background: C.border, borderRadius: 99, height: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 99, transition: 'width 0.5s' }} />
            </div>
          </div>
        )}

        {/* Filtros */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 200 }}>
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Buscar por título, slug ou keyword…"
              style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '7px 12px', color: C.text, fontSize: 13 }}
            />
            <Btn type="submit" variant="primary">Buscar</Btn>
            {search && (
              <Btn onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }} variant="ghost">✕</Btn>
            )}
          </form>

          <select
            value={status}
            onChange={e => handleFilter('status', e.target.value)}
            style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '7px 12px', color: C.text, fontSize: 13, cursor: 'pointer' }}
          >
            <option value="all">Todos</option>
            <option value="with-seo">Com SEO</option>
            <option value="without-seo">Sem SEO</option>
          </select>

          <select
            value={sort}
            onChange={e => handleFilter('sort', e.target.value)}
            style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '7px 12px', color: C.text, fontSize: 13, cursor: 'pointer' }}
          >
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
          </select>

          <div style={{ marginLeft: 'auto', fontSize: 12, color: C.textMuted, whiteSpace: 'nowrap' }}>
            {total} artigos encontrados
          </div>
        </div>

        {/* Tabela */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#162032', borderBottom: `1px solid ${C.border}` }}>
                  {['#', 'Título', 'Status', 'Keyword', 'SEO Title', 'Atualizado', 'Ações'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: C.textMuted, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 48, textAlign: 'center', color: C.textMuted }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                        <Spinner size={18} /> Carregando artigos…
                      </div>
                    </td>
                  </tr>
                ) : articles.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 48, textAlign: 'center', color: C.textMuted }}>
                      Nenhum artigo encontrado.
                    </td>
                  </tr>
                ) : articles.map((a, i) => {
                  const st = seoStatus(a)
                  const num = (page - 1) * limit + i + 1
                  const fixKey = `${a.id}-fix-seo`
                  const contentKey = `${a.id}-improve-content`
                  return (
                    <tr
                      key={a.id}
                      style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1a2840'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '10px 14px', color: C.textDim, fontSize: 12 }}>{num}</td>
                      <td style={{ padding: '10px 14px', maxWidth: 220 }}>
                        <div style={{ color: C.text, fontWeight: 500 }} title={a.title}>{trunc(a.title, 45)}</div>
                        <div style={{ color: C.textDim, fontSize: 11, marginTop: 2 }}>{trunc(a.slug, 40)}</div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <Badge status={st} />
                      </td>
                      <td style={{ padding: '10px 14px', color: C.textMuted, maxWidth: 140 }}>
                        {a.main_keyword ? (
                          <span title={a.main_keyword} style={{ background: '#1e3a5f', color: '#93c5fd', borderRadius: 4, padding: '2px 7px', fontSize: 11 }}>
                            {trunc(a.main_keyword, 20)}
                          </span>
                        ) : <span style={{ color: C.textDim }}>—</span>}
                      </td>
                      <td style={{ padding: '10px 14px', color: C.textMuted, maxWidth: 200 }}>
                        <span title={a.seo_title}>{trunc(a.seo_title, 38)}</span>
                      </td>
                      <td style={{ padding: '10px 14px', color: C.textDim, fontSize: 12, whiteSpace: 'nowrap' }}>
                        {fmtDate(a.updated_at || a.created_at)}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                          <Btn
                            small
                            variant="primary"
                            loading={actionLoading[fixKey]}
                            disabled={actionLoading[fixKey] || actionLoading[contentKey]}
                            onClick={() => runAction(a, 'fix-seo')}
                          >
                            Fix SEO
                          </Btn>
                          <Btn
                            small
                            variant="success"
                            loading={actionLoading[contentKey]}
                            disabled={actionLoading[fixKey] || actionLoading[contentKey]}
                            onClick={() => runAction(a, 'improve-content')}
                          >
                            Conteúdo
                          </Btn>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: 12, color: C.textMuted }}>
              Página {page} de {totalPages} — {total} artigos
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <Btn variant="ghost" small disabled={page <= 1} onClick={() => setPage(1)}>«</Btn>
              <Btn variant="ghost" small disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹ Anterior</Btn>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p
                if (totalPages <= 5) {
                  p = i + 1
                } else if (page <= 3) {
                  p = i + 1
                } else if (page >= totalPages - 2) {
                  p = totalPages - 4 + i
                } else {
                  p = page - 2 + i
                }
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      background: p === page ? C.blue : C.card,
                      color: p === page ? '#fff' : C.textMuted,
                      border: `1px solid ${p === page ? C.blue : C.border}`,
                      borderRadius: 6, padding: '4px 10px', fontSize: 12,
                      cursor: 'pointer', fontWeight: p === page ? 700 : 400,
                    }}
                  >
                    {p}
                  </button>
                )
              })}

              <Btn variant="ghost" small disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Próxima ›</Btn>
              <Btn variant="ghost" small disabled={page >= totalPages} onClick={() => setPage(totalPages)}>»</Btn>
            </div>
          </div>
        )}

      </div>

      {/* Painel de resultado */}
      <ResultPanel data={panel} onClose={() => setPanel(null)} />
    </>
  )
}
