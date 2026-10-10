import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { Moteur } from '../data/moteurs'
import './AjouterMoteur.css'

const BUCKET = 'photos-moteurs'
const TYPES = ['image/jpeg', 'image/png', 'image/webp']
const TAILLE_MAX = 10 * 1024 * 1024

type Props = {
  moteurInitial?: Moteur | null
  onAjoute: () => void
  onAnnuler: () => void
}

// Retrouve le chemin dans le stockage à partir de l'adresse publique de la photo
function cheminDepuisUrl(url: string) {
  return url.split(`/${BUCKET}/`)[1] ?? null
}

function AjouterMoteur({ moteurInitial: m, onAjoute, onAnnuler }: Props) {
  const [nom, setNom] = useState(m?.nom ?? '')
  const [code, setCode] = useState(m?.code ?? '')
  const [compatibilite, setCompatibilite] = useState(m?.compatibilite ?? '')
  const [prix, setPrix] = useState(m ? String(m.prix) : '')
  const [kmMiles, setKmMiles] = useState(m?.kilometrage_miles ? String(m.kilometrage_miles) : '')
  const [disponibilite, setDisponibilite] = useState(m?.disponibilite ?? 'Disponible')
  const [vehiculeOrigine, setVehiculeOrigine] = useState(m?.vehicule_origine ?? '')
  const [vin, setVin] = useState(m?.vin ?? '')
  const [statutTitre, setStatutTitre] = useState(m?.statut_titre ?? 'Propre')
  const [sourceAchat, setSourceAchat] = useState(m?.source_achat ?? '')
  const [compression, setCompression] = useState(m?.compression ?? '')
  const [historique, setHistorique] = useState(m?.historique ?? '')
  const [description, setDescription] = useState(m?.description ?? '')
  const [photosActuelles, setPhotosActuelles] = useState<string[]>(m?.photos ?? [])
  const [nouvellesPhotos, setNouvellesPhotos] = useState<File[]>([])
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')

  function echec(msg: string) {
    setErreur(msg)
    setEnvoi(false)
  }

  function mettreEnPremiere(url: string) {
    setPhotosActuelles((p) => [url, ...p.filter((u) => u !== url)])
  }

  function retirerPhoto(url: string) {
    setPhotosActuelles((p) => p.filter((u) => u !== url))
  }

  async function enregistrer(e: FormEvent) {
    e.preventDefault()
    setErreur('')

    const invalide = nouvellesPhotos.find((f) => !TYPES.includes(f.type) || f.size > TAILLE_MAX)
    if (invalide) {
      setErreur(`« ${invalide.name} » doit être une image JPG, PNG ou WebP de 10 Mo maximum.`)
      return
    }

    setEnvoi(true)

    const donnees = {
      nom,
      code,
      compatibilite,
      prix: Number(prix),
      kilometrage: kmMiles ? Math.round(Number(kmMiles) * 1.609) : null,
      kilometrage_miles: kmMiles ? Number(kmMiles) : null,
      disponibilite,
      etat: 'Occasion',
      vehicule_origine: vehiculeOrigine || null,
      vin: vin || null,
      statut_titre: statutTitre,
      source_achat: sourceAchat || null,
      compression: compression || null,
      historique: historique || null,
      description: description || null,
    }

    let id = m?.id
    if (m) {
      const { error } = await supabase.from('moteurs').update(donnees).eq('id', m.id)
      if (error) return echec('Modification impossible : ' + error.message)
    } else {
      const { data, error } = await supabase
        .from('moteurs')
        .insert({ ...donnees, photos: [] })
        .select('id')
        .single()
      if (error || !data) return echec('Enregistrement impossible : ' + error?.message)
      id = data.id
    }

    // Envoi des nouvelles photos
    const ajoutees: string[] = []
    for (const f of nouvellesPhotos) {
      const chemin = `${id}/${Date.now()}-${f.name.replace(/\s+/g, '_')}`
      const { error } = await supabase.storage.from(BUCKET).upload(chemin, f)
      if (error) {
        return echec(`La photo « ${f.name} » n'a pas pu être envoyée. Les informations sont enregistrées : utilisez Annuler puis Modifier pour reprendre les photos.`)
      }
      ajoutees.push(supabase.storage.from(BUCKET).getPublicUrl(chemin).data.publicUrl)
    }

    // Suppression du stockage des photos retirées
    const retirees = (m?.photos ?? []).filter((u) => !photosActuelles.includes(u))
    for (const u of retirees) {
      const chemin = cheminDepuisUrl(u)
      if (chemin) await supabase.storage.from(BUCKET).remove([chemin])
    }

    const { error: erreurPhotos } = await supabase
      .from('moteurs')
      .update({ photos: [...photosActuelles, ...ajoutees] })
      .eq('id', id)
    if (erreurPhotos) return echec('Photos non enregistrées : ' + erreurPhotos.message)

    setEnvoi(false)
    onAjoute()
  }

  return (
    <form className="formulaire" onSubmit={enregistrer}>
      <h2>{m ? 'Modifier le moteur' : 'Ajouter un moteur'}</h2>

      <div className="grille-champs">
        <label>Nom du moteur
          <input required value={nom} onChange={(e) => setNom(e.target.value)} placeholder="ex. Moteur 3.6 V6 283 ch" />
        </label>
        <label>Code moteur
          <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="ex. ERB" />
        </label>
        <label>Compatibilité
          <input required value={compatibilite} onChange={(e) => setCompatibilite(e.target.value)} placeholder="ex. Jeep Grand Cherokee, Dodge Durango" />
        </label>
        <label>Véhicule d'origine
          <input value={vehiculeOrigine} onChange={(e) => setVehiculeOrigine(e.target.value)} placeholder="ex. Jeep Grand Cherokee 2014" />
        </label>
        <label>Prix (FCFA)
          <input required type="number" min="0" value={prix} onChange={(e) => setPrix(e.target.value)} />
        </label>
        <label>Kilométrage (miles, compteur US)
          <input type="number" min="0" value={kmMiles} onChange={(e) => setKmMiles(e.target.value)} />
        </label>
        <label>Statut du titre
          <select value={statutTitre} onChange={(e) => setStatutTitre(e.target.value)}>
            <option>Propre</option>
            <option>Endommagé réparé</option>
            <option>Autre</option>
          </select>
        </label>
        <label>Disponibilité
          <select value={disponibilite} onChange={(e) => setDisponibilite(e.target.value)}>
            <option>Disponible</option>
            <option>Réservé</option>
            <option>En préparation</option>
            <option>Vendu</option>
          </select>
        </label>
        <label>VIN
          <input value={vin} maxLength={17} onChange={(e) => setVin(e.target.value.toUpperCase())} />
        </label>
        <label>Source d'achat
          <input value={sourceAchat} onChange={(e) => setSourceAchat(e.target.value)} placeholder="ex. enchères, casse" />
        </label>
        <label>Compression (si mesurée)
          <input value={compression} onChange={(e) => setCompression(e.target.value)} placeholder="ex. 13 / 13 / 12 / 13 bar" />
        </label>
        <label className="pleine">Historique connu
          <textarea rows={2} value={historique} onChange={(e) => setHistorique(e.target.value)} />
        </label>
        <label className="pleine">Description
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
      </div>

      <div className="bloc-photos">
        <h3>Photos</h3>
        {photosActuelles.length > 0 && (
          <div className="photos-actuelles">
            {photosActuelles.map((url, i) => (
              <figure key={url} className="photo-cellule">
                <img src={url} alt="" />
                {i === 0 && <span className="principale">Principale</span>}
                <div className="photo-actions">
                  {i !== 0 && (
                    <button type="button" onClick={() => mettreEnPremiere(url)}>Mettre en principale</button>
                  )}
                  <button type="button" className="retirer-photo" onClick={() => retirerPhoto(url)}>Retirer</button>
                </div>
              </figure>
            ))}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setNouvellesPhotos(Array.from(e.target.files ?? []))}
        />
        {nouvellesPhotos.length > 0 && (
          <p className="info">{nouvellesPhotos.length} nouvelle(s) photo(s) à envoyer à l'enregistrement.</p>
        )}
      </div>

      {erreur && <p className="erreur">{erreur}</p>}

      <div className="actions-formulaire">
        <button type="submit" className="bouton-principal" disabled={envoi}>
          {envoi ? 'Enregistrement…' : m ? 'Enregistrer les modifications' : 'Publier le moteur'}
        </button>
        <button type="button" className="bouton-secondaire" onClick={onAnnuler}>Annuler</button>
      </div>
    </form>
  )
}

export default AjouterMoteur