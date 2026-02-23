type Props = {
  instructorName: string
}

export function MirrorRequestSentView({ instructorName }: Props) {
  return (
    <div className="animate-fade-in flex flex-col h-full items-center justify-center py-8 px-4">
      <p className="text-sm text-gray-700 text-center leading-relaxed">
        「{instructorName}」先生にミラーリングのリクエストを送信しました。
      </p>
      <p className="text-xs text-gray-500 mt-3">承認をお待ちください...</p>
    </div>
  )
}
