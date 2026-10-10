import './Footer.css'
import Logo from './Logo'

function Footer() {
  return (
    <footer className="pied">
      <div className="pied-marque">
        <Logo />
        <span>© {new Date().getFullYear()} KHELCOM-MOTORS</span>
      </div>
      <span>Mentions légales · Confidentialité · Conditions de vente</span>
    </footer>
  )
}

export default Footer