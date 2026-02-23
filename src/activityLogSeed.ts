/** 09:41:00 を 0 秒としたときの表示用フォーマット */
export function formatLogTime(elapsedSeconds: number): string {
  const baseSeconds = 9 * 3600 + 41 * 60 // 09:41:00
  const total = baseSeconds + elapsedSeconds
  const h = Math.floor(total / 3600) % 24
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const ACTIVITY_LOG_MESSAGES = [
  '"Notion" でグループ議事録の構成案を作成しました',
  '"Safari" で先行研究の論文（PDF）を閲覧しました',
  '"PowerPoint" に図解スライドを挿入しました',
  '"ChatGPT" で関数のアルゴリズムについて確認しました',
  '"Keynote" でプレゼン資料のアウトラインを編集しました',
]

export type ActivityLogEntry = {
  elapsedSeconds: number
  text: string
}
