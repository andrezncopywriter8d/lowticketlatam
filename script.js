const CHECKOUT_URL = "https://SEU-LINK-DE-CHECKOUT-AQUI.com";

if (window.location.hash === "#oferta") {
  history.replaceState(null, "", window.location.pathname + window.location.search);
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

const checkoutLinks = document.querySelectorAll(".js-checkout");
const offerLinks = document.querySelectorAll(".js-offer-link");
const floatingBuy = document.querySelector(".floating-buy");
const revealItems = document.querySelectorAll(".reveal");

checkoutLinks.forEach((link) => {
  link.setAttribute("href", CHECKOUT_URL);
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener noreferrer");
});

offerLinks.forEach((link) => {
  link.setAttribute("href", "#oferta");
  link.removeAttribute("target");
  link.removeAttribute("rel");
  link.addEventListener("click", (event) => {
    const offerSection = document.querySelector("#oferta");
    if (!offerSection) return;
    event.preventDefault();
    offerSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function updateFloatingButton() {
  if (!floatingBuy) return;
  floatingBuy.classList.toggle("is-visible", window.scrollY > 520);
}

window.addEventListener("scroll", updateFloatingButton, { passive: true });
updateFloatingButton();

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-item[open]").forEach((openedItem) => {
      if (openedItem !== item) openedItem.open = false;
    });
  });
});
