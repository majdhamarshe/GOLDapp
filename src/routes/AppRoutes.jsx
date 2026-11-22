import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import { AssistantPage, CartPage, CheckoutPage, GoldPricesPage, InfoPage, ProductDetailsPage, ProductsPage, WishlistPage } from '../pages/StorePages'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="gold-prices" element={<GoldPricesPage />} />
        <Route path="collections" element={<InfoPage title="مجموعات GOLDEN" text="تشكيلات صُممت لكل مناسبة ولكل ذوق." />} />
        <Route path="about" element={<InfoPage title="من نحن" text="نختار الذهب بعناية لنقدم لك جودة تدوم." />} />
        <Route path="contact" element={<InfoPage title="تواصل معنا" text="فريقنا جاهز للإجابة عن استفساراتك ومساعدتك." />} />
        <Route path="assistant" element={<AssistantPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
