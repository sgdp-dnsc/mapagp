import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { HitoData } from "./data-table"
import { ExternalLink, CalendarClock, User, BookOpen, AlertTriangle } from "lucide-react"

interface DetailModalProps {
    hito: HitoData | null
    isOpen: boolean
    onClose: () => void
}

export function DetailModal({ hito, isOpen, onClose }: DetailModalProps) {
    if (!hito) return null

    const isCritical = hito.criticidad.toLowerCase() === "alta"
    const isPeremptory = hito.plazoPerentorio.toLowerCase() === "sí"

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white text-[#333333] border-[#e0e0e0] shadow-xl rounded-md px-4 sm:px-6 py-6 pb-8">
                <div className={`fixed top-0 left-0 w-2 h-full z-10 ${isCritical || isPeremptory ? "bg-[#eb3c46]" : "bg-[#00457c]"
                    }`} />

                <DialogHeader className="pl-4 pb-4 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="pr-2">
                            <p className="text-[11px] sm:text-[12px] font-bold text-slate-400 mb-1 uppercase tracking-widest leading-none">{hito.id}. {hito.categoria}</p>
                            <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight text-[#00457c] mt-2">
                                {hito.hito}
                            </DialogTitle>
                        </div>
                        <div className="flex flex-row sm:flex-col gap-2 items-center sm:items-end shrink-0">
                            {isCritical && (
                                <Badge className="bg-rose-50 text-[#eb3c46] hover:bg-rose-50 border-rose-100 pointer-events-none px-2.5 py-1 whitespace-nowrap rounded-md shadow-none inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
                                    <AlertTriangle className="w-3.5 h-3.5" />Crítico
                                </Badge>
                            )}
                            {isPeremptory && (
                                <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-100 pointer-events-none px-2.5 py-1 whitespace-nowrap rounded-md shadow-none inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
                                    <CalendarClock className="w-3.5 h-3.5" />Perentorio
                                </Badge>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 py-6 pl-4 pr-2">
                    <div className="space-y-6">
                        <div>
                            <h4 className="flex items-center text-[13px] font-bold text-slate-800 mb-3 uppercase tracking-wider">
                                <BookOpen className="w-4 h-4 mr-2 text-[#00457c]" />
                                Normativa y Legal
                            </h4>
                            <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100">
                                <p className="text-[14px] text-slate-600 font-medium leading-relaxed mb-4">{hito.normativa}</p>

                                {hito.siaper.toLowerCase() === "sí" && (
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">SIAPER</span>
                                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 font-bold rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-none">
                                            Requiere registro
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>

                        {hito.linkNormativa && (
                            <div>
                                <a
                                    href={hito.linkNormativa}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-[#00457c] hover:bg-[#00335e] text-white rounded-lg px-4 py-3 text-[14px] font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                                >
                                    Ver Documento Legal
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="flex items-center text-[13px] font-bold text-slate-800 mb-3 uppercase tracking-wider">
                                <User className="w-4 h-4 mr-2 text-[#00457c]" />
                                Ejecución
                            </h4>
                            <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 space-y-5">
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Vinculación con otras instituciones</span>
                                    <span className="text-[14px] font-bold text-slate-700 leading-snug block">{hito.responsable}</span>
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Periodicidad</span>
                                    <div className="inline-flex items-center px-2 py-1 bg-white border border-slate-100 rounded-md shadow-sm">
                                        <span className="text-[13px] font-bold text-slate-700">{hito.periodicidad}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
