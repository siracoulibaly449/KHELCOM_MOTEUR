import { useState } from 'react'
import './RechercheVehicule.css'

// Données de test, à remplacer plus tard par la base Supabase
const vehicules: Record<string, Record<string, string[]>> = {
  Volkswagen: { Golf: ['1.6 TDI 105 ch', '2.0 TSI 180 ch'], Passat: ['1.6 TDI 105 ch'] },
  Peugeot: { '308': ['1.2 PureTech 110 ch'], '3008': ['1.2 PureTech 110 ch'] },
}

function RechercheVehicule() {
  const [marque, setMarque] = useState('')
  const [modele, setModele] = useState('')
  const [motorisation, setMotorisation] = useState('')

  const modeles = marque ? Object.keys(vehicules[marque]) : []
  const motorisations = marque && modele ? vehicules[marque][modele] : []

  return (
    <div className="recherche">
      <h2>Mon véhicule</h2>

      <label>
        Marque
        <select value={marque} onChange={(e) => { setMarque(e.target.value); setModele(''); setMotorisation('') }}>
          <option value="">Choisissez une marque</option>
          {Object.keys(vehicules).map((m) => <option key={m}>{m}</option>)}
        </select>
      </label>

      <label>
        Modèle
        <select value={modele} disabled={!marque} onChange={(e) => { setModele(e.target.value); setMotorisation('') }}>
          <option value="">Choisissez un modèle</option>
          {modeles.map((m) => <option key={m}>{m}</option>)}
        </select>
      </label>

      <label>
        Motorisation
        <select value={motorisation} disabled={!modele} onChange={(e) => setMotorisation(e.target.value)}>
          <option value="">Choisissez une motorisation</option>
          {motorisations.map((m) => <option key={m}>{m}</option>)}
        </select>
      </label>

      <button className="voir-pieces" disabled={!motorisation}>
        Voir mes pièces compatibles
      </button>
    </div>
  )
}

export default RechercheVehicule