import { useEffect, useState } from 'react'
import CarteMoteur from './CarteMoteur'
import { supabase } from '../lib/supabase'
import type { Moteur } from '../data/moteurs'
import './MoteursEnStock.css'
import { Link } from 'react-router-dom'

function MoteursEnStock() {
  const [moteurs, setMoteurs] = useState<Moteur[]>([])
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

  return (
    <section className="stock">
      <div className="stock-entete">
        <h2>Moteurs <span className="accent">en stock</span></h2>
        <Link to="/catalogue" className="tout-voir">Tout voir →</Link>
      </div>
      {chargement ? (
        <p>Chargement des moteurs…</p>
      ) : (
        <div className="stock-grille">
          {moteurs.map((moteur) => (
            <CarteMoteur key={moteur.id} moteur={moteur} />
          ))}
        </div>
      )}
    </section>
  )
}

export default MoteursEnStock