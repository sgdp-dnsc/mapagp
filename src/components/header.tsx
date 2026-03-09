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
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{categoryName}</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Visualización de procesos y cumplimiento normativo</p>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar hito, responsable..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onExportExcel}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        title="Exportar a Excel"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Excel</span>
                    </button>
                    <button
                        onClick={onExportPDF}
                        className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        title="Exportar a PDF"
                    >
                        <FileText className="w-4 h-4" />
                        <span className="hidden sm:inline">PDF</span>
                    </button>
                </div>
            </div>
        </header>
    )
}
