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
            <DialogContent className="sm:max-w-[600px] bg-white text-slate-900 border-slate-200 shadow-xl overflow-hidden">
                <div className={`absolute top-0 left-0 w-2 h-full ${isCritical || isPeremptory ? "bg-rose-500" : "bg-blue-500"
                    }`} />

                <DialogHeader className="pl-4 pb-4 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-blue-600 mb-1">{hito.categoria}</p>
                            <DialogTitle className="text-xl font-bold leading-tight">
                                {hito.hito}
                            </DialogTitle>
                        </div>
                        <div className="flex flex-col gap-2 items-end shrink-0">
                            {isCritical && (
                                <Badge variant="destructive" className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-0 pointer-events-none px-2.5">
                                    <AlertTriangle className="w-3 h-3 mr-1" /> Crítico
                                </Badge>
                            )}
                            {isPeremptory && (
                                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0 pointer-events-none px-2.5">
                                    <CalendarClock className="w-3 h-3 mr-1" /> Plazo Perentorio
                                </Badge>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 pl-4 pr-2">
                    <div className="space-y-6">
                        <div>
                            <h4 className="flex items-center text-sm font-bold text-slate-800 mb-2">
                                <BookOpen className="w-4 h-4 mr-2 text-slate-500" />
                                Normativa y Legal
                            </h4>
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                <p className="text-sm text-slate-700 font-medium mb-3">{hito.normativa}</p>

                                <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-200">
                                    <span className="text-xs text-slate-500">¿Requiere SIAPER?</span>
                                    <Badge variant={hito.siaper.toLowerCase() === "sí" ? "default" : "secondary"}
                                        className={hito.siaper.toLowerCase() === "sí" ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-0" : "bg-slate-100 text-slate-600 hover:bg-slate-100 border-0"}>
                                        {hito.siaper.toLowerCase() === "sí" ? "Sí, requiere" : "No requiere"}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div>
                            <a
                                href={hito.linkNormativa}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md px-4 py-2.5 text-sm font-medium transition-colors shadow-sm"
                            >
                                Ver Documento Normativo
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="flex items-center text-sm font-bold text-slate-800 mb-2">
                                <User className="w-4 h-4 mr-2 text-slate-500" />
                                Ejecución
                            </h4>
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-3">
                                <div>
                                    <span className="block text-xs text-slate-500 mb-0.5">Responsable</span>
                                    <span className="text-sm font-medium text-slate-900">{hito.responsable}</span>
                                </div>
                                <div className="pt-2 border-t border-slate-200">
                                    <span className="block text-xs text-slate-500 mb-0.5">Periodicidad</span>
                                    <span className="text-sm font-medium text-slate-900">{hito.periodicidad}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
