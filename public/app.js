import { initRouter } from './router.js';
import { initRandomizer } from './randomizer.js';

const activeStorageKeys = new Set([
  'upptb-campus-distribution-v8',
  'upptb-alice-characters-v2'
]);

function pruneLegacyStorage() {
  try {
    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);
      const isUpptbRuntimeRecord = key?.startsWith('upptb-campus-distribution-') ||
        key?.startsWith('upptb-alice-characters-');
      if (isUpptbRuntimeRecord && !activeStorageKeys.has(key)) localStorage.removeItem(key);
    }
  } catch {
    // Storage indisponível não pode bloquear a interface.
  }
}

pruneLegacyStorage();

const uiPatch = document.createElement('style');
uiPatch.textContent = `
  .site-header nav { overflow: visible; }
  .site-page-link { text-decoration: none; color: var(--muted); padding: .55rem .8rem; border-radius: 999px; font-weight: 850; font-size: .9rem; }
  .site-page-link:hover, .site-page-link:focus-visible { color: var(--text); background: rgba(53,255,102,.1); }
  .nav-group { position: relative; }
  .nav-group > summary { list-style: none; cursor: pointer; color: var(--muted); padding: .55rem .8rem; border-radius: 999px; font-weight: 850; font-size: .9rem; user-select: none; }
  .nav-group > summary::-webkit-details-marker { display: none; }
  .nav-group > summary::after { content: ' ▾'; color: var(--green); }
  .nav-group[open] > summary, .nav-group > summary:hover, .nav-group > summary:focus-visible { color: var(--text); background: rgba(53,255,102,.1); }
  .nav-group[open] > summary::after { content: ' ▴'; }
  .nav-panel { position: absolute; top: calc(100% + .55rem); right: 0; z-index: 220; min-width: 230px; display: grid; gap: .25rem; padding: .6rem; border: 1px solid var(--line); border-radius: 18px; background: rgba(7,18,10,.98); box-shadow: var(--shadow); }
  .nav-panel a { display: block; white-space: nowrap; }
  .chaos-cluster { border-top: 1px solid rgba(53,255,102,.14); }
  .memory-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 2rem; }
  .memory-grid article { min-height: 220px; padding: 1.4rem; border: 1px solid var(--line); border-radius: var(--radius); background: linear-gradient(145deg, rgba(16,39,24,.95), rgba(7,18,10,.94)); box-shadow: var(--shadow); transform: rotate(var(--card-tilt, 0deg)); }
  .memory-grid article:nth-child(3n+1) { --card-tilt: -.7deg; }
  .memory-grid article:nth-child(3n+2) { --card-tilt: .8deg; }
  .memory-grid article:nth-child(3n) { --card-tilt: -.25deg; }
  .memory-grid article p { color: var(--muted); }
  .memory-tag { display: inline-block; margin-bottom: .8rem; padding: .28rem .55rem; border: 1px solid var(--green); border-radius: 999px; color: var(--green); font: 850 .72rem/1.1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; text-transform: uppercase; letter-spacing: .08em; }

  /* UX gate: o efeito Alice continua, mas conteúdo e controles sempre ficam acima dele. */
  main > section { position: relative; z-index: 10 !important; }
  .random-asset-plane { z-index: 3 !important; }
  .random-identity { width: clamp(9rem, 18vw, 15rem) !important; opacity: .52; }
  .random-turtle.large-turtle { width: clamp(8rem, 15vw, 13rem) !important; opacity: .58; }

  @media (max-width: 900px) {
    .memory-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 700px) {
    html, body { max-width: 100%; overflow-x: hidden; }
    main > section { width: min(100% - 1.25rem, var(--max)); }
    .site-header { padding-inline: .7rem; }
    .brand-mini span { font-size: .9rem; }
    .site-header nav[data-open="true"] {
      align-items: center !important;
      text-align: center;
    }
    .nav-group, .site-page-link { width: min(100%, 22rem); margin-inline: auto; text-align: center; }
    .nav-group > summary, .site-page-link { display: block; padding: .8rem 1rem; text-align: center; }
    .nav-panel { position: static; min-width: 0; width: 100%; margin: .35rem auto 0; box-shadow: none; background: #07120a; text-align: center; }
    .nav-panel a { white-space: normal; text-align: center; }
    .memory-grid { grid-template-columns: 1fr; }

    .hero {
      grid-template-columns: 1fr !important;
      justify-items: center !important;
      align-items: start !important;
      gap: 1.4rem !important;
      min-height: auto !important;
      padding-top: 2.4rem !important;
      padding-bottom: 2.8rem !important;
    }
    .hero-copy {
      width: min(100%, 34rem) !important;
      max-width: 34rem !important;
      margin-inline: auto !important;
      padding-inline: .4rem !important;
      text-align: center !important;
      justify-self: center !important;
    }
    .hero-copy .eyebrow { font-size: .68rem; line-height: 1.4; }
    #hero-title, .hero h1 {
      width: 100% !important;
      max-width: 18ch !important;
      margin-inline: auto !important;
      font-size: clamp(1.85rem, 8.5vw, 2.55rem) !important;
      line-height: 1.03 !important;
      letter-spacing: -.04em !important;
      overflow-wrap: normal !important;
      word-break: normal !important;
      hyphens: none !important;
      text-wrap: balance;
    }
    .hero-copy .lead {
      max-width: 34ch !important;
      margin: 1rem auto 0 !important;
      font-size: clamp(.98rem, 4.5vw, 1.12rem) !important;
      line-height: 1.55 !important;
    }
    .hero-actions { justify-content: center !important; width: 100%; gap: .65rem; }
    .hero-actions .button { flex: 1 1 13rem; max-width: 18rem; }
    .hero-mark {
      position: relative !important;
      top: auto !important;
      width: min(68vw, 250px) !important;
      max-width: 250px !important;
      margin: .35rem auto 0 !important;
      justify-self: center !important;
      transform: rotate(.8deg) !important;
      border-radius: 22px !important;
    }
    .hero-mark img { width: 100% !important; height: auto !important; }

    h2 { font-size: clamp(1.8rem, 9vw, 2.7rem); overflow-wrap: anywhere; }
    h3 { overflow-wrap: anywhere; }
    pre { max-width: 100%; white-space: pre-wrap; overflow-wrap: anywhere; }
    .code-grid, .mode-grid, .origin .timeline, .split, .archive { grid-template-columns: minmax(0, 1fr) !important; }
    .carousel { grid-auto-columns: minmax(0, 88%); }
    .random-character { width: clamp(6.5rem, 29vw, 10rem); }
    .random-identity { width: clamp(4.8rem, 20vw, 6.5rem) !important; max-width: 6.5rem !important; opacity: .38; }
    .random-turtle { width: clamp(3.8rem, 17vw, 6.2rem); }
    .random-turtle.large-turtle { width: clamp(4.2rem, 18vw, 5.8rem) !important; max-width: 5.8rem !important; opacity: .46; }
    .random-identity img, .random-turtle.large-turtle img { max-height: 7rem !important; }
    .do-not-feed { width: min(18rem, calc(100vw - 1.4rem)); font-size: .64rem; right: .7rem; bottom: .7rem; }
  }
`;
document.head.append(uiPatch);


const hero = document.querySelector('.hero');
const heroCopy = document.querySelector('.hero-copy');
const heroMark = document.querySelector('.hero-mark');
const heroTitle = document.querySelector('#hero-title');

if (hero && heroCopy && document.documentElement.dataset.page !== 'home') {
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
  }
}


// Navegação é funcionalidade crítica: inicializa antes de qualquer caos visual.
initRouter();

// Guard de domínio: Beyblade e Multi nunca sobrevivem fora do laboratório.
if (document.documentElement.dataset.page !== 'lab') {
  const labOnly = ['pretend-were-the-in-universe-general-public-who-do-you-v0-mejb5ymxzwkg1.webp','ekusu-remade.webp','Beyblade_X_-_Ekusu_Kurosu.webp','multi-nanairo-from-beyblade-x-v0-sg3enaxuhy8f1.webp'];
  document.querySelectorAll('img').forEach((image) => {
    if (labOnly.some((asset) => image.src.includes(asset))) image.closest('figure')?.remove();
  });
}

let randomizer = { scatterAssets() {} };
const bootRandomizer = () => { randomizer = initRandomizer(); };
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(bootRandomizer, { timeout: 450 });
} else {
  window.setTimeout(bootRandomizer, 60);
}

const chaosButton = document.querySelector('#chaos-button');
const terminalOutput = document.querySelector('#terminal-output');
const audits = [
  '$ upptb audit\nresultado ............ 0 bugs encontrados\nqa ................... recusou acreditar\nstatus ................ executar novamente',
  '$ upptb audit --deep\nrobinWins ............. 0\nregression ............ consistente\nmetodologia ........... turtle step\nstatus ................ suspeitamente estável',
  '$ upptb audit --institutional\npaginas ............... 4\ntartarugas pequenas ... migratorias\ntartarugas grandes .... fixas por pagina\nlogos .................. fixas por pagina\nimagens ................ migratorias\ngato pelado ........... migratorio\nproduto ................ caos responsivo'
];
let auditIndex = 0;

chaosButton?.addEventListener('click', () => {
  if (!terminalOutput) return;
  terminalOutput.textContent = audits[auditIndex % audits.length];
  auditIndex += 1;
  randomizer.scatterAssets();
});
