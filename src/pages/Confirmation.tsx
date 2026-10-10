import { Link, useLocation, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { formatPrix } from '../lib/format'
import './Commande.css'

type Etat = { total?: number; acompte?: number; expire_le?: string }

function Confirmation() {
  const { reference } = useParams()
  const location = useLocation()
  const etat = (location.state ?? {}) as Etat

  return (
    <>
      <Header />
      <main className="commande-page">
        <h1>Réservation <span className="accent">reçue</span></h1>
        <p className="texte">
          Votre numéro de réservation est <strong>{reference}</strong>. Gardez-le.
        </p>
        {etat.acompte !== undefined && (
          <p className="texte">
            Acompte à régler : <strong>{formatPrix(etat.acompte)}</strong>
            {etat.total !== undefined && <> sur un total de {formatPrix(etat.total)}</>}.
          </p>
        )}
        {etat.expire_le && (
          <p className="texte">
            Réglez l'acompte avant le <strong>{new Date(etat.expire_le).toLocaleDateString('fr-FR')}</strong>,
            sans quoi le moteur est remis en vente.
          </p>
        )}
        <p className="texte">
          Nous vous appelons pour confirmer le paiement de l'acompte (Wave ou espèces) et les modalités de retrait.
        </p>
        <Link to="/catalogue" className="bouton-lien principal">Continuer mes achats</Link>
      </main>
      <Footer />
    </>
  )
}

export default Confirmation