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
import { ExternalLink } from "lucide-react"

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
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Periodicidad</label>
                    <Select value={periodicidadFilter} onValueChange={(val) => setPeriodicidadFilter(val || "Todas")}>
                        <SelectTrigger className="w-full bg-white border-slate-200 focus:ring-blue-500">
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
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Responsable</label>
                    <Select value={responsableFilter} onValueChange={(val) => setResponsableFilter(val || "Todos")}>
                        <SelectTrigger className="w-full bg-white border-slate-200 focus:ring-blue-500">
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

            <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="hover:bg-slate-50 border-b-slate-200">
                            <TableHead className="w-[30%] font-bold text-xs uppercase tracking-wider text-slate-500">Hito a Cumplir</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">SIAPER</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">Normativa / Naturaleza</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 hidden md:table-cell">Periodicidad</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 hidden md:table-cell">Responsable</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">Alertas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                    No se encontraron resultados para los filtros seleccionados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((row) => {
                                const isCritical = row.criticidad.toLowerCase() === "alta"
                                const isPeremptory = row.plazoPerentorio.toLowerCase() === "sí"

                                return (
                                    <TableRow
                                        key={row.id}
                                        onClick={() => onRowClick(row)}
                                        className={`cursor-pointer transition-colors hover:bg-slate-50 ${isCritical || isPeremptory ? "border-l-4 border-l-rose-500" : "border-l-4 border-l-transparent"
                                            }`}
                                    >
                                        <TableCell className="font-medium text-slate-800 py-4">
                                            {row.hito}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={row.siaper.toLowerCase() === "sí" ? "default" : "secondary"}
                                                className={row.siaper.toLowerCase() === "sí" ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-0" : "bg-slate-100 text-slate-600 hover:bg-slate-100 border-0 font-normal"}>
                                                {row.siaper}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-600 group">
                                            <span className="flex items-center gap-1.5">
                                                {row.normativa}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-600 hidden md:table-cell">{row.periodicidad}</TableCell>
                                        <TableCell className="text-slate-600 hidden md:table-cell">{row.responsable}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1 sm:flex-row">
                                                {isCritical && (
                                                    <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-0 pointer-events-none px-2 py-0.5 whitespace-nowrap">
                                                        Crit: Alta
                                                    </Badge>
                                                )}
                                                {isPeremptory && (
                                                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 pointer-events-none px-2 py-0.5 whitespace-nowrap">
                                                        Plazo Perentorio
                                                    </Badge>
                                                )}
                                                {!isCritical && !isPeremptory && (
                                                    <span className="text-sm text-slate-400">Normal</span>
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
