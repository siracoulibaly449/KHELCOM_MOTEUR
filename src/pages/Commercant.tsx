import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Commercant.css'

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
  const [pret, setPret] = useState(false)

  async function charger() {
    const { data, error } = await supabase
      .from('moteurs')
      .select('id, nom, code, etat, prix, disponibilite')
      .order('id')
    if (error) console.error(error)
    setLignes(data ?? [])
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate('/connexion')
        return
      }
      setPret(true)
      charger()
    })
  }, [])

  async function changerStatut(ligne: Ligne, nouveau: string) {
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('moteurs')
      .update({ disponibilite: nouveau })
      .eq('id', ligne.id)

    if (error) {
      alert('Modification refusée : ' + error.message)
      return
    }

    await supabase.from('historique_statuts').insert({
      moteur_id: ligne.id,
      ancien_statut: ligne.disponibilite,
      nouveau_statut: nouveau,
      modifie_par: user?.id,
    })

    charger()
  }

  async function deconnexion() {
    await supabase.auth.signOut()
    navigate('/connexion')
  }

  if (!pret) return <p style={{ padding: 40 }}>Chargement…</p>

  const compte = (s: string) => lignes.filter((l) => l.disponibilite === s).length

  return (
    <div className="admin">
      <aside className="admin-menu">
        <div className="admin-logo">MOTEURS<span>.</span>PRO</div>
        <a className="actif">Tableau de bord</a>
        <a>Catalogue</a>
        <a>Stocks</a>
        <a>Commandes</a>
        <a>Clients et retours</a>
        <button className="admin-deconnexion" onClick={deconnexion}>Se déconnecter</button>
      </aside>

      <main className="admin-principal">
        <h1>Mes moteurs</h1>

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
              <span>{l.prix.toLocaleString('fr-FR')} €</span>
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