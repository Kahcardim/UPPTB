(() => {
  const form = document.querySelector('[data-terminal-form]');
  const input = document.querySelector('[data-terminal-input]');
  const output = document.querySelector('#terminal-output');
  if (!form || !input || !output) return;
  const initial = output.textContent;
  const lore = [
    'Robin perdeu de novo. Multi continua trabalhando.',
    'Turtle Step não mede velocidade. Mede estabilidade.',
    'F5 = mapa novo, localização desconhecida, boa sorte.',
    'Uma evidência plausível não é necessariamente uma evidência válida.'
  ];
  const status = () => [
    'reitoria ............ online',
    'qa .................. desconfiado',
    'robin ................ provavelmente perdeu',
    'multi ................ reborn',
    'campus ................ 5 páginas',
    'efeito alice .......... ativo'
  ].join('\n');
  function execute(raw) {
    const command = raw.trim().toLowerCase();
    if (!command) return '';
    if (command === 'help') return 'help · status · lore · clear';
    if (command === 'status') return status();
    if (command === 'lore') return lore[Math.floor(Math.random() * lore.length)];
    if (command === 'clear') return '';
    return 'Comando desconhecido: "' + raw.trim() + '". Digite "help".';
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const raw = input.value;
    const result = execute(raw);
    output.textContent = raw.trim().toLowerCase() === 'clear' ? '' : '$ ' + raw.trim() + '\n' + result;
    input.value = '';
    input.focus();
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      output.textContent = initial;
      input.blur();
    }
  });
})();
