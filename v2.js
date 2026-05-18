const CHECKOUT_URL = "https://seguro.nutriinteligente.site/checkout/210182806:1";

if (window.location.hash === "#oferta-v2") {
  history.replaceState(null, "", window.location.pathname + window.location.search);
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

const checkoutLinks = document.querySelectorAll(".js-checkout");
const offerLinks = document.querySelectorAll(".js-offer-link");
const floatingBuy = document.querySelector(".v2-floating");
const revealItems = document.querySelectorAll(".reveal");

function syncCheckoutLinks() {
  document.querySelectorAll(".js-checkout").forEach((link) => {
    if (link.getAttribute("href") !== CHECKOUT_URL) link.setAttribute("href", CHECKOUT_URL);
    if (link.getAttribute("target") !== "_blank") link.setAttribute("target", "_blank");
    if (link.getAttribute("rel") !== "noopener noreferrer") {
      link.setAttribute("rel", "noopener noreferrer");
    }
  });
}

function removeCartPandaLegalFootnote() {
  Array.from(document.body.childNodes).forEach((node) => {
    const text = node.textContent?.toLowerCase() || "";
    const isCartPandaLegal =
      text.includes("cartpanda inc.") ||
      text.includes("review legal terms of use") ||
      text.includes("privacy policy") ||
      text.includes("contact us");

    if (!isCartPandaLegal) return;

    if (node.nodeType === Node.TEXT_NODE) {
      node.remove();
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node;
      const isPageElement = element.classList?.contains("v2-shell") || element.classList?.contains("v2-floating");
      if (!isPageElement) element.remove();
    }
  });

  document.querySelectorAll("body > a").forEach((link) => {
    if (link.textContent.trim().toLowerCase() === "here") link.remove();
  });
}

checkoutLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const checkoutWindow = window.open(CHECKOUT_URL, "_blank", "noopener,noreferrer");
    if (!checkoutWindow) window.location.href = CHECKOUT_URL;
  });
});

offerLinks.forEach((link) => {
  link.setAttribute("href", "#oferta-v2");
  link.removeAttribute("target");
  link.removeAttribute("rel");
  link.addEventListener("click", (event) => {
    const offerSection = document.querySelector("#oferta-v2");
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
  { threshold: 0.1 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function updateFloatingButton() {
  if (!floatingBuy) return;
  floatingBuy.classList.toggle("is-visible", window.scrollY > 620);
}

window.addEventListener("scroll", updateFloatingButton, { passive: true });
updateFloatingButton();

syncCheckoutLinks();
removeCartPandaLegalFootnote();

new MutationObserver(() => {
  syncCheckoutLinks();
  removeCartPandaLegalFootnote();
}).observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["href", "target", "rel", "style", "class"],
});

document.querySelectorAll(".v2-faq__item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".v2-faq__item[open]").forEach((openedItem) => {
      if (openedItem !== item) openedItem.open = false;
    });
  });
});
