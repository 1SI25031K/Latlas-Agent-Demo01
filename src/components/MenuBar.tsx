import { GraduationCap, Wifi, Battery, Search, LayoutDashboard } from 'lucide-react'

function AppleLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M12.5 8.5c-.03-1.8 1.48-2.67 1.54-2.71-.84-1.24-2.14-1.41-2.6-1.43-1.11-.11-2.17.65-2.69.65-.53 0-1.38-.63-2.27-.61-1.17.02-2.25.68-2.86 1.73-1.22 2.12-.31 5.26.88 7.48.6.99 1.28 2.1 2.2 2.06 1.08-.05 1.49-.7 2.8-.7 1.29 0 1.65.7 2.78.68 1.15-.02 1.89-1.02 2.49-2.01.78-1.12 1.1-2.21 1.12-2.26-.02-.02-2.16-.83-2.18-3.28zM10.2 4.77c.57-.69.96-1.65.85-2.61-.82.03-1.82.55-2.41 1.24-.52.6-.97 1.59-.85 2.53.9.07 1.81-.48 2.41-1.16z" />
    </svg>
  )
}

const MENU_ITEMS = ['Finder', 'File', 'Edit', 'View', 'Go', 'Window', 'Help']

type Props = {
  menuBarLabel: string
  onLatlasClick: () => void
  popoverOpen?: boolean
  tutorialStep?: number
}

export function MenuBar({ menuBarLabel, onLatlasClick, popoverOpen = false, tutorialStep }: Props) {
  const useMonospace = menuBarLabel !== 'Latlas'

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[50] h-9 flex items-center justify-between px-4"
      {...(tutorialStep === 3 ? { 'data-tutorial-step': '3' } : {})}
      style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex items-center gap-6">
        <button className="p-1 rounded hover:bg-black/5 text-gray-800 transition-colors" aria-label="Apple">
          <AppleLogo />
        </button>
        {MENU_ITEMS.map((label) => (
          <span
            key={label}
            className="text-[13px] font-medium text-gray-800 cursor-default"
          >
            {label}
          </span>
        ))}
      </div>

      <button
        onClick={onLatlasClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-black/5 transition-colors absolute left-1/2 -translate-x-1/2"
        aria-expanded={popoverOpen}
        {...(tutorialStep === 1 ? { 'data-tutorial-step': '1' } : {})}
      >
        <GraduationCap className="w-4 h-4 text-gray-800 shrink-0" strokeWidth={2} />
        <span
          className="text-[13px] font-medium text-gray-800 tabular-nums min-w-[11rem] text-center inline-block"
          style={
            useMonospace
              ? { fontFamily: 'ui-monospace, SF Mono, Monaco, monospace' }
              : undefined
          }
        >
          {menuBarLabel}
        </span>
      </button>

      <div className="flex items-center gap-4 text-gray-700">
        <Wifi className="w-4 h-4" strokeWidth={2} />
        <Battery className="w-4 h-4" strokeWidth={2} />
        <Search className="w-4 h-4" strokeWidth={2} />
        <LayoutDashboard className="w-4 h-4" strokeWidth={2} />
        <span className="text-[13px] font-medium min-w-[120px] text-right tabular-nums">
          Mon Jun 10 9:41 AM
        </span>
      </div>
    </header>
  )
}
