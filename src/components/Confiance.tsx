import { Link } from 'react-router-dom'
import './Confiance.css'

const etapes = [
  { titre: 'Choisissez', texte: "Consultez la fiche : véhicule d'origine, kilométrage, statut du titre." },
  { titre: 'Réservez', texte: "Versez l'acompte. Le moteur est bloqué pour vous pendant la durée indiquée." },
  { titre: 'Récupérez', texte: 'Réglez le solde et prenez possession de votre moteur.' },
]

const engagements = [
  {
    num: '01',
    titre: 'Origine indiquée',
    texte: "Véhicule d'origine, kilométrage d'origine et historique connu figurent sur chaque fiche.",
  },
  {
    num: '02',
    titre: 'Titre transparent',
    texte: "Le statut du titre est affiché clairement, y compris lorsqu'un véhicule a été endommagé puis réparé.",
  },
  {
    num: '03',
    titre: 'Réservation encadrée',
    texte: 'Un acompte bloque le moteur pendant une durée définie. Les conditions sont lisibles avant de payer.',
  },
]

function Confiance() {
  return (
    <section className="conf-section">
      <div className="conf-inner">
        <div className="conf-entete">
          <span className="etiquette">Comment ça marche</span>
          <h2>Trois étapes, <span className="accent">sans surprise</span></h2>
        </div>

        <ol className="conf-etapes">
          {etapes.map((e, i) => (
            <li key={e.titre} className="conf-etape">
              <span className="conf-etape-num">{i + 1}</span>
              <div>
                <h3>{e.titre}</h3>
                <p>{e.texte}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="conf-entete conf-entete-2">
          <span className="etiquette">Nos engagements</span>
          <h2>Un achat clair, <span className="accent">du début à la fin</span></h2>
        </div>

        <div className="conf-grille">
          {engagements.map((e) => (
            <article key={e.num} className="conf-carte">
              <span className="conf-num">{e.num}</span>
              <h3>{e.titre}</h3>
              <p>{e.texte}</p>
            </article>
          ))}
        </div>

        <div className="conf-cta">
          <div>
            <h3>Vous cherchez un moteur précis ?</h3>
            <p>Indiquez le modèle, l'année et le code moteur : nous vérifions la disponibilité.</p>
          </div>
          <Link to="/contact" className="conf-bouton">Nous écrire</Link>
        </div>
      </div>
    </section>
  )
}

export default Confiance