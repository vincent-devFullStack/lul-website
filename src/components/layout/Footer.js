import Link from "next/link";
import "../../styles/layout/Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="footer bottom-0 left-0 right-0 font-medium"
      role="contentinfo"
    >
      <div className="footer-content">
        <nav
          className="footer-nav text-lg"
          aria-label="Pages légales et crédits"
        >
          <ul>
            <li className="footer-nav-item">
              <Link href="/mentions-legales">Mentions légales</Link>
            </li>
            <li className="footer-nav-item">
              <Link href="/politique-confidentialite">
                Politique de confidentialité
              </Link>
            </li>
            <li className="footer-nav-item">
              <Link href="/credits-artistiques">Crédits artistiques</Link>
            </li>
          </ul>
        </nav>

        <div className="footer-copyrights">
          <p>© {year} L’Iconodule</p>
          <p>Tous droits réservés.</p>
          <p>Conçu & développé avec Next.js</p>
        </div>
      </div>
    </footer>
  );
}
