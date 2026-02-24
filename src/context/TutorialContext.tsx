import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export const TUTORIAL_MESSAGES: Record<number, string> = {
  1: 'デモへようこそ。Latlasは、学習プロセスを可視化し、適切な評価と支援につなげるエージェントです。まずはメニューバーの **"Latlas"** をクリックして、操作パネルを開いてください。',
  2: 'ここがクラス一覧です。**"Intensive English JI"** を選ぶと、その授業の記録を開始できます。議論や作業の内容がリアルタイムで収集され、あなたの活動がデータとして蓄積されます。',
  3: 'メニューバーを見てください。経過時間が表示され、バックグラウンドで活動が記録されています。下には、今行った操作（PowerPointの編集など）がログとして追加されていきます。',
  4: '次に「ミラーリング」を試します。その前に、いったん記録を止めましょう。画面右上の **"赤い停止ボタン"** を押し、確認で **"はい"** を選んで停止を完了してください。',
  5: '**ミラーリング**は、自分の画面を先生の画面に共有する機能です。右上の **"キャストアイコン"** をクリックし、共有先の先生として **"Sarah Jenkins"**（Intensive English JI）を選んでください。',
  6: 'リクエストを送信しました。約3秒で先生側が許可すると **"開始"** ボタンが押せるようになります。押すと、メニューバーでカウントダウン後に画面の縁が赤くなり、共有が始まります。',
  7: 'ミラーリングを止めてから、今度は **"自然科学総合実験"** を開始してください。このクラスは**試験モード**が設定されています。開始から10秒ほどで、教員から専用モードのリクエストが届きます。',
  8: 'クラス登録の流れです。**"新規追加"** を押し、配布されたクラスコードを入力すると、**"デザイン思考3"** が一覧に追加されます。',
  9: '**デザイン思考3** が追加されましたね。次に、**"課題アプローチ"** を選んで記録を開始してみてください。同じWiFiネットワークにいない場合、プライバシー保護のためのメッセージが表示されます。',
}

const COMPLETE_MESSAGE =
  'これでチュートリアルは終了です。ここからは自由にお試しください。'

type TutorialContextValue = {
  tutorialStep: number
  nextStep: () => void
  skip: () => void
  complete: () => void
  dismissComplete: () => void
  isActive: boolean
  isComplete: boolean
  message: string
  /** ステップ2で「記録を開始しますか？」表示中なら true。オーバーレイの再計測用 */
  step2ConfirmOpen: boolean
  setStep2ConfirmOpen: (open: boolean) => void
  /** ステップ3で「次へ」押下後のカウントダウン（5→0）。0でステップ4へ */
  step3Countdown: number | null
  setStep3Countdown: (v: number | null) => void
  /** ステップ4で「記録を停止しますか？」表示中なら true。オーバーレイの再計測用 */
  step4ConfirmOpen: boolean
  setStep4ConfirmOpen: (open: boolean) => void
  /** ステップ6でミラーリング許可確認（「開始」ボタン）表示中なら true。オーバーレイの再計測用 */
  step6ConfirmOpen: boolean
  setStep6ConfirmOpen: (open: boolean) => void
  /** 操作と操作の間で「枠なしで全体を見る」秒数。0で通常の枠表示に戻る */
  viewPauseSeconds: number | null
  setViewPauseSeconds: (v: number | null) => void
}

const TutorialContext = createContext<TutorialContextValue | null>(null)

export function useTutorial() {
  const ctx = useContext(TutorialContext)
  return ctx
}

type Props = { children: ReactNode }

export function TutorialProvider({ children }: Props) {
  const [tutorialStep, setTutorialStep] = useState(1)
  const [step2ConfirmOpen, setStep2ConfirmOpen] = useState(false)
  const [step3Countdown, setStep3Countdown] = useState<number | null>(null)
  const [step4ConfirmOpen, setStep4ConfirmOpen] = useState(false)
  const [step6ConfirmOpen, setStep6ConfirmOpen] = useState(false)
  const [viewPauseSeconds, setViewPauseSeconds] = useState<number | null>(null)

  const nextStep = useCallback(() => {
    setTutorialStep((s) => (s >= 9 ? 10 : s + 1))
  }, [])

  const skip = useCallback(() => {
    setTutorialStep(0)
  }, [])

  const complete = useCallback(() => {
    setTutorialStep(10)
  }, [])

  const dismissComplete = useCallback(() => {
    setTutorialStep(0)
  }, [])

  const isActive = tutorialStep >= 1 && tutorialStep <= 9
  const isComplete = tutorialStep === 10
  const message =
    tutorialStep === 10 ? COMPLETE_MESSAGE : TUTORIAL_MESSAGES[tutorialStep] ?? ''

  const value: TutorialContextValue = {
    tutorialStep,
    nextStep,
    skip,
    complete,
    dismissComplete,
    isActive,
    isComplete,
    message,
    step2ConfirmOpen,
    setStep2ConfirmOpen,
    step3Countdown,
    setStep3Countdown,
    step4ConfirmOpen,
    setStep4ConfirmOpen,
    step6ConfirmOpen,
    setStep6ConfirmOpen,
    viewPauseSeconds,
    setViewPauseSeconds,
  }

  return (
    <TutorialContext.Provider value={value}>{children}</TutorialContext.Provider>
  )
}
