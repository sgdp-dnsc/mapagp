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
        <div className="grid gap-3 md:grid-cols-3 mb-6 print:hidden">
            <Card
                onClick={() => onFilterChange("Todas")}
                className={cn(
                    "cursor-pointer transition-all border-0 border-l-4 shadow-sm rounded-lg bg-white overflow-hidden hover:shadow-md active:scale-[0.98]",
                    currentFilter === "Todas" ? "border-l-[#00457c] ring-1 ring-inset ring-[#00457c]/10 bg-slate-50" : "border-l-slate-200"
                )}
            >
                <div className="flex flex-row items-center justify-between p-3">
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Hitos</p>
                        <div className="text-xl font-bold text-slate-800 tracking-tight">{totalHitos}</div>
                        <p className="text-[10px] text-slate-400 font-medium">Ver todos los procesos</p>
                    </div>
                    <div className={cn("p-2 rounded-lg shrink-0", currentFilter === "Todas" ? "bg-[#00457c]/10 text-[#00457c]" : "bg-slate-50 text-slate-400")}>
                        <ListTodo className="h-4 w-4" />
                    </div>
                </div>
            </Card>

            <Card
                onClick={() => onFilterChange("Críticos")}
                className={cn(
                    "cursor-pointer transition-all border-0 border-l-4 shadow-sm rounded-lg bg-white overflow-hidden hover:shadow-md active:scale-[0.98]",
                    currentFilter === "Críticos" ? "border-l-[#eb3c46] ring-1 ring-inset ring-[#eb3c46]/10 bg-rose-50" : "border-l-slate-200"
                )}
            >
                <div className="flex flex-row items-center justify-between p-3">
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hitos Críticos</p>
                        <div className="text-xl font-bold text-slate-800 tracking-tight">{criticalHitos}</div>
                        <p className="text-[10px] text-[#eb3c46] font-medium">Filtrar Criticidad Alta</p>
                    </div>
                    <div className={cn("p-2 rounded-lg shrink-0", currentFilter === "Críticos" ? "bg-rose-100 text-[#eb3c46]" : "bg-slate-50 text-slate-400")}>
                        <AlertCircle className="h-4 w-4" />
                    </div>
                </div>
            </Card>

            <Card
                onClick={() => onFilterChange("Vencimientos")}
                className={cn(
                    "cursor-pointer transition-all border-0 border-l-4 shadow-sm rounded-lg bg-white overflow-hidden hover:shadow-md active:scale-[0.98]",
                    currentFilter === "Vencimientos" ? "border-l-amber-500 ring-1 ring-inset ring-amber-500/10 bg-amber-50" : "border-l-slate-200"
                )}
            >
                <div className="flex flex-row items-center justify-between p-3">
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vencimientos</p>
                        <div className="text-xl font-bold text-slate-800 tracking-tight">{expiringHitos}</div>
                        <p className="text-[10px] text-amber-600 font-medium">Filtrar Plazo Perentorio</p>
                    </div>
                    <div className={cn("p-2 rounded-lg shrink-0", currentFilter === "Vencimientos" ? "bg-amber-100 text-amber-600" : "bg-slate-50 text-slate-400")}>
                        <CalendarClock className="h-4 w-4" />
                    </div>
                </div>
            </Card>
        </div>
    )
}
