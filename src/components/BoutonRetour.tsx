import { useNavigate } from 'react-router-dom'

function BoutonRetour({ libelle = 'Retour' }: { libelle?: string }) {
  const navigate = useNavigate()

  function retour() {
    // Revient à la page précédente si elle existe, sinon à l'accueil
    if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }

  return (
    <button type="button" className="bouton-retour" onClick={retour}>
      ← {libelle}
    </button>
  )
}

export default BoutonRetour