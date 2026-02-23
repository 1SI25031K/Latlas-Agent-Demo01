type Props = {
  onStart: () => void
  onCancel: () => void
}

export function MirrorApprovedConfirmPopup({ onStart, onCancel }: Props) {
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center p-4 animate-spring-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/25" onClick={onCancel} aria-hidden="true" />
      <div
        className="relative w-full max-w-[280px] rounded-[20px] overflow-hidden animate-spring-scale bg-white shadow-xl"
        style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}
      >
        <div className="p-5">
          <p className="text-sm text-gray-900 text-center mb-5 leading-relaxed">
            ミラーリングが許可されました。開始しますか？
          </p>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[18px] transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={onStart}
              className="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-[18px] transition-colors"
            >
              開始
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
