const hero = document.querySelector('.hero');
const heroCopy = document.querySelector('.hero-copy');
const heroMark = document.querySelector('.hero-mark');
const heroTitle = document.querySelector('#hero-title');

if (hero && heroCopy) {
  hero.style.gridTemplateColumns = '1fr';
  hero.style.justifyItems = 'center';
  hero.style.minHeight = 'auto';
  hero.style.paddingTop = '4.5rem';
  hero.style.paddingBottom = '4rem';

  heroCopy.style.width = 'min(100%, 620px)';
  heroCopy.style.maxWidth = '620px';
  heroCopy.style.marginInline = 'auto';
  heroCopy.style.paddingInline = '1rem';
  heroCopy.style.textAlign = 'center';

  if (heroTitle) {
    heroTitle.style.fontSize = 'clamp(2rem, 3.4vw, 3.25rem)';
    heroTitle.style.lineHeight = '1.08';
    heroTitle.style.maxWidth = '620px';
    heroTitle.style.marginInline = 'auto';
  }

  if (heroMark) {
    heroMark.style.width = 'min(360px, 90%)';
    heroMark.style.margin = '2rem auto 0';
  }
}

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    nav.dataset.open = String(!isOpen);
  });

  nav.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      nav.dataset.open = 'false';
    }
  });
}

const carousel = document.querySelector('[data-carousel]');
const previous = document.querySelector('[data-carousel-prev]');
const next = document.querySelector('[data-carousel-next]');

function carouselStep() {
  if (!carousel) return 320;
  const card = carousel.querySelector('.chaos-card');
  if (!card) return 320;
  return card.getBoundingClientRect().width + 16;
}

previous?.addEventListener('click', () => {
  carousel?.scrollBy({ left: -carouselStep(), behavior: 'smooth' });
});

next?.addEventListener('click', () => {
  carousel?.scrollBy({ left: carouselStep(), behavior: 'smooth' });
});

carousel?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    carousel.scrollBy({ left: -carouselStep(), behavior: 'smooth' });
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    carousel.scrollBy({ left: carouselStep(), behavior: 'smooth' });
  }
});

const chaosButton = document.querySelector('#chaos-button');
const terminalOutput = document.querySelector('#terminal-output');
const randomAssetPlane = document.querySelector('#random-asset-plane');
const audits = [
  '$ upptb audit\nresultado ............ 0 bugs encontrados\nqa ................... recusou acreditar\nstatus ................ executar novamente',
  '$ upptb audit --deep\nrobinWins ............. 0\nregression ............ consistente\nmetodologia ........... turtle step\nstatus ................ suspeitamente estável',
  '$ upptb audit --institutional\ncredenciamento ........ inexistente\nreitoria .............. o mesmo cara\ndepartamentos ......... também\nproduto ................ funcionando apesar disso'
];
let auditIndex = 0;
let turtlesCreated = false;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createTurtles() {
  if (!randomAssetPlane || turtlesCreated) return;

  for (let index = 1; index <= 31; index += 1) {
    const figure = document.createElement('figure');
    const turtle = document.createElement('img');
    figure.className = `random-asset random-turtle${index >= 28 ? ' large-turtle' : ''}`;
    turtle.src = `assets/turtles/turtle-${String(index).padStart(2, '0')}.webp`;
    turtle.alt = '';
    turtle.loading = 'lazy';
    figure.append(turtle);
    randomAssetPlane.append(figure);
  }

  turtlesCreated = true;
}

function scatterAssets() {
  if (!randomAssetPlane) return;
  const pageHeight = Math.max(document.querySelector('main')?.scrollHeight ?? 4000, 4000);

  randomAssetPlane.querySelectorAll('.random-asset').forEach((asset, index) => {
    const isLarge = asset.classList.contains('large-turtle') || asset.classList.contains('random-character');
    const topLimit = Math.max(pageHeight - (isLarge ? 540 : 240), 600);
    asset.style.top = `${randomBetween(100, topLimit).toFixed(0)}px`;
    asset.style.left = `${randomBetween(-4, isLarge ? 82 : 92).toFixed(1)}%`;
    asset.style.transform = `rotate(${randomBetween(-26, 26).toFixed(1)}deg)`;
    asset.style.zIndex = `${index % 4}`;
  });
}

function reorganizeCampus() {
  createTurtles();
  scatterAssets();
}

chaosButton?.addEventListener('click', () => {
  if (!terminalOutput) return;
  terminalOutput.textContent = audits[auditIndex % audits.length];
  auditIndex += 1;
  reorganizeCampus();
});

reorganizeCampus();
window.addEventListener('load', scatterAssets, { once: true });
