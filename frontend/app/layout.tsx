import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata = {
  title: 'AgentMarket - AI Agent Marketplace',
  description: 'Discover, publish, and deploy AI agents',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
