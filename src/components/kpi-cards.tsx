import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CalendarClock, ListTodo } from "lucide-react"

interface KPICardsProps {
    totalHitos: number
    criticalHitos: number
    expiringHitos: number
}

export function KPICards({ totalHitos, criticalHitos, expiringHitos }: KPICardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3 mb-6 print:hidden">
            <Card className="border-l-4 border-l-blue-600 border-t-0 border-r-0 border-b-0 shadow-sm rounded-lg bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50">
                    <CardTitle className="text-[0.8rem] font-bold text-slate-500 uppercase tracking-wider">Total de Hitos</CardTitle>
                    <div className="p-2 bg-blue-50 rounded-md">
                        <ListTodo className="h-4 w-4 text-blue-600" />
                    </div>
                </CardHeader>
                <CardContent className="pt-4 pb-5">
                    <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalHitos}</div>
                    <p className="text-xs text-slate-500 mt-1.5 font-medium">Hitos a cumplir en esta categoría</p>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-rose-500 border-t-0 border-r-0 border-b-0 shadow-sm rounded-lg bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50">
                    <CardTitle className="text-[0.8rem] font-bold text-slate-500 uppercase tracking-wider">Hitos Críticos</CardTitle>
                    <div className="p-2 bg-rose-50 rounded-md">
                        <AlertCircle className="h-4 w-4 text-rose-600" />
                    </div>
                </CardHeader>
                <CardContent className="pt-4 pb-5">
                    <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{criticalHitos}</div>
                    <p className="text-xs text-rose-600 mt-1.5 font-semibold">Marcados de criticidad alta</p>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500 border-t-0 border-r-0 border-b-0 shadow-sm rounded-lg bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50">
                    <CardTitle className="text-[0.8rem] font-bold text-slate-500 uppercase tracking-wider">Vencimientos</CardTitle>
                    <div className="p-2 bg-amber-50 rounded-md">
                        <CalendarClock className="h-4 w-4 text-amber-600" />
                    </div>
                </CardHeader>
                <CardContent className="pt-4 pb-5">
                    <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{expiringHitos}</div>
                    <p className="text-xs text-amber-600 mt-1.5 font-semibold">Tienen plazo perentorio</p>
                </CardContent>
            </Card>
        </div>
    )
}
