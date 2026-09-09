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
const audits = [
  '$ upptb audit\nresultado ............ 0 bugs encontrados\nqa ................... recusou acreditar\nstatus ................ executar novamente',
  '$ upptb audit --deep\nrobinWins ............. 0\nregression ............ consistente\nmetodologia ........... turtle step\nstatus ................ suspeitamente estável',
  '$ upptb audit --institutional\ncredenciamento ........ inexistente\nreitoria .............. o mesmo cara\ndepartamentos ......... também\nproduto ................ funcionando apesar disso'
];
let auditIndex = 0;

chaosButton?.addEventListener('click', () => {
  if (!terminalOutput) return;
  terminalOutput.textContent = audits[auditIndex % audits.length];
  auditIndex += 1;
});
