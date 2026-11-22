import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="empty-page">
      <h1>الصفحة غير موجودة</h1>
      <Link to="/">العودة إلى الرئيسية</Link>
    </section>
  )
}
