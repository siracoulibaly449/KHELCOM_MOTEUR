import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function NouveauMotDePasse() {
  const navigate = useNavigate()
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')

  async function enregistrer(e: FormEvent) {
    e.preventDefault()
    setErreur('')
    if (motDePasse.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    const { error } = await supabase.auth.updateUser({ password: motDePasse })
    if (error) {
      setErreur('Enregistrement impossible : ' + error.message)
      return
    }
    navigate('/connexion')
  }

  return (
    <main className="page-simple">
      <h1>Nouveau <span className="accent">mot de passe</span></h1>
      <form onSubmit={enregistrer} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
        <label>Mot de passe
          <input type="password" required value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} />
        </label>
        {erreur && <p className="erreur">{erreur}</p>}
        <button type="submit" className="bouton-ajouter">Enregistrer</button>
      </form>
    </main>
  )
}

export default NouveauMotDePasse