import { useEffect, useRef, useState } from "react";
import SocialMediaIcons from "../../Nav-Logo-Footer/SocialMediaIcons/SocialMediaIcons";

const prefersReducedMotion = () =>
	window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

// Top of a converted tour page: one looping video (like the homepage hero),
// with the photo as poster. Nothing rotates, so no arrows or dots.
// Reduced motion: the poster stays still.
const VideoHero = ({ video, poster, title }) => {
	const ref = useRef(null);
	const [reduced] = useState(prefersReducedMotion);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (reduced) {
			el.pause();
			return;
		}
		el.muted = true; // iOS only autoplays when the muted *property* is set
		el.play().catch(() => {});
	}, [reduced]);

	return (
		<section className="hero-gallery tour-video-hero" aria-label={title}>
			<video
				ref={ref}
				className="tour-video"
				src={video}
				poster={poster}
				autoPlay={!reduced}
				muted
				loop
				playsInline
				preload="auto"
				aria-hidden="true"
			/>
			<div className="hero-gallery-footer">
				<div className="hero-social">
					<SocialMediaIcons only={["Facebook", "Instagram", "TikTok", "YouTube"]} />
				</div>
			</div>
		</section>
	);
};

export default VideoHero;
