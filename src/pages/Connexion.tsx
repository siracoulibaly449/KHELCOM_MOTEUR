import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Connexion() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')

  async function connecter(e: FormEvent) {
    e.preventDefault()
    setErreur('')
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    })
    if (error) {
      setErreur('E-mail ou mot de passe incorrect.')
      return
    }
    navigate('/commercant')
  }

  return (
    <main style={{ maxWidth: 420, margin: '80px auto', padding: 32, background: 'var(--carte)', border: '1px solid var(--bordure)', borderRadius: 20 }}>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Espace commerçant</h1>
      <form onSubmit={connecter} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label>
          E-mail
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={champ} />
        </label>
        <label>
          Mot de passe
          <input type="password" required value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} style={champ} />
        </label>
        {erreur && <p style={{ color: '#FF7A7A', margin: 0 }}>{erreur}</p>}
        <button type="submit" style={bouton}>Se connecter</button>
      </form>
    </main>
  )
}

const champ = {
  display: 'block',
  width: '100%',
  marginTop: 6,
  padding: 12,
  minHeight: 48,
  background: 'var(--fond)',
  color: 'var(--texte)',
  border: '1px solid var(--bordure)',
  borderRadius: 12,
  boxSizing: 'border-box' as const,
}

const bouton = {
  minHeight: 48,
  background: 'var(--accent)',
  color: '#0E0F12',
  border: 0,
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer',
}

export default Connexion