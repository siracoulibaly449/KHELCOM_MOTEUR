import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CarteMoteur from '../components/CarteMoteur'
import BoutonRetour from '../components/BoutonRetour'
import { useMoteurs } from '../data/useMoteurs'
import './Catalogue.css'

function Catalogue() {
  const { moteurs, chargement, erreur } = useMoteurs()
  const [recherche, setRecherche] = useState('')
  const [statut, setStatut] = useState('Disponible')

  const filtres = moteurs.filter((m) => {
    const texte = `${m.nom} ${m.code} ${m.compatibilite} ${m.vehicule_origine ?? ''}`.toLowerCase()
    const correspondTexte = texte.includes(recherche.trim().toLowerCase())
    const correspondStatut = statut === 'Tous' || m.disponibilite === statut
    return correspondTexte && correspondStatut
  })

  return (
    <>
      <Header />
      <main className="catalogue">

        <h1 className="catalogue-titre">
          Catalogue <span className="accent">moteurs</span>
        </h1>

        <div className="catalogue-filtres">
          <input
            type="search"
            placeholder="Rechercher un moteur, un code, un véhicule…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
          <select value={statut} onChange={(e) => setStatut(e.target.value)}>
            <option>Disponible</option>
            <option>Tous</option>
          </select>
        </div>

        {erreur ? (
          <p className="erreur">{erreur}</p>
        ) : chargement ? (
          <p>Chargement des moteurs…</p>
        ) : filtres.length === 0 ? (
          <p className="liste-vide">Aucun moteur ne correspond à votre recherche.</p>
        ) : (
          <div className="catalogue-grille">
            {filtres.map((m) => <CarteMoteur key={m.id} moteur={m} />)}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

export default Catalogue