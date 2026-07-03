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
