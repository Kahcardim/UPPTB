const alicePageRoot = document.documentElement;

if (alicePageRoot.dataset.page === 'alice') {
  const aliceStates = [
    { alice: 'Você não precisa controlar tudo.', cat: 'Então por que sua mão ainda está no painel?', cta: 'Soltar uma variável', wallpaper: 'assets/alice-wallpapers/01_voce_nao_precisa_controlar_tudo.png' },
    { alice: 'Entender não obriga você a interferir.', cat: 'Você entendeu. Agora consegue suportar não mexer?', cta: 'Observar sem tocar', wallpaper: 'assets/alice-wallpapers/02_entender_nao_obriga_voce_a_interferir.png' },
    { alice: 'Nem toda variável é sua.', cat: 'Curioso. Quantas variáveis alheias você tentou adotar hoje?', cta: 'Devolver uma variável', wallpaper: 'assets/alice-wallpapers/03_nem_toda_variavel_e_sua.png' },
    { alice: 'Aceitar não significa gostar.', cat: 'E gostar nunca foi requisito para reconhecer o resultado.', cta: 'Aceitar o estado atual', wallpaper: 'assets/alice-wallpapers/04_aceitar_nao_significa_gostar.png' },
    { alice: 'Tudo talvez.', cat: 'Inclusive aquilo que você acabou de chamar de certeza.', cta: 'Executar talvez', wallpaper: 'assets/alice-wallpapers/05_tudo_talvez.png' },
    { alice: 'O segundo mudou.', cat: 'Seu plano recebeu a atualização ou ainda está preso no segundo anterior?', cta: 'Ler o segundo atual', wallpaper: 'assets/alice-wallpapers/06_o_segundo_mudou.png' },
    { alice: 'Sai da sala de controle.', cat: 'O sistema continua existindo mesmo quando você não está olhando.', cta: 'Abrir a porta', wallpaper: 'assets/alice-wallpapers/07_sai_da_sala_de_controle.png' },
    { alice: 'Eu cuido disso daqui.', cat: 'Você criou uma administradora e ainda quer cobrir o turno dela?', cta: 'Deixar Alice trabalhar', wallpaper: 'assets/alice-wallpapers/08_eu_cuido_disso_daqui.png' },
    { alice: 'Você consegue prever. Não precisa dominar.', cat: 'Previsão é informação. Quando foi que ela virou ordem?', cta: 'Prever sem possuir', wallpaper: 'assets/alice-wallpapers/09_voce_consegue_prever_nao_precisa_dominar.png' },
    { alice: 'Erro não é identidade.', cat: 'Se um erro definisse alguém, qual versão sua estaria falando comigo agora?', cta: 'Separar pessoa e falha', wallpaper: 'assets/alice-wallpapers/10_erro_nao_e_identidade.png' },
    { alice: 'Vai viver também, caralho.', cat: 'Ou você pretende transformar a vida inteira em ambiente de homologação?', cta: 'Sair do painel', wallpaper: 'assets/alice-wallpapers/11_vai_viver_tambem_caralho.png' },
    { alice: 'Eu sei que é chato. Por isso eu existo.', cat: 'Você queria liberdade ou só um controle com interface mais bonita?', cta: 'Aceitar o incômodo', wallpaper: 'assets/alice-wallpapers/12_eu_sei_que_e_chato_por_isso_eu_existo.png' },
    { alice: 'Alice está administrando o caos.', cat: 'Ótimo. Então por que o fundador ainda está auditando cada borboleta?', cta: 'Confiar na ADM', wallpaper: 'assets/alice-wallpapers/13_alice_esta_administrando_o_caos.png' },
    { alice: 'Kauan, larga o painel.', cat: 'Ele ouviu. A dúvida é se vai obedecer antes de criar outra função.', cta: 'Largar por um segundo', wallpaper: 'assets/alice-wallpapers/14_kauan_larga_o_painel.png' },
    { alice: 'Hoje você só precisa existir nesse segundo.', cat: 'E se o próximo segundo não precisar de uma tarefa?', cta: 'Ficar neste segundo', wallpaper: 'assets/alice-wallpapers/15_hoje_voce_so_precisa_existir_nesse_segundo.png' }
  ];

  const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
  const state = randomItem(aliceStates);
  const hero = document.querySelector('.alice-hero');
  const quote = document.querySelector('[data-alice-quote]');
  const cta = document.querySelector('[data-alice-cta]');
  const heroImage = document.querySelector('[data-alice-wallpaper]');
  const heroVisual = document.querySelector('.alice-hero-visual');
  const catZone = document.querySelector('[data-alice-cat-zone]');

  const side = Math.random() < 0.5 ? 'left' : 'right';
  if (hero) hero.dataset.side = side;
  if (quote) quote.textContent = state.alice;
  if (cta) cta.textContent = state.cta;
  if (heroImage) {
    heroImage.src = state.wallpaper;
    heroImage.alt = '';
    heroImage.addEventListener('error', () => {
      heroImage.hidden = true;
      heroImage.parentElement?.setAttribute('data-missing-asset', 'true');
    }, { once: true });
  }

  const catSvg = `<svg viewBox="0 0 260 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gato exclusivo da Alice"><defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M53 73 38 35l42 20c17-10 63-10 84 2l48-23-17 46c14 16 17 44 6 64-16 29-53 38-89 33-41-5-68-28-70-61-1-17 3-31 11-43Z" fill="#0b0209" stroke="#ff4fa3" stroke-width="5"/><path d="M81 101c9-11 22-11 31 0M149 101c9-11 22-11 31 0" fill="none" stroke="#ff8dc6" stroke-width="5" stroke-linecap="round" filter="url(#glow)"/><path d="M126 118l8 0-4 7Z" fill="#ff4fa3"/><path d="M111 132c12 10 28 10 40 0" fill="none" stroke="#d7a2bf" stroke-width="3" stroke-linecap="round"/><text x="130" y="184" text-anchor="middle" fill="#ff8dc6" font-size="13" font-family="monospace" font-weight="800">GATO // ALICE</text></svg>`;
  const cat = document.createElement('div');
  cat.className = 'alice-cat';
  cat.setAttribute('aria-live', 'polite');
  cat.innerHTML = `${catSvg}<div class="alice-cat-bubble"></div>`;
  const catBubble = cat.querySelector('.alice-cat-bubble');
  if (catBubble) catBubble.textContent = state.cat;
  catZone?.append(cat);

  // O gato continua imprevisível, mas só anda dentro do próprio espaço seguro.
  const safeCatPositions = [
    [3, 12], [36, 7], [68, 13], [18, 22], [54, 20]
  ];
  let lastCatPosition = -1;
  const moveCat = () => {
    if (!cat || !catZone) return;
    let next = Math.floor(Math.random() * safeCatPositions.length);
    if (safeCatPositions.length > 1 && next === lastCatPosition) next = (next + 1) % safeCatPositions.length;
    lastCatPosition = next;
    const [x, y] = safeCatPositions[next];
    const mobile = window.innerWidth <= 760;
    cat.style.left = `${mobile ? Math.min(x, 52) : x}%`;
    cat.style.top = `${mobile ? Math.min(y, 14) : y}%`;
    cat.style.transform = `rotate(${(Math.random() * 4 - 2).toFixed(1)}deg)`;
  };
  moveCat();
  window.setInterval(moveCat, 6500);

  // As 15 borboletas pertencem ao espaço visual da Alice e nunca atravessam o texto.
  const butterflyPlane = document.createElement('div');
  butterflyPlane.className = 'alice-butterfly-plane';
  butterflyPlane.setAttribute('aria-hidden', 'true');
  const palette = [
    { wing: '#ff4fa3', wing2: '#ff9ccd', edge: '#ffd2e8', glow: 'rgba(255,79,163,.38)' },
    { wing: '#45a7ff', wing2: '#8dd1ff', edge: '#d9f1ff', glow: 'rgba(69,167,255,.38)' },
    { wing: '#080008', wing2: '#2d1229', edge: '#ff79ba', glow: 'rgba(255,79,163,.24)' }
  ];
  const zones = [[6,7],[28,2],[72,4],[91,13],[4,29],[88,34],[5,54],[92,58],[7,78],[30,91],[68,90],[91,82],[18,68],[80,69],[49,95]];
  const butterflySvg = (tone, index) => `<svg viewBox="0 0 72 58" xmlns="http://www.w3.org/2000/svg"><g class="butterfly-wings"><path d="M34 29C20 2 3 4 8 22c3 11 14 14 26 11" fill="${tone.wing}" stroke="${tone.edge}" stroke-width="1.8"/><path d="M38 29C52 2 69 4 64 22c-3 11-14 14-26 11" fill="${tone.wing2}" stroke="${tone.edge}" stroke-width="1.8"/><path d="M34 33C22 54 8 52 13 39c3-8 11-10 21-7" fill="${tone.wing2}" stroke="${tone.edge}" stroke-width="1.6"/><path d="M38 33c12 21 26 19 21 6-3-8-11-10-21-7" fill="${tone.wing}" stroke="${tone.edge}" stroke-width="1.6"/></g><ellipse cx="36" cy="30" rx="2.7" ry="14" fill="#050005"/><path d="M35 17c-5-7-8-8-11-9M37 17c5-7 8-8 11-9" fill="none" stroke="${tone.edge}" stroke-width="1.2" stroke-linecap="round"/><circle cx="${index % 2 ? 20 : 52}" cy="20" r="2" fill="#fff" opacity=".55"/></svg>`;
  zones.forEach(([x, y], index) => {
    const tone = palette[index % palette.length];
    const butterfly = document.createElement('div');
    butterfly.className = `alice-butterfly alice-butterfly-${index % 3 === 0 ? 'pink' : index % 3 === 1 ? 'blue' : 'black'}`;
    butterfly.innerHTML = butterflySvg(tone, index);
    butterfly.style.left = `${x + (Math.random() * 2 - 1)}%`;
    butterfly.style.top = `${y + (Math.random() * 2 - 1)}%`;
    butterfly.style.setProperty('--float-time', `${9 + Math.random() * 4}s`);
    butterfly.style.setProperty('--orbit-x', `${8 + Math.random() * 12}px`);
    butterfly.style.setProperty('--orbit-y', `${8 + Math.random() * 10}px`);
    butterfly.style.setProperty('--glow', tone.glow);
    butterfly.style.animationDelay = `${(-Math.random() * 8).toFixed(2)}s`;
    butterflyPlane.append(butterfly);
  });
  heroVisual?.prepend(butterflyPlane);

  document.querySelectorAll('[data-gallery-wallpaper]').forEach((image, index) => {
    const entry = aliceStates[index];
    if (!entry) return;
    image.src = entry.wallpaper;
    image.alt = '';
    image.addEventListener('error', () => {
      image.hidden = true;
      image.parentElement?.classList.add('missing-wallpaper');
    }, { once: true });
  });

  const sectionLinks = [...document.querySelectorAll('.nav-panel a[href^="#"]')];
  const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const navGroup = document.querySelector('.nav-group');
  const closeAliceMenu = () => {
    if (navGroup?.hasAttribute('open')) navGroup.removeAttribute('open');
    const nav = document.querySelector('#main-nav');
    const toggle = document.querySelector('.menu-toggle');
    if (nav) nav.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  };
  const setActiveSection = (id) => {
    sectionLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
    });
  };
  const scrollToSection = (section, updateHash = false) => {
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (updateHash && section.id) history.pushState(null, '', `#${section.id}`);
  };

  if (sections.length && 'IntersectionObserver' in window) {
    let currentSection = '';
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible?.target?.id || visible.target.id === currentSection) return;
      currentSection = visible.target.id;
      setActiveSection(currentSection);
      closeAliceMenu();
      moveCat();
    }, { rootMargin: '-18% 0px -58% 0px', threshold: [0.08, 0.25, 0.5] });
    sections.forEach((section) => observer.observe(section));
  }

  if (window.location.hash) {
    const initialId = window.location.hash.slice(1);
    if (sections.some((section) => section.id === initialId)) setActiveSection(initialId);
  }

  sectionLinks.forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    closeAliceMenu();
    scrollToSection(target, true);
  }));

  // O navegador preserva a rolagem natural. Alice não empurra o usuário para outra seção.
  window.addEventListener('scroll', closeAliceMenu, { passive: true });
}
