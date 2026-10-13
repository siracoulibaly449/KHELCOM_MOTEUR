import { Link } from 'react-router-dom'
import { useMoteurs } from '../data/useMoteurs'
import RechercheVehicule from './RechercheVehicule'
import './Hero.css'

function Hero() {
  const { moteurs, chargement } = useMoteurs()
  const disponibles = moteurs.filter((m) => m.disponibilite === 'Disponible').length

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-texte">
          <span className="etiquette">Moteurs importés des États-Unis</span>

          <h1 className="hero-titre">
            Des moteurs <span className="accent">américains</span> de qualité.
          </h1>
          <p className="hero-sous-titre">
            Chaque moteur est présenté avec son véhicule d'origine, son kilométrage et le statut de son titre.
            Réservez le vôtre avec un acompte.
          </p>

          <div className="hero-actions">
            <Link to="/catalogue" className="hero-cta">Voir les moteurs</Link>
            <Link to="/garanties" className="hero-cta-2">Conditions de vente</Link>
          </div>

          <dl className="hero-stats">
            <div>
              <dt>Moteurs disponibles</dt>
              <dd>{chargement ? '…' : disponibles}</dd>
            </div>
            <div>
              <dt>Provenance</dt>
              <dd>États-Unis</dd>
            </div>
            <div>
              <dt>Réservation</dt>
              <dd>Avec acompte</dd>
            </div>
          </dl>
        </div>

        <RechercheVehicule />
      </div>
    </section>
  )
}

export default Hero