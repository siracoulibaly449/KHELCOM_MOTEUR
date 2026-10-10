import './CarteMoteur.css'
import type { Moteur } from '../data/moteurs'
import { Link } from 'react-router-dom'
import { formatPrix } from '../lib/format'

function CarteMoteur({ moteur }: { moteur: Moteur }) {
  const photo = moteur.photos?.[0]

  return (
    <article className="carte">
      <Link to={`/moteur/${moteur.id}`} className="carte-image">
        {photo ? (
          <img src={photo} alt={moteur.nom} />
        ) : (
          <span className="sans-photo">Photo bientôt disponible</span>
        )}
      </Link>

      <div className="carte-corps">
        <span className="badge-etat">
          Occasion
          {moteur.kilometrage ? ` · ${moteur.kilometrage.toLocaleString('fr-FR')} km` : ''}
        </span>

        <h3>{moteur.nom}</h3>

        <p className="compatibilite">
          {moteur.vehicule_origine
            ? `Démonté d'un ${moteur.vehicule_origine}`
            : `Code ${moteur.code} · ${moteur.compatibilite}`}
        </p>

        {moteur.statut_titre === 'Endommagé réparé' && (
          <span className="alerte-titre">Titre endommagé réparé</span>
        )}

        <div className="carte-bas">
          <span className="prix">{formatPrix(moteur.prix)}</span>
          <Link to={`/moteur/${moteur.id}`} className="voir-fiche">Voir la fiche</Link>
        </div>
      </div>
    </article>
  )
}

export default CarteMoteur