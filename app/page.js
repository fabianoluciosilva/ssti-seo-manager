'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── paleta ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#0f172a', card: '#1e293b', border: '#334155', borderLight: '#475569',
  blue: '#3b82f6', green: '#10b981', yellow: '#f59e0b', red: '#ef4444',
  text: '#f1f5f9', textMuted: '#94a3b8', textDim: '#64748b',
}

// ─── helpers ──────────────────────────────────────────────────────────────────
function trunc(str, n) { return !str ? '—' : str.length > n ? str.slice(0, n) + '…' : str }
function fmtDate(d) { return !d ? '—' : new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }) }

function seoStatus(a) {
  if (a.seo_title && a.main_keyword && a.seo_description) return 'complete'
  if (a.seo_title || a.main_keyword) return 'partial'
  return 'missing'
}

function auditSEO(a) {
  const issues = []
  const ok = []
  let score = 0

  if (!a.seo_title) {
    issues.push('Title Tag ausente')
  } else if (a.seo_title.length > 60) {
    issues.push(`Title Tag longo: ${a.seo_title.length} chars (máx 60)`)
  } else {
    ok.push(`Title Tag: ${a.seo_title.length} chars ✓`)
    score += 25
  }

  if (!a.seo_description) {
    issues.push('Meta Description ausente')
  } else if (a.seo_description.length < 120) {
    issues.push(`Meta Description curta: ${a.seo_description.length} chars (mín 120)`)
    score += 10
  } else if (a.seo_description.length > 160) {
    issues.push(`Meta Description longa: ${a.seo_description.length} chars (máx 160)`)
    score += 10
  } else {
    ok.push(`Meta Description: ${a.seo_description.length} chars ✓`)
    score += 25
  }

  if (!a.main_keyword) {
    issues.push('Keyword principal ausente')
  } else {
    ok.push(`Keyword principal: "${a.main_keyword}" ✓`)
    score += 25
  }

  if (!a.keywords) {
    issues.push('Keywords secundárias ausentes')
  } else {
    const kws = a.keywords.split(',').filter(Boolean)
    if (kws.length < 5) {
      issues.push(`Poucas keywords: ${kws.length} (recomendado: 5-8)`)
      score += 10
    } else {
      ok.push(`${kws.length} keywords secundárias ✓`)
      score += 25
    }
  }

  return { issues, ok, score }
}

// ─── componentes ──────────────────────────────────────────────────────────────
function Spinner({ size = 16 }) {
  return <span style={{ display: 'inline-block', width: size, height: size, border: `2px solid ${C.border}`, borderTopColor: C.blue, borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
}

function Badge({ status }) {
  const map = { complete: ['SEO OK', '#065f46', '#6ee7b7'], partial: ['Parcial', '#4a2700', '#fbbf24'], missing: ['Sem SEO', '#450a0a', '#fca5a5'] }
  const [label, bg, color] = map[status]
  return <span style={{ background: bg, color, borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{label}</span>
}

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 20px', flex: 1, minWidth: 120 }}>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: color || C.text }}>
        {value === null || value === undefined ? <Spinner size={14} /> : value}
      </div>
      {sub && <div style={{ fontSize: 11, color: C.textDim, marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

function Btn({ onClick, disabled, loading, children, variant = 'primary', small, title }) {
  const variants = {
    primary: { background: C.blue, color: '#fff' },
    success: { background: '#047857', color: '#fff' },
    warning: { background: '#92400e', color: '#fff' },
    ghost: { background: '#1e293b', color: C.textMuted, border: `1px solid ${C.border}` },
    danger: { background: '#7f1d1d', color: '#fca5a5', border: `1px solid #ef4444` },
  }
  return (
    <button title={title} onClick={onClick} disabled={disabled || loading}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', borderRadius: 6, cursor: disabled || loading ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: small ? 11 : 13, padding: small ? '4px 9px' : '7px 14px', opacity: disabled ? 0.5 : 1, transition: 'filter 0.15s', whiteSpace: 'nowrap', ...variants[variant] }}
      onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.filter = 'brightness(1.15)' }}
      onMouseLeave={e => e.currentTarget.style.filter = 'none'}
    >
      {loading && <Spinner size={11} />}
      {children}
    </button>
  )
}

// ─── painel lateral ───────────────────────────────────────────────────────────
function Panel({ data, onClose }) {
  if (!data) return null
  const { type, article, result } = data
  const titleMap = { audit: 'Análise de SEO', 'fix-seo': '✓ SEO Corrigido pela IA', 'improve-content': 'Sugestões de Conteúdo' }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 500, background: '#1a2540', overflowY: 'auto', padding: 24, boxShadow: '-8px 0 40px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{titleMap[type]}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>{article?.title || article?.slug}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        {type === 'audit' && <AuditPanel article={article} />}
        {type === 'fix-seo' && result?.seo && <FixSEOPanel seo={result.seo} />}
        {type === 'improve-content' && result?.suggestions && <ContentPanel s={result.suggestions} />}
      </div>
    </div>
  )
}

function Row({ label, value, limit }) {
  const len = value?.length || 0
  const overLimit = limit && len > limit
  const underLimit = limit && label.includes('Meta') && len > 0 && len < 120
  return (
    <div style={{ background: C.bg, borderRadius: 8, padding: '10px 13px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: C.textMuted }}>{label}</span>
        {limit && <span style={{ fontSize: 11, fontWeight: 600, color: overLimit ? C.red : underLimit ? C.yellow : C.green }}>{len}/{limit}</span>}
      </div>
      <div style={{ fontSize: 13, color: value ? C.text : C.textDim, lineHeight: 1.5 }}>{value || '— não definido'}</div>
    </div>
  )
}

function AuditPanel({ article }) {
  const { issues, ok, score } = auditSEO(article)
  const scoreColor = score >= 75 ? C.green : score >= 50 ? C.yellow : C.red
  return (
    <>
      <div style={{ background: C.bg, borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{score}</div>
        <div>
          <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>Score de SEO</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>de 100 pontos</div>
        </div>
      </div>
      {issues.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: C.red, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Problemas ({issues.length})</div>
          {issues.map((i, idx) => <div key={idx} style={{ background: '#2d1515', border: `1px solid #7f1d1d`, borderRadius: 6, padding: '7px 11px', fontSize: 12, color: '#fca5a5', marginBottom: 6 }}>⚠ {i}</div>)}
        </div>
      )}
      {ok.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: C.green, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Ok ({ok.length})</div>
          {ok.map((i, idx) => <div key={idx} style={{ background: '#052e16', border: `1px solid #065f46`, borderRadius: 6, padding: '7px 11px', fontSize: 12, color: '#6ee7b7', marginBottom: 6 }}>✓ {i}</div>)}
        </div>
      )}
      <Row label="Title Tag" value={article.seo_title} limit={60} />
      <Row label="Meta Description" value={article.seo_description} limit={160} />
      <Row label="Keyword principal" value={article.main_keyword} />
      <Row label="Keywords secundárias" value={article.keywords} />
    </>
  )
}

function FixSEOPanel({ seo }) {
  return (
    <>
      <div style={{ background: '#052e16', border: `1px solid #065f46`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#6ee7b7' }}>
        ✓ SEO gerado e salvo com sucesso no banco de dados.
      </div>
      <Row label="Title Tag" value={seo.titleTag} limit={60} />
      <Row label="Meta Description" value={seo.metaDescription} limit={160} />
      <Row label="H1" value={seo.h1} />
      <Row label="Keyword principal" value={seo.mainKeyword} />
      <Row label="Keywords secundárias" value={seo.secondaryKeywords} />
    </>
  )
}

function ContentPanel({ s }) {
  const scoreColor = s.score_estimado >= 7 ? C.green : s.score_estimado >= 5 ? C.yellow : C.red
  return (
    <>
      <div style={{ background: C.bg, borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: scoreColor }}>{s.score_estimado}</div>
        <div><div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>Score de conteúdo</div><div style={{ fontSize: 11, color: C.textMuted }}>estimado pela IA</div></div>
      </div>
      {s.melhorias_sugeridas?.length > 0 && <ListSection title="Melhorias sugeridas" items={s.melhorias_sugeridas} icon="→" color={C.yellow} bg="#1c1400" border="#92400e" />}
      {s.estrutura_ideal?.length > 0 && <ListSection title="Estrutura ideal de seções" items={s.estrutura_ideal} icon="#" color={C.blue} bg="#0c1a2e" border="#1d4ed8" />}
      {s.palavras_chave_semanticas?.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>Keywords semânticas a incluir</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {s.palavras_chave_semanticas.map(k => <span key={k} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: '3px 8px', fontSize: 11, color: C.textMuted }}>{k}</span>)}
          </div>
        </div>
      )}
      {s.cta_sugerido && <Row label="CTA sugerido" value={`"${s.cta_sugerido}"`} />}
    </>
  )
}

function ListSection({ title, items, icon, color, bg, border }) {
  return (
    <div>
      <div style={{ fontSize: 11, color, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{title}</div>
      {items.map((item, i) => (
        <div key={i} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 6, padding: '7px 11px', fontSize: 12, color, marginBottom: 5, display: 'flex', gap: 8 }}>
          <span style={{ fontWeight: 700, flexShrink: 0 }}>{icon}</span><span style={{ color: C.text }}>{item}</span>
        </div>
      ))}
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
  const [error, setError] = useState(null)
  const [statsError, setStatsError] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [actionLoading, setActionLoading] = useState({})
  const [panel, setPanel] = useState(null)

  const LIMIT = 10

  const fetchStats = useCallback(async () => {
    setStatsError(null)
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      if (data.error) setStatsError(data.error)
      else setStats(data)
    } catch (e) {
      setStatsError(e.message)
    }
  }, [])

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page, limit: LIMIT, status: statusFilter, sort })
      if (search) params.set('search', search)
      const res = await fetch(`/api/articles?${params}`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        setArticles([])
      } else {
        setArticles(data.articles || [])
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 1)
      }
    } catch (e) {
      setError(e.message)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, sort, search])

  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { fetchArticles() }, [fetchArticles])

  function handleSearch(e) {
    e.preventDefault()
    setSearch(searchInput.trim())
    setPage(1)
  }

  function clearSearch() {
    setSearchInput('')
    setSearch('')
    setPage(1)
  }

  async function runAction(article, type) {
    const key = `${article.id}-${type}`

    if (type === 'audit') {
      setPanel({ type: 'audit', article })
      return
    }

    setActionLoading(p => ({ ...p, [key]: true }))
    try {
      const res = await fetch(`/api/articles/${article.id}/${type}`, { method: 'POST' })
      const data = await res.json()
      if (data.error) {
        alert(`Erro: ${data.error}`)
      } else {
        setPanel({ type, article, result: data })
        if (type === 'fix-seo') { fetchArticles(); fetchStats() }
      }
    } catch (e) {
      alert(`Erro: ${e.message}`)
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
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        input, select { outline: none; }
        input:focus, select:focus { border-color: ${C.blue} !important; }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.text }}>SEO Manager</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textMuted }}>Simples Solução TI — gerenciamento de SEO dos artigos do blog</p>
        </div>

        {/* Erro de stats */}
        {statsError && (
          <div style={{ background: '#2d1515', border: `1px solid ${C.red}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#fca5a5' }}>
            ⚠ Erro ao carregar estatísticas: {statsError}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <StatCard label="Total de Artigos" value={stats?.total} />
          <StatCard label="SEO Completo" value={stats?.withSEO} color={C.green} sub={stats ? `${pct}% do total` : null} />
          <StatCard label="SEO Parcial" value={stats?.partial} color={C.yellow} />
          <StatCard label="Sem SEO" value={stats?.pending} color={C.red} />
        </div>

        {/* Barra de progresso */}
        {stats && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 14px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: C.textMuted }}>
              <span>Progresso de otimização</span>
              <span style={{ color: C.text, fontWeight: 700 }}>{pct}%</span>
            </div>
            <div style={{ background: C.border, borderRadius: 99, height: 6 }}>
              <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: 99, transition: 'width .5s' }} />
            </div>
          </div>
        )}

        {/* Filtros */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 14px', marginBottom: 12, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 200 }}>
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Buscar por título, slug ou keyword…"
              style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '7px 11px', color: C.text, fontSize: 13 }}
            />
            <Btn type="submit">Buscar</Btn>
            {search && <Btn onClick={clearSearch} variant="ghost">✕ Limpar</Btn>}
          </form>

          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '7px 10px', color: C.text, fontSize: 13, cursor: 'pointer' }}>
            <option value="all">Todos os artigos</option>
            <option value="with-seo">Com SEO</option>
            <option value="without-seo">Sem SEO</option>
          </select>

          <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}
            style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '7px 10px', color: C.text, fontSize: 13, cursor: 'pointer' }}>
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
          </select>

          <span style={{ fontSize: 12, color: C.textDim, whiteSpace: 'nowrap' }}>
            {loading ? <Spinner size={12} /> : `${total} artigo${total !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Erro de artigos */}
        {error && (
          <div style={{ background: '#2d1515', border: `1px solid ${C.red}`, borderRadius: 8, padding: '12px 14px', marginBottom: 12, fontSize: 13, color: '#fca5a5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠ Erro ao carregar artigos: <strong>{error}</strong></span>
            <Btn small variant="ghost" onClick={fetchArticles}>Tentar novamente</Btn>
          </div>
        )}

        {/* Tabela */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#0f1e35', borderBottom: `1px solid ${C.border}` }}>
                  {['#', 'Título / Slug', 'Status', 'Keyword Principal', 'SEO Title', 'Atualizado', 'Ações'].map(h => (
                    <th key={h} style={{ padding: '10px 13px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: C.textMuted, whiteSpace: 'nowrap', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ padding: 52, textAlign: 'center', color: C.textMuted }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><Spinner size={18} />Carregando artigos…</div>
                  </td></tr>
                ) : articles.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: 52, textAlign: 'center', color: C.textMuted }}>
                    {search ? `Nenhum artigo encontrado para "${search}".` : 'Nenhum artigo encontrado.'}
                  </td></tr>
                ) : articles.map((a, i) => {
                  const num = (page - 1) * LIMIT + i + 1
                  const fixKey = `${a.id}-fix-seo`
                  const contentKey = `${a.id}-improve-content`
                  const busy = actionLoading[fixKey] || actionLoading[contentKey]
                  return (
                    <tr key={a.id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background .1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#162035'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px 13px', color: C.textDim, fontSize: 12 }}>{num}</td>
                      <td style={{ padding: '10px 13px', maxWidth: 220 }}>
                        <div style={{ color: C.text, fontWeight: 500 }} title={a.title}>{trunc(a.title, 48) || <span style={{ color: C.textDim }}>sem título</span>}</div>
                        <div style={{ color: C.textDim, fontSize: 11, marginTop: 2 }}>{trunc(a.slug, 44)}</div>
                      </td>
                      <td style={{ padding: '10px 13px' }}><Badge status={seoStatus(a)} /></td>
                      <td style={{ padding: '10px 13px' }}>
                        {a.main_keyword
                          ? <span style={{ background: '#1e3a5f', color: '#93c5fd', borderRadius: 4, padding: '2px 8px', fontSize: 11 }} title={a.main_keyword}>{trunc(a.main_keyword, 22)}</span>
                          : <span style={{ color: C.textDim, fontSize: 12 }}>—</span>}
                      </td>
                      <td style={{ padding: '10px 13px', color: C.textMuted, maxWidth: 200 }}>
                        <span title={a.seo_title}>{trunc(a.seo_title, 40)}</span>
                      </td>
                      <td style={{ padding: '10px 13px', color: C.textDim, fontSize: 12, whiteSpace: 'nowrap' }}>
                        {fmtDate(a.updated_at || a.created_at)}
                      </td>
                      <td style={{ padding: '10px 13px' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <Btn small variant="warning" disabled={busy} onClick={() => runAction(a, 'audit')} title="Auditar SEO atual sem IA">
                            🔍 Analisar
                          </Btn>
                          <Btn small variant="primary" loading={actionLoading[fixKey]} disabled={busy} onClick={() => runAction(a, 'fix-seo')} title="Gerar e salvar SEO otimizado com IA">
                            🤖 Corrigir IA
                          </Btn>
                          <Btn small variant="success" loading={actionLoading[contentKey]} disabled={busy} onClick={() => runAction(a, 'improve-content')} title="Sugestões de melhoria de conteúdo">
                            📝
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
            <span style={{ fontSize: 12, color: C.textMuted }}>
              Exibindo {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} de {total} artigos
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <Btn variant="ghost" small disabled={page <= 1} onClick={() => setPage(1)}>«</Btn>
              <Btn variant="ghost" small disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹ Anterior</Btn>
              {buildPages(page, totalPages).map((p, i) =>
                p === '…' ? <span key={i} style={{ color: C.textDim, padding: '0 4px' }}>…</span> : (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ background: p === page ? C.blue : C.card, color: p === page ? '#fff' : C.textMuted, border: `1px solid ${p === page ? C.blue : C.border}`, borderRadius: 6, padding: '4px 11px', fontSize: 12, cursor: 'pointer', fontWeight: p === page ? 700 : 400 }}>
                    {p}
                  </button>
                )
              )}
              <Btn variant="ghost" small disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Próximos 10 ›</Btn>
              <Btn variant="ghost" small disabled={page >= totalPages} onClick={() => setPage(totalPages)}>»</Btn>
            </div>
          </div>
        )}

      </div>

      <Panel data={panel} onClose={() => setPanel(null)} />
    </>
  )
}

function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}
