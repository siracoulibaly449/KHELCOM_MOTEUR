import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CarteMoteur from '../components/CarteMoteur'
import { supabase } from '../lib/supabase'
import type { Moteur } from '../data/moteurs'
import './Catalogue.css'

function Catalogue() {
  const [moteurs, setMoteurs] = useState<Moteur[]>([])
  const [recherche, setRecherche] = useState('')
  const [etat, setEtat] = useState('Tous')
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    supabase
      .from('moteurs')
      .select('*')
      .order('id')
      .then(({ data, error }) => {
        if (error) console.error(error)
        setMoteurs(
          (data ?? []).map((m) => ({
            id: m.id,
            nom: m.nom,
            code: m.code,
            etat: m.etat,
            compatibilite: m.compatibilite,
            prix: m.prix,
            kilometrage: m.kilometrage ?? undefined,
          }))
        )
        setChargement(false)
      })
  }, [])

  const filtres = moteurs.filter((m) => {
    const correspondTexte = (m.nom + ' ' + m.code + ' ' + m.compatibilite)
      .toLowerCase()
      .includes(recherche.toLowerCase())
    const correspondEtat = etat === 'Tous' || m.etat === etat
    return correspondTexte && correspondEtat
  })

  return (
    <>
      <Header />
      <main className="catalogue">
        <h1 className="catalogue-titre">
          Catalogue <span style={{ color: 'var(--accent)' }}>moteurs</span>
        </h1>

        <div className="catalogue-filtres">
          <input
            placeholder="Rechercher un moteur, un code, un véhicule"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            style={champ}
          />
          <select value={etat} onChange={(e) => setEtat(e.target.value)} style={champ}>
            <option>Tous</option>
            <option>Neuf</option>
            <option>Occasion</option>
            <option>Reconditionné</option>
          </select>
        </div>

        {chargement ? (
          <p>Chargement des moteurs…</p>
        ) : filtres.length === 0 ? (
          <p style={{ color: 'var(--texte-doux)' }}>Aucun moteur ne correspond à votre recherche.</p>
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

const champ = {
  padding: 13,
  minHeight: 48,
  minWidth: 240,
  background: 'var(--carte)',
  color: 'var(--texte)',
  border: '1px solid var(--bordure)',
  borderRadius: 12,
  fontSize: 15,
}

export default Catalogue