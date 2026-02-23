type Props = {
  className: string
  onCancel: () => void
  onStart: () => void
}

/** ポップオーバー枠内に表示（親が relative のとき absolute inset-0 で覆う） */
export function ConfirmStartPopup({ className, onCancel, onStart }: Props) {
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center p-4 animate-spring-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="absolute inset-0 bg-black/25"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-[280px] rounded-xl overflow-hidden animate-spring-scale bg-white shadow-xl"
        style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}
      >
        <div className="p-5">
          <h2 id="confirm-title" className="text-base font-semibold text-gray-900 text-center mb-1">
            記録を開始しますか？
          </h2>
          <p className="text-sm text-gray-500 text-center mb-5 truncate px-2" title={className}>
            {className}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={onStart}
              className="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
            >
              開始
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
