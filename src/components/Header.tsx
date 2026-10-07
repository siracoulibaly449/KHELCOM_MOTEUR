import './Header.css'
import { Link } from 'react-router-dom'


function Header() {
  return (
    <header className="entete">
      <div className="logo">
        MOTEURS<span>.</span>PRO
      </div>

      <nav className="navigation">
        <Link to="/catalogue">Moteurs</Link>
        <Link to="/catalogue">Pièces</Link>
        <Link to="/catalogue">Occasion</Link>
        <Link to="/garanties">Garanties</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <div className="actions">
        <Link to="/connexion" className="connexion">Connexion</Link>
        <button className="panier">Panier · 0</button>
      </div>
    </header>
  )
}

export default Header