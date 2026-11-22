export default function SplashScreen({ onSkip }) {
  return (
    <output className="splash" aria-live="polite" aria-label="مرحباً بك في جولدن">
      <div className="splash-inner">
        <p className="splash-greeting">أهلاً بك</p>
        <p className="splash-brand">GOLDEN</p>
      </div>
      <button className="splash-skip" onClick={onSkip}>تخطي</button>
    </output>
  )
}
