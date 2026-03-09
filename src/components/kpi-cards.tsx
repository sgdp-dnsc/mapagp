import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CalendarClock, ListTodo } from "lucide-react"

interface KPICardsProps {
    totalHitos: number
    criticalHitos: number
    expiringHitos: number
}

export function KPICards({ totalHitos, criticalHitos, expiringHitos }: KPICardsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-3 mb-8 print:hidden">
            <Card className="border-0 border-l-4 border-l-[#00457c] shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-md bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
                    <CardTitle className="text-[14px] font-semibold text-[#666666] uppercase tracking-wider">Total de Hitos</CardTitle>
                    <div className="p-2 bg-[#f2f5f7] rounded-md">
                        <ListTodo className="h-5 w-5 text-[#00457c]" />
                    </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0">
                    <div className="text-[32px] font-semibold text-[#333333] tracking-tight">{totalHitos}</div>
                    <p className="text-[14px] text-[#666666] mt-2 font-regular">Hitos a cumplir in esta categoría</p>
                </CardContent>
            </Card>

            <Card className="border-0 border-l-4 border-l-[#eb3c46] shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-md bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
                    <CardTitle className="text-[14px] font-semibold text-[#666666] uppercase tracking-wider">Hitos Críticos</CardTitle>
                    <div className="p-2 bg-[#fdf2f2] rounded-md">
                        <AlertCircle className="h-5 w-5 text-[#eb3c46]" />
                    </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0">
                    <div className="text-[32px] font-semibold text-[#333333] tracking-tight">{criticalHitos}</div>
                    <p className="text-[14px] text-[#eb3c46] mt-2 font-medium">Marcados de criticidad alta</p>
                </CardContent>
            </Card>

            <Card className="border-0 border-l-4 border-l-amber-500 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-md bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
                    <CardTitle className="text-[14px] font-semibold text-[#666666] uppercase tracking-wider">Vencimientos</CardTitle>
                    <div className="p-2 bg-amber-50 rounded-md">
                        <CalendarClock className="h-5 w-5 text-amber-600" />
                    </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0">
                    <div className="text-[32px] font-semibold text-[#333333] tracking-tight">{expiringHitos}</div>
                    <p className="text-[14px] text-amber-600 mt-2 font-medium">Tienen plazo perentorio</p>
                </CardContent>
            </Card>
        </div>
    )
}
