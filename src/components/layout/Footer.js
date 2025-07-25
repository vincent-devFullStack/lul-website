import Link from "next/link";
import "../../styles/layout/Footer.css";

const Footer = () => {
  return (
    <div className="footer bottom-0 left-0 right-0 font-medium">
      <div className="footer-content">
        <div className="footer-nav text-lg">
          <div className="footer-nav-item">
            <Link href="/">Mentions légales</Link>
          </div>
          <div className="footer-nav-item">
            <Link href="/">Politique de confidentialité</Link>
          </div>
          <div className="footer-nav-item">
            <Link href="/">Crédits artistiques</Link>
          </div>
        </div>
        <div className="footer-copyrights">
          <p>© 2025 Damien Mourot & Vincent Silvestri.</p>
          <p> All Rights Reserved.</p>
          <p>Designed & Developed with Next.js</p>
        </div>
      </div>
    </div>
  );
};
export default Footer;
