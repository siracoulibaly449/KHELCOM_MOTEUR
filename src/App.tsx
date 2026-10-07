import Header from './components/Header'
import Hero from './components/Hero'
import Bandeau from './components/Bandeau'
import MoteursEnStock from './components/MoteursEnStock'
import Confiance from './components/Confiance'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
      <Bandeau />
      <MoteursEnStock />
      <Confiance />
      <Footer />
    </>
  )
}

export default App