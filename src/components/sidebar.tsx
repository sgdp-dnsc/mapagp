import { LayoutDashboard, Users, GraduationCap, Building, Heart, ShieldAlert, BadgeDollarSign, Handshake, Folder, X } from "lucide-react"
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
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ categories, selectedCategory, onSelectCategory, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white text-[#333333] flex flex-col h-full shrink-0 print:hidden border-r border-[#e0e0e0] z-50 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 border-b border-[#e0e0e0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building className="w-8 h-8 text-[#00457c]" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#00457c] leading-tight">Mapa GP</h1>
              <p className="text-[14px] text-[#666666] mt-0.5 font-medium tracking-wide">Gestión de Personas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#666666]" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1.5 px-4 mb-6">
            <li>
              <button
                onClick={() => onSelectCategory("Introducción")}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-all text-[14px] font-medium text-left",
                  selectedCategory === "Introducción"
                    ? "bg-[#f2f5f7] text-[#00457c] shadow-sm border border-[#00457c]/20"
                    : "text-[#666666] hover:bg-slate-50 hover:text-[#333333] border border-transparent"
                )}
              >
                <LayoutDashboard className={cn("w-4 h-4", selectedCategory === "Introducción" ? "text-[#00457c]" : "text-[#666666]")} />
                <span className="leading-snug">Introducción</span>
              </button>
            </li>
          </ul>

          <h2 className="px-6 text-xs font-bold text-[#666666] uppercase tracking-widest mb-4">Categorías</h2>
          <ul className="space-y-1.5 px-4">
            {categories.map((catName) => {
              const Icon = getIconForCategory(catName)
              const isSelected = selectedCategory === catName
              return (
                <li key={catName}>
                  <button
                    onClick={() => onSelectCategory(catName)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-all text-[14px] font-medium text-left",
                      isSelected
                        ? "bg-[#f2f5f7] text-[#00457c] shadow-sm border border-[#00457c]/20"
                        : "text-[#666666] hover:bg-slate-50 hover:text-[#333333] border border-transparent"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isSelected ? "text-[#00457c]" : "text-[#666666]")} />
                    <span className="leading-snug">{catName}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="mt-auto border-t border-[#e0e0e0]">
          <div className="p-5 flex flex-col items-center text-center gap-1.5">
            <p className="font-bold text-[13px] text-[#333333] leading-snug tracking-wide">
              Dirección Nacional del<br />Servicio Civil
            </p>
            <p className="text-[11px] text-[#666666] font-medium">
              V1.0 - Acceso Abierto
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
