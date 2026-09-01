const carousel = document.querySelector('[data-carousel]');

if (carousel) {
  const track = carousel.querySelector('#example-track');
  const slides = [...track.querySelectorAll('.example-tile')];
  const controls = carousel.querySelector('#carousel-controls');
  const dots = carousel.querySelector('#carousel-dots');
  const previous = carousel.querySelector('#carousel-prev');
  const next = carousel.querySelector('#carousel-next');
  const status = carousel.querySelector('#carousel-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentIndex = 0;
  let timer;
  let pointerStart = null;

  function visibleCount() {
    if (window.innerWidth <= 560) return 1;
    if (window.innerWidth <= 850) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, slides.length - visibleCount());
  }

  function makeDots(max) {
    dots.replaceChildren();
    for (let index = 0; index <= max; index += 1) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Показать примеры ${index + 1}`);
      dot.addEventListener('click', () => goTo(index));
      dots.append(dot);
    }
  }

  function update(announce = false) {
    const max = maxIndex();
    currentIndex = Math.min(currentIndex, max);
    const slideWidth = slides[0]?.getBoundingClientRect().width || 0;
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    track.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;
    controls.hidden = max === 0;
    previous.disabled = currentIndex === 0;
    next.disabled = currentIndex === max;
    makeDots(max);
    [...dots.children].forEach((dot, index) => dot.classList.toggle('is-active', index === currentIndex));
    if (announce) status.textContent = `Показаны примеры ${currentIndex + 1} из ${max + 1}`;
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex()));
    update(true);
    restartAutoPlay();
  }

  function advance() {
    const max = maxIndex();
    if (max === 0) return;
    currentIndex = currentIndex >= max ? 0 : currentIndex + 1;
    update();
  }

  function stopAutoPlay() {
    window.clearInterval(timer);
  }

  function restartAutoPlay() {
    stopAutoPlay();
    if (!reducedMotion.matches && maxIndex() > 0) timer = window.setInterval(advance, 5000);
  }

  previous.addEventListener('click', () => goTo(currentIndex - 1));
  next.addEventListener('click', () => goTo(currentIndex + 1));
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', restartAutoPlay);
  carousel.addEventListener('focusin', stopAutoPlay);
  carousel.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget)) restartAutoPlay();
  });
  track.addEventListener('pointerdown', (event) => { pointerStart = event.clientX; });
  track.addEventListener('pointerup', (event) => {
    if (pointerStart === null) return;
    const distance = event.clientX - pointerStart;
    if (Math.abs(distance) > 45) goTo(currentIndex + (distance < 0 ? 1 : -1));
    pointerStart = null;
  });
  track.addEventListener('pointercancel', () => { pointerStart = null; });
  window.addEventListener('resize', () => { update(); restartAutoPlay(); });
  reducedMotion.addEventListener?.('change', restartAutoPlay);

  update();
  restartAutoPlay();
}
