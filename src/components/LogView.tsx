import { Check, ChevronLeft } from 'lucide-react'
import { Square } from 'lucide-react'
import { formatLogTime, type ActivityLogEntry } from '../activityLogSeed'

const EXAM_MODE_STATUS =
  'このデバイスでの活動は試験モードで記録されています。不正行為が検出された場合のみ"Dr. Alexander Wright"先生に記録が送信されます。'

type Props = {
  selectedClassName?: string
  activityLogs: ActivityLogEntry[]
  isExamMode?: boolean
  onBack?: () => void
  onStopClick?: () => void
  tutorialStep?: number
  /** 記録停止確認ポップアップ表示中は、ステップ4のスポットライトを停止ボタンではなくダイアログの「はい」に移す */
  showConfirmStopPopup?: boolean
}

export function LogView({
  selectedClassName = 'Intensive English JI',
  activityLogs,
  isExamMode = false,
  onBack,
  onStopClick,
  tutorialStep,
  showConfirmStopPopup = false,
}: Props) {
  return (
    <div className="animate-fade-in flex flex-col h-full min-h-0">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-2 -ml-1 shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          クラス一覧
        </button>
      )}

      <div className="flex items-center gap-2 mb-4 shrink-0">
        <h2 className="text-base font-semibold text-gray-900 truncate flex-1 min-w-0">
          {selectedClassName}
        </h2>
        {onStopClick && (
          <button
            onClick={onStopClick}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white transition-colors border border-red-400/50 shadow-md"
            aria-label="記録を停止"
            title="記録を停止"
            {...(tutorialStep === 4 && !showConfirmStopPopup ? { 'data-tutorial-step': '4' } : {})}
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        )}
      </div>
      <div className="text-xs text-gray-500 -mt-2 mb-2 shrink-0">
        九大花子（1SI25031E）
      </div>

      {isExamMode ? (
        /* 試験モード：ログ追加を停止し、メッセージのみ中央表示 */
        <div className="flex-1 min-h-0 flex items-center justify-center px-4">
          <p className="text-sm text-center text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-6 leading-relaxed">
            {EXAM_MODE_STATUS}
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-sm font-medium text-gray-700 mb-2 shrink-0">
            最近のアクティビティ
          </h3>
          <ul
            className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1"
            style={{ maxHeight: '220px' }}
          >
            {activityLogs.length === 0 ? (
              <li className="text-sm text-gray-400 py-4">
                記録中… しばらくお待ちください
              </li>
            ) : (
              activityLogs.map((log, i) => (
                <li key={`${log.elapsedSeconds}-${i}`} className="flex gap-3">
                  <span
                    className="shrink-0 text-xs text-gray-500 w-[4.5rem] tabular-nums"
                    style={{
                      fontFamily: 'ui-monospace, SF Mono, Monaco, monospace',
                    }}
                  >
                    午前 {formatLogTime(log.elapsedSeconds)}
                  </span>
                  <p className="text-sm text-gray-700 leading-snug break-words">
                    {log.text}
                  </p>
                </li>
              ))
            )}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-600 shrink-0">
            <Check className="w-4 h-4 text-green-500 shrink-0" />
            <span>このデバイスでの活動は安全に記録されています</span>
          </div>
        </>
      )}
    </div>
  )
}
