export const metadata = {
  title: 'SEO Manager — Simples Solução TI',
  description: 'Gerenciador de SEO para artigos do blog',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#0f172a', color: '#f1f5f9', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
