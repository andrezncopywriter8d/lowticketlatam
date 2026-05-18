const CHECKOUT_URL = "https://seguro.nutriinteligente.site/checkout/210182806:1";

if (window.location.hash === "#oferta") {
  history.replaceState(null, "", window.location.pathname + window.location.search);
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

const checkoutLinks = document.querySelectorAll(".js-checkout");
const offerLinks = document.querySelectorAll(".js-offer-link");
const floatingBuy = document.querySelector(".floating-buy");
const revealItems = document.querySelectorAll(".reveal");

const cartPandaLegalPatterns = [
  "cartpanda inc.",
  "review legal terms of use",
  "privacy policy",
  "contact us",
];

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
  const directCartPandaNode = Array.from(document.body.childNodes).find((node) => {
    const text = node.textContent?.toLowerCase() || "";
    return text.includes("cartpanda inc.") || text.includes("review legal terms of use");
  });

  if (directCartPandaNode) {
    Array.from(document.body.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node;
        const text = element.textContent?.toLowerCase() || "";
        const isLanding = element.classList?.contains("landing") || element.classList?.contains("floating-buy");

        if (!isLanding && (text.includes("cartpanda inc.") || text.includes("review legal terms of use"))) {
          element.remove();
        }

        if (!isLanding && element.tagName === "A" && element.textContent.trim().toLowerCase() === "here") {
          element.remove();
        }
      }

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.toLowerCase() || "";
        if (
          text.includes("cartpanda inc.") ||
          text.includes("review legal terms of use") ||
          text.includes("privacy policy") ||
          text.includes("contact us")
        ) {
          node.remove();
        }
      }
    });
  }

  Array.from(document.querySelectorAll("body *:not(script):not(style)")).forEach((element) => {
    const text = element.textContent?.toLowerCase() || "";
    const hasCartPandaLegal =
      text.includes("cartpanda inc.") &&
      cartPandaLegalPatterns.slice(1).some((pattern) => text.includes(pattern));

    if (!hasCartPandaLegal) return;

    const childAlsoMatches = Array.from(element.children).some((child) => {
      const childText = child.textContent?.toLowerCase() || "";
      return childText.includes("cartpanda inc.");
    });

    if (!childAlsoMatches) {
      element.remove();
    }
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

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-item[open]").forEach((openedItem) => {
      if (openedItem !== item) openedItem.open = false;
    });
  });
});
