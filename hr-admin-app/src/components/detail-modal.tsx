"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Drawer } from "vaul"
import { Badge } from "@/components/ui/badge"
import { HitoData } from "@/types"
import { ExternalLink, CalendarClock, User, BookOpen, AlertTriangle, X } from "lucide-react"
import { useEffect, useState } from "react"

interface DetailModalProps {
    hito: HitoData | null
    isOpen: boolean
    onClose: () => void
}

export function DetailModal({ hito, isOpen, onClose }: DetailModalProps) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    if (!hito) return null

    const isCritical = hito.criticidad.toLowerCase() === "alta"
    const isPeremptory = hito.plazoPerentorio.toLowerCase() === "sí"

    const Content = () => (
        <div className="flex flex-col h-full bg-white text-[#333333]">
            {/* Accessibility: WCAG 2.1 Contrast bar */}
            <div className={`h-1.5 w-full shrink-0 ${isCritical || isPeremptory ? "bg-[#eb3c46]" : "bg-[#00457c]"
                }`} />

            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                    <div className="pr-2">
                        <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-[0.2em] leading-none">
                            {hito.id}. {hito.categoria}
                        </p>
                        <h2 className="text-xl sm:text-2xl font-bold leading-tight text-[#00457c] mt-2">
                            {hito.hito}
                        </h2>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h4 className="flex items-center text-[11px] font-bold text-slate-800 mb-3 uppercase tracking-[0.2em]">
                                <BookOpen className="w-4 h-4 mr-2 text-[#00457c]" />
                                Normativa y Legal
                            </h4>
                            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-100 shadow-sm">
                                <p className="text-[14px] text-slate-600 font-medium leading-relaxed mb-4">{hito.normativa}</p>

                                {hito.siaper.toLowerCase() === "sí" && (
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SIAPER</span>
                                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 font-bold rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-none">
                                            Requiere registro
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>

                        {hito.linkNormativa && (
                            <a
                                href={hito.linkNormativa}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full group flex items-center justify-center gap-3 bg-[#00457c] hover:bg-[#00335e] text-white rounded-xl px-4 py-4 text-[14px] font-bold transition-all shadow-md hover:shadow-xl active:scale-[0.98]"
                            >
                                Ver Documento Legal
                                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="flex items-center text-[11px] font-bold text-slate-800 mb-3 uppercase tracking-[0.2em]">
                                <User className="w-4 h-4 mr-2 text-[#00457c]" />
                                Ejecución
                            </h4>
                            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-100 shadow-sm space-y-5">
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Vinculación Institucional</span>
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
            </div>
        </div>
    )

    if (isMobile) {
        return (
            <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()} shouldScaleBackground>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
                    <Drawer.Content className="bg-white flex flex-col rounded-t-[32px] h-[90vh] fixed bottom-0 left-0 right-0 z-[101] focus:outline-none">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 mt-4 mb-2" />
                        <Content />
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="p-0 overflow-hidden sm:max-w-[700px] border-none shadow-2xl rounded-2xl">
                <Content />
            </DialogContent>
        </Dialog>
    )
}
