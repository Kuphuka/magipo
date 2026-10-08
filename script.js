const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
const currentYear = document.querySelector("#current-year");
const welcomeScreen = document.querySelector("#welcome-screen");
const welcomeEnter = document.querySelector("#welcome-enter");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (welcomeScreen && welcomeEnter) {
  const pageElements = document.querySelectorAll(".skip-link, .topbar, .site-header, #main, .whatsapp-button, .site-footer");
  let welcomeDismissed = false;

  document.body.classList.add("welcome-active");
  pageElements.forEach((element) => {
    element.inert = true;
  });
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => welcomeEnter.focus({ preventScroll: true }));
  });

  const dismissWelcome = () => {
    if (welcomeDismissed) return;

    welcomeDismissed = true;
    welcomeScreen.classList.add("is-leaving");
    document.body.classList.remove("welcome-active");
    pageElements.forEach((element) => {
      element.inert = false;
    });
    document.removeEventListener("keydown", handleWelcomeKeydown);
    window.setTimeout(() => {
      welcomeScreen.hidden = true;
      document.querySelector("#hero-title")?.focus({ preventScroll: true });
    }, prefersReducedMotion ? 0 : 450);
  };

  const handleWelcomeKeydown = (event) => {
    if (event.key === "Escape") dismissWelcome();
  };

  welcomeEnter.addEventListener("click", dismissWelcome);
  document.addEventListener("keydown", handleWelcomeKeydown);
  window.setTimeout(dismissWelcome, prefersReducedMotion ? 1000 : 2200);
}

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (menuToggle && primaryNavigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
    primaryNavigation.classList.toggle("is-open", !isExpanded);
  });

  primaryNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      primaryNavigation.classList.remove("is-open");
    });
  });
}

const revealElements = document.querySelectorAll("[data-reveal]");

if (revealElements.length > 0 && !prefersReducedMotion && "IntersectionObserver" in window) {
  document.body.classList.add("motion-ready");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}
