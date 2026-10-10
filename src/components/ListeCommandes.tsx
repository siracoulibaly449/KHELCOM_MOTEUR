import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatPrix } from '../lib/format'
import './ListeCommandes.css'

type Ligne = { id: number; nom: string; prix: number }

type Commande = {
  id: number
  reference: string
  client_nom: string
  client_telephone: string
  adresse: string
  mode_paiement: string
  total: number
  statut: string
  created_at: string
  commande_lignes: Ligne[]
  acompte: number
  expire_le: string | null
}

const statuts = ['En attente', 'Acompte reçu', 'Confirmée', 'Livrée', 'Annulée', 'Expirée']

function ListeCommandes() {
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [message, setMessage] = useState('')

  const charger = useCallback(async () => {
    const { data, error } = await supabase
      .from('commandes')
      .select('*, commande_lignes(id, nom, prix)')
      .order('created_at', { ascending: false })
    if (error) {
      setMessage('Impossible de charger les commandes : ' + error.message)
      return
    }
    setCommandes((data ?? []) as Commande[])
  }, [])

  // Chargement initial
  useEffect(() => {
    let annule = false
    supabase.rpc('liberer_reservations_expirees').then(() =>
      supabase
        .from('commandes')
        .select('*, commande_lignes(id, nom, prix)')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (annule) return
          if (error) {
            setMessage('Impossible de charger les commandes : ' + error.message)
            return
          }
          setCommandes((data ?? []) as Commande[])
        })
    )
    return () => {
      annule = true
    }
  }, [])

  async function changerStatut(commande: Commande, nouveau: string) {
    setMessage('')
    const { error } = await supabase
      .from('commandes')
      .update({ statut: nouveau })
      .eq('id', commande.id)
    if (error) {
      setMessage('Modification refusée : ' + error.message)
      return
    }
    charger()
  }

  if (commandes.length === 0 && !message) {
    return <p className="liste-vide">Aucune commande pour le moment.</p>
  }

  return (
    <section className="commandes">
      {message && <p className="erreur">{message}</p>}

      {commandes.map((c) => (
        <article key={c.id} className="commande">
          <header className="commande-tete">
            <div>
              <strong>Commande {c.reference}</strong>
              <span className="date">
                {new Date(c.created_at).toLocaleDateString('fr-FR', {
                  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
            <select
              value={c.statut}
              onChange={(e) => changerStatut(c, e.target.value)}
            >
              {statuts.map((s) => <option key={s}>{s}</option>)}
            </select>
          </header>

          <div className="commande-corps">
            <div className="client">
              <p><strong>{c.client_nom}</strong></p>
              <p>{c.client_telephone}</p>
              <p>{c.adresse}</p>
              <p className="paiement">Paiement : {c.mode_paiement}</p>
            </div>

            <ul className="articles">
              {c.commande_lignes.map((l) => (
                <li key={l.id}>
                  <span>{l.nom}</span>
                  <span>{formatPrix(l.prix)}</span>
                </li>
              ))}
            </ul>

            <div className="total">
              <span>Total</span>
              <strong>{formatPrix(c.total)}</strong>
              <span>Acompte : {formatPrix(c.acompte)}</span>
              <span>Reste à payer : {formatPrix(c.total - c.acompte)}</span>
              {c.expire_le && c.statut === 'En attente' && (
                <span>Acompte attendu avant le {new Date(c.expire_le).toLocaleDateString('fr-FR')}</span>
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}

export default ListeCommandes