import './Confiance.css'

const arguments_ = [
  { titre: 'Origine indiquée', texte: 'Véhicule d\'origine, kilométrage et statut du titre sur chaque fiche.' },
  { titre: 'Réservation', texte: 'Réservez votre moteur avec un acompte. Les modalités sont indiquées à la commande.' },
  { titre: 'Vente sans retour', texte: 'Vente d\'occasion sans garantie ni retour. Vérifiez la fiche avant de commander.' },
]

function Confiance() {
  return (
    <section className="confiance">
      {arguments_.map((a) => (
        <div key={a.titre}>
          <h3>{a.titre}</h3>
          <p>{a.texte}</p>
        </div>
      ))}
    </section>
  )
}

export default Confiance