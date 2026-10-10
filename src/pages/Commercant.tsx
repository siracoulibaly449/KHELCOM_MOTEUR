import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Commercant.css'
import AjouterMoteur from '../components/AjouterMoteur'
import ListeCommandes from '../components/ListeCommandes'
import { formatPrix } from '../lib/format'
import type { Moteur } from '../data/moteurs'

const statuts = ['Disponible', 'Réservé', 'En préparation', 'Vendu']

function Commercant() {
  const navigate = useNavigate()
  const [lignes, setLignes] = useState<Moteur[]>([])
  const [ajoutOuvert, setAjoutOuvert] = useState(false)
  const [moteurEdite, setMoteurEdite] = useState<Moteur | null>(null)
  const [message, setMessage] = useState('')
  const [vue, setVue] = useState<'moteurs' | 'commandes'>('moteurs')

  async function charger() {
    const { data, error } = await supabase.from('moteurs').select('*').order('id')
    if (error) {
      setMessage('Impossible de charger les moteurs : ' + error.message)
      return
    }
    setLignes((data ?? []) as Moteur[])
  }

  // Chargement initial : l'effet ne fait que lancer la requête
  useEffect(() => {
    let annule = false
    supabase
      .from('moteurs')
      .select('*')
      .order('id')
      .then(({ data, error }) => {
        if (annule) return
        if (error) {
          setMessage('Impossible de charger les moteurs : ' + error.message)
          return
        }
        setLignes((data ?? []) as Moteur[])
      })
    return () => {
      annule = true
    }
  }, [])

  async function changerStatut(ligne: Moteur, nouveau: string) {
    setMessage('')
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('moteurs')
      .update({ disponibilite: nouveau })
      .eq('id', ligne.id)

    if (error) {
      setMessage('Modification refusée : ' + error.message)
      return
    }

    const { error: erreurHistorique } = await supabase
      .from('historique_statuts')
      .insert({
        moteur_id: ligne.id,
        ancien_statut: ligne.disponibilite,
        nouveau_statut: nouveau,
        modifie_par: user?.id,
      })

    if (erreurHistorique) {
      setMessage("Statut modifié, mais l'historique n'a pas pu être enregistré.")
    }

    charger()
  }

  async function deconnexion() {
    await supabase.auth.signOut()
    navigate('/connexion')
  }

  const compte = (s: string) => lignes.filter((l) => l.disponibilite === s).length

  return (
    <div className="admin">
      <aside className="admin-menu">
        <div className="admin-logo">MOTEURS<span>.</span>PRO</div>
        <a className={vue === 'moteurs' ? 'actif' : ''} onClick={() => setVue('moteurs')}>Tableau de bord</a>
        <a className={vue === 'commandes' ? 'actif' : ''} onClick={() => setVue('commandes')}>Commandes</a>
        <span className="bientot">Stocks (bientôt)</span>
        <span className="bientot">Clients et retours (bientôt)</span>
        <Link to="/catalogue">Voir le catalogue</Link>
        <Link to="/commercant/compte">Mon compte</Link>
        <button className="admin-deconnexion" onClick={deconnexion}>Se déconnecter</button>
      </aside>

      <main className="admin-principal">
        {vue === 'commandes' ? (
          <>
            <h1>Commandes</h1>
            <ListeCommandes />
          </>
        ) : (
          <>
            <div className="entete-page">
              <h1>Mes moteurs</h1>
              {!ajoutOuvert && (
                <button
                  className="bouton-ajouter"
                  onClick={() => { setMoteurEdite(null); setAjoutOuvert(true) }}
                >
                  + Ajouter un moteur
                </button>
              )}
            </div>

            {message && <p className="erreur">{message}</p>}

            {ajoutOuvert && (
              <AjouterMoteur
                moteurInitial={moteurEdite}
                onAjoute={() => { setAjoutOuvert(false); setMoteurEdite(null); charger() }}
                onAnnuler={() => { setAjoutOuvert(false); setMoteurEdite(null) }}
              />
            )}

            <div className="indicateurs">
              <div><span>Total</span><strong>{lignes.length}</strong></div>
              <div><span>Disponibles</span><strong style={{ color: 'var(--succes)' }}>{compte('Disponible')}</strong></div>
              <div><span>Réservés</span><strong style={{ color: 'var(--ambre)' }}>{compte('Réservé')}</strong></div>
              <div><span>Vendus</span><strong style={{ color: 'var(--bleu)' }}>{compte('Vendu')}</strong></div>
            </div>

            <section className="tableau">
              <div className="tableau-tete">
                <span>Moteur</span><span>Prix</span><span>Statut et actions</span>
              </div>
              {lignes.map((l) => (
                <div key={l.id} className="tableau-ligne">
                  <div>
                    <strong>{l.nom}</strong>
                    <div className="sous-ligne">Code {l.code} · {l.vehicule_origine ?? 'véhicule non renseigné'}</div>
                  </div>
                  <span>{formatPrix(l.prix)}</span>
                  <div className="actions-ligne">
                    <select value={l.disponibilite} onChange={(e) => changerStatut(l, e.target.value)}>
                      {statuts.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <button
                      className="bouton-modifier"
                      onClick={() => { setMoteurEdite(l); setAjoutOuvert(true) }}
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Commercant