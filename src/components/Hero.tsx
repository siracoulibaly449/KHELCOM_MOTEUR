import './Hero.css'
import RechercheVehicule from './RechercheVehicule'

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
            Moteurs neufs, reconditionnés ou d'occasion, et pièces détachées.
            Choisissez votre véhicule, on ne vous montre que ce qui lui va.
          </p>
          <div className="boutons">
            <button className="bouton-principal">Trouver ma pièce</button>
            <button className="bouton-secondaire">Voir les moteurs</button>
          </div>
        </div>
        <RechercheVehicule />
      </div>
    </section>
  )
}

export default Hero