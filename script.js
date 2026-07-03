const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const header = document.querySelector(".site-header");

window.addEventListener(
  "scroll",
  () => {
    const scrolled = window.scrollY > 24;
    header.style.background = scrolled
      ? "rgba(17, 16, 13, 0.94)"
      : "rgba(17, 16, 13, 0.88)";
  },
  { passive: true }
);
