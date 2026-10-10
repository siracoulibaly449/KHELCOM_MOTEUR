import './Bandeau.css'
const message = 'Moteurs d\'occasion · Origine indiquée · Réservation avec acompte · Wave ou espèces · '

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