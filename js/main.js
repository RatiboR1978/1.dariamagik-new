// Parallax effect
let scrollY = 0;
const hero = document.querySelector('.hero');

function updateParallax() {
  scrollY = window.scrollY;
  hero.style.setProperty('--scroll-y', scrollY);
  requestAnimationFrame(updateParallax);
}
updateParallax();

// Fade-in animations
const fadeElements = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => observer.observe(el));

// Reviews slider
const track = document.getElementById('reviewsTrack');
const dotsContainer = document.getElementById('reviewsDots');
const cards = track.querySelectorAll('.review-card');
let currentSlide = 0;
let slidesPerView = 1;
let totalSlides = 1;

function updateSlidesPerView() {
  if (window.innerWidth >= 1024) {
    slidesPerView = 3;
  } else if (window.innerWidth >= 768) {
    slidesPerView = 2;
  } else {
    slidesPerView = 1;
  }
  totalSlides = Math.ceil(cards.length / slidesPerView);
  createDots();
  goToSlide(Math.min(currentSlide, totalSlides - 1));
}

function createDots() {
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.classList.add('reviews__dot');
    if (i === currentSlide) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

function goToSlide(index) {
  currentSlide = index;
  const offset = -index * (100 / slidesPerView) * slidesPerView;
  track.style.transform = `translateX(${offset}%)`;

  document.querySelectorAll('.reviews__dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

// Touch swipe for mobile
let touchStartX = 0;
let touchEndX = 0;

track.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

track.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0 && currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    } else if (diff < 0 && currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }
}

window.addEventListener('resize', updateSlidesPerView);
updateSlidesPerView();

// Toggle review text
function toggleReview(btn) {
  const text = btn.previousElementSibling;
  const isExpanded = !text.classList.contains('truncated');

  if (isExpanded) {
    text.classList.add('truncated');
    btn.textContent = 'Читать полностью';
  } else {
    text.classList.remove('truncated');
    btn.textContent = 'Свернуть';
  }
}
