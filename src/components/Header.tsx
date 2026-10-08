import './Header.css'
import { Link } from 'react-router-dom'
import { usePanier } from '../context/usePanier'

function Header() {
  const { nombre } = usePanier()

  return (
    <header className="entete">
      <div className="logo">
        MOTEURS<span>.</span>PRO
      </div>

      <nav className="navigation">
        <Link to="/catalogue">Moteurs</Link>
        <a href="#">Pièces</a>
        <a href="#">Occasion</a>
        <Link to="/garanties">Garanties</Link>
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