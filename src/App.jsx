import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CartDrawer from './components/cart/CartDrawer'
import Home from './pages/Home'
import Collection from './pages/Collection'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const { pathname } = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
    ScrollTrigger.refresh()
  }, [pathname])

  const hideFooterOn = ['/checkout', '/login', '/register']
  const showFooter = !hideFooterOn.some(p => pathname.startsWith(p))

  return (
    <>
      <Navbar />
      <CartDrawer />
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/collection"     element={<Collection />} />
        <Route path="/product/:slug"  element={<ProductDetail />} />
        <Route path="/checkout"       element={<Checkout />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  )
}