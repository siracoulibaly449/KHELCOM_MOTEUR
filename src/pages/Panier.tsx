import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { usePanier } from '../context/usePanier'
import './Panier.css'
import { formatPrix } from '../lib/format'


function Panier() {
  const { articles, total, retirer } = usePanier()

  return (
    <>
      <Header />
      <main className="panier-page">
        <h1>Mon <span className="accent">panier</span></h1>

        {articles.length === 0 ? (
          <div className="panier-vide">
            <p>Votre panier est vide.</p>
            <Link to="/catalogue" className="bouton-lien principal">Voir le catalogue</Link>
          </div>
        ) : (
          <div className="panier-contenu">
            <ul className="panier-liste">
              {articles.map((a) => (
                <li key={a.id} className="panier-ligne">
                  <div className="panier-photo">
                    {a.photo && <img src={a.photo} alt="" />}
                  </div>
                  <div className="panier-texte">
                    <Link to={`/moteur/${a.id}`}>{a.nom}</Link>
                    <span>Code {a.code}</span>
                  </div>
                  <strong>{formatPrix(a.prix)}</strong>
                  <button className="retirer" onClick={() => retirer(a.id)}>Retirer</button>
                </li>
              ))}
            </ul>

            <aside className="recap">
              <h2>Récapitulatif</h2>
              <div className="recap-ligne">
                <span>Articles</span>
                <span>{articles.length}</span>
              </div>
              <div className="recap-ligne total">
                <span>Total</span>
                <strong>{formatPrix(total)}</strong>
              </div>
              <p className="aide">Les frais de livraison seront calculés à l'étape suivante.</p>
              <Link to="/commande" className="bouton-lien principal">Passer la commande</Link>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

export default Panier