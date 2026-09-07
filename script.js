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

const heroVideo = document.querySelector(".hero-video");
const videoToggle = document.querySelector("[data-video-toggle]");
const videoToggleLabel = videoToggle?.querySelector("[data-video-toggle-label]");
const videoToggleIcon = videoToggle?.querySelector(".hero-video-toggle-icon");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let videoPausedByUser = false;

const syncVideoToggle = () => {
  if (!heroVideo || !videoToggle || !videoToggleLabel || !videoToggleIcon) return;

  const isPaused = heroVideo.paused;
  videoToggle.setAttribute("aria-pressed", String(isPaused));
  videoToggle.setAttribute("aria-label", isPaused ? "Reproduzir vídeo de fundo" : "Pausar vídeo de fundo");
  videoToggleLabel.textContent = isPaused ? "Reproduzir vídeo" : "Pausar vídeo";
  videoToggleIcon.textContent = isPaused ? "▶" : "Ⅱ";
};

if (heroVideo && videoToggle) {
  if (reducedMotionQuery.matches) {
    heroVideo.pause();
  } else {
    heroVideo.play().catch(syncVideoToggle);
  }

  videoToggle.addEventListener("click", () => {
    if (heroVideo.paused) {
      videoPausedByUser = false;
      heroVideo.play().catch(syncVideoToggle);
    } else {
      videoPausedByUser = true;
      heroVideo.pause();
    }
    syncVideoToggle();
  });

  heroVideo.addEventListener("play", syncVideoToggle);
  heroVideo.addEventListener("pause", syncVideoToggle);

  const heroVideoObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        heroVideo.pause();
      } else if (!videoPausedByUser && !reducedMotionQuery.matches) {
        heroVideo.play().catch(syncVideoToggle);
      }
    },
    { threshold: 0.18 }
  );

  heroVideoObserver.observe(heroVideo);
  syncVideoToggle();
}

const syncHeaderAppearance = () => {
  if (!header) return;

  const scrolled = window.scrollY > 24;
  header.style.background = scrolled
    ? "rgba(17, 16, 13, 0.94)"
    : "rgba(17, 16, 13, 0.28)";
  header.style.boxShadow = scrolled
    ? "0 16px 54px rgba(0, 0, 0, 0.22)"
    : "0 16px 54px rgba(0, 0, 0, 0.1)";
};

window.addEventListener("scroll", syncHeaderAppearance, { passive: true });
syncHeaderAppearance();

const menuModal = document.querySelector("#menu-modal");
const menuDialog = menuModal?.querySelector(".menu-dialog");
const menuOpenButtons = document.querySelectorAll("[data-menu-open]");
const menuCloseButtons = menuModal?.querySelectorAll("[data-menu-close]") || [];
let lastFocusedElement = null;

const getFocusableElements = () => {
  if (!menuModal) return [];

  return [...menuModal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter((element) => element.offsetParent !== null);
};

const openMenu = (event) => {
  event?.preventDefault();
  if (!menuModal || !menuDialog) return;

  lastFocusedElement = document.activeElement;
  menuModal.classList.add("is-open");
  menuModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
  menuDialog.focus({ preventScroll: true });
};

const closeMenu = () => {
  if (!menuModal) return;

  menuModal.classList.remove("is-open");
  menuModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus({ preventScroll: true });
  }
};

menuOpenButtons.forEach((button) => {
  button.addEventListener("click", openMenu);
});

menuCloseButtons.forEach((button) => {
  button.addEventListener("click", closeMenu);
});

window.addEventListener("keydown", (event) => {
  if (!menuModal?.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    closeMenu();
    return;
  }

  if (event.key !== "Tab") return;

  const focusableElements = getFocusableElements();
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (!firstElement || !lastElement) {
    event.preventDefault();
    menuDialog?.focus({ preventScroll: true });
    return;
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});
