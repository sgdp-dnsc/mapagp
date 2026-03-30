"use client"

import { useState, useEffect, useMemo, Suspense } from "react" // Agregado Suspense
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

// 1. Movemos toda la lógica a un componente interno
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

  // Sincronización de URL (Deep Linking)
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

  // Buscador Inteligente (Fuse.js)
  const fuse = useMemo(() => new Fuse(allData, {
    keys: ["hito", "responsable", "normativa", "categoria"],
    threshold: 0.3,
    distance: 100
  }), [allData])

  // Lógica de filtrado
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

  // Calcular KPIs
  const totalHitos = filteredData.length
  const criticalHitos = filteredData.filter((d) => d.criticidad.toLowerCase() === "alta").length
  const expiringHitos = filteredData.filter((d) => d.plazoPerentorio.toLowerCase() === "sí").length

  const isSearching = searchQuery.trim() !== ""

  // Handlers
  const handleRowClick = (hito: HitoData) => {
    setSelectedHito(hito)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedHito(null), 200)
  }

  // Exportar a Excel
  const handleExportExcel = () => {
    const exportData = filteredData.map(item => ({
      'Hito': item.hito,
      'Categoría': item.categoria,
      'SIAPER': item.siaper,
      'Normativa': item.normativa,
      'Periodicidad': item.periodicidad,
      'Vinculación con otras instituciones': item.responsable,
      'Criticidad': item.criticidad,
      'Plazo Perentorio': item.plazoPerentorio
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados")
    XLSX.writeFile(workbook, `Mapa_GP_Export.xlsx`)
  }

  // Exportar a PDF
  const handleExportPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text(`Mapa de Gestión de Personas - Reporte`, 14, 15)
    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 22)

    const tableColumn = ["Hito", "Categoría", "Normativa", "Vinculación", "Crit."];
    const tableRows = filteredData.map(item => [
      item.hito,
      item.categoria,
      item.normativa,
      item.responsable,
      item.criticidad
    ]);

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [0, 69, 124] }
    });

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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth print:p-0">
          <div className="max-w-6xl mx-auto space-y-6">
            {selectedCategory === "Introducción" && !isSearching ? (
              <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-8 sm:p-12">
                <div className="max-w-3xl mx-auto space-y-8">
                  <div className="prose prose-slate max-w-none">
                    <h2 className="text-2xl font-bold text-[#00457c] mb-6">Bienvenidos</h2>
                    
                    <p className="text-lg text-slate-700 leading-relaxed mb-6 text-justify">
                      Con el fin de aportar a una visión y comprensión amplia del rol de Gestión de Personas al interior de cada Servicio, hemos levantado el siguiente <span className="font-bold text-[#00457c]">“Mapa de Gestión y Desarrollo de Personas”</span>.
                    </p>

                    <p className="text-lg text-slate-700 leading-relaxed mb-6 text-justify">
                      Buscamos que ésta sea una herramienta útil para las jefaturas del área de gestión y desarrollo de personas, y que les permita, realizar una check list del cumplimiento de los compromisos establecidos para el área; generar un diagnóstico que les permita identificar funciones críticas, demandas y desafíos del área; y también a jefaturas de ADP, tener una panorámica vinculada al área, entre otras posibilidades.
                    </p>

                    <p className="text-lg text-slate-700 leading-relaxed mb-4 text-justify">
                      En este mapeo de gestión encontrarán cada subsistema de gestión y desarrollo de personas, dividido en 2 niveles:
                    </p>

                    <ul className="list-none space-y-4 mb-8">
                      <li className="text-lg text-slate-700 text-justify flex gap-3">
                        <span className="font-bold text-[#00457c] shrink-0">Nivel 1:</span>
                        <span>Aborda temáticas básicas, que deben estar presentes para las áreas de gestión de personas y que tienen un correlato de cumplimiento legal o normativo.</span>
                      </li>
                      <li className="text-lg text-slate-700 text-justify flex gap-3">
                        <span className="font-bold text-[#00457c] shrink-0">Nivel 2:</span>
                        <span>Aborda hitos o acciones de carácter más estratégico, que apuntan a un nivel de desarrollo mayor en materia de gestión y desarrollo de personas en cada servicio.</span>
                      </li>
                    </ul>

                    <div className="mt-12 p-8 bg-[#f2f5f7] rounded-xl border border-[#00457c]/10 text-center italic text-[#00457c] font-medium leading-relaxed shadow-inner">
                      El objetivo final es entregar una herramienta de <span className="font-bold underline decoration-2 underline-offset-4">mapeo y alertas tempranas</span> que permita a las jefaturas navegar la complejidad normativa sin perder de vista el desarrollo humano.
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedCategory === "GLOSARIO" && !isSearching ? (
              <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-8 sm:p-12">
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#00457c] mb-4">Glosario</h2>
                    <div className="h-1 w-20 bg-[#eb3c46] mx-auto rounded-full"></div>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-4">
                      <p className="text-slate-700 font-medium">Conceptos clave de Gestión de Personas:</p>

                      <div className="divide-y divide-slate-100">
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">SIAPER</p>
                          <p className="text-slate-600">Plataforma de la Contraloría General de la República utilizada para registrar resoluciones, ingresos de personal y calificaciones.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">DIPRES</p>
                          <p className="text-slate-600">Dirección de Presupuestos del Ministerio de Hacienda, encargada de la asignación y control de recursos financieros.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">ADP</p>
                          <p className="text-slate-600">Alta Dirección Pública. Sistema que busca dotar a las instituciones públicas de directivos con capacidad de gestión y liderazgo.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                  <div className="p-4 sm:p-6 border-b border-[#e0e0e0] flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800 print:hidden">
                      {isSearching ? "Resultados de búsqueda" : "Detalle de Hitos de Gestión"}
                    </h3>
                  </div>
                  <div className="p-0">
                    <DataTable
                      data={filteredData}
                      onRowClick={handleRowClick}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <DetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        hito={selectedHito}
      />
    </div>
  )
}

// 2. Exportamos el componente envuelto en Suspense
export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Cargando aplicación...</div>}>
      <HomeContent />
    </Suspense>
  )
}
