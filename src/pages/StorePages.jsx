import { Bot, Check, Gem, Heart, Minus, Plus, Send, ShoppingBag, Trash2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { products } from '../data/products'
import GoldPriceCards from '../components/gold/GoldPriceCards'
import GoldHistoryChart from '../components/gold/GoldHistoryChart'

function PageTitle({ title, subtitle }) {
  return <header className="page-title"><h1>{title}</h1><p>{subtitle}</p></header>
}

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link className="product-visual" to={`/products/${product.id}`} aria-label={`عرض ${product.name}`}><Gem /></Link>
      <button className="heart-button" aria-label="إضافة إلى المفضلة"><Heart /></button>
      <p className="product-category">{product.category}</p>
      <h2><Link to={`/products/${product.id}`}>{product.name}</Link></h2>
      <small>{product.weight}</small>
      <strong>{product.price} شيكل</strong>
    </article>
  )
}

export function ProductsPage() {
  return (
    <div className="container page-space">
      <PageTitle title="جميع المنتجات" subtitle="اكتشف مجموعتنا المختارة من المجوهرات" />
      <div className="catalog-layout">
        <aside className="filters"><h3>تصفية المنتجات</h3>{['خواتم', 'سلاسل', 'أقراط', 'أساور'].map(x => <label key={x}><input type="checkbox" /> {x}</label>)}</aside>
        <section className="product-grid">{products.map(product => <ProductCard key={product.id} product={product} />)}</section>
      </div>
    </div>
  )
}

export function ProductDetailsPage() {
  const { id } = useParams()
  const product = products.find(item => item.id === Number(id)) || products[0]
  return (
    <div className="container page-space product-details">
      <div className="detail-visual"><Gem /></div>
      <div className="detail-copy">
        <p className="product-category">{product.category}</p><h1>{product.name}</h1>
        <div className="rating">★★★★★ <span>(128 تقييماً)</span></div>
        <strong className="detail-price">{product.price} شيكل</strong>
        <dl><div><dt>العيار</dt><dd>21</dd></div><div><dt>الوزن</dt><dd>{product.weight}</dd></div><div><dt>التوفر</dt><dd className="success">متوفر</dd></div></dl>
        <div className="quantity"><button><Minus /></button><span>1</span><button><Plus /></button></div>
        <Link className="primary-action full-action" to="/cart"><ShoppingBag /> إضافة إلى السلة</Link>
      </div>
    </div>
  )
}

export function CartPage() {
  return (
    <div className="container page-space narrow-page">
      <PageTitle title="سلة التسوق" subtitle="راجع منتجاتك قبل إتمام الطلب" />
      {products.slice(0, 3).map(product => <div className="cart-row" key={product.id}><div className="mini-visual"><Gem /></div><div><b>{product.name}</b><small>{product.weight}</small></div><div className="quantity"><button><Minus /></button><span>1</span><button><Plus /></button></div><strong>{product.price} شيكل</strong><button className="icon-danger"><Trash2 /></button></div>)}
      <div className="summary-card"><span>الإجمالي</span><strong>6,210 شيكل</strong><Link className="primary-action" to="/checkout">إتمام الطلب</Link></div>
    </div>
  )
}

export function CheckoutPage() {
  return (
    <div className="container page-space checkout-layout">
      <section><PageTitle title="إتمام الطلب" subtitle="أدخل معلومات التوصيل والدفع" /><form className="checkout-form"><label>الاسم الكامل<input placeholder="الاسم الكامل" /></label><label>رقم الهاتف<input placeholder="07XXXXXXXX" /></label><label>البريد الإلكتروني<input type="email" placeholder="name@example.com" /></label><label className="wide">عنوان التوصيل<textarea placeholder="المدينة، المنطقة، الشارع" /></label></form></section>
      <aside className="summary-card order-summary"><h2>ملخص الطلب</h2><span>المجموع الفرعي <b>6,210 شيكل</b></span><span>التوصيل <b>25 شيكل</b></span><hr /><span>الإجمالي <strong>6,235 شيكل</strong></span><button className="primary-action"><Check /> تأكيد الطلب</button></aside>
    </div>
  )
}

export function WishlistPage() {
  return <div className="container page-space"><PageTitle title="المفضلة" subtitle="القطع التي أحببتها محفوظة هنا" /><section className="product-grid">{products.map(product => <ProductCard key={product.id} product={product} />)}</section></div>
}

export function GoldPricesPage() {
  return <div className="container page-space"><PageTitle title="أسعار الذهب اليوم" subtitle="أسعار السوق العالمي بالدينار الأردني لكل غرام" /><GoldPriceCards /><GoldHistoryChart /><div className="chart-card pricing-note"><h2>ملاحظة التسعير</h2><p>هذه أسعار الذهب الخام في السوق العالمي. سعر قطعة المجوهرات النهائي يشمل الوزن والمصنعية وهامش المتجر.</p></div></div>
}

export function AssistantPage() {
  return <div className="assistant-page"><div className="assistant-head"><Bot /><div><h1>مساعدك الذكي</h1><p>متصل الآن</p></div></div><div className="chat"><div className="message bot-message">مرحباً! أنا مساعد GOLDEN. كيف يمكنني مساعدتك اليوم؟</div><div className="suggestions"><button>اعرض أسعار الذهب الآن</button><button>ساعدني باختيار خاتم</button><button>تتبع طلبي</button></div></div><div className="chat-input"><input placeholder="اكتب رسالتك..." /><button aria-label="إرسال"><Send /></button></div></div>
}

export function InfoPage({ title, text }) {
  return <div className="container page-space info-page"><Gem /><PageTitle title={title} subtitle={text} /><Link className="primary-action" to="/products">تصفح المنتجات</Link></div>
}
