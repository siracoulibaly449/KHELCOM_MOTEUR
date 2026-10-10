import { Link } from 'react-router-dom'
import './Logo.css'

type Props = {
  variante?: 'complet' | 'icone'
}

function Logo({ variante = 'complet' }: Props) {
  return (
    <Link to="/" className="logo" aria-label="KHELCOM-MOTORS, accueil">
      <svg className="logo-icone" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#0A0C0B" />
        <rect x="2" y="2" width="60" height="60" rx="14" fill="none" stroke="#22C55E" strokeWidth="2" opacity="0.6" />
        <path d="M20 16 V48" stroke="#F4F7F5" strokeWidth="6" strokeLinecap="round" />
        <path d="M46 16 L26 34 L46 48" fill="none" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="26" cy="34" r="3.5" fill="#F4F7F5" />
      </svg>
      {variante === 'complet' && (
        <span className="logo-texte">
          KHELCOM<span>-MOTORS</span>
        </span>
      )}
    </Link>
  )
}

export default Logo