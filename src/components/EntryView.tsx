import { useState } from 'react'
import { Check, ChevronLeft } from 'lucide-react'

type Props = {
  onComplete?: (classCode: string, password: string) => void
  onBack?: () => void
}

export function EntryView({ onComplete, onBack }: Props) {
  const [classCode, setClassCode] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="animate-fade-in">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-3 -ml-1"
        >
          <ChevronLeft className="w-4 h-4" />
          戻る
        </button>
      )}
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        新しいクラスを追加する
      </h2>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            クラスコードを入力
          </label>
          <input
            type="text"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder="クラスコード"
            className="w-full px-3 py-2 text-sm rounded-[18px] bg-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            パスワードを入力
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            className="w-full px-3 py-2 text-sm rounded-[18px] bg-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
          />
        </div>
      </div>
      <button
        onClick={() => onComplete?.(classCode, password)}
        className="mt-4 w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-[18px] transition-colors flex items-center justify-center gap-2"
      >
        <Check className="w-4 h-4" />
        完了
      </button>
    </div>
  )
}
