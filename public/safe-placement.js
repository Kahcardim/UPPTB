const blockerSelector = [
  'header',
  'footer',
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
  'main label',
  'main pre',
  'main article',
  'main .button',
  'main .downloads',
  'main .terminal-controls',
  'main .warning',
  'main .classified',
  'main .error-board',
  'main .fossil'
].join(',');

function intersects(a, b, margin) {
  return !(
    a.right + margin <= b.left ||
    a.left >= b.right + margin ||
    a.bottom + margin <= b.top ||
    a.top >= b.bottom + margin
  );
}

function visibleBlockers(element) {
  return [...document.querySelectorAll(blockerSelector)].filter((blocker) => {
    if (blocker === element || blocker.closest('.random-asset-plane')) return false;
    const style = getComputedStyle(blocker);
    const rect = blocker.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  });
}

export function overlapsReadableContent(element, margin = 10) {
  const rect = element.getBoundingClientRect();
  return visibleBlockers(element).some((blocker) =>
    intersects(rect, blocker.getBoundingClientRect(), margin)
  );
}

export function placeDecorationSafely(element, {
  pageHeight,
  index = 0,
  minTop = 96,
  rotation = 0,
  margin = 10
} = {}) {
  const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const heightLimit = Math.max(pageHeight || document.documentElement.scrollHeight || 1600, 800);
  const scales = [1, .82, .68];

  element.hidden = false;
  element.style.transformOrigin = 'top left';
  element.style.zIndex = String(index % 2);

  for (const scale of scales) {
    element.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
    element.style.top = '0px';
    element.style.left = '0px';

    const measured = element.getBoundingClientRect();
    const width = Math.max(measured.width, 1);
    const height = Math.max(measured.height, 1);
    const maxTop = Math.max(minTop, heightLimit - height - 20);
    const span = Math.max(1, maxTop - minTop);
    const baseOffset = (index * 173) % span;

    const xs = [
      8,
      Math.max(8, viewportWidth - width - 8),
      Math.max(8, viewportWidth * .06),
      Math.max(8, viewportWidth * .94 - width)
    ].map((value) => Math.round(value));

    for (let attempt = 0; attempt < 36; attempt += 1) {
      const top = Math.round(minTop + ((baseOffset + attempt * 137) % span));
      for (const left of xs) {
        element.style.top = `${top}px`;
        element.style.left = `${left}px`;
        if (!overlapsReadableContent(element, margin)) {
          element.dataset.safePlacement = 'true';
          return true;
        }
      }
    }
  }

  element.hidden = true;
  element.dataset.safePlacement = 'hidden';
  return false;
}
