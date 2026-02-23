import { ChevronLeft } from 'lucide-react'
import { CLASS_ICONS, type ClassItem } from '../data/classes'

type Props = {
  classes: ClassItem[]
  onSelect: (className: string) => void
  onBack: () => void
}

export function MirrorClassSelectView({ classes, onSelect, onBack }: Props) {
  return (
    <div className="animate-fade-in flex flex-col h-full">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-3 -ml-1 shrink-0"
      >
        <ChevronLeft className="w-4 h-4" />
        戻る
      </button>
      <h2 className="text-base font-semibold text-gray-900 mb-4 shrink-0">
        ミラーリングをリクエストするクラスを選択してください。
      </h2>
      <ul className="flex-1 min-h-0 overflow-y-auto space-y-0.5 -mx-1">
        {classes.map((c) => {
          const Icon = CLASS_ICONS[c.icon]
          return (
            <li key={c.name}>
              <button
                onClick={() => onSelect(c.name)}
                type="button"
                className="w-full flex items-center gap-2 px-2 py-2.5 rounded-[18px] hover:bg-black/5 text-left transition-colors border border-transparent hover:border-gray-200/80"
              >
                <span className="shrink-0 w-8 h-8 rounded-[14px] flex items-center justify-center text-gray-500 border border-gray-200/80 bg-white/60">
                  {Icon && <Icon className="w-4 h-4" strokeWidth={1.8} />}
                </span>
                <div className="min-w-0 flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {c.name}
                  </div>
                  <div className="text-xs text-gray-500">{c.instructor}</div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
