import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import './AjouterMoteur.css'

type Props = { onAjoute: () => void; onAnnuler: () => void }

function AjouterMoteur({ onAjoute, onAnnuler }: Props) {
  const [nom, setNom] = useState('')
  const [code, setCode] = useState('')
  const [etat, setEtat] = useState('Occasion')
  const [compatibilite, setCompatibilite] = useState('')
  const [prix, setPrix] = useState('')
  const [kilometrage, setKilometrage] = useState('')
  const [disponibilite, setDisponibilite] = useState('Disponible')
  const [fichiers, setFichiers] = useState<File[]>([])
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')

  async function enregistrer(e: FormEvent) {
    e.preventDefault()
    setErreur('')
    setEnvoi(true)

    // 1. Créer le moteur
    const { data, error } = await supabase
      .from('moteurs')
      .insert({
        nom,
        code,
        etat,
        compatibilite,
        prix: Number(prix),
        kilometrage: kilometrage ? Number(kilometrage) : null,
        disponibilite,
      })
      .select('id')
      .single()

    if (error || !data) {
      setErreur('Enregistrement impossible : ' + error?.message)
      setEnvoi(false)
      return
    }

    // 2. Envoyer les photos
    const adresses: string[] = []
    for (const fichier of fichiers) {
      const chemin = `${data.id}/${Date.now()}-${fichier.name.replace(/\s+/g, '_')}`
      const { error: erreurPhoto } = await supabase.storage
        .from('photos-moteurs')
        .upload(chemin, fichier)
      if (erreurPhoto) {
        setErreur('Une photo n\'a pas pu être envoyée : ' + erreurPhoto.message)
        continue
      }
      const { data: lien } = supabase.storage.from('photos-moteurs').getPublicUrl(chemin)
      adresses.push(lien.publicUrl)
    }

    // 3. Rattacher les photos au moteur
    if (adresses.length > 0) {
      await supabase.from('moteurs').update({ photos: adresses }).eq('id', data.id)
    }

    setEnvoi(false)
    onAjoute()
  }

  return (
    <form className="formulaire" onSubmit={enregistrer}>
      <h2>Ajouter un moteur</h2>

      <div className="grille-champs">
        <label>Nom du moteur
          <input required value={nom} onChange={(e) => setNom(e.target.value)} placeholder="ex. Moteur 1.6 TDI 105 ch" />
        </label>
        <label>Code moteur
          <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="ex. CAYC" />
        </label>
        <label>Compatibilité
          <input required value={compatibilite} onChange={(e) => setCompatibilite(e.target.value)} placeholder="ex. Golf VI, Passat B7" />
        </label>
        <label>Prix (€)
          <input required type="number" min="0" value={prix} onChange={(e) => setPrix(e.target.value)} />
        </label>
        <label>Kilométrage (occasion)
          <input type="number" min="0" value={kilometrage} onChange={(e) => setKilometrage(e.target.value)} />
        </label>
        <label>État
          <select value={etat} onChange={(e) => setEtat(e.target.value)}>
            <option>Neuf</option>
            <option>Occasion</option>
            <option>Reconditionné</option>
          </select>
        </label>
        <label>Disponibilité
          <select value={disponibilite} onChange={(e) => setDisponibilite(e.target.value)}>
            <option>Disponible</option>
            <option>En préparation</option>
            <option>Vendu</option>
          </select>
        </label>
        <label>Photos (JPG, PNG, WebP)
          <input type="file" accept="image/*" multiple onChange={(e) => setFichiers(Array.from(e.target.files ?? []))} />
        </label>
      </div>

      {fichiers.length > 0 && (
        <p className="info">{fichiers.length} photo(s) sélectionnée(s). La première sera l'image principale.</p>
      )}
      {erreur && <p className="erreur">{erreur}</p>}

      <div className="actions-formulaire">
        <button type="submit" className="bouton-principal" disabled={envoi}>
          {envoi ? 'Enregistrement…' : 'Publier le moteur'}
        </button>
        <button type="button" className="bouton-secondaire" onClick={onAnnuler}>Annuler</button>
      </div>
    </form>
  )
}

export default AjouterMoteur