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
            <DialogContent className="sm:max-w-[600px] bg-white text-[#333333] border-[#e0e0e0] shadow-xl overflow-hidden rounded-md px-6 py-6 pb-8">
                <div className={`absolute top-0 left-0 w-2 h-full ${isCritical || isPeremptory ? "bg-[#eb3c46]" : "bg-[#00457c]"
                    }`} />

                <DialogHeader className="pl-4 pb-4 border-b border-[#e0e0e0]">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[14px] font-semibold text-[#666666] mb-1.5 uppercase tracking-wide">{hito.categoria}</p>
                            <DialogTitle className="text-xl font-bold leading-tight text-[#00457c]">
                                {hito.hito}
                            </DialogTitle>
                        </div>
                        <div className="flex flex-col gap-2 items-end shrink-0">
                            {isCritical && (
                                <Badge className="bg-rose-50 text-[#eb3c46] hover:bg-rose-50 border border-rose-100 pointer-events-none px-2 py-0.5 whitespace-nowrap rounded-[4px] shadow-none inline-flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />Crítico
                                </Badge>
                            )}
                            {isPeremptory && (
                                <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-100 pointer-events-none px-2 py-0.5 whitespace-nowrap rounded-[4px] shadow-none inline-flex items-center gap-1">
                                    <CalendarClock className="w-3 h-3" />Perentorio
                                </Badge>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 pl-4 pr-2">
                    <div className="space-y-6">
                        <div>
                            <h4 className="flex items-center text-[14px] font-bold text-[#333333] mb-3">
                                <BookOpen className="w-4 h-4 mr-2 text-[#00457c]" />
                                Normativa y Legal
                            </h4>
                            <div className="bg-[#fcfcfc] rounded-[6px] p-4 border border-[#e0e0e0]">
                                <p className="text-[14px] text-[#666666] font-medium leading-relaxed mb-4">{hito.normativa}</p>

                                <div className="flex items-center justify-between pt-3 border-t border-[#e0e0e0]">
                                    <span className="text-[13px] text-[#666666]">¿Requiere SIAPER?</span>
                                    {hito.siaper.toLowerCase() === "sí" ? (
                                        <span className="text-[13px] font-medium text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded-[4px]">
                                            Sí
                                        </span>
                                    ) : (
                                        <span className="text-[13px] font-medium text-[#666666] bg-[#f2f5f7] px-2 py-0.5 rounded-[4px]">
                                            No
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <a
                                href={hito.linkNormativa}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-[#00457c] hover:bg-[#00335e] text-white rounded-md px-4 py-2.5 text-[14px] font-medium transition-colors shadow-sm"
                            >
                                Ver Documento
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="flex items-center text-[14px] font-bold text-[#333333] mb-3">
                                <User className="w-4 h-4 mr-2 text-[#00457c]" />
                                Ejecución
                            </h4>
                            <div className="bg-[#fcfcfc] rounded-[6px] p-4 border border-[#e0e0e0] space-y-4">
                                <div>
                                    <span className="block text-[12px] uppercase tracking-wide font-semibold text-[#999999] mb-1">Responsable</span>
                                    <span className="text-[14px] font-medium text-[#333333]">{hito.responsable}</span>
                                </div>
                                <div className="pt-3 border-t border-[#e0e0e0]">
                                    <span className="block text-[12px] uppercase tracking-wide font-semibold text-[#999999] mb-1">Periodicidad</span>
                                    <span className="text-[14px] font-medium text-[#333333]">{hito.periodicidad}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
