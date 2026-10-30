import { Link } from "react-router-dom";
import "./ConsultButton.css";

// Always-visible call to action on every page; opens the contact form
// with Free consultation already chosen.
const ConsultButton = () => (
	<Link className="floating-consult-btn" to="/contact?topic=consultation">
		Free Consultation
	</Link>
);

export default ConsultButton;
