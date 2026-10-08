import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Commercant.css'
import AjouterMoteur from '../components/AjouterMoteur'
import { formatPrix } from '../lib/format'

type Ligne = {
  id: number
  nom: string
  code: string
  etat: string
  prix: number
  disponibilite: string
}

const statuts = ['Disponible', 'En préparation', 'Vendu']

function Commercant() {
  const navigate = useNavigate()
  const [lignes, setLignes] = useState<Ligne[]>([])
  const [ajoutOuvert, setAjoutOuvert] = useState(false)
  const [message, setMessage] = useState('')

  const charger = useCallback(async () => {
    const { data, error } = await supabase
      .from('moteurs')
      .select('id, nom, code, etat, prix, disponibilite')
      .order('id')
    if (error) {
      setMessage('Impossible de charger les moteurs : ' + error.message)
      return
    }
    setLignes(data ?? [])
  }, [])

  // Chargement initial : l'effet ne fait que lancer la requête
  useEffect(() => {
    let annule = false
    supabase
      .from('moteurs')
      .select('id, nom, code, etat, prix, disponibilite')
      .order('id')
      .then(({ data, error }) => {
        if (annule) return
        if (error) {
          setMessage('Impossible de charger les moteurs : ' + error.message)
          return
        }
        setLignes(data ?? [])
      })
    return () => {
      annule = true
    }
  }, [])

  async function changerStatut(ligne: Ligne, nouveau: string) {
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
        <a className="actif">Tableau de bord</a>
        <Link to="/catalogue">Voir le catalogue client</Link>
        <span className="bientot">Stocks (bientôt)</span>
        <span className="bientot">Commandes (bientôt)</span>
        <span className="bientot">Clients et retours (bientôt)</span>
        <button className="admin-deconnexion" onClick={deconnexion}>Se déconnecter</button>
      </aside>

      <main className="admin-principal">
        <div className="entete-page">
          <h1>Mes moteurs</h1>
          {!ajoutOuvert && (
            <button className="bouton-ajouter" onClick={() => setAjoutOuvert(true)}>
              + Ajouter un moteur
            </button>
          )}
        </div>

        {message && <p className="erreur">{message}</p>}

        {ajoutOuvert && (
          <AjouterMoteur
            onAjoute={() => { setAjoutOuvert(false); charger() }}
            onAnnuler={() => setAjoutOuvert(false)}
          />
        )}

        <div className="indicateurs">
          <div><span>Total</span><strong>{lignes.length}</strong></div>
          <div><span>Disponibles</span><strong style={{ color: 'var(--succes)' }}>{compte('Disponible')}</strong></div>
          <div><span>En préparation</span><strong style={{ color: 'var(--ambre)' }}>{compte('En préparation')}</strong></div>
          <div><span>Vendus</span><strong style={{ color: 'var(--bleu)' }}>{compte('Vendu')}</strong></div>
        </div>

        <section className="tableau">
          <div className="tableau-tete">
            <span>Moteur</span><span>Prix</span><span>Statut</span>
          </div>
          {lignes.map((l) => (
            <div key={l.id} className="tableau-ligne">
              <div>
                <strong>{l.nom}</strong>
                <div className="sous-ligne">Code {l.code} · {l.etat}</div>
              </div>
              <span>{formatPrix(l.prix)}</span>
              <select
                value={l.disponibilite}
                onChange={(e) => changerStatut(l, e.target.value)}
              >
                {statuts.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default Commercant