import { Link, useLocation, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { formatPrix } from '../lib/format'
import './Commande.css'

function Confirmation() {
  const { reference } = useParams()
  const location = useLocation()
  const total = (location.state as { total?: number } | null)?.total

  return (
    <>
      <Header />
      <main className="commande-page">
        <h1>Commande <span className="accent">reçue</span></h1>
        <p className="texte">
          Merci. Votre numéro de commande est <strong>{reference}</strong>.
          {total !== undefined && <> Montant : <strong>{formatPrix(total)}</strong>.</>}
        </p>
        <p className="texte">
          Nous vous appelons dans les plus brefs délais pour confirmer la livraison et le paiement.
          Gardez ce numéro de commande.
        </p>
        <Link to="/catalogue" className="bouton-lien principal">Continuer mes achats</Link>
      </main>
      <Footer />
    </>
  )
}

export default Confirmation