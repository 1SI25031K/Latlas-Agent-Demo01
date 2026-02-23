type Props = {
  onApprove: () => void
}

export function ExamModeRequestPopup({ onApprove }: Props) {
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center p-4 animate-spring-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
      <div
        className="relative w-full max-w-[280px] rounded-xl overflow-hidden animate-spring-scale bg-white shadow-xl"
        style={{ border: '0.5px solid rgba(0,0,0,0.08)' }}
      >
        <div className="p-5">
          <p className="text-sm text-gray-900 text-center mb-5 leading-relaxed">
            教員から共有モードがリクエストされました。承認し、記録を継続しますか？
          </p>
          <button
            onClick={onApprove}
            className="w-full py-2.5 px-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
          >
            承認
          </button>
        </div>
      </div>
    </div>
  )
}
