"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { KPICards } from "@/components/kpi-cards"
import { DataTable, HitoData } from "@/components/data-table"
import { DetailModal } from "@/components/detail-modal"
import rawData from "@/data.json"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function Home() {
  const categories = rawData.categories
  const allData = rawData.data as HitoData[]

  const [selectedCategory, setSelectedCategory] = useState("Introducción")
  const [searchQuery, setSearchQuery] = useState("")
  const [alertFilter, setAlertFilter] = useState<"Todas" | "Críticos" | "Vencimientos">("Todas")
  const [selectedHito, setSelectedHito] = useState<HitoData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Lógica de filtrado
  let filteredData = allData

  // 1. Filtrar por búsqueda (Global si hay búsqueda)
  const isSearching = searchQuery.trim() !== ""
  if (isSearching) {
    const terms = searchQuery.toLowerCase().split(/\s+/).filter(t => t.length > 0)
    filteredData = allData.filter((d) => {
      const searchFields = [
        d.hito,
        d.responsable,
        d.normativa,
        d.periodicidad,
        d.categoria
      ].map(f => f.toLowerCase())

      return terms.every(term =>
        searchFields.some(field => field.includes(term))
      )
    })
  } else if (selectedCategory !== "Introducción") {
    // 2. Si no hay búsqueda, filtrar por categoría
    filteredData = allData.filter((d) => d.categoria === selectedCategory)
  }

  // 3. Filtro de Alertas (KPIs) sobre el conjunto ya filtrado
  if (alertFilter === "Críticos") {
    filteredData = filteredData.filter(d => d.criticidad.toLowerCase() === "alta")
  } else if (alertFilter === "Vencimientos") {
    filteredData = filteredData.filter(d => d.plazoPerentorio.toLowerCase() === "sí")
  }

  // Calcular KPIs sobre los datos filtrados
  const totalHitos = filteredData.length
  const criticalHitos = filteredData.filter((d) => d.criticidad.toLowerCase() === "alta").length
  const expiringHitos = filteredData.filter((d) => d.plazoPerentorio.toLowerCase() === "sí").length

  // Handlers para el modal
  const handleRowClick = (hito: HitoData) => {
    setSelectedHito(hito)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedHito(null), 200) // Clear after animation
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
    XLSX.writeFile(workbook, `Mapa_Procesos_Export.xlsx`)
  }

  // Exportar a PDF
  const handleExportPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text(`Mapa de Procesos HR - Reporte`, 14, 15)
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
      headStyles: { fillColor: [30, 64, 175] }
    });

    doc.save(`Mapa_Procesos_Reporte.pdf`)
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
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#00457c] mb-4">Bienvenidos al Mapa GP</h2>
                    <div className="h-1 w-20 bg-[#eb3c46] mx-auto rounded-full"></div>
                  </div>

                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-600 leading-relaxed text-center">
                      Esta plataforma permite visualizar y gestionar de manera estratégica los procesos de Gestión de Personas,
                      asegurando el cumplimiento de la normativa vigente y optimizando la toma de decisiones.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6 mt-12">
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Objetivo</h3>
                        <p className="text-slate-600">Proporcionar una visión clara de los hitos y requerimientos legales en cada etapa del ciclo de vida del funcionario.</p>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Funcionalidad</h3>
                        <p className="text-slate-600">Navegue a través de las categorías en el panel lateral para ver los detalles, criticidad y plazos de cada proceso.</p>
                      </div>
                    </div>

                    <div className="mt-12 p-6 bg-[#f2f5f7] rounded-xl border border-[#00457c]/10 text-center italic">
                      "Optimizando la gestión pública a través de la transparencia y la planificación estratégica."
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
                      Detalle de Procesos
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
