type Props = {
  onCancel: () => void
  onStop: () => void
}

/** ポップオーバー枠内に表示 */
export function ConfirmStopPopup({ onCancel, onStop }: Props) {
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center p-4 animate-spring-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-stop-title"
    >
      <div className="absolute inset-0 bg-black/25" onClick={onCancel} aria-hidden="true" />
      <div
        className="relative w-full max-w-[280px] rounded-xl overflow-hidden animate-spring-scale bg-white shadow-xl"
        style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}
      >
        <div className="p-5">
          <h2 id="confirm-stop-title" className="text-base font-semibold text-gray-900 text-center mb-5">
            記録を停止しますか？
          </h2>
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
              はい
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
