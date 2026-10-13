import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMoteurs } from '../data/useMoteurs'
import { parserVehicule } from '../lib/vehicule'
import './RechercheVehicule.css'

function RechercheVehicule() {
  const navigate = useNavigate()
  const { moteurs, chargement } = useMoteurs()
  const [marque, setMarque] = useState('')
  const [modele, setModele] = useState('')
  const [annee, setAnnee] = useState('')
  const [q, setQ] = useState('')

  // Seuls les moteurs disponibles alimentent les listes
  const disponibles = useMemo(
    () =>
      moteurs
        .filter((m) => m.disponibilite === 'Disponible')
        .map((m) => ({ m, v: parserVehicule(m.vehicule_origine) })),
    [moteurs]
  )

  const marques = useMemo(
    () =>
      [...new Set(disponibles.map((d) => d.v?.marque).filter((x): x is string => !!x))].sort(),
    [disponibles]
  )

  const modeles = useMemo(
    () =>
      [...new Set(
        disponibles
          .filter((d) => d.v?.marque === marque)
          .map((d) => d.v?.modele)
          .filter((x): x is string => !!x)
      )].sort(),
    [disponibles, marque]
  )

  const annees = useMemo(
    () =>
      [...new Set(
        disponibles
          .filter((d) => d.v?.marque === marque && (!modele || d.v?.modele === modele))
          .map((d) => d.v?.annee)
          .filter((x): x is string => !!x)
      )].sort((a, b) => b.localeCompare(a)),
    [disponibles, marque, modele]
  )

  const nombre = useMemo(() => {
    const texte = q.trim().toLowerCase()
    return disponibles.filter(({ m, v }) => {
      const correspondVehicule =
        (!marque || v?.marque === marque) &&
        (!modele || v?.modele === modele) &&
        (!annee || v?.annee === annee)
      const contenu = `${m.nom} ${m.code} ${m.compatibilite} ${m.vehicule_origine ?? ''} ${m.vin ?? ''}`.toLowerCase()
      return correspondVehicule && contenu.includes(texte)
    }).length
  }, [disponibles, marque, modele, annee, q])

  function chercher(e: FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (marque) p.set('marque', marque)
    if (modele) p.set('modele', modele)
    if (annee) p.set('annee', annee)
    if (q.trim()) p.set('q', q.trim())
    navigate(`/catalogue?${p.toString()}`)
  }

  function reinitialiser() {
    setMarque('')
    setModele('')
    setAnnee('')
    setQ('')
  }

  const pluriel = nombre > 1 ? 's' : ''

  return (
    <form className="rv" onSubmit={chercher}>
      <div className="rv-entete">
        <span className="rv-point" aria-hidden="true" />
        <div>
          <h2>Trouver mon moteur</h2>
          <p>Choisissez votre véhicule. Nous ne montrons que les moteurs compatibles.</p>
        </div>
      </div>

      <div className="rv-champs">
        <label>
          Marque
          <select
            value={marque}
            onChange={(e) => {
              setMarque(e.target.value)
              setModele('')
              setAnnee('')
            }}
          >
            <option value="">Toutes les marques</option>
            {marques.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>

        <label>
          Modèle
          <select
            value={modele}
            disabled={!marque}
            onChange={(e) => {
              setModele(e.target.value)
              setAnnee('')
            }}
          >
            <option value="">Tous les modèles</option>
            {modeles.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>

        <label>
          Année
          <select value={annee} disabled={!marque} onChange={(e) => setAnnee(e.target.value)}>
            <option value="">Toutes les années</option>
            {annees.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>

        <label>
          Code moteur, VIN ou mot-clé
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ex. CAYC, 1C4RJ…"
          />
        </label>
      </div>

      <div className="rv-pied">
        <span className="rv-compte" aria-live="polite">
          {chargement ? 'Chargement…' : `${nombre} moteur${pluriel} disponible${pluriel}`}
        </span>
        <div className="rv-actions">
          <button type="button" className="rv-reset" onClick={reinitialiser}>Effacer</button>
          <button type="submit" className="rv-submit" disabled={chargement || nombre === 0}>
            Voir les résultats
          </button>
        </div>
      </div>
    </form>
  )
}

export default RechercheVehicule