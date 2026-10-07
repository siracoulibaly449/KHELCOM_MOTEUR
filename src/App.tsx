import { Routes, Route } from 'react-router-dom'
import Accueil from './pages/Accueil'
import Connexion from './pages/Connexion'
import Commercant from './pages/Commercant'
import Catalogue from './pages/Catalogue'
import Garanties from './pages/Garanties'
import Contact from './pages/Contact'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/commercant" element={<Commercant />} />
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/garanties" element={<Garanties />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}

export default App