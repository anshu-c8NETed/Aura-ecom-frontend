import Hero from '../components/home/Hero'
import MarqueeBand from '../components/home/MarqueeBand'
import FeaturedProducts from '../components/home/FeaturedProducts'
import Editorial from '../components/home/Editorial'
import CategoryGrid from '../components/home/CategoryGrid'
import Newsletter from '../components/home/Newsletter'

export default function Home() {
  return (
    <main>
      <Hero />
      <MarqueeBand />
      <FeaturedProducts />
      <Editorial />
      <CategoryGrid />
      <Newsletter />
    </main>
  )
}