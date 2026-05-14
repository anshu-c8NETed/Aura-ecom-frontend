import SmoothScroller from '../components/layout/Smoothscroller'
import Hero from '../components/home/Hero'
import MarqueeBand from '../components/home/MarqueeBand'
import FeaturedProducts from '../components/home/FeaturedProducts'
import Editorial from '../components/home/Editorial'
import CategoryGrid from '../components/home/CategoryGrid'
import Testimonials from '../components/home/Testimonials'
import Newsletter from '../components/home/Newsletter'

export default function Home() {
  return (
    <SmoothScroller>
      <main>
        <Hero />
        <MarqueeBand />
        <FeaturedProducts />
        <Editorial />
        <CategoryGrid />
        <Testimonials />
        <Newsletter />
      </main>
    </SmoothScroller>
  )
}