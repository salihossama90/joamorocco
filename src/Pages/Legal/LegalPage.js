import { Link } from "react-router-dom";
import { EFFECTIVE_DATE, TERMS, PRIVACY } from "../../data/legal";
import "./Legal.css";

const Block = ({ item }) => {
	// Strings first: String.prototype.sub exists, so `item.sub` is truthy on text.
	if (typeof item === "string") return <p>{item}</p>;
	if (Array.isArray(item)) {
		return (
			<ul>
				{item.map((li) => (
					<li key={li}>{li}</li>
				))}
			</ul>
		);
	}
	if (item.sub) return <h3>{item.sub}</h3>;
	if (item.lines) {
		return (
			<address>
				{item.lines.map((line) => (
					<span key={line}>{line}</span>
				))}
			</address>
		);
	}
	return null;
};

const LegalPage = ({ doc }) => {
	const { title, intro, sections } = doc === "privacy" ? PRIVACY : TERMS;
	return (
		<main className="ds-page legal-page" data-tone="light">
			<article className="legal-doc">
				<h1>JOA — {title}</h1>
				<p className="legal-effective">Effective Date: {EFFECTIVE_DATE}</p>
				{intro.map((p) => (
					<p key={p}>{p}</p>
				))}
				{sections.map((s) => (
					<section key={s.h}>
						<h2>{s.h}</h2>
						{s.body.map((item, i) => (
							<Block key={i} item={item} />
						))}
					</section>
				))}
				<nav className="legal-switch">
					{doc === "privacy" ? (
						<Link to="/terms">Read our Terms &amp; Conditions</Link>
					) : (
						<Link to="/privacy">Read our Privacy Policy</Link>
					)}
				</nav>
			</article>
		</main>
	);
};

export default LegalPage;
