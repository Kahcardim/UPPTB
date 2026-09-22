export function initRouter() {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const navGroups = [...document.querySelectorAll('.nav-group')];
  const carousel = document.querySelector('[data-carousel]');
  const previous = document.querySelector('[data-carousel-prev]');
  const next = document.querySelector('[data-carousel-next]');

  navGroups.forEach((group) => group.addEventListener('toggle', () => {
    if (group.open) navGroups.forEach((other) => { if (other !== group) other.open = false; });
  }));

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      nav.dataset.open = String(!isOpen);
    });
    nav.addEventListener('click', (event) => {
      if (!event.target.matches('a')) return;
      menuButton.setAttribute('aria-expanded', 'false');
      nav.dataset.open = 'false';
      navGroups.forEach((group) => { group.open = false; });
    });
  }

  const carouselStep = () => {
    const card = carousel?.querySelector('.chaos-card');
    return card ? card.getBoundingClientRect().width + 16 : 320;
  };
  previous?.addEventListener('click', () => carousel?.scrollBy({ left: -carouselStep(), behavior: 'smooth' }));
  next?.addEventListener('click', () => carousel?.scrollBy({ left: carouselStep(), behavior: 'smooth' }));
}
