import './Hero.css'
import RechercheVehicule from './RechercheVehicule'
import { Link } from 'react-router-dom'


function Hero() {
  return (
    <section className="hero">
      <div className="hero-grille">
        <div className="hero-texte">
          <p className="badge">Compatibilité garantie</p>
          <h1>
            Le bon moteur.
            <br />
            <span className="accent">La bonne pièce.</span>
          </h1>
          <p className="sous-titre">
            Moteurs d'occasion, avec le véhicule d'origine, le kilométrage et le statut du titre indiqués sur chaque fiche.
            Réservez avec un acompte.
          </p>
          <div className="boutons">
            <button className="bouton-principal">Trouver ma pièce</button>
            <Link to="/catalogue" className="bouton-secondaire">Voir les moteurs</Link>
          </div>
        </div>
        <RechercheVehicule />
      </div>
    </section>
  )
}

export default Hero