import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Commercant.css'

function MonCompte() {
  const [nouveau, setNouveau] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [message, setMessage] = useState('')
  const [erreur, setErreur] = useState('')

  async function changerMotDePasse(e: FormEvent) {
    e.preventDefault()
    setMessage('')
    setErreur('')

    if (nouveau.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (nouveau !== confirmation) {
      setErreur('Les deux mots de passe ne correspondent pas.')
      return
    }

    const { error } = await supabase.auth.updateUser({ password: nouveau })
    if (error) {
      setErreur('Modification impossible : ' + error.message)
      return
    }
    setNouveau('')
    setConfirmation('')
    setMessage('Votre mot de passe a été modifié.')
  }

  return (
    <div className="admin">
      <aside className="admin-menu">
        <div className="admin-logo">MOTEURS<span>.</span>PRO</div>
        <Link to="/commercant">Retour au tableau de bord</Link>
      </aside>

      <main className="admin-principal">
        <h1>Mon compte</h1>

        <form className="formulaire" onSubmit={changerMotDePasse}>
          <h2>Changer mon mot de passe</h2>
          <label>Nouveau mot de passe
            <input type="password" required value={nouveau} onChange={(e) => setNouveau(e.target.value)} />
          </label>
          <label>Confirmer le mot de passe
            <input type="password" required value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
          </label>
          {erreur && <p className="erreur">{erreur}</p>}
          {message && <p className="succes">{message}</p>}
          <button type="submit" className="bouton-ajouter">Enregistrer</button>
        </form>
      </main>
    </div>
  )
}

export default MonCompte