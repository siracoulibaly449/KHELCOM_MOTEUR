import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { usePanier } from '../context/usePanier'
import { supabase } from '../lib/supabase'
import { formatPrix } from '../lib/format'
import './Commande.css'

const modes = ['Wave', 'Espèces']

function Commande() {
  const { articles, total, vider } = usePanier()
  const navigate = useNavigate()
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [adresse, setAdresse] = useState('')
  const [mode, setMode] = useState(modes[0])
  const [accepte, setAccepte] = useState(false)
  const [params, setParams] = useState<Record<string, string>>({})
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    let annule = false
    supabase
      .from('parametres')
      .select('cle, valeur')
      .then(({ data }) => {
        if (annule || !data) return
        setParams(Object.fromEntries(data.map((p) => [p.cle, p.valeur])))
      })
    return () => {
      annule = true
    }
  }, [])

  const pourcentage = Number(params.acompte_pourcentage ?? 0)
  const acompte = Math.round((total * pourcentage) / 100)

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

    const commande = data as { reference: string; total: number; acompte: number; expire_le: string }
    vider()
    navigate(`/confirmation/${commande.reference}`, { state: commande })
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
        <h1>Réserver <span className="accent">mon moteur</span></h1>

        <div className="commande-grille">
          <form className="commande-form" onSubmit={valider}>
            <label>Nom complet
              <input required value={nom} onChange={(e) => setNom(e.target.value)} />
            </label>
            <label>Téléphone
              <input required type="tel" placeholder="+221 …" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
            </label>
            <label>Adresse ou lieu de retrait
              <textarea required rows={3} value={adresse} onChange={(e) => setAdresse(e.target.value)} />
            </label>
            <label>Mode de paiement de l'acompte
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                {modes.map((m) => <option key={m}>{m}</option>)}
              </select>
            </label>

            {Object.keys(params).length > 0 && (
              <div className="info-acompte">
                <p>
                  Pour réserver, un acompte de <strong>{pourcentage} %</strong> est demandé,
                  soit <strong>{formatPrix(acompte)}</strong>.
                </p>
                <p>
                  La réservation est valable <strong>{params.duree_reservation_jours} jours</strong> pour
                  régler le solde. Passé ce délai, le moteur est remis en vente.
                </p>
              </div>
            )}

            <label className="accord">
              <input type="checkbox" checked={accepte} onChange={(e) => setAccepte(e.target.checked)} />
              <span>
                Je comprends qu'il s'agit d'une vente d'occasion, sans garantie ni retour,
                et que l'acompte est demandé pour réserver le moteur.
              </span>
            </label>

            {erreur && <p className="erreur">{erreur}</p>}

            <button type="submit" className="bouton-lien principal" disabled={envoi || !accepte}>
              {envoi ? 'Envoi en cours…' : 'Confirmer la réservation'}
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
            <div className="recap-ligne">
              <span>Acompte à payer</span>
              <span>{formatPrix(acompte)}</span>
            </div>
            <p className="aide">Vente sans garantie ni retour.</p>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Commande