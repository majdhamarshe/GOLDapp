import { Gem, LogIn, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const next = new URLSearchParams(location.search).get('next') || '/'

  function handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    localStorage.setItem('golden_user', JSON.stringify({ name: data.get('name') || 'عميل GOLDEN', email: data.get('email') }))
    void navigate(next, { replace: true })
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <Gem className="auth-logo" />
        <h1>{isRegister ? 'إنشاء حساب' : 'تسجيل الدخول'}</h1>
        <p>سجّل دخولك لتتمكن من استخدام مساعد GOLDEN الذكي.</p>
        {isRegister && <label>الاسم الكامل<input name="name" required placeholder="اكتب اسمك" /></label>}
        <label>البريد الإلكتروني<input name="email" type="email" required placeholder="name@example.com" /></label>
        <label>كلمة المرور<input name="password" type="password" required minLength="6" placeholder="6 أحرف على الأقل" /></label>
        <button className="primary-action full-action" type="submit">{isRegister ? <UserPlus /> : <LogIn />}{isRegister ? 'إنشاء الحساب والمتابعة' : 'تسجيل الدخول'}</button>
        <button className="auth-switch" type="button" onClick={() => setIsRegister(value => !value)}>{isRegister ? 'لديك حساب؟ سجّل الدخول' : 'ليس لديك حساب؟ أنشئ حساباً'}</button>
      </form>
    </section>
  )
}
