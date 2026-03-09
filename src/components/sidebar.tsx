import { LayoutDashboard, Users, GraduationCap, Building, Heart, ShieldAlert, BadgeDollarSign, Handshake, Folder } from "lucide-react"
import { cn } from "@/lib/utils"

function getIconForCategory(name: string) {
  const n = name.toLowerCase()
  if (n.includes('planificación') || n.includes('reclutamiento')) return Users
  if (n.includes('capacitación') || n.includes('desarrollo')) return GraduationCap
  if (n.includes('desempeño')) return LayoutDashboard
  if (n.includes('cambio')) return Building
  if (n.includes('bienestar')) return Heart
  if (n.includes('riesgos')) return ShieldAlert
  if (n.includes('remuneraciones')) return BadgeDollarSign
  if (n.includes('relaciones')) return Handshake
  return Folder
}

interface SidebarProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function Sidebar({ categories, selectedCategory, onSelectCategory }: SidebarProps) {
  return (
    <div className="w-72 bg-slate-950 text-slate-50 flex flex-col h-full shrink-0 print:hidden border-r border-slate-800">
      <div className="p-8 border-b border-slate-800/60 flex items-center gap-3">
        <Building className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white leading-tight">Mapa GP</h1>
          <p className="text-sm text-slate-400 mt-0.5 font-medium tracking-wide">Gestión de Personas</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-6">
        <h2 className="px-6 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Categorías</h2>
        <ul className="space-y-1.5 px-4">
          {categories.map((catName) => {
            const Icon = getIconForCategory(catName)
            const isSelected = selectedCategory === catName
            return (
              <li key={catName}>
                <button
                  onClick={() => onSelectCategory(catName)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-sm font-medium text-left",
                    isSelected
                      ? "bg-blue-600/10 text-blue-400 shadow-sm border border-blue-500/20"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isSelected ? "text-blue-500" : "text-slate-500")} />
                  <span className="leading-snug">{catName}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="mt-auto border-t border-slate-800/60">
        <div className="p-5 flex flex-col items-center text-center gap-1.5">
          <p className="font-bold text-[13px] text-slate-200 leading-snug tracking-wide">
            Dirección Nacional del<br />Servicio Civil
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            V1.0 - Acceso Abierto
          </p>
        </div>
        {/* Barra Institucional */}
        <div className="h-1.5 w-full flex">
          <div className="w-1/3 bg-[#0f4b8f]"></div>
          <div className="w-2/3 bg-[#e31828]"></div>
        </div>
      </div>
    </div>
  )
}
