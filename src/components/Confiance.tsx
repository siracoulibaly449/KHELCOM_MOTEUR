import './Confiance.css'

const arguments_ = [
  { titre: 'Compatibilité vérifiée', texte: "Un doute sur une référence ? Notre équipe valide avec vous avant l'achat." },
  { titre: 'Garantie claire', texte: 'Durée et conditions affichées sur chaque fiche produit.' },
  { titre: 'Retours simplifiés', texte: 'Procédure de retour en quelques étapes depuis votre compte.' },
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