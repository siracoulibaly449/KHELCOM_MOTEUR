import { Link, useLocation } from 'react-router-dom'
import { usePanier } from '../context/usePanier'
import { formatPrix } from '../lib/format'
import './PanierFlottant.css'

function PanierFlottant() {
  const { articles, nombre, total, retirer } = usePanier()
  const location = useLocation()

  // Pas de sticker sur la page panier ni sur la réservation : on y est déjà
 if (
  location.pathname === '/panier' ||
  location.pathname === '/commande' ||
  location.pathname === '/connexion' ||
  location.pathname.startsWith('/commercant')
) {
  return null
}

  return (
    <div className="panier-sticker">
      {nombre > 0 && (
        <aside className="panier-apercu" aria-label="Aperçu du panier">
          <div className="apercu-titre">Mon panier · {nombre}</div>
          <ul>
            {articles.map((a) => (
              <li key={a.id}>
                <span>{a.nom}</span>
                <button type="button" onClick={() => retirer(a.id)} aria-label={`Retirer ${a.nom}`}>
                  ×
                </button>
              </li>
            ))}
          </ul>
          <div className="apercu-total">
            <span>Total</span>
            <strong>{formatPrix(total)}</strong>
          </div>
          <Link to="/commande" className="apercu-bouton">Réserver</Link>
        </aside>
      )}

      <Link to="/panier" className="panier-bulle" aria-label={`Panier, ${nombre} article(s)`}>
        <span className="bulle-icone">🛒</span>
        <span className="bulle-nombre">{nombre}</span>
      </Link>
    </div>
  )
}

export default PanierFlottant