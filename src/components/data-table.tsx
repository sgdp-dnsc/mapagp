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

    // Obtener opciones únicas para los filtros
    const periodicidades = ["Todas", ...Array.from(new Set(data.map((d) => d.periodicidad)))]
    const responsables = ["Todos", ...Array.from(new Set(data.map((d) => d.responsable)))]

    // Aplicar filtros
    const filteredData = data.filter((item) => {
        const matchPeriodicidad = periodicidadFilter === "Todas" || item.periodicidad === periodicidadFilter
        const matchResponsable = responsableFilter === "Todos" || item.responsable === responsableFilter
        return matchPeriodicidad && matchResponsable
    })

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
                <div className="w-full sm:w-64">
                    <label className="text-xs font-semibold text-[#666666] uppercase mb-1 block tracking-wide">Periodicidad</label>
                    <Select value={periodicidadFilter} onValueChange={(val) => setPeriodicidadFilter(val || "Todas")}>
                        <SelectTrigger className="w-full bg-white border-[#e0e0e0] focus:ring-[#00457c] shadow-sm rounded-md">
                            <SelectValue placeholder="Seleccionar periodicidad" />
                        </SelectTrigger>
                        <SelectContent>
                            {periodicidades.map((p) => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full sm:w-64">
                    <label className="text-xs font-semibold text-[#666666] uppercase mb-1 block tracking-wide">Responsable</label>
                    <Select value={responsableFilter} onValueChange={(val) => setResponsableFilter(val || "Todos")}>
                        <SelectTrigger className="w-full bg-white border-[#e0e0e0] focus:ring-[#00457c] shadow-sm rounded-md">
                            <SelectValue placeholder="Seleccionar responsable" />
                        </SelectTrigger>
                        <SelectContent>
                            {responsables.map((r) => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border border-[#e0e0e0] bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
                <Table>
                    <TableHeader className="bg-[#f2f5f7] border-b border-[#e0e0e0]">
                        <TableRow className="hover:bg-[#f2f5f7]">
                            <TableHead className="w-[30%] font-semibold text-xs uppercase tracking-wider text-[#666666] h-12">Hito a Cumplir</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider text-[#666666] h-12">SIAPER</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider text-[#666666] h-12">Normativa / Naturaleza</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider text-[#666666] hidden md:table-cell h-12">Periodicidad</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider text-[#666666] hidden md:table-cell h-12">Responsable</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider text-[#666666] h-12">Alertas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-[#666666]">
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
                                            className="hover:bg-transparent border-t border-[#e0e0e0]"
                                        >
                                            <TableCell colSpan={6} className="text-[12px] sm:text-[13px] text-[#666666] py-4 italic bg-[#fcfcfc]">
                                                {row.hito}
                                            </TableCell>
                                        </TableRow>
                                    )
                                }

                                const isCritical = row.criticidad.toLowerCase() === "alta"
                                const isPeremptory = row.plazoPerentorio.toLowerCase() === "sí"

                                return (
                                    <TableRow
                                        key={row.id}
                                        onClick={() => onRowClick(row)}
                                        className={`cursor-pointer transition-colors even:bg-[#fcfcfc] hover:bg-slate-50 border-b border-[#e0e0e0] ${isCritical || isPeremptory ? "border-l-4 border-l-[#eb3c46]" : "border-l-4 border-l-transparent"
                                            }`}
                                    >
                                        <TableCell className="font-semibold text-[16px] text-[#333333] py-5">
                                            {row.hito}
                                        </TableCell>
                                        <TableCell>
                                            {row.siaper.toLowerCase() === "sí" ? (
                                                <Badge className="bg-[#e6f4ea] text-[#137333] hover:bg-[#e6f4ea] border-0 font-medium rounded-[4px] px-2 py-0.5 whitespace-nowrap inline-flex items-center gap-1 shadow-none">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Sí
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-[#f2f5f7] text-[#666666] hover:bg-[#f2f5f7] border-0 font-medium rounded-[4px] shadow-none">
                                                    No
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-[14px] text-[#666666]">
                                            <span className="flex items-center gap-1.5">
                                                {row.normativa}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-[14px] text-[#666666] hidden md:table-cell">{row.periodicidad}</TableCell>
                                        <TableCell className="text-[14px] text-[#666666] hidden md:table-cell">{row.responsable}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1.5 sm:flex-row">
                                                {isCritical && (
                                                    <Badge className="bg-rose-50 text-[#eb3c46] hover:bg-rose-50 border border-rose-100 pointer-events-none px-2 py-0.5 whitespace-nowrap rounded-[4px] shadow-none inline-flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" />Alta
                                                    </Badge>
                                                )}
                                                {isPeremptory && (
                                                    <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-100 pointer-events-none px-2 py-0.5 whitespace-nowrap rounded-[4px] shadow-none inline-flex items-center gap-1">
                                                        <CalendarClock className="w-3 h-3" />Perentorio
                                                    </Badge>
                                                )}
                                                {!isCritical && !isPeremptory && (
                                                    <span className="text-[13px] text-[#999999] italic">Normal</span>
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
    )
}
