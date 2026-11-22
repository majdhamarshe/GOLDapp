import { ArrowLeft, Gem, Mail, MapPin, Phone, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import GoldPriceCards from '../components/gold/GoldPriceCards'
import GoldHistoryChart from '../components/gold/GoldHistoryChart'
import { products } from '../data/products'

const collections = [
  { title: 'لمعة يومية', text: 'قطع ناعمة تناسب كل يوم.' },
  { title: 'ليالي GOLDEN', text: 'تصاميم مميزة للمناسبات.' },
  { title: 'هدية العمر', text: 'اختيارات تعبّر عن أجمل اللحظات.' },
]

export default function HomePage() {
  return (
    <>
      <section className="setup-hero" id="home">
        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles /> مرحباً بك في GOLDEN</span>
            <h1>جمال يدوم<br /><em>وقيمة لا تزول</em></h1>
            <p>اكتشف تشكيلتنا المختارة من المجوهرات والذهب، حيث تلتقي الأناقة الخالدة بالجودة التي تستحقها.</p>
            <a className="primary-action" href="#products">ابدأ التسوق <ArrowLeft /></a>
          </div>
          <figure className="hero-jewelry"><img src="/hero-gold-pendant.jpg" alt="قلادة ذهبية مزخرفة على خلفية سوداء" /></figure>
        </div>
      </section>

      <section className="home-section" id="products">
        <div className="container">
          <div className="section-heading"><div><span>مختاراتنا</span><h2>الأكثر مبيعاً</h2></div><Link to="/products">عرض جميع المنتجات <ArrowLeft /></Link></div>
          <div className="product-grid">
            {products.map(product => (
              <article className="product-card" key={product.id}>
                <Link className="product-visual" to={`/products/${product.id}`}><Gem /></Link>
                <p className="product-category">{product.category}</p>
                <h2><Link to={`/products/${product.id}`}>{product.name}</Link></h2>
                <small>{product.weight}</small><strong>{product.price} شيكل</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section cream-section" id="gold-prices">
        <div className="container"><div className="section-heading"><div><span>تحديث اليوم</span><h2>أسعار الذهب</h2></div><TrendingUp /></div>
          <GoldPriceCards />
          <GoldHistoryChart />
        </div>
      </section>

      <section className="home-section" id="collections">
        <div className="container"><div className="section-heading"><div><span>لكل لحظة</span><h2>مجموعات GOLDEN</h2></div></div>
          <div className="collections-grid">{collections.map(item => <article className="collection-card" key={item.title}><Gem /><h3>{item.title}</h3><p>{item.text}</p><a href="#products">اكتشف المجموعة</a></article>)}</div>
        </div>
      </section>

      <section className="home-section dark-section" id="about">
        <div className="container about-grid"><div><span className="eyebrow"><ShieldCheck /> ثقة وجودة</span><h2>ذهب نختاره بعناية</h2><p>في GOLDEN نؤمن أن كل قطعة تحمل قصة. لذلك نختار مجوهراتنا وفق معايير دقيقة ونقدّم تجربة واضحة وموثوقة من الاختيار حتى الاستلام.</p></div><div className="about-mark"><Gem /><strong>GOLDEN</strong><small>أناقة تدوم</small></div></div>
      </section>

      <section className="home-section" id="contact">
        <div className="container contact-grid"><div><span>نحن هنا لمساعدتك</span><h2>تواصل معنا</h2><p>استفسر عن المنتجات أو المقاسات أو حالة طلبك، وسيجيبك فريقنا بأقرب وقت.</p></div><div className="contact-list"><a href="tel:+970595716604"><Phone /> 0595716604</a><a href="mailto:jamel.7madi@gmail.com"><Mail /> jamel.7madi@gmail.com</a><p><MapPin /> جنين، فلسطين</p></div></div>
      </section>
    </>
  )
}
