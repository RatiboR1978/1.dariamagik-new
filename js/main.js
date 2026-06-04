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
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

const track = document.querySelector("#reviewsTrack");
const dots = document.querySelector("#reviewsDots");
const prev = document.querySelector(".reviews__arrow--prev");
const next = document.querySelector(".reviews__arrow--next");
const cards = [...document.querySelectorAll(".review-card")];

let currentIndex = 0;
let perView = 3;

function getPerView() {
  if (window.matchMedia("(max-width: 700px)").matches) return 1;
  if (window.matchMedia("(max-width: 980px)").matches) return 2;
  return 3;
}

function maxIndex() {
  return Math.max(0, cards.length - perView);
}

function buildDots() {
  dots.innerHTML = "";
  for (let index = 0; index <= maxIndex(); index += 1) {
    const dot = document.createElement("button");
    dot.className = "reviews__dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Показать отзыв ${index + 1}`);
    dot.addEventListener("click", () => goToReview(index));
    dots.appendChild(dot);
  }
}

function goToReview(index) {
  currentIndex = Math.min(Math.max(index, 0), maxIndex());
  const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
  const gap = parseFloat(getComputedStyle(cards[0]).marginRight) || 0;
  track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;

  dots.querySelectorAll(".reviews__dot").forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === currentIndex);
  });

  prev.disabled = currentIndex === 0;
  next.disabled = currentIndex === maxIndex();
}

function refreshReviews() {
  perView = getPerView();
  buildDots();
  goToReview(currentIndex);
}

prev.addEventListener("click", () => goToReview(currentIndex - 1));
next.addEventListener("click", () => goToReview(currentIndex + 1));

cards.forEach((card) => {
  const toggle = card.querySelector(".review-card__toggle");
  toggle.addEventListener("click", () => {
    const expanded = card.classList.toggle("is-expanded");
    toggle.textContent = expanded ? "Свернуть" : "Читать полностью";
  });
});

const viewport = document.querySelector(".reviews__viewport");
let startX = 0;
let startY = 0;
let isHorizontal = false;

viewport.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  isHorizontal = false;
}, { passive: true });

viewport.addEventListener("touchmove", (e) => {
  const dx = Math.abs(e.touches[0].clientX - startX);
  const dy = Math.abs(e.touches[0].clientY - startY);
  if (dx > dy) {
    isHorizontal = true;
    e.preventDefault();
  }
}, { passive: false });

viewport.addEventListener("touchend", (e) => {
  if (!isHorizontal) return;
  const delta = startX - e.changedTouches[0].clientX;
  if (Math.abs(delta) < 30) return;
  goToReview(currentIndex + (delta > 0 ? 1 : -1));
});

window.addEventListener("resize", refreshReviews);
refreshReviews();

// ── Hero parallax ──────────────────────────────────────────────
const heroMedia = document.querySelector(".hero__media img, .hero__media video");
if (heroMedia && heroMedia.tagName === "IMG") {
  let rafPending = false;
  window.addEventListener("scroll", () => {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        heroMedia.style.transform = `scale(1.15) translateY(${window.scrollY * 0.28}px)`;
        rafPending = false;
      });
    }
  }, { passive: true });
  heroMedia.style.transform = "scale(1.15) translateY(0px)";
}

// ── Author counters ────────────────────────────────────────────
function formatNumber(n) {
  return n >= 1000
    ? Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    : Math.floor(n).toString();
}

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function animateCounter(el, target, duration) {
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = prefix + formatNumber(target * easeOutQuart(progress)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll(".author__facts [data-count]");
if (counterEls.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        counterEls.forEach((el) => animateCounter(el, +el.dataset.count, 1800));
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  counterObserver.observe(document.querySelector(".author__facts"));
}

// ── Active nav section ─────────────────────────────────────────
const navLinks = document.querySelectorAll(".site-header__nav a");
const sections = [...navLinks].map((a) => document.querySelector(a.getAttribute("href")));

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const link = [...navLinks].find(
      (a) => a.getAttribute("href") === "#" + entry.target.id
    );
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach((a) => a.classList.remove("is-active"));
      link.classList.add("is-active");
    }
  });
}, { threshold: 0.3 });

sections.forEach((sec) => { if (sec) navObserver.observe(sec); });
