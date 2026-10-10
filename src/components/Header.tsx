import './Header.css'
import { Link } from 'react-router-dom'
import { usePanier } from '../context/usePanier'

function Header() {
  const { nombre } = usePanier()

  return (
    <header className="entete">
      <Link to="/" className="logo">MOTEURS<span>.</span>PRO</Link>

      <nav className="navigation">
        <Link to="/">Accueil</Link>
        <Link to="/catalogue">Moteurs</Link>
        <Link to="/garanties">Conditions</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <div className="actions">
        <Link to="/connexion" className="connexion">Connexion</Link>
        <Link to="/panier" className="panier">Panier · {nombre}</Link>
      </div>
    </header>
  )
}

export default Header