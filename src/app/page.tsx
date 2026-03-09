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

  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedHito, setSelectedHito] = useState<HitoData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Filtrar por categoría seleccionada
  let currentCategoryData = allData.filter((d) => d.categoria === selectedCategory)

  // Búsqueda global (sobre la categoría actual)
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase()
    currentCategoryData = currentCategoryData.filter(
      (d) =>
        d.hito.toLowerCase().includes(q) ||
        d.responsable.toLowerCase().includes(q) ||
        d.normativa.toLowerCase().includes(q)
    )
  }

  // Calcular KPIs
  const totalHitos = currentCategoryData.length
  const criticalHitos = currentCategoryData.filter((d) => d.criticidad.toLowerCase() === "alta").length
  const expiringHitos = currentCategoryData.filter((d) => d.plazoPerentorio.toLowerCase() === "sí").length

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
    const exportData = currentCategoryData.map(item => ({
      'Hito': item.hito,
      'SIAPER': item.siaper,
      'Normativa': item.normativa,
      'Periodicidad': item.periodicidad,
      'Responsable': item.responsable,
      'Criticidad': item.criticidad,
      'Plazo Perentorio': item.plazoPerentorio
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    const sheetName = selectedCategory.substring(0, 31)
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.writeFile(workbook, `Mapa_Procesos_${selectedCategory.replace(/\s+/g, '_')}.xlsx`)
  }

  // Exportar a PDF
  const handleExportPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text(`Mapa de Procesos HR - ${selectedCategory}`, 14, 15)
    doc.setFontSize(10)
    doc.text(`Fecha de exportación: ${new Date().toLocaleDateString()}`, 14, 22)

    const tableColumn = ["Hito", "Normativa", "Resp.", "Periodicidad", "Crit.", "Perentorio"];
    const tableRows = currentCategoryData.map(item => [
      item.hito,
      item.normativa,
      item.responsable,
      item.periodicidad,
      item.criticidad,
      item.plazoPerentorio
    ]);

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [30, 64, 175] }, // blue-800
      didParseCell: function (data: any) {
        if (data.section === 'body') {
          // Highlight critical
          if (data.column.index === 4 && data.cell.raw === 'Alta') {
            data.cell.styles.textColor = [225, 29, 72] // rose-600
            data.cell.styles.fontStyle = 'bold'
          }
          // Highlight peremptory
          if (data.column.index === 5 && data.cell.raw === 'Sí') {
            data.cell.styles.textColor = [217, 119, 6] // amber-600
            data.cell.styles.fontStyle = 'bold'
          }
        }
      }
    });

    doc.save(`Mapa_Procesos_${selectedCategory.replace(/\s+/g, '_')}.pdf`)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 relative">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat)
          setIsSidebarOpen(false)
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        <Header
          categoryName={selectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth print:p-0">
          <div className="max-w-6xl mx-auto space-y-6">
            <KPICards
              totalHitos={totalHitos}
              criticalHitos={criticalHitos}
              expiringHitos={expiringHitos}
            />

            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-[#e0e0e0] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 print:hidden">
                  Detalle de Procesos
                </h3>
              </div>
              <div className="p-0">
                <DataTable
                  data={currentCategoryData}
                  onRowClick={handleRowClick}
                />
              </div>
            </div>
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
