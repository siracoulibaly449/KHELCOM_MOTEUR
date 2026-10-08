import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { usePanier } from '../context/usePanier'
import { supabase } from '../lib/supabase'
import { formatPrix } from '../lib/format'
import './Commande.css'

const modes = ['Wave', 'Orange Money', 'Espèces à la livraison', 'Virement']

function Commande() {
  const { articles, total, vider } = usePanier()
  const navigate = useNavigate()
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [adresse, setAdresse] = useState('')
  const [mode, setMode] = useState(modes[0])
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')

  async function valider(e: FormEvent) {
    e.preventDefault()
    setErreur('')
    setEnvoi(true)

    const { data, error } = await supabase.rpc('creer_commande', {
      p_nom: nom,
      p_telephone: telephone,
      p_adresse: adresse,
      p_mode: mode,
      p_moteurs: articles.map((a) => a.id),
    })

    setEnvoi(false)

    if (error || !data) {
      setErreur(error?.message ?? 'Commande impossible, réessayez.')
      return
    }

    const commande = data as { reference: string; total: number }
    vider()
    navigate(`/confirmation/${commande.reference}`, { state: { total: commande.total } })
  }

  if (articles.length === 0) {
    return (
      <>
        <Header />
        <main className="commande-page">
          <h1>Votre panier est vide</h1>
          <Link to="/catalogue" className="bouton-lien principal">Voir le catalogue</Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="commande-page">
        <h1>Finaliser ma <span className="accent">commande</span></h1>

        <div className="commande-grille">
          <form className="commande-form" onSubmit={valider}>
            <label>Nom complet
              <input required value={nom} onChange={(e) => setNom(e.target.value)} />
            </label>
            <label>Téléphone
              <input required type="tel" placeholder="+221 …" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
            </label>
            <label>Adresse de livraison
              <textarea required rows={3} value={adresse} onChange={(e) => setAdresse(e.target.value)} />
            </label>
            <label>Mode de paiement
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                {modes.map((m) => <option key={m}>{m}</option>)}
              </select>
            </label>

            <p className="aide">
              Votre commande sera confirmée par téléphone avant le paiement et l'expédition.
            </p>

            {erreur && <p className="erreur">{erreur}</p>}

            <button type="submit" className="bouton-lien principal" disabled={envoi}>
              {envoi ? 'Envoi en cours…' : 'Confirmer la commande'}
            </button>
          </form>

          <aside className="recap">
            <h2>Récapitulatif</h2>
            {articles.map((a) => (
              <div key={a.id} className="recap-ligne">
                <span>{a.nom}</span>
                <span>{formatPrix(a.prix)}</span>
              </div>
            ))}
            <div className="recap-ligne total">
              <span>Total</span>
              <strong>{formatPrix(total)}</strong>
            </div>
            <p className="aide">Frais de livraison confirmés par téléphone.</p>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Commande