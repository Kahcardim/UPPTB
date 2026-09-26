const protectedSelector = [
  'main h1',
  'main h2',
  'main h3',
  'main p:not(.do-not-feed)',
  'main li',
  'main a',
  'main button',
  'main input',
  'main textarea',
  'main select',
  'main pre',
  'main code',
  'main blockquote',
  'main label',
  '.terminal-controls'
].join(',');

function intersects(a, b, padding = 8) {
  return !(
    a.right <= b.left + padding ||
    a.left >= b.right - padding ||
    a.bottom <= b.top + padding ||
    a.top >= b.bottom - padding
  );
}

export function collectProtectedRects() {
  return [...document.querySelectorAll(protectedSelector)]
    .filter((element) => !element.closest('.random-asset-plane') && !element.hidden)
    .map((element) => element.getBoundingClientRect())
    .filter((rect) => rect.width > 2 && rect.height > 2);
}

export function decorativeOverlapsContent(element, protectedRects = collectProtectedRects()) {
  if (!element || element.hidden) return false;
  const rect = element.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return false;
  return protectedRects.some((target) => intersects(rect, target));
}

export function placeDecorativeAsset(element, {
  index = 0,
  pageHeight = 2200,
  topStart = 120,
  protectedRects = collectProtectedRects(),
  rotation = 10
} = {}) {
  const mobile = window.innerWidth <= 700;
  const lanes = mobile ? [-4, 70, 2, 62] : [-2, 88, 2, 80, 8, 72];
  const scales = mobile ? [1, .82, .68, .54] : [1, .86, .72, .6];
  const assetHeight = Math.max(element.getBoundingClientRect().height || (mobile ? 120 : 220), 80);
  const maxTop = Math.max(topStart, pageHeight - assetHeight - 24);
  const usable = Math.max(maxTop - topStart, 80);
  const slots = Math.max(8, Math.min(28, Math.ceil(usable / (mobile ? 150 : 190))));

  element.hidden = false;
  element.removeAttribute('data-suppressed');
  element.style.transformOrigin = 'top left';

  for (const scale of scales) {
    for (let attempt = 0; attempt < slots; attempt += 1) {
      const lane = lanes[(index + attempt) % lanes.length];
      const slot = (index * 3 + attempt * 5) % slots;
      const baseTop = topStart + (usable * slot / Math.max(slots - 1, 1));
      const jitter = ((index + 1) * (attempt + 3) * 17) % (mobile ? 46 : 82);
      const angle = (((index + attempt) % 7) - 3) * (rotation / 3);

      element.style.left = `${lane}%`;
      element.style.top = `${Math.round(Math.min(maxTop, baseTop + jitter))}px`;
      element.style.transform = `rotate(${angle.toFixed(1)}deg) scale(${scale})`;

      if (!decorativeOverlapsContent(element, protectedRects)) {
        return true;
      }
    }
  }

  element.hidden = true;
  element.dataset.suppressed = 'content-priority';
  return false;
}
