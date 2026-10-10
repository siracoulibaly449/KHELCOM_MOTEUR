import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { usePanier } from '../context/usePanier'
import Logo from '../components/Logo'
import './Connexion.css'

function Connexion() {
  const navigate = useNavigate()
  const { vider } = usePanier()
  const emailRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [voir, setVoir] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')
  const [secousse, setSecousse] = useState(0)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  async function connecter(e: FormEvent) {
    e.preventDefault()
    setErreur('')
    setChargement(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: motDePasse,
    })

    setChargement(false)

    if (error) {
      setErreur('Adresse e-mail ou mot de passe incorrect.')
      setSecousse((s) => s + 1)
      setMotDePasse('')
      return
    }

    vider()
    navigate('/commercant')
  }

  return (
    <main className="cnx">
      <section className="cnx-marque" aria-hidden="true">
        <div className="cnx-marque-haut">
          <Logo />
        </div>
        <div className="cnx-marque-corps">
          <p className="cnx-kicker">Espace professionnel</p>
          <h2>Gérez votre stock en toute simplicité</h2>
          <p className="cnx-marque-texte">
            Fiches moteurs, photos, statuts de disponibilité et suivi des réservations, depuis un seul tableau de bord.
          </p>
          <Link to="/" className="cnx-marque-retour">← Retour à l'accueil</Link>
        </div>
        <p className="cnx-marque-pied">Accès réservé aux comptes autorisés.</p>
      </section>

      <section className="cnx-panneau">
        <div className="cnx-carte">
          <header className="cnx-entete">
            <h1>Connexion</h1>
            <p>Saisissez les identifiants fournis par l'administrateur.</p>
          </header>

          <form onSubmit={connecter} className="cnx-form" noValidate={false}>
            <div className="cnx-champ">
              <label htmlFor="cnx-email">Adresse e-mail</label>
              <div className="cnx-saisie">
                <svg className="cnx-icone" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 6h16v12H4z M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
                <input
                  id="cnx-email"
                  ref={emailRef}
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="nom@entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="cnx-champ">
              <label htmlFor="cnx-mdp">Mot de passe</label>
              <div className="cnx-saisie">
                <svg className="cnx-icone" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <input
                  id="cnx-mdp"
                  type={voir ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Votre mot de passe"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                />
                <button
                  type="button"
                  className="cnx-voir"
                  onClick={() => setVoir((v) => !v)}
                  aria-label={voir ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {voir ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            {erreur && (
              <p key={secousse} className="cnx-erreur secouer" role="alert">
                <span aria-hidden="true">!</span>
                {erreur}
              </p>
            )}

            <button type="submit" className="cnx-bouton" disabled={chargement}>
              {chargement && <span className="cnx-chargement" aria-hidden="true" />}
              {chargement ? 'Vérification…' : 'Se connecter'}
            </button>
          </form>

          <div className="cnx-liens">
            <Link to="/mot-de-passe-oublie">Mot de passe oublié ?</Link>
          </div>
        </div>

        <p className="cnx-mention">© {new Date().getFullYear()} KHELCOM-MOTORS</p>
      </section>
    </main>
  )
}

export default Connexion