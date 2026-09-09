const uiPatch = document.createElement('style');
uiPatch.textContent = `
  .site-header nav { overflow: visible; }
  .nav-group { position: relative; }
  .nav-group > summary {
    list-style: none;
    cursor: pointer;
    color: var(--muted);
    padding: .55rem .8rem;
    border-radius: 999px;
    font-weight: 850;
    font-size: .9rem;
    user-select: none;
  }
  .nav-group > summary::-webkit-details-marker { display: none; }
  .nav-group > summary::after { content: ' ▾'; color: var(--green); }
  .nav-group[open] > summary,
  .nav-group > summary:hover,
  .nav-group > summary:focus-visible { color: var(--text); background: rgba(53,255,102,.1); }
  .nav-group[open] > summary::after { content: ' ▴'; }
  .nav-panel {
    position: absolute;
    top: calc(100% + .55rem);
    right: 0;
    z-index: 220;
    min-width: 230px;
    display: grid;
    gap: .25rem;
    padding: .6rem;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: rgba(7,18,10,.98);
    box-shadow: var(--shadow);
  }
  .nav-panel a { display: block; white-space: nowrap; }

  .chaos-cluster { border-top: 1px solid rgba(53,255,102,.14); }
  .memory-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    margin-top: 2rem;
  }
  .memory-grid article {
    min-height: 220px;
    padding: 1.4rem;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: linear-gradient(145deg, rgba(16,39,24,.95), rgba(7,18,10,.94));
    box-shadow: var(--shadow);
    transform: rotate(var(--card-tilt, 0deg));
  }
  .memory-grid article:nth-child(3n+1) { --card-tilt: -.7deg; }
  .memory-grid article:nth-child(3n+2) { --card-tilt: .8deg; }
  .memory-grid article:nth-child(3n) { --card-tilt: -.25deg; }
  .memory-grid article p { color: var(--muted); }
  .memory-tag {
    display: inline-block;
    margin-bottom: .8rem;
    padding: .28rem .55rem;
    border: 1px solid var(--green);
    border-radius: 999px;
    color: var(--green);
    font: 850 .72rem/1.1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    text-transform: uppercase;
    letter-spacing: .08em;
  }

  @media (max-width: 900px) {
    .memory-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 700px) {
    .nav-group { width: 100%; }
    .nav-group > summary { padding: .8rem 1rem; }
    .nav-panel {
      position: static;
      min-width: 0;
      margin-top: .35rem;
      box-shadow: none;
      background: #07120a;
    }
    .nav-panel a { white-space: normal; }
    .memory-grid { grid-template-columns: 1fr; }
  }
`;
document.head.append(uiPatch);

const hero = document.querySelector('.hero');
const heroCopy = document.querySelector('.hero-copy');
const heroMark = document.querySelector('.hero-mark');
const heroTitle = document.querySelector('#hero-title');

if (hero && heroCopy) {
  hero.style.gridTemplateColumns = 'minmax(0, 1fr) minmax(280px, 420px)';
  hero.style.justifyItems = 'stretch';
  hero.style.alignItems = 'center';
  hero.style.minHeight = 'auto';
  hero.style.paddingTop = '4.5rem';
  hero.style.paddingBottom = '4rem';
  hero.style.gap = 'clamp(2rem, 6vw, 5rem)';

  heroCopy.style.width = 'min(100%, 620px)';
  heroCopy.style.maxWidth = '620px';
  heroCopy.style.margin = '0';
  heroCopy.style.paddingInline = '0';
  heroCopy.style.textAlign = 'left';
  heroCopy.style.justifySelf = 'start';

  if (heroTitle) {
    heroTitle.style.fontSize = 'clamp(2rem, 3.4vw, 3.25rem)';
    heroTitle.style.lineHeight = '1.08';
    heroTitle.style.maxWidth = '620px';
    heroTitle.style.margin = '0';
  }

  const heroLead = heroCopy.querySelector('.lead');
  if (heroLead) heroLead.style.marginInline = '0';

  const heroActions = heroCopy.querySelector('.hero-actions');
  if (heroActions) heroActions.style.justifyContent = 'flex-start';

  if (heroMark) {
    heroMark.style.width = 'min(420px, 100%)';
    heroMark.style.margin = '0';
    heroMark.style.justifySelf = 'end';
    heroMark.style.position = 'sticky';
    heroMark.style.top = '6rem';

    const heroLogo = heroMark.querySelector('img');
    if (heroLogo) {
      heroLogo.src = 'assets/upptb-collage.webp';
      heroLogo.alt = 'Logo manifesto da UPPTB com tartaruga, Beyblade, código e caos visual';
    }
  }
}

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const navGroups = [...document.querySelectorAll('.nav-group')];

navGroups.forEach((group) => {
  group.addEventListener('toggle', () => {
    if (!group.open) return;
    navGroups.forEach((other) => {
      if (other !== group) other.open = false;
    });
  });
});

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
      navGroups.forEach((group) => { group.open = false; });
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
let hairlessCatCreated = false;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createHairlessCat() {
  if (!randomAssetPlane || hairlessCatCreated) return;

  const figure = document.createElement('figure');
  const cat = document.createElement('img');
  const caption = document.createElement('figcaption');

  figure.className = 'random-asset random-character random-photo random-hairless-cat';
  cat.src = 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Sphynx_kitten.JPG';
  cat.alt = '';
  cat.loading = 'lazy';
  cat.referrerPolicy = 'no-referrer';
  caption.textContent = 'GATO PELADO DO TI // COMPUTADOR OCUPADO';

  figure.append(cat, caption);
  randomAssetPlane.append(figure);
  hairlessCatCreated = true;

  const footer = document.querySelector('footer');
  if (footer && !footer.querySelector('[data-sphynx-credit]')) {
    const credit = document.createElement('p');
    credit.dataset.sphynxCredit = 'true';
    credit.innerHTML = '<small>Foto do Sphynx: M.M.Minderhoud / Wikipedia (CC BY-SA 3.0).</small>';
    footer.append(credit);
  }
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
  createHairlessCat();
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
