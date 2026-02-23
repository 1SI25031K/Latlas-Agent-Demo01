type Props = {
  onClose: () => void
}

export function MirroringBlockAlert({ onClose }: Props) {
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center p-4 animate-spring-in"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/25" onClick={onClose} aria-hidden="true" />
      <div
        className="relative w-full max-w-[280px] rounded-[20px] overflow-hidden animate-spring-scale bg-white shadow-xl"
        style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}
      >
        <div className="p-5">
          <p className="text-sm text-gray-900 text-center mb-5 leading-relaxed">
            ミラーリング中は新しい記録を開始できません。
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-[18px] transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
