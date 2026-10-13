import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Commercant.css'
import AjouterMoteur from '../components/AjouterMoteur'
import ListeCommandes from '../components/ListeCommandes'
import { formatPrix } from '../lib/format'
import type { Moteur } from '../data/moteurs'
import Logo from '../components/Logo'

const statuts = ['Disponible', 'Réservé', 'En préparation', 'Vendu']

function Commercant() {
  const navigate = useNavigate()
  const [lignes, setLignes] = useState<Moteur[]>([])
  const [formulaireOuvert, setFormulaireOuvert] = useState(false)
  const [moteurEdite, setMoteurEdite] = useState<Moteur | null>(null)
  const [message, setMessage] = useState('')
  const [vue, setVue] = useState<'moteurs' | 'commandes'>('moteurs')
  const [recherche, setRecherche] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('Tous')
  const [menuOuvert, setMenuOuvert] = useState(false)

  const lignesFiltrees = lignes.filter((l) => {
    const texte = `${l.nom} ${l.code} ${l.vehicule_origine ?? ''} ${l.vin ?? ''}`.toLowerCase()
    const correspondTexte = texte.includes(recherche.trim().toLowerCase())
    const correspondStatut = filtreStatut === 'Tous' || l.disponibilite === filtreStatut
    return correspondTexte && correspondStatut
  })

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

  function ouvrirFormulaire(moteur: Moteur | null) {
    setMoteurEdite(moteur)
    setFormulaireOuvert(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function fermerFormulaire() {
    setFormulaireOuvert(false)
    setMoteurEdite(null)
    charger()
  }

  function choisirVue(nouvelle: 'moteurs' | 'commandes') {
    setVue(nouvelle)
    setFormulaireOuvert(false)
    setMenuOuvert(false)
  }

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

  const couleurCompte = (valeur: number, couleur: string) =>
    valeur === 0 ? 'var(--texte-discret)' : couleur

  return (
    <div className="admin">
      <button
        type="button"
        className="admin-burger"
        aria-expanded={menuOuvert}
        onClick={() => setMenuOuvert(true)}
      >
        ☰ Menu
      </button>

      {menuOuvert && <div className="admin-voile" onClick={() => setMenuOuvert(false)} />}

      <aside className={`admin-menu ${menuOuvert ? 'ouvert' : ''}`}>
        <div className="admin-logo"><Logo /></div>

        <nav className="menu-section" aria-label="Principal">
          <span className="menu-titre">Principal</span>
          <button
            type="button"
            className={`menu-item ${vue === 'moteurs' ? 'actif' : ''}`}
            onClick={() => choisirVue('moteurs')}
          >
            <span className="menu-icone" aria-hidden="true">▦</span>
            Catalogue moteurs
          </button>
          <button
            type="button"
            className={`menu-item ${vue === 'commandes' ? 'actif' : ''}`}
            onClick={() => choisirVue('commandes')}
          >
            <span className="menu-icone" aria-hidden="true">☰</span>
            Commandes
          </button>
        </nav>

        <nav className="menu-section" aria-label="Stock et logistique">
          <span className="menu-titre">Stock et logistique</span>
          <span className="menu-item desactive">
            <span className="menu-icone" aria-hidden="true">▤</span>
            Stocks et alertes
          </span>
          <span className="menu-item desactive">
            <span className="menu-icone" aria-hidden="true">⇄</span>
            Frais de livraison
          </span>
        </nav>

        <nav className="menu-section" aria-label="Espace professionnel">
          <span className="menu-titre">Espace pro</span>
          <span className="menu-item desactive">
            <span className="menu-icone" aria-hidden="true">◇</span>
            Garagistes
          </span>
          <span className="menu-item desactive">
            <span className="menu-icone" aria-hidden="true">↻</span>
            Consignes
          </span>
          <span className="menu-item desactive">
            <span className="menu-icone" aria-hidden="true">▭</span>
            Devis et factures
          </span>
        </nav>

        <nav className="menu-section" aria-label="Compte">
          <span className="menu-titre">Compte</span>
          <Link
            to="/commercant/compte"
            className="menu-item"
            onClick={() => setMenuOuvert(false)}
          >
            <span className="menu-icone" aria-hidden="true">●</span>
            Mon compte
          </Link>
        </nav>

        <button type="button" className="admin-deconnexion" onClick={deconnexion}>
          Se déconnecter
        </button>
      </aside>

      <main className="admin-principal">
        {vue === 'commandes' ? (
          <>
            <h1>Commandes</h1>
            <ListeCommandes />
          </>
        ) : formulaireOuvert ? (
          <AjouterMoteur
            moteurInitial={moteurEdite}
            onAjoute={fermerFormulaire}
            onAnnuler={fermerFormulaire}
          />
        ) : (
          <>
            <div className="entete-page">
              <h1>Mes moteurs</h1>
              <button className="bouton-ajouter" onClick={() => ouvrirFormulaire(null)}>
                + Ajouter un moteur
              </button>
            </div>

            {message && <p className="erreur">{message}</p>}

            <div className="indicateurs">
              <div><span>Total</span><strong>{lignes.length}</strong></div>
              <div>
                <span>Disponibles</span>
                <strong style={{ color: couleurCompte(compte('Disponible'), 'var(--succes)') }}>
                  {compte('Disponible')}
                </strong>
              </div>
              <div>
                <span>Réservés</span>
                <strong style={{ color: couleurCompte(compte('Réservé'), 'var(--succes)') }}>
                  {compte('Réservé')}
                </strong>
              </div>
              <div>
                <span>Vendus</span>
                <strong style={{ color: couleurCompte(compte('Vendu'), 'var(--bleu)') }}>
                  {compte('Vendu')}
                </strong>
              </div>
            </div>

            <div className="barre-recherche">
              <input
                type="search"
                placeholder="Rechercher un moteur, un code, un véhicule, un VIN…"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
              <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
                <option>Tous</option>
                {statuts.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <section className="tableau">
              <div className="tableau-tete">
                <span>Photo</span><span>Moteur</span><span>Prix</span><span>Statut et actions</span>
              </div>
              {lignesFiltrees.map((l) => (
                <div key={l.id} className="tableau-ligne">
                  <div className="miniature-liste">
                    {l.photos && l.photos.length > 0 ? (
                      <img src={l.photos[0]} alt={l.nom} />
                    ) : (
                      <span>Aucune</span>
                    )}
                  </div>
                  <div>
                    <strong>{l.nom}</strong>
                    <div className="sous-ligne">Code {l.code} · {l.vehicule_origine ?? 'véhicule non renseigné'}</div>
                  </div>
                  <span>{formatPrix(l.prix)}</span>
                  <div className="actions-ligne">
                    <select value={l.disponibilite} onChange={(e) => changerStatut(l, e.target.value)}>
                      {statuts.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <button className="bouton-modifier" onClick={() => ouvrirFormulaire(l)}>
                      Modifier
                    </button>
                  </div>
                </div>
              ))}
            </section>

            {lignesFiltrees.length === 0 && (
              <p className="liste-vide">Aucun moteur ne correspond à votre recherche.</p>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Commercant