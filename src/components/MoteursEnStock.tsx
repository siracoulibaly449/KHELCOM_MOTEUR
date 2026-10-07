import CarteMoteur from './CarteMoteur'
import { moteurs } from '../data/moteurs'

function MoteursEnStock() {
  return (
    <section className="stock">
      <div className="stock-entete">
        <h2>Moteurs <span className="accent">en stock</span></h2>
        <a href="#" className="tout-voir">Tout voir →</a>
      </div>
      <div className="stock-grille">
        {moteurs.map((moteur) => (
          <CarteMoteur key={moteur.id} moteur={moteur} />
        ))}
      </div>
    </section>
  )
}

export default MoteursEnStock