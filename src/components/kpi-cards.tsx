import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CalendarClock, ListTodo } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardsProps {
    totalHitos: number
    criticalHitos: number
    expiringHitos: number
    onFilterChange: (filter: "Todas" | "Críticos" | "Vencimientos") => void
    currentFilter: "Todas" | "Críticos" | "Vencimientos"
}

export function KPICards({ totalHitos, criticalHitos, expiringHitos, onFilterChange, currentFilter }: KPICardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3 mb-6 print:hidden">
            <Card
                onClick={() => onFilterChange("Todas")}
                className={cn(
                    "cursor-pointer transition-all border-0 border-l-4 shadow-sm rounded-md bg-white overflow-hidden hover:shadow-md",
                    currentFilter === "Todas" ? "border-l-[#00457c] ring-1 ring-inset ring-[#00457c]/10 bg-slate-50" : "border-l-slate-200"
                )}
            >
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                    <CardTitle className="text-[12px] font-bold text-[#666666] uppercase tracking-wider">Total Hitos</CardTitle>
                    <div className={cn("p-1.5 rounded-md", currentFilter === "Todas" ? "bg-[#00457c]/10 text-[#00457c]" : "bg-slate-100 text-slate-500")}>
                        <ListTodo className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                    <div className="text-[24px] font-bold text-[#333333] tracking-tight">{totalHitos}</div>
                    <p className="text-[12px] text-[#666666] mt-1">Ver todos los procesos</p>
                </CardContent>
            </Card>

            <Card
                onClick={() => onFilterChange("Críticos")}
                className={cn(
                    "cursor-pointer transition-all border-0 border-l-4 shadow-sm rounded-md bg-white overflow-hidden hover:shadow-md",
                    currentFilter === "Críticos" ? "border-l-[#eb3c46] ring-1 ring-inset ring-[#eb3c46]/10 bg-rose-50" : "border-l-slate-200"
                )}
            >
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                    <CardTitle className="text-[12px] font-bold text-[#666666] uppercase tracking-wider">Hitos Críticos</CardTitle>
                    <div className={cn("p-1.5 rounded-md", currentFilter === "Críticos" ? "bg-rose-100 text-[#eb3c46]" : "bg-slate-100 text-slate-500")}>
                        <AlertCircle className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                    <div className="text-[24px] font-bold text-[#333333] tracking-tight">{criticalHitos}</div>
                    <p className="text-[12px] text-[#eb3c46] mt-1">Filtrar por Criticidad Alta</p>
                </CardContent>
            </Card>

            <Card
                onClick={() => onFilterChange("Vencimientos")}
                className={cn(
                    "cursor-pointer transition-all border-0 border-l-4 shadow-sm rounded-md bg-white overflow-hidden hover:shadow-md",
                    currentFilter === "Vencimientos" ? "border-l-amber-500 ring-1 ring-inset ring-amber-500/10 bg-amber-50" : "border-l-slate-200"
                )}
            >
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                    <CardTitle className="text-[12px] font-bold text-[#666666] uppercase tracking-wider">Vencimientos</CardTitle>
                    <div className={cn("p-1.5 rounded-md", currentFilter === "Vencimientos" ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500")}>
                        <CalendarClock className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                    <div className="text-[24px] font-bold text-[#333333] tracking-tight">{expiringHitos}</div>
                    <p className="text-[12px] text-amber-600 mt-1">Filtrar Plazo Perentorio</p>
                </CardContent>
            </Card>
        </div>
    )
}
