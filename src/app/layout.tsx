import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mapa de Procesos HR",
  description: "Visualizador de Mapa de Procesos y Cumplimiento Normativo - Gestión de Personas",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-[#f2f5f7] text-[#333333] antialiased`}>
        {children}
      </body>
    </html>
  )
}
