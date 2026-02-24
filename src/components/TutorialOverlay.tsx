import { useState, useEffect, useRef } from 'react'
import { useTutorial } from '../context/TutorialContext'

function renderMessage(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((p, i) =>
    i % 2 === 1 ? <strong key={i}>{p}</strong> : p
  )
}

export function TutorialOverlay() {
  const { tutorialStep, nextStep, skip, complete, isActive, isComplete, message, step2ConfirmOpen, step3Countdown, setStep3Countdown, step4ConfirmOpen, step6ConfirmOpen, viewPauseSeconds, setViewPauseSeconds } =
    useTutorial()
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const prevStepRef = useRef(tutorialStep)

  // ステップ遷移時：操作と操作の間で「枠なしで全体を見る」時間を挿入
  useEffect(() => {
    if (prevStepRef.current !== tutorialStep) {
      prevStepRef.current = tutorialStep
      if (tutorialStep === 7) setViewPauseSeconds(6)
      else if ([2, 4, 5, 6, 8, 9].includes(tutorialStep)) setViewPauseSeconds(3)
    }
  }, [tutorialStep, setViewPauseSeconds])

  // viewPauseSeconds のカウントダウン
  useEffect(() => {
    if (viewPauseSeconds === null || viewPauseSeconds <= 0) return
    const id = setInterval(() => {
      setViewPauseSeconds((s) => (s === null || s <= 1 ? null : s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [viewPauseSeconds, setViewPauseSeconds])

  // ステップ3の5秒カウントダウン
  useEffect(() => {
    if (step3Countdown === null || step3Countdown <= 0) return
    const id = setInterval(() => {
      setStep3Countdown((c) => {
        if (c === null || c <= 0) return null
        if (c === 1) {
          nextStep()
          return null
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [step3Countdown, nextStep, setStep3Countdown])

  useEffect(() => {
    if (!isActive || tutorialStep > 9) return
    // 毎回その時点の要素を取得（確認ポップアップ表示中はダイアログ側のボタンに変わる）
    const update = () => {
      const el = document.querySelector(`[data-tutorial-step="${tutorialStep}"]`)
      if (el) setTargetRect(el.getBoundingClientRect())
      else setTargetRect(null)
      return el
    }
    const el = update()
    const ro = new ResizeObserver(update)
    if (el) ro.observe(el)
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    const raf = requestAnimationFrame(update)
    const t = setTimeout(update, 150)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
      ro.disconnect()
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [tutorialStep, isActive, step2ConfirmOpen, step4ConfirmOpen, step6ConfirmOpen])

  useEffect(() => {
    if (tutorialStep !== 10) return
    const t = setTimeout(() => skip(), 2500)
    return () => clearTimeout(t)
  }, [tutorialStep, skip])

  if (!isActive && tutorialStep !== 10) return null

  // 操作間の「枠なしで全体を見る」時間（クリックはブロックし、チュートリアル終了のみ可能）
  if (viewPauseSeconds !== null && viewPauseSeconds > 0) {
    const isStep7 = tutorialStep === 7
    return (
      <>
        <div className="fixed inset-0 z-[99] pointer-events-auto" aria-hidden="true" />
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto px-4 py-3 rounded-2xl bg-white/95 border border-white/20 shadow-2xl max-w-[min(320px,calc(100vw-32px))]"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <p className="text-sm text-gray-800">
            {isStep7
              ? 'ミラーリングが開始されました。画面の縁が赤く、メニューバーに経過が表示されています。しばらくご確認ください。（あと' + viewPauseSeconds + '秒）'
              : '画面を確認してください（あと' + viewPauseSeconds + '秒）'}
          </p>
        </div>
        <button
          type="button"
          onClick={skip}
          className="fixed bottom-6 right-6 z-[100] pointer-events-auto py-2 px-3 text-xs font-medium text-gray-500 hover:text-gray-800 bg-white/80 hover:bg-white rounded-lg border border-white/20 shadow-lg transition-colors"
        >
          チュートリアルを終了
        </button>
      </>
    )
  }

  // ステップ3の5秒待機：記録の様子を見せる（クリックはブロックし、チュートリアル終了のみ可能）
  if (tutorialStep === 3 && step3Countdown !== null && step3Countdown > 0) {
    return (
      <>
        <div className="fixed inset-0 z-[99] pointer-events-auto" aria-hidden="true" />
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto px-4 py-3 rounded-2xl bg-white/95 border border-white/20 shadow-2xl"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <p className="text-sm text-gray-800">
            記録の様子を5秒間ご覧ください（あと{step3Countdown}秒）
          </p>
        </div>
        <button
          type="button"
          onClick={skip}
          className="fixed bottom-6 right-6 z-[100] pointer-events-auto py-2 px-3 text-xs font-medium text-gray-500 hover:text-gray-800 bg-white/80 hover:bg-white rounded-lg border border-white/20 shadow-lg transition-colors"
        >
          チュートリアルを終了
        </button>
      </>
    )
  }

  if (tutorialStep === 10) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
        style={{ backdropFilter: 'blur(4px)' }}
      >
        <div
          className="mx-4 max-w-sm rounded-2xl bg-white/95 px-6 py-5 shadow-2xl border border-white/20"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <p className="text-center text-gray-800 text-sm leading-relaxed">
            {renderMessage('デモを完了しました。ここからは自由にお試しください。')}
          </p>
        </div>
      </div>
    )
  }

  const padding = 8

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" aria-hidden="true">
      {/* スポットライト：周囲4枚で穴を作り、穴部分はクリック透過 */}
      {targetRect && (
        <>
          <div
            className="absolute left-0 top-0 right-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            style={{ height: Math.max(0, targetRect.top - padding) }}
          />
          <div
            className="absolute left-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            style={{
              top: targetRect.top - padding,
              width: Math.max(0, targetRect.left - padding),
              height: targetRect.height + padding * 2,
            }}
          />
          <div
            className="absolute bg-black/60 backdrop-blur-sm pointer-events-auto"
            style={{
              left: targetRect.right + padding,
              top: targetRect.top - padding,
              right: 0,
              height: targetRect.height + padding * 2,
            }}
          />
          <div
            className="absolute left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            style={{ top: targetRect.bottom + padding }}
          />
        </>
      )}
      {!targetRect && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" />
      )}
      {/* ガイダンスパネル（macOS通知風）：ターゲットの中央に揃える */}
      <div
        className="absolute w-[min(320px,calc(100vw-32px))] pointer-events-auto mx-4 rounded-2xl border border-white/20 bg-white/95 shadow-2xl overflow-hidden z-10"
        style={{
          left: targetRect
            ? targetRect.left + targetRect.width / 2
            : '50%',
          top: targetRect ? targetRect.bottom + 16 : 24,
          transform: targetRect
            ? 'translate(-50%, 0)'
            : 'translate(-50%, 0)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="p-4">
          <p className="text-sm text-gray-800 leading-relaxed">
            {renderMessage(message)}
          </p>
          {tutorialStep === 3 && (
            <button
              type="button"
              onClick={() => setStep3Countdown(5)}
              className="mt-3 w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            >
              次へ
            </button>
          )}
        </div>
      </div>
      {/* チュートリアルを終了 */}
      <button
        type="button"
        onClick={skip}
        className="absolute bottom-6 right-6 pointer-events-auto py-2 px-3 text-xs font-medium text-gray-500 hover:text-gray-800 bg-white/80 hover:bg-white rounded-lg border border-white/20 shadow-lg transition-colors"
      >
        チュートリアルを終了
      </button>
    </div>
  )
}
