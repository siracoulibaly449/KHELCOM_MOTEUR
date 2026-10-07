import './Header.css'

const liens = ['Moteurs', 'Pièces', 'Occasion', 'Garanties', 'Contact']

function Header() {
  return (
    <header className="entete">
      <div className="logo">
        MOTEURS<span>.</span>PRO
      </div>

      <nav className="navigation">
        {liens.map((lien) => (
          <a key={lien} href="#">{lien}</a>
        ))}
      </nav>

      <div className="actions">
        <a href="#" className="connexion">Connexion</a>
        <button className="panier">Panier · 0</button>
      </div>
    </header>
  )
}

export default Header