import { useState } from 'react'
import { Search, ChevronDown, Cast } from 'lucide-react'
import { CLASS_ICONS, type ClassItem } from '../data/classes'

type Props = {
  classes: ClassItem[]
  recordingClassName?: string | null
  onAddNew?: () => void
  onSelectClass?: (name: string) => void
  onRecordingBannerClick?: () => void
  isMirroring?: boolean
  onMirrorClick?: () => void
  tutorialStep?: number
  /** 記録開始確認ポップアップ表示中は、ステップ2のスポットライトをリスト行ではなくポップアップ側に移すため */
  showConfirmStartPopup?: boolean
}

export function ListView({
  classes,
  recordingClassName,
  onAddNew,
  onSelectClass,
  onRecordingBannerClick,
  isMirroring = false,
  onMirrorClick,
  tutorialStep,
  showConfirmStartPopup = false,
}: Props) {
  const [search, setSearch] = useState('')
  const filterRecent = '最近'

  const filtered = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in flex flex-col h-full">
      {/* 記録中バナー：クラス一覧表示中かつ記録中の場合 */}
      {recordingClassName && onRecordingBannerClick && (
        <button
          type="button"
          onClick={onRecordingBannerClick}
          className="w-full mb-3 py-2 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium text-left hover:bg-amber-100 transition-colors"
        >
          記録が続いています：{recordingClassName}
        </button>
      )}

      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="検索"
            className="w-full pl-8 pr-3 py-2 text-sm rounded-[18px] bg-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
          />
        </div>
        <button
          onClick={onAddNew}
          className="shrink-0 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-[18px] border border-white/20 transition-colors"
          {...(tutorialStep === 8 ? { 'data-tutorial-step': '8' } : {})}
        >
          新規追加
        </button>
        {onMirrorClick && (
          <button
            onClick={onMirrorClick}
            className={`shrink-0 p-2 rounded-xl transition-colors ${
              isMirroring ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isMirroring ? 'ミラーリングを停止' : 'ミラーリングをリクエスト'}
            aria-label={isMirroring ? 'ミラーリングを停止' : 'ミラーリングをリクエスト'}
            {...(tutorialStep === 5 ? { 'data-tutorial-step': '5' } : {})}
          >
            <Cast className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 mb-3">
        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
          {filterRecent}
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto space-y-0.5 -mx-1">
        {filtered.map((c) => {
          const Icon = CLASS_ICONS[c.icon]
          const step2Highlight = tutorialStep === 2 && !showConfirmStartPopup && c.name === 'Intensive English JI'
          const step7Highlight = tutorialStep === 7 && c.name === '自然科学総合実験'
          const step9Highlight = tutorialStep === 9 && c.name === '課題アプローチ'
          return (
            <li key={c.name}>
              <button
                onClick={() => onSelectClass?.(c.name)}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-[18px] hover:bg-black/5 text-left transition-colors"
                {...(step2Highlight ? { 'data-tutorial-step': '2' } : step7Highlight ? { 'data-tutorial-step': '7' } : step9Highlight ? { 'data-tutorial-step': '9' } : {})}
              >
                <span
                  className="shrink-0 w-8 h-8 rounded-[14px] flex items-center justify-center text-gray-500 border border-gray-200/80 bg-white/60"
                  style={{ backdropFilter: 'blur(8px)' }}
                >
                  {Icon && <Icon className="w-4 h-4" strokeWidth={1.8} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">{c.name}</div>
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
