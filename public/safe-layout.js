const protectedSelector = [
  'main h1',
  'main h2',
  'main h3',
  'main p',
  'main li',
  'main a',
  'main button',
  'main input',
  'main textarea',
  'main select',
  'main pre',
  'main code',
  'main .hero-copy',
  'main .hero-actions',
  'main .downloads',
  'main .terminal-controls'
].join(',');

function intersects(a, b, padding = 8) {
  return !(
    a.right + padding <= b.left ||
    a.left - padding >= b.right ||
    a.bottom + padding <= b.top ||
    a.top - padding >= b.bottom
  );
}

export function decorationOverlapsProtectedContent(element) {
  if (!element || element.hidden) return false;
  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;

  return [...document.querySelectorAll(protectedSelector)].some((target) => {
    if (target.closest('.random-asset-plane')) return false;
    const targetRect = target.getBoundingClientRect();
    if (!targetRect.width || !targetRect.height) return false;
    return intersects(rect, targetRect);
  });
}

export function placeDecorationSafely(element, {
  pageHeight = Math.max(document.querySelector('main')?.scrollHeight ?? 2200, 2200),
  minTop = 96,
  index = 0
} = {}) {
  if (!element) return false;

  const mobile = window.matchMedia('(max-width: 700px)').matches;
  const viewportWidth = document.documentElement.clientWidth;
  const scales = mobile ? [0.78, 0.64, 0.52] : [1, 0.84, 0.68];
  const rotations = [-8, -4, 0, 4, 8];
  const maxTop = Math.max(minTop + 120, pageHeight - (mobile ? 150 : 260));

  element.hidden = false;
  element.dataset.hiddenByCollision = 'false';
  element.style.zIndex = '1';

  for (const scale of scales) {
    for (let attempt = 0; attempt < 28; attempt += 1) {
      const side = (attempt + index) % 2 === 0 ? 'left' : 'right';
      const ratio = ((attempt * 7 + index * 11) % 29) / 28;
      const top = Math.round(minTop + ratio * Math.max(120, maxTop - minTop));
      const rotate = rotations[(attempt + index) % rotations.length];

      element.style.top = `${top}px`;
      element.style.left = side === 'left' ? (mobile ? '4px' : '8px') : 'auto';
      element.style.right = side === 'right' ? (mobile ? '4px' : '8px') : 'auto';
      element.style.transformOrigin = side === 'left' ? 'top left' : 'top right';
      element.style.transform = `rotate(${rotate}deg) scale(${scale})`;

      if (!decorationOverlapsProtectedContent(element)) return true;
    }
  }

  element.hidden = true;
  element.dataset.hiddenByCollision = 'true';
  element.style.transform = 'none';
  return false;
}

export function protectedContentSelector() {
  return protectedSelector;
}
