import { LayoutDashboard, Users, GraduationCap, Building, Heart, ShieldAlert, BadgeDollarSign, Handshake, Folder, X } from "lucide-react"
import { cn } from "@/lib/utils"

function getIconForCategory(name: string) {
  const n = name.toLowerCase()
  if (n.includes('planificación')) return { icon: Users, color: "#00457c" }
  if (n.includes('soporte')) return { icon: Users, color: "#00457c" }
  if (n.includes('desempeño')) return { icon: LayoutDashboard, color: "#1e40af" }
  if (n.includes('desarrollo')) return { icon: GraduationCap, color: "#15803d" }
  if (n.includes('cambio')) return { icon: Building, color: "#c2410c" }
  if (n.includes('bienestar')) return { icon: Heart, color: "#e11d48" }
  if (n.includes('riesgos')) return { icon: ShieldAlert, color: "#9f1239" }
  if (n.includes('remuneraciones')) return { icon: BadgeDollarSign, color: "#115e59" }
  if (n.includes('relaciones')) return { icon: Handshake, color: "#3730a3" }
  return { icon: Folder, color: "#666666" }
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
            <li>
              <button
                onClick={() => onSelectCategory("GLOSARIO")}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-all text-[14px] font-medium text-left",
                  selectedCategory === "GLOSARIO"
                    ? "bg-[#f2f5f7] text-[#00457c] shadow-sm border border-[#00457c]/20"
                    : "text-[#666666] hover:bg-slate-50 hover:text-[#333333] border border-transparent"
                )}
              >
                <Folder className={cn("w-4 h-4", selectedCategory === "GLOSARIO" ? "text-[#00457c]" : "text-[#666666]")} />
                <span className="leading-snug">Glosario</span>
              </button>
            </li>
          </ul>

          <h2 className="px-6 text-xs font-bold text-[#666666] uppercase tracking-widest mb-4">Categorías</h2>
          <ul className="space-y-1.5 px-4">
            {categories.map((catName) => {
              const { icon: Icon, color } = getIconForCategory(catName)
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
                    <div className={cn(
                      "p-1 rounded-md transition-colors",
                      isSelected ? "bg-white shadow-sm" : "bg-transparent border border-transparent"
                    )}>
                      <Icon className="w-4 h-4" style={{ color: isSelected ? "#00457c" : color }} />
                    </div>
                    <span className="leading-snug">{catName}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="mt-auto border-t border-[#e0e0e0] bg-slate-50/50">
          <div className="p-5 flex flex-col items-center text-center gap-3">
            <div className="w-48 h-20 relative bg-[#00457c] p-4 rounded-xl shadow-md flex items-center justify-center overflow-hidden border border-white/10 group transition-all hover:scale-[1.02]">
              <img 
                src="https://www.serviciocivil.cl/wp-content/uploads/2024/06/logo_sc_white.svg" 
                alt="DN Servicio Civil" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-[11px] text-[#666666] font-semibold tracking-wider">
                V1.2 - Acceso Abierto
              </p>
              <p className="text-[9px] text-[#999999] uppercase tracking-tighter mt-0.5">Ministerio de Hacienda</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
