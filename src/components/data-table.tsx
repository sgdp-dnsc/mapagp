"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, ExternalLink, AlertTriangle, CalendarClock } from "lucide-react"

export type HitoData = {
    id: string
    categoria: string
    hito: string
    siaper: string
    normativa: string
    linkNormativa: string
    periodicidad: string
    responsable: string
    criticidad: string
    plazoPerentorio: string
}

interface DataTableProps {
    data: HitoData[]
    onRowClick: (hito: HitoData) => void
}

export function DataTable({ data, onRowClick }: DataTableProps) {
    const [periodicidadFilter, setPeriodicidadFilter] = useState("Todas")
    const [responsableFilter, setResponsableFilter] = useState("Todos")
    const [alertaFilter, setAlertaFilter] = useState("Todas")

    // Obtener opciones únicas para los filtros
    const periodicidades = ["Todas", ...Array.from(new Set(data.map((d) => d.periodicidad)))]
    const responsables = ["Todos", ...Array.from(new Set(data.map((d) => d.responsable)))]
    const alertas = ["Todas", "Críticos", "Vencimientos"]

    // Aplicar filtros
    const filteredData = data.filter((item) => {
        const matchPeriodicidad = periodicidadFilter === "Todas" || item.periodicidad === periodicidadFilter
        const matchResponsable = responsableFilter === "Todos" || item.responsable === responsableFilter

        let matchAlerta = true
        if (alertaFilter === "Críticos") {
            matchAlerta = item.criticidad.toLowerCase() === "alta"
        } else if (alertaFilter === "Vencimientos") {
            matchAlerta = item.plazoPerentorio.toLowerCase() === "sí"
        }

        return matchPeriodicidad && matchResponsable && matchAlerta
    })

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4 px-4 sm:px-6 pt-4 print:hidden">
                <div className="w-full sm:w-48">
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block tracking-widest">Periodicidad</label>
                    <Select value={periodicidadFilter} onValueChange={(val) => setPeriodicidadFilter(val || "Todas")}>
                        <SelectTrigger className="w-full h-9 text-[13px] bg-white border-slate-200 focus:ring-[#00457c] shadow-sm rounded-md">
                            <SelectValue placeholder="Periodicidad" />
                        </SelectTrigger>
                        <SelectContent>
                            {periodicidades.map((p) => (
                                <SelectItem key={p} value={p} className="text-[13px]">{p}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full sm:w-64">
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block tracking-widest">Vinculación Institucional</label>
                    <Select value={responsableFilter} onValueChange={(val) => setResponsableFilter(val || "Todos")}>
                        <SelectTrigger className="w-full h-9 text-[13px] bg-white border-slate-200 focus:ring-[#00457c] shadow-sm rounded-md">
                            <SelectValue placeholder="Responsable" />
                        </SelectTrigger>
                        <SelectContent>
                            {responsables.map((r) => (
                                <SelectItem key={r} value={r} className="text-[13px]">{r}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full sm:w-48">
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block tracking-widest">Alertas</label>
                    <Select value={alertaFilter} onValueChange={(val) => setAlertaFilter(val || "Todas")}>
                        <SelectTrigger className="w-full h-9 text-[13px] bg-white border-slate-200 focus:ring-[#00457c] shadow-sm rounded-md">
                            <SelectValue placeholder="Alertas" />
                        </SelectTrigger>
                        <SelectContent>
                            {alertas.map((a) => (
                                <SelectItem key={a} value={a} className="text-[13px]">{a}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border-0 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50 border-y border-slate-200">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="min-w-[220px] w-[35%] font-bold text-[11px] uppercase tracking-wider text-slate-500 h-11">Hito a Cumplir</TableHead>
                                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 h-11">SIAPER</TableHead>
                                <TableHead className="min-w-[150px] font-bold text-[11px] uppercase tracking-wider text-slate-500 h-11">Normativa / Naturaleza</TableHead>
                                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 hidden md:table-cell h-11">Periodicidad</TableHead>
                                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 hidden md:table-cell h-11 text-center">Vinculación con otras instituciones</TableHead>
                                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-500 h-11">Estado Alertas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-400 text-sm">
                                        No se encontraron resultados para los filtros seleccionados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((row) => {
                                    const isFootnoteRow = row.hito.startsWith("Nota ") || row.hito.startsWith("SISPUBLI:");

                                    if (isFootnoteRow) {
                                        return (
                                            <TableRow
                                                key={row.id}
                                                className="hover:bg-transparent border-b border-slate-100"
                                            >
                                                <TableCell colSpan={6} className="text-[11px] sm:text-[12px] text-slate-500 py-4 italic bg-slate-50/50 leading-relaxed px-6">
                                                    {row.hito}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }

                                    const isCritical = row.criticidad.toLowerCase() === "alta"
                                    const isPeremptory = row.plazoPerentorio.toLowerCase() === "sí"
                                    const showSiaper = row.siaper.toLowerCase() === "sí"

                                    return (
                                        <TableRow
                                            key={row.id}
                                            onClick={() => onRowClick(row)}
                                            className={`group cursor-pointer transition-colors border-b border-slate-100 hover:bg-slate-50/80 ${isCritical || isPeremptory ? "border-l-4 border-l-[#eb3c46]" : "border-l-4 border-l-transparent"
                                                }`}
                                        >
                                            <TableCell className="font-bold text-[12px] sm:text-[14px] text-slate-800 py-4 leading-snug">
                                                {row.hito}
                                            </TableCell>
                                            <TableCell>
                                                {showSiaper ? (
                                                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 font-bold rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wider flex w-fit items-center gap-1 shadow-none">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Sí
                                                    </Badge>
                                                ) : (
                                                    <span className="text-[13px] text-slate-300">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-[12px] sm:text-[13px] text-slate-600 font-medium">
                                                {row.normativa}
                                            </TableCell>
                                            <TableCell className="text-[12px] sm:text-[13px] text-slate-600 hidden md:table-cell">{row.periodicidad}</TableCell>
                                            <TableCell className="text-[12px] sm:text-[13px] text-slate-600 hidden md:table-cell text-center">{row.responsable}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1.5 2xl:flex-row">
                                                    {isCritical && (
                                                        <Badge className="bg-rose-50 text-[#eb3c46] hover:bg-rose-50 border-rose-100 pointer-events-none px-2 py-0.5 whitespace-nowrap rounded-md shadow-none inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                                                            <AlertTriangle className="w-3 h-3" />Alta
                                                        </Badge>
                                                    )}
                                                    {isPeremptory && (
                                                        <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-100 pointer-events-none px-2 py-0.5 whitespace-nowrap rounded-md shadow-none inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                                                            <CalendarClock className="w-3 h-3" />Perentorio
                                                        </Badge>
                                                    )}
                                                    {!isCritical && !isPeremptory && (
                                                        <span className="text-[11px] text-slate-400 font-medium italic">Normal</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
