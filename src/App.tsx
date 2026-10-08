import { Routes, Route } from 'react-router-dom'
import Accueil from './pages/Accueil'
import Connexion from './pages/Connexion'
import Commercant from './pages/Commercant'
import Catalogue from './pages/Catalogue'
import FicheMoteur from './pages/FicheMoteur'
import Garanties from './pages/Garanties'
import Contact from './pages/Contact'
import RequireCommercant from './components/RequireCommercant'
import Panier from './pages/Panier'
import Commande from './pages/Commande'
import Confirmation from './pages/Confirmation'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route
        path="/commercant"
        element={<RequireCommercant><Commercant /></RequireCommercant>}
      />
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/moteur/:id" element={<FicheMoteur />} />
      <Route path="/garanties" element={<Garanties />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/panier" element={<Panier />} />
      <Route path="*" element={
        <main className="page-simple">
          <h1>Page introuvable</h1>
          <p>Cette page n'existe pas ou a été déplacée.</p>
          <a href="/" className="tout-voir">Retour à l'accueil</a>
        </main>
      } />
      <Route path="/commande" element={<Commande />} />
      <Route path="/confirmation/:reference" element={<Confirmation />} />
    </Routes>
  )
}

export default App