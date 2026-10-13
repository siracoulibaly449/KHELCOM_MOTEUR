import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CarteMoteur from '../components/CarteMoteur'
import BoutonRetour from '../components/BoutonRetour'
import { useMoteurs } from '../data/useMoteurs'
import { parserVehicule } from '../lib/vehicule'
import './Catalogue.css'

function Catalogue() {
  const { moteurs, chargement, erreur } = useMoteurs()
  const [params, setParams] = useSearchParams()
  const [statut, setStatut] = useState('Disponible')

  const marque = params.get('marque') ?? ''
  const modele = params.get('modele') ?? ''
  const annee = params.get('annee') ?? ''
  const q = params.get('q') ?? ''

  function majParam(cle: string, valeur: string) {
    const p = new URLSearchParams(params)
    if (valeur) p.set(cle, valeur)
    else p.delete(cle)
    setParams(p, { replace: true })
  }

  function retirer(cle: string) {
    majParam(cle, '')
  }

  const filtres = moteurs.filter((m) => {
    const v = parserVehicule(m.vehicule_origine)
    const correspondVehicule =
      (!marque || v?.marque === marque) &&
      (!modele || v?.modele === modele) &&
      (!annee || v?.annee === annee)
    const texte = `${m.nom} ${m.code} ${m.compatibilite} ${m.vehicule_origine ?? ''} ${m.vin ?? ''}`.toLowerCase()
    const correspondTexte = texte.includes(q.trim().toLowerCase())
    const correspondStatut = statut === 'Tous' || m.disponibilite === statut
    return correspondVehicule && correspondTexte && correspondStatut
  })

  const chips = [
    { cle: 'marque', libelle: marque },
    { cle: 'modele', libelle: modele },
    { cle: 'annee', libelle: annee },
    { cle: 'q', libelle: q },
  ].filter((c) => c.libelle)

  function tout_effacer() {
    setParams(new URLSearchParams(), { replace: true })
    setStatut('Disponible')
  }

  return (
    <>
      <Header />
      <main className="catalogue">
        <BoutonRetour libelle="Accueil" />

        <h1 className="catalogue-titre">
          Catalogue <span className="accent">moteurs</span>
        </h1>

        <div className="catalogue-filtres">
          <input
            type="search"
            placeholder="Rechercher un moteur, un code, un véhicule…"
            value={q}
            onChange={(e) => majParam('q', e.target.value)}
          />
          <select value={statut} onChange={(e) => setStatut(e.target.value)}>
            <option>Disponible</option>
            <option>Tous</option>
          </select>
        </div>

        {chips.length > 0 && (
          <div className="catalogue-chips">
            {chips.map((c) => (
              <span key={c.cle} className="chip">
                {c.libelle}
                <button type="button" onClick={() => retirer(c.cle)} aria-label={`Retirer ${c.libelle}`}>
                  ×
                </button>
              </span>
            ))}
            <button type="button" className="chips-effacer" onClick={tout_effacer}>
              Tout effacer
            </button>
          </div>
        )}

        {erreur ? (
          <p className="erreur">{erreur}</p>
        ) : chargement ? (
          <p>Chargement des moteurs…</p>
        ) : filtres.length === 0 ? (
          <div className="liste-vide">
            <p>Aucun moteur ne correspond à cette recherche.</p>
            {chips.length > 0 && (
              <button type="button" className="chips-effacer" onClick={tout_effacer}>
                Voir tout le catalogue
              </button>
            )}
          </div>
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