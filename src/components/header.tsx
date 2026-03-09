import { Search, Download, FileText } from "lucide-react"

interface HeaderProps {
    categoryName: string
    searchQuery: string
    setSearchQuery: (query: string) => void
    onExportPDF: () => void
    onExportExcel: () => void
}

export function Header({
    categoryName,
    searchQuery,
    setSearchQuery,
    onExportPDF,
    onExportExcel,
}: HeaderProps) {
    return (
        <div className="flex flex-col w-full print:hidden">
            {/* Franja Superior Institucional */}
            <div className="h-1 w-full flex">
                <div className="w-1/3 bg-[#00457c]"></div>
                <div className="w-2/3 bg-[#eb3c46]"></div>
            </div>
            <header className="bg-white border-b border-[#e0e0e0] px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-[#00457c]">{categoryName}</h2>
                    <p className="text-[14px] font-regular text-[#666666] mt-1">Visualización de procesos y cumplimiento normativo</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666] w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar hito, responsable..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-[#e0e0e0] rounded-md text-[14px] focus:outline-none focus:ring-1 focus:ring-[#00457c] w-full sm:w-64 text-[#333333] placeholder:text-[#666666]"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={onExportExcel}
                            className="flex items-center gap-2 bg-[#00457c] hover:bg-[#00335e] text-white px-4 py-2 rounded-md text-[14px] font-medium transition-colors shadow-sm"
                            title="Exportar a Excel"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Excel</span>
                        </button>
                        <button
                            onClick={onExportPDF}
                            className="flex items-center gap-2 bg-white border border-[#00457c] text-[#00457c] hover:bg-slate-50 px-4 py-2 rounded-md text-[14px] font-medium transition-colors shadow-sm"
                            title="Exportar a PDF"
                        >
                            <FileText className="w-4 h-4" />
                            <span className="hidden sm:inline">PDF</span>
                        </button>
                    </div>
                </div>
            </header>
        </div>
    )
}
