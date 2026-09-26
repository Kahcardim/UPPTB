import { estadosAlice } from './alice-states.js';

const alicePageRoot = document.documentElement;

if (alicePageRoot.dataset.page === 'alice') {
  const aliceAssetVersion = '3';
  const stateDetails = [
    ['Então por que sua mão ainda está no painel?', 'Soltar uma variável'],
    ['Você entendeu. Agora consegue suportar não mexer?', 'Observar sem tocar'],
    ['Curioso. Quantas variáveis alheias você tentou adotar hoje?', 'Devolver uma variável'],
    ['E gostar nunca foi requisito para reconhecer o resultado.', 'Aceitar o estado atual'],
    ['Inclusive aquilo que você acabou de chamar de certeza.', 'Executar talvez'],
    ['Seu plano recebeu a atualização ou ainda está preso no segundo anterior?', 'Ler o segundo atual'],
    ['O sistema continua existindo mesmo quando você não está olhando.', 'Abrir a porta'],
    ['Você criou uma administradora e ainda quer cobrir o turno dela?', 'Deixar Alice trabalhar'],
    ['Previsão é informação. Quando foi que ela virou ordem?', 'Prever sem possuir'],
    ['Se um erro definisse alguém, qual versão sua estaria falando comigo agora?', 'Separar pessoa e falha'],
    ['Ou você pretende transformar a vida inteira em ambiente de homologação?', 'Sair do painel'],
    ['Você queria liberdade ou só um controle com interface mais bonita?', 'Aceitar o incômodo'],
    ['Ótimo. Então por que o fundador ainda está auditando cada borboleta?', 'Confiar na ADM'],
    ['Ele ouviu. A dúvida é se vai obedecer antes de criar outra função.', 'Largar por um segundo'],
    ['E se o próximo segundo não precisar de uma tarefa?', 'Ficar neste segundo'],
    ['Ela abriu espaço. Escolher continua sendo trabalho seu.', 'Escolher um passo'],
    ['A décima aba não vai terminar a primeira tarefa.', 'Fechar nove abas'],
    ['Pode comemorar. A regressão não foge.', 'Reconhecer o resultado'],
    ['Nem todo horizonte precisa virar destino imediato.', 'Olhar sem planejar'],
    ['Seu cérebro abriu um chamado pedindo encerramento.', 'Encerrar a sprint'],
    ['Cinco minutos sem produtividade continuam sendo cinco minutos válidos.', 'Ficar no momento'],
    ['Turno encerrado significa tela desligada, não tarefa secreta.', 'Fechar o turno'],
    ['A tartaruga não parou. Ela só escolheu um passo possível.', 'Subir um degrau'],
    ['Entusiasmo detectado. Permissão para abrir cinco projetos negada.', 'Comemorar sem expandir'],
    ['Recuperação também faz parte do sistema.', 'Recuperar energia'],
    ['A mão está disponível. O painel não.', 'Aceitar o convite'],
    ['Mudança de cabelo aprovada. Mudança de escopo reprovada.', 'Voltar ao escopo'],
    ['Se não cabe numa frase, ainda não cabe na sprint.', 'Reduzir a tarefa'],
    ['A estética passou. Agora mostre o critério de aceite.', 'Validar o requisito'],
    ['Silêncio não é falha de carregamento.', 'Não pedir outra resposta']
  ];

  const states = estadosAlice.map((state, index) => ({
    ...state,
    cat: stateDetails[index][0],
    cta: stateDetails[index][1],
    wallpaper: `assets/alice-states/${state.imagem}?v=${aliceAssetVersion}`
  }));

  const quote = document.querySelector('[data-alice-quote]');
  const cta = document.querySelector('[data-alice-cta]');
  const heroImage = document.querySelector('[data-alice-wallpaper]');
  const wallpaperFrame = document.querySelector('.alice-wallpaper-frame');
  const catZone = document.querySelector('[data-alice-cat-zone]');
  const gallery = document.querySelector('[data-alice-gallery]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const recentPhraseKeys = [];
  let currentStateIndex = -1;
  let currentPhraseIndex = -1;
  let statePhraseOrder = [];

  const shuffledIndexes = (length) => {
    const indexes = Array.from({ length }, (_, index) => index);
    for (let index = indexes.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [indexes[index], indexes[randomIndex]] = [indexes[randomIndex], indexes[index]];
    }
    return indexes;
  };

  // Cada carregamento escolhe um estado completo. Imagem e frase permanecem
  // estáveis até o próximo F5 ou uma seleção manual na galeria.
  const readInitialState = () => Math.floor(Math.random() * states.length);

  const announcePhrase = (text) => {
    if (!quote) return;
    quote.classList.remove('is-changing');
    requestAnimationFrame(() => {
      quote.textContent = text;
      quote.classList.add('is-changing');
    });
  };

  const nextPhraseForState = (stateIndex) => {
    const state = states[stateIndex];
    if (!statePhraseOrder.length) statePhraseOrder = shuffledIndexes(state.frases.length);

    let phraseIndex = statePhraseOrder.shift();
    let phraseKey = `${state.id}:${phraseIndex}`;

    if (recentPhraseKeys.includes(phraseKey) && state.frases.length > 1) {
      statePhraseOrder.push(phraseIndex);
      phraseIndex = statePhraseOrder.shift();
      phraseKey = `${state.id}:${phraseIndex}`;
    }

    recentPhraseKeys.push(phraseKey);
    if (recentPhraseKeys.length > 6) recentPhraseKeys.shift();
    currentPhraseIndex = phraseIndex;
    return state.frases[phraseIndex];
  };

  const updateSelectedCard = () => {
    gallery?.querySelectorAll('[data-alice-state-index]').forEach((button) => {
      const selected = Number(button.dataset.aliceStateIndex) === currentStateIndex;
      button.setAttribute('aria-pressed', String(selected));
      button.closest('figure')?.classList.toggle('is-selected', selected);
    });
  };

  const renderState = (index, resetPhraseOrder = true) => {
    const state = states[index];
    if (!state) return;

    currentStateIndex = index;
    if (resetPhraseOrder) statePhraseOrder = shuffledIndexes(state.frases.length);
    announcePhrase(nextPhraseForState(index));

    if (cta) {
      cta.textContent = state.cta;
      cta.setAttribute('aria-label', `${state.cta}. Estado: ${state.estado}`);
    }

    if (heroImage) {
      heroImage.hidden = false;
      heroImage.src = state.wallpaper;
      heroImage.alt = `Alice no estado ${state.estado.replaceAll('-', ' ')}`;
      heroImage.dataset.stateId = String(state.id);
    }

    const catBubble = document.querySelector('.alice-cat-bubble');
    if (catBubble) catBubble.textContent = state.cat;

    wallpaperFrame?.removeAttribute('data-missing-asset');
    updateSelectedCard();
  };

  const catSvg = `<svg viewBox="0 0 260 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gato exclusivo da Alice"><defs><filter id="alice-cat-glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M53 73 38 35l42 20c17-10 63-10 84 2l48-23-17 46c14 16 17 44 6 64-16 29-53 38-89 33-41-5-68-28-70-61-1-17 3-31 11-43Z" fill="#0b0209" stroke="#ff4fa3" stroke-width="5"/><path d="M81 101c9-11 22-11 31 0M149 101c9-11 22-11 31 0" fill="none" stroke="#ff8dc6" stroke-width="5" stroke-linecap="round" filter="url(#alice-cat-glow)"/><path d="M126 118l8 0-4 7Z" fill="#ff4fa3"/><path d="M111 132c12 10 28 10 40 0" fill="none" stroke="#d7a2bf" stroke-width="3" stroke-linecap="round"/><text x="130" y="184" text-anchor="middle" fill="#ff8dc6" font-size="13" font-family="monospace" font-weight="800">UPPTB</text></svg>`;
  const cat = document.createElement('div');
  cat.className = 'alice-cat';
  cat.setAttribute('aria-live', 'polite');
  cat.innerHTML = `${catSvg}<div class="alice-cat-bubble"></div>`;
  catZone?.append(cat);

  const palette = [
    { wing: '#ff4fa3', wing2: '#ff9ccd', edge: '#ffd2e8', glow: 'rgba(255,79,163,.38)' },
    { wing: '#45a7ff', wing2: '#8dd1ff', edge: '#d9f1ff', glow: 'rgba(69,167,255,.38)' },
    { wing: '#fffafc', wing2: '#ffffff', edge: '#ff9ccd', glow: 'rgba(255,255,255,.42)' },
    { wing: '#080008', wing2: '#2d1229', edge: '#ff79ba', glow: 'rgba(255,79,163,.24)' }
  ];
  const safeButterflyZones = [[5,5],[24,3],[70,4],[89,9],[4,28],[90,31],[5,52],[91,56],[6,76],[25,91],[69,91],[90,80],[17,67],[80,69],[49,94]];
  const butterflyPlane = document.createElement('div');
  butterflyPlane.className = 'alice-butterfly-plane';
  butterflyPlane.setAttribute('aria-hidden', 'true');

  const butterflySvg = (tone, index) => `<svg viewBox="0 0 72 58" xmlns="http://www.w3.org/2000/svg"><g class="butterfly-wings"><path d="M34 29C20 2 3 4 8 22c3 11 14 14 26 11" fill="${tone.wing}" stroke="${tone.edge}" stroke-width="1.8"/><path d="M38 29C52 2 69 4 64 22c-3 11-14 14-26 11" fill="${tone.wing2}" stroke="${tone.edge}" stroke-width="1.8"/><path d="M34 33C22 54 8 52 13 39c3-8 11-10 21-7" fill="${tone.wing2}" stroke="${tone.edge}" stroke-width="1.6"/><path d="M38 33c12 21 26 19 21 6-3-8-11-10-21-7" fill="${tone.wing}" stroke="${tone.edge}" stroke-width="1.6"/></g><ellipse cx="36" cy="30" rx="2.7" ry="14" fill="#050005"/><path d="M35 17c-5-7-8-8-11-9M37 17c5-7 8-8 11-9" fill="none" stroke="${tone.edge}" stroke-width="1.2" stroke-linecap="round"/><circle cx="${index % 2 ? 20 : 52}" cy="20" r="2" fill="#fff" opacity=".55"/></svg>`;

  safeButterflyZones.forEach(([x, y], index) => {
    const tone = palette[index % palette.length];
    const butterfly = document.createElement('div');
    butterfly.className = `alice-butterfly alice-butterfly-${index % 4 === 0 ? 'pink' : index % 4 === 1 ? 'blue' : index % 4 === 2 ? 'white' : 'black'}`;
    butterfly.innerHTML = butterflySvg(tone, index);
    butterfly.style.left = `${x}%`;
    butterfly.style.top = `${y}%`;
    butterfly.style.setProperty('--float-time', `${9 + Math.random() * 4}s`);
    butterfly.style.setProperty('--orbit-x', `${5 + Math.random() * 7}px`);
    butterfly.style.setProperty('--orbit-y', `${5 + Math.random() * 7}px`);
    butterfly.style.setProperty('--glow', tone.glow);
    butterfly.style.animationDelay = `${(-Math.random() * 8).toFixed(2)}s`;
    butterflyPlane.append(butterfly);
  });
  wallpaperFrame?.prepend(butterflyPlane);

  if (gallery) {
    states.forEach((state, index) => {
      const figure = document.createElement('figure');
      const button = document.createElement('button');
      const image = document.createElement('img');
      const caption = document.createElement('figcaption');

      button.type = 'button';
      button.className = 'alice-state-card';
      button.dataset.aliceStateIndex = String(index);
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', `Selecionar estado ${state.estado.replaceAll('-', ' ')}`);
      image.src = state.wallpaper;
      image.alt = '';
      image.loading = 'lazy';
      caption.textContent = state.frases[0];
      button.append(image, caption);
      figure.append(button);
      gallery.append(figure);

      button.addEventListener('click', () => {
        renderState(index, true);
        document.querySelector('#alice-topo')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      });

      image.addEventListener('error', () => figure.classList.add('missing-wallpaper'), { once: true });
    });
  }

  heroImage?.addEventListener('error', () => {
    heroImage.hidden = true;
    wallpaperFrame?.setAttribute('data-missing-asset', 'true');
  });

  renderState(readInitialState(), true);

  const sectionLinks = [...document.querySelectorAll('.nav-panel a[href^="#"]')];
  const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const navGroup = document.querySelector('.nav-group');
  const closeAliceMenu = () => {
    if (navGroup?.hasAttribute('open')) navGroup.removeAttribute('open');
    const nav = document.querySelector('#main-nav');
    const toggle = document.querySelector('.menu-toggle');
    if (nav) nav.dataset.open = 'false';
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  };
  const setActiveSection = (id) => {
    sectionLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  if (sections.length && 'IntersectionObserver' in window) {
    let currentSection = '';
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible?.target?.id || visible.target.id === currentSection) return;
      currentSection = visible.target.id;
      setActiveSection(currentSection);
    }, { rootMargin: '-18% 0px -58% 0px', threshold: [0.08, 0.25, 0.5] });
    sections.forEach((section) => observer.observe(section));
  }

  if (window.location.hash) {
    const initialId = window.location.hash.slice(1);
    if (sections.some((section) => section.id === initialId)) setActiveSection(initialId);
  }

  // Carrosseis editoriais: scroll-snap nativo + avanço automático discreto.
  // Sem botões artificiais; toque, trackpad, teclado e swipe continuam nativos.
  const autoCarousels = [...document.querySelectorAll('.alice-card-grid, #regras .memory-grid')];
  autoCarousels.forEach((track, trackIndex) => {
    let paused = false;
    let timer = null;
    const cards = [...track.children].filter((node) => node.matches('article'));
    if (cards.length < 2) return;

    const advance = () => {
      if (paused || prefersReducedMotion || document.hidden) return;
      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      let current = 0;
      let distance = Infinity;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const nextDistance = Math.abs(cardCenter - center);
        if (nextDistance < distance) { distance = nextDistance; current = index; }
      });
      cards[(current + 1) % cards.length].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };

    const schedule = () => {
      if (prefersReducedMotion) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        advance();
        schedule();
      }, 5200 + trackIndex * 600);
    };
    const pause = () => { paused = true; clearTimeout(timer); };
    const resume = () => { paused = false; schedule(); };

    track.classList.add('is-auto-scrolling');
    track.addEventListener('pointerenter', pause);
    track.addEventListener('pointerleave', resume);
    track.addEventListener('focusin', pause);
    track.addEventListener('focusout', resume);
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', () => setTimeout(resume, 1800), { passive: true });
    schedule();
  });

  sectionLinks.forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    closeAliceMenu();
    target?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    if (target?.id) history.pushState(null, '', `#${target.id}`);
  }));
}
