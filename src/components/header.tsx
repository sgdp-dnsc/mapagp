import { Search, Download, FileText, Menu } from "lucide-react"

interface HeaderProps {
    categoryName: string
    searchQuery: string
    setSearchQuery: (query: string) => void
    onExportPDF: () => void
    onExportExcel: () => void
    onMenuClick?: () => void
}

export function Header({
    categoryName,
    searchQuery,
    setSearchQuery,
    onExportPDF,
    onExportExcel,
    onMenuClick,
}: HeaderProps) {
    return (
        <div className="flex flex-col w-full print:hidden">
            {/* Franja Superior Institucional */}
            <div className="h-1 w-full flex shrink-0">
                <div className="w-1/3 bg-[#00457c]"></div>
                <div className="w-2/3 bg-[#eb3c46]"></div>
            </div>
            <header className="bg-white border-b border-[#e0e0e0] px-4 sm:px-8 py-4 sm:py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md transition-colors"
                        aria-label="Abrir menú"
                    >
                        <Menu className="w-6 h-6 text-[#00457c]" />
                    </button>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#00457c]">{categoryName}</h2>
                        <p className="text-[12px] sm:text-[14px] font-regular text-[#666666] mt-0.5 sm:mt-1">Mapa de Procesos HR</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666] w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar hito..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-[#e0e0e0] rounded-md text-[14px] focus:outline-none focus:ring-1 focus:ring-[#00457c] w-full lg:w-64 text-[#333333] placeholder:text-[#666666]"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={onExportExcel}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#00457c] hover:bg-[#00335e] text-white px-4 py-2 rounded-md text-[14px] font-medium transition-colors shadow-sm"
                            title="Exportar a Excel"
                        >
                            <Download className="w-4 h-4" />
                            <span>Excel</span>
                        </button>
                        <button
                            onClick={onExportPDF}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-[#00457c] text-[#00457c] hover:bg-slate-50 px-4 py-2 rounded-md text-[14px] font-medium transition-colors shadow-sm"
                            title="Exportar a PDF"
                        >
                            <FileText className="w-4 h-4" />
                            <span>PDF</span>
                        </button>
                    </div>
                </div>
            </header>
        </div>
    )
}
