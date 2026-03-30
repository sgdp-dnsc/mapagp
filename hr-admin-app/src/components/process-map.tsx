"use client"

import { motion } from "framer-motion"
import { ArrowRight, ChevronRight } from "lucide-react"

interface ProcessMapProps {
  onSelectSubsystem: (categories: string[]) => void
  activeSubsystem?: string | null
}

const subsystems = [
  {
    id: "planificacion",
    title: "Planificación y soporte de la gestión de personas",
    color: "#00457c",
    categories: ["1. Planificación y Soporte nivel 1", "2. Planificación y Soporte nivel 2"],
    position: "left"
  },
  {
    id: "desempeño",
    title: "Proceso de gestión del desempeño",
    color: "#00457c",
    categories: ["3. Gestión del Desempeño nivel 1", "4. Gestión del Desempeño nivel 2"],
    position: "top-left"
  },
  {
    id: "cambio",
    title: "Proceso de gestión del cambio",
    color: "#00457c",
    categories: ["7. Gestión del Cambio nivel 1", "8. Gestión del Cambio nivel 2"],
    position: "top-right"
  },
  {
    id: "desarrollo",
    title: "Proceso de gestión del desarrollo",
    color: "#00457c",
    categories: ["5. Gestión del Desarrollo nivel 1", "6. Gestión del Desarrollo nivel 2"],
    position: "bottom"
  }
]

export function ProcessMap({ onSelectSubsystem, activeSubsystem }: ProcessMapProps) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 overflow-hidden">
      <div className="max-w-4xl mx-auto relative h-[500px] flex items-center justify-center">
        
        {/* Connection Arrows SVG Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 500">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#8b1e1e" />
            </marker>
          </defs>
          
          {/* Main horizontal line from Planificacion */}
          <line x1="260" y1="250" x2="650" y2="250" stroke="#00457c" strokeWidth="12" />
          
          {/* Vertical connectors */}
          <line x1="420" y1="250" x2="420" y2="150" stroke="#00457c" strokeWidth="12" />
          <line x1="580" y1="250" x2="580" y2="150" stroke="#00457c" strokeWidth="12" />
          <line x1="500" y1="250" x2="500" y2="350" stroke="#00457c" strokeWidth="12" />
          
          {/* Red Bi-directional arrows */}
          {/* Desempeño <-> Cambio */}
          <line x1="460" y1="100" x2="520" y2="100" stroke="#8b1e1e" strokeWidth="4" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)" />
          
          {/* Desempeño <-> Desarrollo */}
          <line x1="400" y1="130" x2="480" y2="330" stroke="#8b1e1e" strokeWidth="4" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)" />
          
          {/* Cambio <-> Desarrollo */}
          <line x1="560" y1="130" x2="520" y2="330" stroke="#8b1e1e" strokeWidth="4" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)" />
        </svg>

        {/* Planificación (Left) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectSubsystem(subsystems[0].categories)}
          className={`absolute left-0 w-64 h-32 bg-[#00457c] text-white p-6 flex items-center justify-center text-center font-bold text-lg rounded-l-2xl shadow-lg z-10 clip-path-arrow-right ${
            activeSubsystem === subsystems[0].id ? "ring-4 ring-offset-2 ring-[#eb3c46]" : ""
          }`}
          style={{ clipPath: "polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%)" }}
        >
          {subsystems[0].title}
        </motion.button>

        {/* Desempeño (Top-Left) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectSubsystem(subsystems[1].categories)}
          className={`absolute top-12 left-[320px] w-48 h-28 bg-[#00457c] text-white p-4 flex items-center justify-center text-center font-bold text-sm rounded-2xl shadow-lg z-10 ${
            activeSubsystem === subsystems[1].id ? "ring-4 ring-offset-2 ring-[#eb3c46]" : ""
          }`}
        >
          {subsystems[1].title}
        </motion.button>

        {/* Cambio (Top-Right) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectSubsystem(subsystems[2].categories)}
          className={`absolute top-12 left-[520px] w-48 h-28 bg-[#00457c] text-white p-4 flex items-center justify-center text-center font-bold text-sm rounded-2xl shadow-lg z-10 ${
            activeSubsystem === subsystems[2].id ? "ring-4 ring-offset-2 ring-[#eb3c46]" : ""
          }`}
        >
          {subsystems[2].title}
        </motion.button>

        {/* Desarrollo (Bottom) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectSubsystem(subsystems[3].categories)}
          className={`absolute bottom-8 left-[420px] w-48 h-28 bg-[#00457c] text-white p-4 flex items-center justify-center text-center font-bold text-sm rounded-2xl shadow-lg z-10 ${
            activeSubsystem === subsystems[3].id ? "ring-4 ring-offset-2 ring-[#eb3c46]" : ""
          }`}
        >
          {subsystems[3].title}
        </motion.button>

        {/* Timeline (Bottom) */}
        <div className="absolute bottom-0 left-[350px] w-[350px] border-t-2 border-slate-300 pt-2 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest uppercase">
          <span>Corto</span>
          <span>Mediano</span>
          <span>Largo Plazo</span>
        </div>
      </div>
      
      <div className="mt-8 text-center text-slate-500 italic text-sm">
        Haz clic en cada subsistema para visualizar su mapeo de gestión.
      </div>
    </div>
  )
}
