import { useEffect } from 'react'
import { ArrowRight, Gem, Heart, Search, ShoppingBag } from 'lucide-react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'الرئيسية', to: '/#home' },
  { label: 'المنتجات', to: '/#products' },
  { label: 'أسعار الذهب', to: '/#gold-prices' },
  { label: 'المجموعات', to: '/#collections' },
  { label: 'من نحن', to: '/#about' },
  { label: 'تواصل معنا', to: '/#contact' },
  { label: 'المساعد الذكي', to: '/assistant' },
]

export default function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    window.requestAnimationFrame(() => {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [location.pathname, location.hash])

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-content">
          <Link className="brand" to="/" aria-label="العودة إلى الرئيسية">
            <Gem aria-hidden="true" />
            <span>GOLDEN<small>أناقة تدوم</small></span>
          </Link>

          <nav aria-label="التنقل الرئيسي">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions" aria-label="إجراءات المستخدم">
            <Link to="/products" aria-label="البحث"><Search /></Link>
            <Link to="/wishlist" aria-label="المفضلة"><Heart /></Link>
            <Link to="/cart" aria-label="سلة التسوق"><ShoppingBag /></Link>
          </div>
        </div>
      </header>

      <main>
        {location.pathname !== '/' && <div className="container page-back-row"><button type="button" onClick={() => { if (window.history.length > 1) void navigate(-1); else void navigate('/') }}><ArrowRight /> العودة للخلف</button></div>}
        <Outlet />
      </main>
      <Link className="assistant-fab" to="/assistant" aria-label="فتح المساعد الذكي"><Gem /></Link>
      <footer className="site-footer"><div className="container"><span>© 2026 GOLDEN</span><div><Link to="/assistant">المساعد الذكي</Link></div></div></footer>
    </div>
  )
}
