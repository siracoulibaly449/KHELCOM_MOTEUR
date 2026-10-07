import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import './FicheMoteur.css'

type Fiche = {
  id: number
  nom: string
  code: string
  etat: string
  compatibilite: string
  prix: number
  kilometrage: number | null
  disponibilite: string
  photos: string[] | null
  description: string | null
}

function FicheMoteur() {
  const { id } = useParams()
  const [fiche, setFiche] = useState<Fiche | null>(null)
  const [chargement, setChargement] = useState(true)
  const [photoActive, setPhotoActive] = useState(0)

  useEffect(() => {
    let annule = false

    supabase
      .from('moteurs')
      .select('id, nom, code, etat, compatibilite, prix, kilometrage, disponibilite, photos, description')
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
                <span className="etat">{fiche.etat}{fiche.kilometrage ? ` · ${fiche.kilometrage.toLocaleString('fr-FR')} km` : ''}</span>
                <h1>{fiche.nom}</h1>
                <p className="code">Code moteur : {fiche.code}</p>

                <p className="prix">{fiche.prix.toLocaleString('fr-FR')} €</p>

                {fiche.disponibilite === 'En préparation' && (
                  <p className="bientot-dispo">Bientôt disponible : ce moteur ne peut pas encore être commandé.</p>
                )}

                <div className="compatibilite">
                  <h2>Véhicules compatibles</h2>
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
                  <p>Garantie et retours : conditions indiquées sur la page <Link to="/garanties">Garanties</Link>.</p>
                </div>

                <div className="actions-fiche">
                  <button className="fiche-bouton principal" disabled={fiche.disponibilite !== 'Disponible'}>
                    Ajouter au panier
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