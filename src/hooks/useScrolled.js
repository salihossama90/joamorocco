import { useEffect, useState } from "react";

// True once the page has scrolled past `offset` px. Passive, rAF-throttled.
const useScrolled = (offset = 60) => {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		let ticking = false;
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				setScrolled(window.scrollY > offset);
				ticking = false;
			});
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, [offset]);

	return scrolled;
};

export default useScrolled;
