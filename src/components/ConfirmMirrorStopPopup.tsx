type Props = {
  onCancel: () => void
  onStop: () => void
}

export function ConfirmMirrorStopPopup({ onCancel, onStop }: Props) {
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center p-4 animate-spring-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/25" onClick={onCancel} aria-hidden="true" />
      <div
        className="relative w-full max-w-[280px] rounded-xl overflow-hidden animate-spring-scale bg-white shadow-xl"
        style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}
      >
        <div className="p-5">
          <p className="text-sm text-gray-900 text-center mb-5">共有を停止しますか？</p>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={onStop}
              className="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
            >
              停止
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
