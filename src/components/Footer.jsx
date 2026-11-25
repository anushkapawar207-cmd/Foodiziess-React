
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <h3>Foodiziess 💜</h3>
      <p>Find recipes to all yum food you crave.</p>

      <p>
        <Link to="/admin/login">Admin Login</Link>
      </p>

      <p>© 2026 Foodiziess. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
