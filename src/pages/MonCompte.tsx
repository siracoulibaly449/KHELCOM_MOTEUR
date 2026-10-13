import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Commercant.css'

type Force = { niveau: 0 | 1 | 2 | 3; libelle: string }

function evaluerForce(mdp: string): Force {
  if (!mdp) return { niveau: 0, libelle: '' }
  let score = 0
  if (mdp.length >= 8) score++
  if (mdp.length >= 12) score++
  if (/[A-Z]/.test(mdp) && /[a-z]/.test(mdp)) score++
  if (/\d/.test(mdp) || /[^A-Za-z0-9]/.test(mdp)) score++
  if (score <= 1) return { niveau: 1, libelle: 'Faible' }
  if (score <= 2) return { niveau: 2, libelle: 'Correct' }
  return { niveau: 3, libelle: 'Solide' }
}

function MonCompte() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [creation, setCreation] = useState('')
  const [derniereConnexion, setDerniereConnexion] = useState('')
  const [nouveau, setNouveau] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [voir, setVoir] = useState(false)
  const [enCours, setEnCours] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'erreur'; texte: string } | null>(null)

  const force = evaluerForce(nouveau)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user
      if (!u) return
      setEmail(u.email ?? '')
      setCreation(u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : '')
      setDerniereConnexion(
        u.last_sign_in_at
          ? new Date(u.last_sign_in_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })
          : ''
      )
    })
  }, [])

  async function changerMotDePasse(e: FormEvent) {
    e.preventDefault()
    setMessage(null)

    if (nouveau.length < 8) {
      setMessage({ type: 'erreur', texte: 'Le mot de passe doit contenir au moins 8 caractères.' })
      return
    }
    if (nouveau !== confirmation) {
      setMessage({ type: 'erreur', texte: 'Les deux mots de passe ne correspondent pas.' })
      return
    }

    setEnCours(true)
    const { error } = await supabase.auth.updateUser({ password: nouveau })
    setEnCours(false)

    if (error) {
      setMessage({ type: 'erreur', texte: 'Modification impossible : ' + error.message })
      return
    }

    setNouveau('')
    setConfirmation('')
    setMessage({ type: 'ok', texte: 'Votre mot de passe a bien été modifié.' })
  }

  async function deconnexion() {
    await supabase.auth.signOut()
    navigate('/connexion')
  }

  const initiale = email ? email.charAt(0).toUpperCase() : '?'

  return (
    <main className="compte">
      <header className="compte-entete">
        <div>
          <span className="etiquette">Espace commerçant</span>
          <h1>Mon compte</h1>
        </div>
        <button type="button" className="compte-deco" onClick={deconnexion}>
          Se déconnecter
        </button>
      </header>

      <section className="compte-carte-identite">
        <div className="compte-avatar" aria-hidden="true">{initiale}</div>
        <div className="compte-identite">
          <span className="compte-label">Adresse e-mail</span>
          <strong>{email || '…'}</strong>
          <span className="compte-badge">Commerçant vérifié</span>
        </div>
        <dl className="compte-infos">
          <div>
            <dt>Compte créé le</dt>
            <dd>{creation || '—'}</dd>
          </div>
          <div>
            <dt>Dernière connexion</dt>
            <dd>{derniereConnexion || '—'}</dd>
          </div>
        </dl>
      </section>

      <section className="compte-bloc">
        <div className="compte-bloc-entete">
          <h2>Sécurité</h2>
          <p>Changez votre mot de passe régulièrement. Il protège l'accès à votre stock.</p>
        </div>

        <form className="compte-form" onSubmit={changerMotDePasse}>
          <label>
            Nouveau mot de passe
            <span className="compte-champ">
              <input
                type={voir ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={nouveau}
                onChange={(e) => setNouveau(e.target.value)}
                placeholder="8 caractères minimum"
              />
              <button
                type="button"
                className="compte-voir"
                onClick={() => setVoir((v) => !v)}
                aria-label={voir ? 'Masquer' : 'Afficher'}
              >
                {voir ? 'Masquer' : 'Afficher'}
              </button>
            </span>
          </label>

          {nouveau && (
            <div className="force" aria-live="polite">
              <div className="force-barres">
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    className={`force-barre ${force.niveau >= n ? `niveau-${force.niveau}` : ''}`}
                  />
                ))}
              </div>
              <span className="force-libelle">Force : {force.libelle}</span>
            </div>
          )}

          <label>
            Confirmer le mot de passe
            <input
              type={voir ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
          </label>

          {message && (
            <p className={`compte-message ${message.type}`} role="status">
              {message.texte}
            </p>
          )}

          <div className="compte-actions">
            <button type="submit" className="compte-bouton" disabled={enCours}>
              {enCours ? 'Enregistrement…' : 'Mettre à jour le mot de passe'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default MonCompte