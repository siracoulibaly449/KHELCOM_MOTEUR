import { Link } from 'react-router-dom'
import CarteMoteur from './CarteMoteur'
import { useMoteurs } from '../data/useMoteurs'
import './MoteursEnStock.css'

// Nombre de moteurs affichés sur l'accueil
const LIMITE_ACCUEIL = 6

function MoteursEnStock() {
  const { moteurs, chargement, erreur } = useMoteurs()

  const disponibles = moteurs.filter((m) => m.disponibilite === 'Disponible')
  const affiches = disponibles.slice(0, LIMITE_ACCUEIL)

  return (
    <section className="stock">
      <div className="stock-entete">
        <div>
          <span className="etiquette">Stock disponible</span>
          <h2>Moteurs <span className="accent">en stock</span></h2>
        </div>
        <Link to="/catalogue" className="tout-voir">Tout voir →</Link>
      </div>

      {erreur ? (
        <p className="erreur">{erreur}</p>
      ) : chargement ? (
        <p>Chargement des moteurs…</p>
      ) : affiches.length === 0 ? (
        <p className="liste-vide">Aucun moteur disponible pour le moment.</p>
      ) : (
        <div className="stock-grille">
          {affiches.map((moteur) => (
            <CarteMoteur key={moteur.id} moteur={moteur} />
          ))}
        </div>
      )}
    </section>
  )
}

export default MoteursEnStock