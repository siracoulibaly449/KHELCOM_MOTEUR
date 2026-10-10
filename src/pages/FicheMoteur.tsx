import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import './FicheMoteur.css'
import { usePanier } from '../context/usePanier'
import { formatPrix } from '../lib/format'

type Fiche = {
  id: number
  nom: string
  code: string
  compatibilite: string
  prix: number
  kilometrage: number | null
  disponibilite: string
  photos: string[] | null
  description: string | null
  vehicule_origine: string | null
  pays_origine: string | null
  statut_titre: string | null
  compression: string | null
  historique: string | null
}

function FicheMoteur() {
  const { id } = useParams()
  const [fiche, setFiche] = useState<Fiche | null>(null)
  const [chargement, setChargement] = useState(true)
  const [photoActive, setPhotoActive] = useState(0)
  const { ajouter, articles } = usePanier()
  const dejaDansPanier = fiche ? articles.some((a) => a.id === fiche.id) : false

  useEffect(() => {
    let annule = false

    // Les coûts d'achat et d'import ne sont jamais sélectionnés ici : ils restent internes
    supabase
      .from('moteurs')
      .select('id, nom, code, compatibilite, prix, kilometrage, disponibilite, photos, description, vehicule_origine, pays_origine, statut_titre, compression, historique')
      .eq('id', Number(id))
      .maybeSingle()
      .then(({ data, error }) => {
        if (annule) return
        if (error) console.error(error)
        setFiche(data ?? null)
        setPhotoActive(0)
        setChargement(false)
      })

    return () => {
      annule = true
    }
  }, [id])

  return (
    <>
      <Header />
      <main className="fiche">
        {chargement && <p>Chargement…</p>}

        {!chargement && !fiche && (
          <div className="fiche-vide">
            <h1>Moteur introuvable</h1>
            <p>Ce moteur n'est plus disponible ou le lien est incorrect.</p>
            <Link to="/catalogue" className="fiche-bouton principal">Voir le catalogue</Link>
          </div>
        )}

        {fiche && (
          <>
            <Link to="/catalogue" className="fiche-retour">← Retour au catalogue</Link>

            <div className="fiche-grille">
              <div className="galerie">
                <div className="galerie-principale">
                  {fiche.photos && fiche.photos.length > 0 ? (
                    <img src={fiche.photos[photoActive]} alt={fiche.nom} />
                  ) : (
                    <span>[PHOTO DU MOTEUR]</span>
                  )}
                </div>

                {fiche.photos && fiche.photos.length > 1 && (
                  <div className="miniatures">
                    {fiche.photos.map((url, i) => (
                      <button
                        key={url}
                        className={i === photoActive ? 'miniature active' : 'miniature'}
                        onClick={() => setPhotoActive(i)}
                        aria-label={`Afficher la photo ${i + 1}`}
                      >
                        <img src={url} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="infos">
                <span className="etat">
                  Occasion{fiche.kilometrage ? ` · ${fiche.kilometrage.toLocaleString('fr-FR')} km` : ''}
                </span>
                <h1>{fiche.nom}</h1>
                <p className="code">Code moteur : {fiche.code}</p>

                <p className="prix">{formatPrix(fiche.prix)}</p>

                {fiche.disponibilite === 'Réservé' && (
                  <p className="bientot-dispo">Ce moteur est déjà réservé.</p>
                )}

                <div className="compatibilite">
                  <h2>Moteur d'occasion</h2>
                  <p>
                    Démonté d'un {fiche.vehicule_origine ?? 'véhicule'}
                    {fiche.pays_origine ? `, origine ${fiche.pays_origine}` : ''}
                    {fiche.kilometrage ? `, kilométrage d'origine ${fiche.kilometrage.toLocaleString('fr-FR')} km` : ''}.
                  </p>
                  {fiche.statut_titre && (
                    <p>Titre du véhicule d'origine : <strong>{fiche.statut_titre}</strong>.</p>
                  )}
                  {fiche.statut_titre === 'Endommagé réparé' && (
                    <p className="bientot-dispo">
                      Ce véhicule a été déclaré endommagé avant réparation. Le moteur est vendu tel quel.
                    </p>
                  )}
                  {fiche.compression && <p>Compression : {fiche.compression}</p>}
                  {fiche.historique && <p>{fiche.historique}</p>}
                </div>

                <div className="compatibilite">
                  <h2>Compatibilité</h2>
                  <p>{fiche.compatibilite}</p>
                  <p className="aide">Un doute sur la compatibilité ? Indiquez le numéro de châssis (VIN) lors de votre demande.</p>
                </div>

                {fiche.description && (
                  <div className="description">
                    <h2>Description</h2>
                    <p>{fiche.description}</p>
                  </div>
                )}

                <div className="garanties">
                  <p>
                    Vente d'occasion sans garantie ni retour. <Link to="/garanties">Conditions de vente</Link>.
                  </p>
                </div>

                <div className="actions-fiche">
                  <button
                    className="fiche-bouton principal"
                    disabled={fiche.disponibilite !== 'Disponible' || dejaDansPanier}
                    onClick={() =>
                      ajouter({
                        id: fiche.id,
                        nom: fiche.nom,
                        code: fiche.code,
                        prix: fiche.prix,
                        photo: fiche.photos?.[0] ?? null,
                      })
                    }
                  >
                    {dejaDansPanier ? 'Déjà dans le panier' : 'Réserver ce moteur'}
                  </button>
                  <Link to="/contact" className="fiche-bouton secondaire">Poser une question</Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}

export default FicheMoteur