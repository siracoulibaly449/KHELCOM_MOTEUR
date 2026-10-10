import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import Logo from './Logo'

const liens = [
  { to: '/', libelle: 'Accueil' },
  { to: '/catalogue', libelle: 'Moteurs' },
  { to: '/garanties', libelle: 'Conditions' },
  { to: '/contact', libelle: 'Contact' },
]

function Header() {
  const [ouvert, setOuvert] = useState(false)
  const fermer = () => setOuvert(false)

  return (
    <header className="entete">
      <div className="entete-barre">
        <Logo />

        <nav className="navigation" aria-label="Navigation principale">
          {liens.map((l) => (
            <Link key={l.to} to={l.to}>{l.libelle}</Link>
          ))}
        </nav>

        <div className="actions">
          <button
            type="button"
            className="burger"
            aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={ouvert}
            onClick={() => setOuvert((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {ouvert && (
        <nav className="menu-mobile" aria-label="Menu mobile">
          {liens.map((l) => (
            <Link key={l.to} to={l.to} onClick={fermer}>{l.libelle}</Link>
          ))}
          <Link to="/connexion" onClick={fermer}>Connexion</Link>
          <Link to="/panier" onClick={fermer}>Panier</Link>
        </nav>
      )}
    </header>
  )
}

export default Header