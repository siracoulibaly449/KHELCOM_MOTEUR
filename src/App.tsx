import { Routes, Route } from 'react-router-dom'
import Accueil from './pages/Accueil'
import Connexion from './pages/Connexion'
import Commercant from './pages/Commercant'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/commercant" element={<Commercant />} />
    </Routes>
  )
}

export default App