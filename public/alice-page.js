const alicePageRoot = document.documentElement;

if (alicePageRoot.dataset.page === 'alice') {
  const aliceStates = [
    {
      alice: 'Você não precisa controlar tudo.',
      cat: 'Então por que sua mão ainda está no painel?',
      cta: 'Soltar uma variável',
      wallpaper: 'assets/alice-wallpapers/01_voce_nao_precisa_controlar_tudo.png'
    },
    {
      alice: 'Entender não obriga você a interferir.',
      cat: 'Você entendeu. Agora consegue suportar não mexer?',
      cta: 'Observar sem tocar',
      wallpaper: 'assets/alice-wallpapers/02_entender_nao_obriga_voce_a_interferir.png'
    },
    {
      alice: 'Nem toda variável é sua.',
      cat: 'Curioso. Quantas variáveis alheias você tentou adotar hoje?',
      cta: 'Devolver uma variável',
      wallpaper: 'assets/alice-wallpapers/03_nem_toda_variavel_e_sua.png'
    },
    {
      alice: 'Aceitar não significa gostar.',
      cat: 'E gostar nunca foi requisito para reconhecer o resultado.',
      cta: 'Aceitar o estado atual',
      wallpaper: 'assets/alice-wallpapers/04_aceitar_nao_significa_gostar.png'
    },
    {
      alice: 'Tudo talvez.',
      cat: 'Inclusive aquilo que você acabou de chamar de certeza.',
      cta: 'Executar talvez',
      wallpaper: 'assets/alice-wallpapers/05_tudo_talvez.png'
    },
    {
      alice: 'O segundo mudou.',
      cat: 'Seu plano recebeu a atualização ou ainda está preso no segundo anterior?',
      cta: 'Ler o segundo atual',
      wallpaper: 'assets/alice-wallpapers/06_o_segundo_mudou.png'
    },
    {
      alice: 'Sai da sala de controle.',
      cat: 'O sistema continua existindo mesmo quando você não está olhando.',
      cta: 'Abrir a porta',
      wallpaper: 'assets/alice-wallpapers/07_sai_da_sala_de_controle.png'
    },
    {
      alice: 'Eu cuido disso daqui.',
      cat: 'Você criou uma administradora e ainda quer cobrir o turno dela?',
      cta: 'Deixar Alice trabalhar',
      wallpaper: 'assets/alice-wallpapers/08_eu_cuido_disso_daqui.png'
    },
    {
      alice: 'Você consegue prever. Não precisa dominar.',
      cat: 'Previsão é informação. Quando foi que ela virou ordem?',
      cta: 'Prever sem possuir',
      wallpaper: 'assets/alice-wallpapers/09_voce_consegue_prever_nao_precisa_dominar.png'
    },
    {
      alice: 'Erro não é identidade.',
      cat: 'Se um erro definisse alguém, qual versão sua estaria falando comigo agora?',
      cta: 'Separar pessoa e falha',
      wallpaper: 'assets/alice-wallpapers/10_erro_nao_e_identidade.png'
    },
    {
      alice: 'Vai viver também, caralho.',
      cat: 'Ou você pretende transformar a vida inteira em ambiente de homologação?',
      cta: 'Sair do painel',
      wallpaper: 'assets/alice-wallpapers/11_vai_viver_tambem_caralho.png'
    },
    {
      alice: 'Eu sei que é chato. Por isso eu existo.',
      cat: 'Você queria liberdade ou só um controle com interface mais bonita?',
      cta: 'Aceitar o incômodo',
      wallpaper: 'assets/alice-wallpapers/12_eu_sei_que_e_chato_por_isso_eu_existo.png'
    },
    {
      alice: 'Alice está administrando o caos.',
      cat: 'Ótimo. Então por que o fundador ainda está auditando cada borboleta?',
      cta: 'Confiar na ADM',
      wallpaper: 'assets/alice-wallpapers/13_alice_esta_administrando_o_caos.png'
    },
    {
      alice: 'Kauan, larga o painel.',
      cat: 'Ele ouviu. A dúvida é se vai obedecer antes de criar outra função.',
      cta: 'Largar por um segundo',
      wallpaper: 'assets/alice-wallpapers/14_kauan_larga_o_painel.png'
    },
    {
      alice: 'Hoje você só precisa existir nesse segundo.',
      cat: 'E se o próximo segundo não precisar de uma tarefa?',
      cta: 'Ficar neste segundo',
      wallpaper: 'assets/alice-wallpapers/15_hoje_voce_so_precisa_existir_nesse_segundo.png'
    }
  ];

  const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
  const state = randomItem(aliceStates);
  const side = Math.random() < 0.5 ? 'left' : 'right';

  const hero = document.querySelector('.alice-hero');
  const quote = document.querySelector('[data-alice-quote]');
  const cta = document.querySelector('[data-alice-cta]');
  const heroImage = document.querySelector('[data-alice-wallpaper]');

  if (hero) hero.dataset.side = side;
  if (quote) quote.textContent = state.alice;
  if (cta) cta.textContent = state.cta;
  if (heroImage) {
    heroImage.src = state.wallpaper;
    heroImage.alt = `Wallpaper da Alice com a frase: ${state.alice}`;
    heroImage.addEventListener('error', () => {
      heroImage.hidden = true;
      heroImage.parentElement?.setAttribute('data-missing-asset', 'true');
    }, { once: true });
  }

  const catSvg = `
    <svg viewBox="0 0 260 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gato exclusivo da Alice">
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M53 73 38 35l42 20c17-10 63-10 84 2l48-23-17 46c14 16 17 44 6 64-16 29-53 38-89 33-41-5-68-28-70-61-1-17 3-31 11-43Z" fill="#0b0209" stroke="#ff4fa3" stroke-width="5"/>
      <path d="M81 101c9-11 22-11 31 0M149 101c9-11 22-11 31 0" fill="none" stroke="#ff8dc6" stroke-width="5" stroke-linecap="round" filter="url(#glow)"/>
      <path d="M126 118l8 0-4 7Z" fill="#ff4fa3"/>
      <path d="M111 132c12 10 28 10 40 0" fill="none" stroke="#d7a2bf" stroke-width="3" stroke-linecap="round"/>
      <path d="M48 127c-22 6-31 20-32 37M207 126c26 7 37 22 38 43" fill="none" stroke="#ff4fa3" stroke-width="4" stroke-linecap="round"/>
      <text x="130" y="184" text-anchor="middle" fill="#ff8dc6" font-size="13" font-family="monospace" font-weight="800">GATO // ALICE</text>
    </svg>`;

  const cat = document.createElement('aside');
  cat.className = `alice-cat ${Math.random() < 0.5 ? 'left' : 'right'}`;
  cat.style.top = `${Math.floor(170 + Math.random() * 460)}px`;
  cat.innerHTML = `${catSvg}<div class="alice-cat-bubble"></div>`;
  const catBubble = cat.querySelector('.alice-cat-bubble');
  if (catBubble) catBubble.textContent = state.cat;
  document.querySelector('.alice-page-shell')?.append(cat);

  const butterflyPlane = document.createElement('div');
  butterflyPlane.className = 'alice-butterfly-plane';
  butterflyPlane.setAttribute('aria-hidden', 'true');

  const butterflySvg = (index) => `
    <svg viewBox="0 0 64 52" xmlns="http://www.w3.org/2000/svg">
      <path d="M31 26C18 1 2 3 7 20c3 10 13 13 24 11" fill="rgba(255,79,163,.${55 + (index % 4) * 8})" stroke="#ff9ccd" stroke-width="2"/>
      <path d="M33 26C46 1 62 3 57 20c-3 10-13 13-24 11" fill="rgba(255,127,189,.${48 + (index % 5) * 7})" stroke="#ff9ccd" stroke-width="2"/>
      <path d="M31 29C20 49 7 48 12 36c3-7 10-9 19-7" fill="rgba(255,79,163,.42)" stroke="#ff76b8" stroke-width="2"/>
      <path d="M33 29c11 20 24 19 19 7-3-7-10-9-19-7" fill="rgba(255,79,163,.42)" stroke="#ff76b8" stroke-width="2"/>
      <ellipse cx="32" cy="27" rx="3" ry="13" fill="#fff0f8"/>
    </svg>`;

  for (let index = 0; index < 15; index += 1) {
    const butterfly = document.createElement('div');
    butterfly.className = 'alice-butterfly';
    butterfly.innerHTML = butterflySvg(index);
    butterfly.style.left = `${4 + Math.random() * 91}%`;
    butterfly.style.top = `${2 + Math.random() * 94}%`;
    butterfly.style.setProperty('--float-time', `${6 + Math.random() * 8}s`);
    butterfly.style.setProperty('--drift-x', `${Math.floor(-40 + Math.random() * 80)}px`);
    butterfly.style.setProperty('--drift-y', `${Math.floor(-60 + Math.random() * 80)}px`);
    butterfly.style.setProperty('--rot-a', `${Math.floor(-18 + Math.random() * 20)}deg`);
    butterfly.style.setProperty('--rot-b', `${Math.floor(-5 + Math.random() * 30)}deg`);
    butterfly.style.animationDelay = `${(-Math.random() * 7).toFixed(2)}s`;
    butterflyPlane.append(butterfly);
  }

  document.querySelector('.alice-page-shell')?.prepend(butterflyPlane);

  document.querySelectorAll('[data-gallery-wallpaper]').forEach((image, index) => {
    const entry = aliceStates[index];
    if (!entry) return;
    image.src = entry.wallpaper;
    image.alt = entry.alice;
    image.addEventListener('error', () => {
      image.hidden = true;
      image.parentElement?.classList.add('missing-wallpaper');
    }, { once: true });
  });
}
