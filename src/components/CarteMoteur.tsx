import './CarteMoteur.css'
import type { Moteur, Etat } from '../data/moteurs'
import { Link } from 'react-router-dom'
import { formatPrix } from '../lib/format'

const couleurs: Record<Etat, string> = {
  Neuf: 'var(--succes)',
  Occasion: 'var(--ambre)',
  Reconditionné: 'var(--bleu)',
}

function CarteMoteur({ moteur }: { moteur: Moteur }) {
  return (
    <article className="carte">
      <div className="carte-image">[PHOTO DU MOTEUR]</div>
      <div className="carte-corps">
        <span
          className="badge-etat"
          style={{ background: couleurs[moteur.etat] }}
        >
          {moteur.etat}
          {moteur.kilometrage ? ` · ${moteur.kilometrage.toLocaleString('fr-FR')} km` : ''}
        </span>
        <h3>{moteur.nom}</h3>
        <p className="compatibilite">Code {moteur.code} · {moteur.compatibilite}</p>
        <div className="carte-bas">
          <span className="prix">{formatPrix(moteur.prix)}</span>
          <Link to={`/moteur/${moteur.id}`} className="voir-fiche">Voir la fiche</Link>
        </div>
      </div>
    </article>
  )
}

export default CarteMoteur