import './Header.css'
import { Link } from 'react-router-dom'

const liens = ['Moteurs', 'Pièces', 'Occasion', 'Garanties', 'Contact']

function Header() {
  return (
    <header className="entete">
      <div className="logo">
        MOTEURS<span>.</span>PRO
      </div>

      <nav className="navigation">
        <Link to="/catalogue">Moteurs</Link>
        <a href="#">Pièces</a>
        <a href="#">Occasion</a>
        <a href="#">Garanties</a>
        <a href="#">Contact</a>
      </nav>

      <div className="actions">
        <Link to="/connexion" className="connexion">Connexion</Link>
        <button className="panier">Panier · 0</button>
      </div>
    </header>
  )
}

export default Header