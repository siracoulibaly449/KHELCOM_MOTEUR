import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

function MotDePasseOublie() {
  const [email, setEmail] = useState('')
  const [envoye, setEnvoye] = useState(false)

  async function envoyer(e: FormEvent) {
    e.preventDefault()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nouveau-mot-de-passe`,
    })
    // Message identique dans tous les cas : on ne révèle pas si le compte existe
    setEnvoye(true)
  }

  return (
    <main className="page-simple">
      <h1>Mot de <span className="accent">passe oublié</span></h1>
      {envoye ? (
        <p>Si un compte existe pour cette adresse, un lien de réinitialisation vient d'être envoyé.</p>
      ) : (
        <form onSubmit={envoyer} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
          <label>E-mail
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button type="submit" className="bouton-ajouter">Envoyer le lien</button>
        </form>
      )}
    </main>
  )
}

export default MotDePasseOublie