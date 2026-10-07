import './Bandeau.css'

const message = 'Livraison rapide · Garantie 12 mois · Compatibilité vérifiée · Retours simplifiés · Moteurs testés · '

function Bandeau() {
  return (
    <div className="bandeau">
      <div className="bandeau-piste">
        <span>{message}</span>
        <span>{message}</span>
      </div>
    </div>
  )
}

export default Bandeau