"use client"

import { useState, useEffect, useMemo, Suspense } from "react" // Agregamos Suspense
import { useRouter, useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { KPICards } from "@/components/kpi-cards"
import { DataTable } from "@/components/data-table"
import { HitoData } from "@/types"
import { DetailModal } from "@/components/detail-modal"
import rawData from "@/data.json"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Fuse from "fuse.js"

// 1. Movemos toda tu lógica actual aquí
function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const categories = rawData.categories
  const allData = rawData.data as HitoData[]

  const [selectedCategory, setSelectedCategory] = useState("Introducción")
  const [searchQuery, setSearchQuery] = useState("")
  const [alertFilter, setAlertFilter] = useState<"Todas" | "Críticos" | "Vencimientos">("Todas")
  const [selectedHito, setSelectedHito] = useState<HitoData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Sincronización de URL
  useEffect(() => {
    const cat = searchParams.get("category")
    const search = searchParams.get("q")
    if (cat) setSelectedCategory(cat)
    if (search) setSearchQuery(search)
  }, [searchParams])

  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory !== "Introducción") params.set("category", selectedCategory)
    if (searchQuery) params.set("q", searchQuery)
    
    const newUrl = params.toString() ? `?${params.toString()}` : "/"
    window.history.replaceState(null, "", newUrl)
  }, [selectedCategory, searchQuery])

  const fuse = useMemo(() => new Fuse(allData, {
    keys: ["hito", "responsable", "normativa", "categoria"],
    threshold: 0.3,
    distance: 100
  }), [allData])

  const filteredData = useMemo(() => {
    let result = allData
    const isSearching = searchQuery.trim() !== ""
    if (isSearching) {
      result = fuse.search(searchQuery).map(r => r.item)
    } else if (selectedCategory !== "Introducción" && selectedCategory !== "GLOSARIO") {
      result = allData.filter((d) => d.categoria === selectedCategory)
    }
    if (alertFilter === "Críticos") {
      result = result.filter(d => d.criticidad.toLowerCase() === "alta")
    } else if (alertFilter === "Vencimientos") {
      result = result.filter(d => d.plazoPerentorio.toLowerCase() === "sí")
    }
    return result
  }, [allData, searchQuery, selectedCategory, fuse, alertFilter])

  const totalHitos = filteredData.length
  const criticalHitos = filteredData.filter((d) => d.criticidad.toLowerCase() === "alta").length
  const expiringHitos = filteredData.filter((d) => d.plazoPerentorio.toLowerCase() === "sí").length
  const isSearching = searchQuery.trim() !== ""

  const handleRowClick = (hito: HitoData) => {
    setSelectedHito(hito)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedHito(null), 200)
  }

  const handleExportExcel = () => {
    const exportData = filteredData.map(item => ({
      'Hito': item.hito,
      'Categoría': item.categoria,
      'SIAPER': item.siaper,
      'Normativa': item.normativa,
      'Periodicidad': item.periodicidad,
      'Vinculación': item.responsable,
      'Criticidad': item.criticidad,
      'Plazo Perentorio': item.plazoPerentorio
    }))
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados")
    XLSX.writeFile(workbook, `Mapa_GP_Export.xlsx`)
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(`Mapa de Gestión de Personas - Reporte`, 14, 15)
    const tableColumn = ["Hito", "Categoría", "Normativa", "Vinculación", "Crit."];
    const tableRows = filteredData.map(item => [item.hito, item.categoria, item.normativa, item.responsable, item.criticidad]);
    autoTable(doc, { startY: 30, head: [tableColumn], body: tableRows, theme: 'grid' });
    doc.save(`Mapa_GP_Reporte.pdf`)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 relative">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat)
          setAlertFilter("Todas")
          setSearchQuery("")
          setIsSidebarOpen(false)
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        <Header
          categoryName={isSearching ? "Resultados de búsqueda" : selectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-6">
            {selectedCategory === "Introducción" && !isSearching ? (
              <div className="bg-white rounded-lg p-8">
                 <h2 className="text-2xl font-bold text-[#00457c] mb-6">Bienvenidos</h2>
                 <p className="text-lg text-slate-700 leading-relaxed mb-6 text-justify">
                    Con el fin de aportar a una visión y comprensión amplia del rol de Gestión de Personas al interior de cada Servicio...
                 </p>
                 {/* ... Resto de tu texto de Introducción ... */}
              </div>
            ) : (
              <>
                <KPICards
                  totalHitos={totalHitos}
                  criticalHitos={criticalHitos}
                  expiringHitos={expiringHitos}
                  onFilterChange={setAlertFilter}
                  currentFilter={alertFilter}
                />
                <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
                  <DataTable data={filteredData} onRowClick={handleRowClick} />
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <DetailModal isOpen={isModalOpen} onClose={handleCloseModal} hito={selectedHito} />
    </div>
  )
}

// 2. Este es el componente que Next.js verá y ahora está protegido con Suspense
export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Cargando Mapa...</div>}>
      <HomeContent />
    </Suspense>
  )
}
