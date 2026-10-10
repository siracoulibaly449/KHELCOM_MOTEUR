import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './ConnexionFlottante.css'

function ConnexionFlottante() {
  const [ouvert, setOuvert] = useState(false)
  const [connecte, setConnecte] = useState(false)
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setConnecte(!!data.session)
    })
    const { data: abonnement } = supabase.auth.onAuthStateChange((_evt, session) => {
      setConnecte(!!session)
    })
    return () => abonnement.subscription.unsubscribe()
  }, [])

  // Fermer l'aperçu à chaque changement de page
  useEffect(() => {
    setOuvert(false)
  }, [location.pathname])

  // Inutile sur la page de connexion et dans l'espace commerçant
  if (location.pathname === '/connexion' || location.pathname.startsWith('/commercant')) {
    return null
  }

  return (
    <div className="connexion-sticker">
      {ouvert && (
        <aside className="connexion-carte" aria-label="Accès espace commerçant">
          <div className="carte-entete">
            <span className="carte-logo">K</span>
            <div>
              <div className="carte-titre">Espace commerçant</div>
              <div className="carte-etat">
                <span className={connecte ? 'point en-ligne' : 'point'} />
                {connecte ? 'Session active' : 'Non connecté'}
              </div>
            </div>
          </div>

          <p className="carte-texte">
            Gérez vos moteurs, vos statuts et vos commandes depuis un seul endroit.
          </p>

          <Link to={connecte ? '/commercant' : '/connexion'} className="carte-bouton">
            {connecte ? 'Ouvrir le tableau de bord' : 'Se connecter'}
          </Link>

        </aside>
      )}

      <button
        type="button"
        className={`connexion-bulle ${ouvert ? 'ouverte' : ''}`}
        aria-expanded={ouvert}
        aria-label={ouvert ? 'Fermer l\'accès espace commerçant' : 'Ouvrir l\'accès espace commerçant'}
        onClick={() => setOuvert((o) => !o)}
      >
        <span className="bulle-anneau" aria-hidden="true" />
        <svg className="bulle-icone" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor" />
        </svg>
      </button>
    </div>
  )
}

export default ConnexionFlottante