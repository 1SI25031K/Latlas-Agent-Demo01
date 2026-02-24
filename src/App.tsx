import { useState, useEffect, useMemo, useRef } from 'react'
import { EntryView } from './components/EntryView'
import { ListView } from './components/ListView'
import { LogView } from './components/LogView'
import { ConfirmStartPopup } from './components/ConfirmStartPopup'
import { ConfirmStopPopup } from './components/ConfirmStopPopup'
import { ConfirmSwitchClassPopup } from './components/ConfirmSwitchClassPopup'
import { WifiWarningPopup } from './components/WifiWarningPopup'
import { ExamModeRequestPopup } from './components/ExamModeRequestPopup'
import { ConfirmMirrorStopPopup } from './components/ConfirmMirrorStopPopup'
import { MirrorClassSelectView } from './components/MirrorClassSelectView'
import { MirrorRequestSentView } from './components/MirrorRequestSentView'
import { MirrorApprovedConfirmPopup } from './components/MirrorApprovedConfirmPopup'
import { MirroringBlockAlert } from './components/MirroringBlockAlert'
import { MenuBar } from './components/MenuBar'
import { useTutorial } from './context/TutorialContext'
import { INITIAL_CLASSES, NEW_CLASS_ON_ADD, type ClassItem } from './data/classes'
import { ACTIVITY_LOG_MESSAGES, type ActivityLogEntry } from './activityLogSeed'

import wallpaperUrl from './korekore.png'

type View = 'entry' | 'list' | 'log'
type MirrorFlowStep = 'idle' | 'select_class' | 'request_sent' | 'approved_confirm'

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatExamCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `試験 ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

type MirrorStartPhase = 'idle' | 'countdown' | 'started' | 'active'

function getInstructor(classes: ClassItem[], className: string): string {
  const c = classes.find((x) => x.name === className)
  return c?.instructor ?? ''
}

const CLASS_ID_KADAI = '課題アプローチ'
const CLASS_ID_NATURE = '自然科学総合実験'

export default function App() {
  const { tutorialStep, nextStep, complete, setStep2ConfirmOpen, setStep4ConfirmOpen, setStep6ConfirmOpen } = useTutorial()
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES)
  const [view, setView] = useState<View>('list')
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [selectedClassName, setSelectedClassName] = useState('Intensive English JI')
  const [recordingClassName, setRecordingClassName] = useState<string | null>(null)
  const [confirmClass, setConfirmClass] = useState<string | null>(null)
  const [confirmStopOpen, setConfirmStopOpen] = useState(false)
  const [confirmSwitchClass, setConfirmSwitchClass] = useState<string | null>(null)
  const [showWifiWarning, setShowWifiWarning] = useState(false)
  const [showExamModeRequest, setShowExamModeRequest] = useState(false)
  const [examModeApproved, setExamModeApproved] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [mirrorFlowStep, setMirrorFlowStep] = useState<MirrorFlowStep>('idle')
  const [mirrorRequestClassName, setMirrorRequestClassName] = useState<string | null>(null)
  const [mirrorStartPhase, setMirrorStartPhase] = useState<MirrorStartPhase>('idle')
  const [mirrorCountdown, setMirrorCountdown] = useState(3)
  const [isMirroring, setIsMirroring] = useState(false)
  const [mirrorStartTime, setMirrorStartTime] = useState<number | null>(null)
  const [mirrorNow, setMirrorNow] = useState(() => Date.now())
  const [confirmMirrorStopOpen, setConfirmMirrorStopOpen] = useState(false)
  const [showMirroringBlockAlert, setShowMirroringBlockAlert] = useState(false)
  const [examCountdownSeconds, setExamCountdownSeconds] = useState(600)
  const examModeRequestShownRef = useRef(false)

  const isRecording = startTime !== null
  const elapsedSeconds = startTime
    ? Math.max(0, Math.floor((now - startTime) / 1000))
    : 0

  useEffect(() => {
    setStep2ConfirmOpen(confirmClass !== null)
  }, [confirmClass, setStep2ConfirmOpen])

  useEffect(() => {
    setStep4ConfirmOpen(confirmStopOpen)
  }, [confirmStopOpen, setStep4ConfirmOpen])

  useEffect(() => {
    setStep6ConfirmOpen(mirrorFlowStep === 'approved_confirm')
  }, [mirrorFlowStep, setStep6ConfirmOpen])

  useEffect(() => {
    if (!startTime) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [startTime])

  useEffect(() => {
    if (!mirrorStartTime) return
    const t = setInterval(() => setMirrorNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [mirrorStartTime])

  // ミラーリング開始：3→2→1 カウントダウン（1秒間隔）
  useEffect(() => {
    if (mirrorStartPhase !== 'countdown') return
    const id = setInterval(() => {
      setMirrorCountdown((c) => {
        if (c <= 1) {
          clearInterval(id)
          setMirrorStartPhase('started')
          setIsMirroring(true)
          setMirrorStartTime(Date.now())
          setMirrorNow(Date.now())
          setTimeout(() => setMirrorStartPhase('active'), 2000)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [mirrorStartPhase])

  // 試験モード：10:00 から 1秒ごとにカウントダウン
  useEffect(() => {
    if (!examModeApproved || recordingClassName !== CLASS_ID_NATURE) return
    const t = setInterval(() => {
      setExamCountdownSeconds((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(t)
  }, [examModeApproved, recordingClassName])

  // ミラーリング「リクエスト送信」から3秒後に承認確認へ
  useEffect(() => {
    if (mirrorFlowStep !== 'request_sent') return
    const t = setTimeout(() => setMirrorFlowStep('approved_confirm'), 3000)
    return () => clearTimeout(t)
  }, [mirrorFlowStep])

  // 自然科学総合実験：記録開始から10秒後に共有モードリクエストを表示
  useEffect(() => {
    if (!startTime || recordingClassName !== CLASS_ID_NATURE) return
    if (examModeRequestShownRef.current) return
    const timer = setTimeout(() => {
      examModeRequestShownRef.current = true
      setShowExamModeRequest(true)
    }, 10_000)
    return () => clearTimeout(timer)
  }, [startTime, recordingClassName])

  // 試験モード中はログ追加を停止
  const activityLogs = useMemo((): ActivityLogEntry[] => {
    if (!isRecording || elapsedSeconds < 5) return []
    if (recordingClassName === CLASS_ID_NATURE && examModeApproved) return []
    const n = Math.floor(elapsedSeconds / 5)
    return Array.from({ length: n }, (_, i) => ({
      elapsedSeconds: (i + 1) * 5,
      text: ACTIVITY_LOG_MESSAGES[i % ACTIVITY_LOG_MESSAGES.length],
    })).reverse()
  }, [isRecording, elapsedSeconds, recordingClassName, examModeApproved])

  const openEntry = () => setView('entry')
  const openList = () => setView('list')
  const goToLogView = () => setView('log')

  const stopRecordingAndGoToList = () => {
    setStartTime(null)
    setRecordingClassName(null)
    setConfirmStopOpen(false)
    setExamModeApproved(false)
    setShowExamModeRequest(false)
    setExamCountdownSeconds(600)
    examModeRequestShownRef.current = false
    setView('list')
  }

  const openLog = (name: string) => {
    setSelectedClassName(name)
    setRecordingClassName(name)
    setView('log')
    setStartTime(Date.now())
    setNow(Date.now())
    setConfirmClass(null)
    setShowWifiWarning(false)
    if (name === CLASS_ID_NATURE) examModeRequestShownRef.current = false
    else examModeRequestShownRef.current = true
  }

  const handleSelectClass = (name: string) => {
    if (isMirroring || mirrorStartPhase !== 'idle') {
      setShowMirroringBlockAlert(true)
      return
    }
    if (isRecording && name !== recordingClassName) {
      setConfirmSwitchClass(name)
      return
    }
    setConfirmClass(name)
  }

  const handleConfirmStart = () => {
    if (!confirmClass) return
    if (confirmClass === CLASS_ID_KADAI) {
      setShowWifiWarning(true)
      return
    }
    if (tutorialStep === 2) nextStep()
    if (tutorialStep === 7 && confirmClass === CLASS_ID_NATURE) nextStep()
    openLog(confirmClass)
  }

  const handleWifiWarningStart = () => {
    if (tutorialStep === 9) complete()
    if (confirmClass) openLog(confirmClass)
    setShowWifiWarning(false)
  }

  const handleConfirmSwitchClass = () => {
    const nextClass = confirmSwitchClass
    setConfirmSwitchClass(null)
    stopRecordingAndGoToList()
    if (nextClass) setConfirmClass(nextClass)
  }

  const handleExamModeApprove = () => {
    setExamModeApproved(true)
    setExamCountdownSeconds(600)
    setShowExamModeRequest(false)
  }

  const handleStopClick = () => setConfirmStopOpen(true)
  const handleConfirmStop = () => {
    if (tutorialStep === 4) nextStep()
    stopRecordingAndGoToList()
  }

  const handleMirrorClick = () => {
    if (isMirroring) setConfirmMirrorStopOpen(true)
    else setMirrorFlowStep('select_class')
  }

  const handleMirrorClassSelect = (className: string) => {
    if (tutorialStep === 5 && className === 'Intensive English JI') nextStep()
    setMirrorRequestClassName(className)
    setMirrorFlowStep('request_sent')
  }

  const handleMirrorApprovedStart = () => {
    if (tutorialStep === 6) complete()
    setPopoverOpen(false)
    setMirrorFlowStep('idle')
    setMirrorRequestClassName(null)
    setMirrorStartPhase('countdown')
    setMirrorCountdown(3)
  }

  const handleMirrorApprovedCancel = () => {
    setMirrorFlowStep('idle')
    setMirrorRequestClassName(null)
  }

  const handleConfirmMirrorStop = () => {
    setConfirmMirrorStopOpen(false)
    setIsMirroring(false)
    setMirrorStartTime(null)
    setMirrorStartPhase('idle')
  }

  const handleAddComplete = () => {
    if (tutorialStep === 8) nextStep()
    setClasses((prev) => [...prev, NEW_CLASS_ON_ADD])
    setView('list')
  }

  const mirrorElapsedSeconds = mirrorStartTime
    ? Math.max(0, Math.floor((mirrorNow - mirrorStartTime) / 1000))
    : 0
  const isExamModeActive =
    recordingClassName === CLASS_ID_NATURE && examModeApproved && isRecording
  const menuBarLabel = isExamModeActive
    ? formatExamCountdown(examCountdownSeconds)
    : mirrorStartPhase === 'countdown'
      ? String(mirrorCountdown)
      : mirrorStartPhase === 'started'
        ? 'ミラーリングを開始しました'
        : isMirroring
          ? `ミラーリング中 ${formatElapsed(mirrorElapsedSeconds)}`
          : isRecording
            ? `(記録中：${formatElapsed(elapsedSeconds)})`
            : 'Latlas'

  const popoverContent = (
    <div className="relative p-4 min-h-[280px] max-h-[420px] overflow-hidden flex flex-col">
      {mirrorFlowStep === 'select_class' && (
        <MirrorClassSelectView
          classes={classes}
          onSelect={handleMirrorClassSelect}
          onBack={() => setMirrorFlowStep('idle')}
          tutorialStep={tutorialStep}
        />
      )}
      {(mirrorFlowStep === 'request_sent' || mirrorFlowStep === 'approved_confirm') &&
        mirrorRequestClassName && (
          <MirrorRequestSentView
            instructorName={getInstructor(classes, mirrorRequestClassName)}
          />
        )}
      {mirrorFlowStep === 'approved_confirm' && (
        <MirrorApprovedConfirmPopup
          onStart={handleMirrorApprovedStart}
          onCancel={handleMirrorApprovedCancel}
          tutorialStep={tutorialStep}
        />
      )}
      {mirrorFlowStep === 'idle' && view === 'entry' && (
        <EntryView onComplete={handleAddComplete} onBack={openList} />
      )}
      {mirrorFlowStep === 'idle' && view === 'list' && (
        <ListView
          classes={classes}
          recordingClassName={recordingClassName}
          onAddNew={openEntry}
          onSelectClass={handleSelectClass}
          onRecordingBannerClick={recordingClassName ? goToLogView : undefined}
          isMirroring={isMirroring}
          onMirrorClick={handleMirrorClick}
          tutorialStep={tutorialStep}
          showConfirmStartPopup={confirmClass !== null}
        />
      )}
      {mirrorFlowStep === 'idle' && view === 'log' && (
        <LogView
          selectedClassName={selectedClassName}
          activityLogs={activityLogs}
          isExamMode={
            recordingClassName === CLASS_ID_NATURE && examModeApproved
          }
          onBack={openList}
          onStopClick={handleStopClick}
          tutorialStep={tutorialStep}
          showConfirmStopPopup={confirmStopOpen}
        />
      )}

      {/* ポップオーバー内のみのオーバーレイ・ダイアログ */}
      {confirmClass !== null && !showWifiWarning && (
        <ConfirmStartPopup
          className={confirmClass}
          onCancel={() => setConfirmClass(null)}
          onStart={handleConfirmStart}
          tutorialStep={tutorialStep}
        />
      )}
      {showWifiWarning && confirmClass === CLASS_ID_KADAI && (
        <WifiWarningPopup
          instructorName={getInstructor(classes, CLASS_ID_KADAI)}
          onCancel={() => {
            setShowWifiWarning(false)
            setConfirmClass(null)
          }}
          onStart={handleWifiWarningStart}
        />
      )}
      {confirmStopOpen && (
        <ConfirmStopPopup
          onCancel={() => setConfirmStopOpen(false)}
          onStop={handleConfirmStop}
          tutorialStep={tutorialStep}
        />
      )}
      {confirmSwitchClass !== null && (
        <ConfirmSwitchClassPopup
          onCancel={() => setConfirmSwitchClass(null)}
          onConfirm={handleConfirmSwitchClass}
        />
      )}
      {showExamModeRequest && (
        <ExamModeRequestPopup onApprove={handleExamModeApprove} />
      )}
      {confirmMirrorStopOpen && (
        <ConfirmMirrorStopPopup
          onCancel={() => setConfirmMirrorStopOpen(false)}
          onStop={handleConfirmMirrorStop}
        />
      )}
      {showMirroringBlockAlert && (
        <MirroringBlockAlert onClose={() => setShowMirroringBlockAlert(false)} />
      )}
    </div>
  )

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-900 relative"
      style={{
        backgroundImage: `url(${wallpaperUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        outline:
          isMirroring && mirrorStartPhase !== 'countdown'
            ? '4px solid #ef4444'
            : undefined,
        outlineOffset: isMirroring ? '-4px' : undefined,
      }}
    >
      <MenuBar
        menuBarLabel={menuBarLabel}
        onLatlasClick={() => {
          setPopoverOpen((o) => {
            if (!o && tutorialStep === 1) nextStep()
            return !o
          })
        }}
        popoverOpen={popoverOpen}
        tutorialStep={tutorialStep}
      />

      <main className="flex-1" aria-hidden="true" />

      {popoverOpen && (
        <>
          <button
            className="fixed inset-0 z-[45]"
            aria-label="閉じる"
            onClick={() => setPopoverOpen(false)}
          />
          <div
            className="fixed left-1/2 top-10 z-50 w-[320px] -translate-x-1/2 overflow-hidden animate-spring-scale-center rounded-xl bg-white/95 shadow-xl"
            style={{
              border: '0.5px solid rgba(0,0,0,0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {popoverContent}
          </div>
        </>
      )}

      {/* チュートリアル終了後のメモ：どの操作でどんなギミックが見られるか */}
      {tutorialStep === 0 && (
        <div
          className="fixed left-6 bottom-6 z-40 w-64 rounded-xl border border-white/20 bg-white/90 px-3 py-2.5 shadow-lg text-left"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <p className="text-[10px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">デモのギミック</p>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>・<strong>自然科学総合実験</strong> → 記録開始から10秒で試験モードのリクエストが届きます</li>
            <li>・<strong>課題アプローチ</strong> → 同じWiFiにいない時に出るプライバシー保護メッセージを確認できます</li>
            <li>・<strong>新規追加</strong> → クラスコードを入力すると「デザイン思考3」が一覧に追加されます</li>
          </ul>
        </div>
      )}
    </div>
  )
}
