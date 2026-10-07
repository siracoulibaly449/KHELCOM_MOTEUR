import Header from '../components/Header'
import Footer from '../components/Footer'

function Contact() {
  return (
    <>
      <Header />
      <main className="page-simple">
        <h1>Nous <span className="accent">contacter</span></h1>
        <p>Une question sur la compatibilité d'une pièce ? Écrivez-nous en indiquant la marque, le modèle, l'année et le code moteur de votre véhicule.</p>
        <p><strong>E-mail :</strong> contact@moteurs-pro.fr</p>
      </main>
      <Footer />
    </>
  )
}

export default Contact