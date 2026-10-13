import Header from '../components/Header'
import Footer from '../components/Footer'

function Garanties() {
  return (
    <>
      <Header />
      <main className="page-simple">
        <h1>Conditions <span className="accent">de vente</span></h1>
        <p>
          Tous nos moteurs sont importés des États-Unis, d'occasion, et vendus sans garantie ni retour.
          Chaque fiche indique le véhicule d'origine, le kilométrage et le statut du titre.
        </p>
        <p>
          Pour réserver un moteur, un acompte est demandé à la commande. Son montant et la durée de la réservation
          sont indiqués au moment de commander. Un moteur dont l'acompte n'est pas réglé dans le délai est remis en vente.
        </p>
        <p>Modes de paiement acceptés : Wave et espèces.</p>
      </main>
      <Footer />
    </>
  )
}

export default Garanties