"use client"

import { useState, useEffect, useMemo } from "react"
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

export default function Home() {
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
                    <h2 className="text-3xl font-bold text-[#00457c] mb-6 border-b pb-4">Bienvenidos</h2>
                    
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
                      <li className="text-lg text-slate-700 text-justify flex gap-3 p-4 bg-slate-50 rounded-lg border-l-4 border-[#00457c]">
                        <span className="font-bold text-[#00457c] shrink-0">Nivel 1:</span>
                        <span>Aborda temáticas básicas, que deben estar presentes para las áreas de gestión de personas y que tienen un correlato de cumplimiento legal o normativo.</span>
                      </li>
                      <li className="text-lg text-slate-700 text-justify flex gap-3 p-4 bg-slate-50 rounded-lg border-l-4 border-[#00457c]">
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

                      <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Anotaciones de Mérito y Demérito</p>
                          <p className="text-slate-600 text-sm">Sistema destinado a dejar constancia formal del desempeño funcionario. Las anotaciones de mérito registran una conducta destacada, mientras que las de demérito registran cualquier acción u omisión que implique un desempeño reprochable.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">BGI (Balance de Gestión Integral)</p>
                          <p className="text-slate-600 text-sm">Informe anual de rendición de cuentas y de control de gestión que debe ser entregado a la Dirección de Presupuestos (Dipres).</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">CAIGG (Consejo de Auditoría Interna General de Gobierno)</p>
                          <p className="text-slate-600 text-sm">Entidad a la cual se le debe entregar un informe trimestral de acuerdo con las indicaciones del auditor interno de la institución.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">CEAL-SM</p>
                          <p className="text-slate-600 text-sm">Herramienta o instrumento utilizado para la medición y gestión de los riesgos psicosociales en el trabajo.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Comité Bipartito de Capacitación</p>
                          <p className="text-slate-600 text-sm">Instancia paritaria de participación donde la institución y los funcionarios, a través de sus representantes, validan el PAC, garantizando transparencia.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Comité Paritario de Higiene y Seguridad</p>
                          <p className="text-slate-600 text-sm">Instancia al interior de la institución en la cual, dado su carácter técnico y de composición mixta (representantes del empleador y los trabajadores de manera paritaria), se levantan necesidades acerca de las condiciones de higiene y seguridad en que se desempeñan, proponen medidas y, de ser ello procedente, se implementan dichas medidas.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Control Presupuestario Subtítulo 21</p>
                          <p className="text-slate-600 text-sm">Gestión técnica para que el gasto en personal se ajuste estrictamente al marco de la Ley de Presupuesto.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Cursos CAMPUS</p>
                          <p className="text-slate-600 text-sm">Oferta formativa transversal del Servicio Civil para el fortalecimiento de competencias de las y los funcionarios públicos.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Declaraciones de Intereses y Patrimonio</p>
                          <p className="text-slate-600 text-sm">Es un instrumento regulado por la Ley N°20.880, la cual tiene por objeto transparentar y dar publicidad a las relaciones económicas y patrimoniales que pueden afectar la imparcialidad del funcionario al momento de la toma de decisiones.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">DIPRES (Dirección de Presupuestos)</p>
                          <p className="text-slate-600 text-sm">La Dirección de Presupuestos (Dipres) es el organismo técnico encargado de velar por la asignación y uso eficiente de los recursos públicos, mediante la aplicación de sistemas e instrumentos de gestión financiera, programación y control de gestión, en el marco de la política fiscal.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">DNC (Detección de Necesidades de Capacitación)</p>
                          <p className="text-slate-600 text-sm">Proceso de identificación de necesidades de formación y capacitación de las y los funcionarios públicos, realizado a través del levantamiento de brechas, encuestas, entrevistas u otras herramientas.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Dotación</p>
                          <p className="text-slate-600 text-sm">La dotación de personal es el número máximo de cargos (cargos de planta y empleos a contrata) que una institución del Estado tiene autorizados por Ley para funcionar durante un año determinado.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Escalafón de Mérito</p>
                          <p className="text-slate-600 text-sm">Registro actualizado del desempeño del personal de planta que debe ser confeccionado, notificado y enviado a la Contraloría General de la República (CGR) para su toma de conocimiento.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Estatuto Administrativo</p>
                          <p className="text-slate-600 text-sm">Ley u ordenamiento jurídico principal que regula las relaciones laborales en la administración pública, dictaminando reglas para trabajos extraordinarios, licencias médicas, cometidos, precalificaciones, entre otros.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Gestión del Ausentismo</p>
                          <p className="text-slate-600 text-sm">Análisis de licencias médicas y diagnóstico para asegurar la continuidad operativa del Servicio.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Gobierno Transparente</p>
                          <p className="text-slate-600 text-sm">Publicación mensual de dotación y remuneraciones para dar cumplimiento al acceso a la información (entre otras materias).</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Junta Calificadora</p>
                          <p className="text-slate-600 text-sm">Órgano constituido por las cinco más altas jerarquías titulares y representantes del personal, encargado de llevar a cabo el proceso de calificación y evaluación del desempeño de los funcionarios.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Malla Formativa en Liderazgo</p>
                          <p className="text-slate-600 text-sm">Programa estratégico orientado a potenciar habilidades directivas y de gestión de equipos en las jefaturas del Servicio.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">OAL (Organismo Administrador Laboral)</p>
                          <p className="text-slate-600 text-sm">Entidad administradora de la Ley 16.744 encargada de gestionar la prevención de riesgos y atender las consecuencias de los accidentes de trabajo y enfermedades profesionales.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">PAC (Plan Anual de Capacitación)</p>
                          <p className="text-slate-600 text-sm">Instrumento que consolida las actividades de capacitación a ejecutar en el año siguiente (año t+1), el cual requiere validación interna por el Comité Bipartito de Capacitación y revisión por el Servicio Civil.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">PMG-MEI</p>
                          <p className="text-slate-600 text-sm">Sistema de incentivos e indicadores transversales que evalúa a las instituciones en materias como capacitación, riesgos psicosociales, y salud y seguridad en el trabajo.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Póliza de Fidelidad Funcionaria</p>
                          <p className="text-slate-600 text-sm">Caución obligatoria para funcionarios que custodian o adminstran fondos o bienes públicos.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Portal Empleos Públicos</p>
                          <p className="text-slate-600 text-sm">Plataforma obligatoria para la difusión de concursos. Su gestión debe observar estrictamente las Normas de Aplicación General del Servicio Civil sobre reclutamiento.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Presupuesto</p>
                          <p className="text-slate-600 text-sm">Documento que contiene una previsión, generalmente anual, de los ingresos y gastos relativos a una determinada actividad económica. Es la expresión numérica de los planes.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Prevención de Acoso</p>
                          <p className="text-slate-600 text-sm">Protocolos para prevenir acoso laboral, sexual y violencia, alineados con Normas de Aplicación General.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Programa de Inducción</p>
                          <p className="text-slate-600 text-sm">Proceso de socialización que incluye obligatoriamente el curso de "Inducción a la Administración del Estado" del Centro de Estudios de la Administración del Estado (CEA - CGR).</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">SIAGF</p>
                          <p className="text-slate-600 text-sm">Sistema utilizado para el ingreso y fiscalización de los Regímenes de Prestaciones Familiares (como las cargas familiares) y el Subsidio Familiar.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">SIAPER</p>
                          <p className="text-slate-600 text-sm">Plataforma de la Contraloría General de la República utilizada para registrar resoluciones, ingresos de personal y calificaciones, la cual permite modalidades de ingreso individual o carga masiva.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">SISPUBLI</p>
                          <p className="text-slate-600 text-sm">Sistema Informático de Capacitación del Sector Público, dispuesto por la Dirección Nacional del Servicio Civil. Sirve para registrar las actividades del PAC, facilitar la gestión de los encargados, almacenar información, apoyar el indicador transversal de capacitación y entregar reportabilidad.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Subtítulo 21</p>
                          <p className="text-slate-600 text-sm">Cuenta del clasificador presupuestario asociada a los gastos en personal, cuyo control implica ajustar los ingresos, egresos y requerimientos dotacionales al presupuesto otorgado.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">SUSESO</p>
                          <p className="text-slate-600 text-sm">Entidad fiscalizadora que regula el Servicio de Bienestar (como el envío de proyectos de presupuestos y estados financieros), los PMG de Riesgos Psicosociales y el ausentismo laboral.</p>
                        </div>
                        <div className="py-4">
                          <p className="font-bold text-[#00457c] mb-1">Transferencia de Capacitación</p>
                          <p className="text-slate-600 text-sm">Medición obligatoria del impacto de la formación en el puesto de trabajo, vinculada al Programa de Mejoramiento de la Gestión.</p>
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
