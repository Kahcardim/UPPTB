# UPPTB

Laboratório de tecnologia, QA, Turtle Step, Beyblade e lore. Universidade imaginária, curiosidade de verdade.

## Estado do projeto

Fundação em **JavaScript + Node.js + Express**, com backend e framework desde a V1. **Frontend não iniciado.** Não há site publicado, banco remoto, login ou painel administrativo nesta etapa.

O **Gate 1 — Benchmark** foi aprovado pelo PO/QA. As correções aprovadas estabelecem que recrutadores não governam a experiência da UPPTB e que a dimensão acadêmica informal faz parte real do produto. Turtle Step V1/V2/V3, Turtle Drill, Turtle Talk, Negation and Negation, Turtle Suicide e os laboratórios precisam caber na arquitetura futura sem virar automaticamente itens do menu principal.

## Executar localmente

Requer Node.js 24 LTS e pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm start
```

Acesse `http://127.0.0.1:3000/api/v1/health`. O servidor retorna JSON com `status: ok`.

`pnpm dev` reinicia o servidor ao editar arquivos. `PORT` e `HOST` podem ser definidos no ambiente. `.env.example` é uma referência; o arquivo não é carregado automaticamente. Para carregar um `.env` local com Node, use `node --env-file=.env src/server.js`. O padrão limita o acesso à máquina local. Nunca envie segredos ao Git.

## Estrutura

```text
src/       aplicação e inicialização do servidor
tests/     testes de contrato e integridade do catálogo
content/   255 frases candidatas em JSON
docs/      escopo, arquitetura, benchmarks e documentos editáveis
```

## Documentação

- [Documento editável em DOCX](docs/UPPTB-escopo-e-banco-de-frases.docx)
- [Escopo e banco de frases em Markdown](docs/escopo-e-frases.md)
- [Arquitetura e limites da base](docs/architecture.md)
- [Gate 1 — Benchmark aprovado](docs/benchmark-gate-1.md)

O catálogo tem 17 categorias: Home, Turtle Step, Robin, Multi, Army Turtle, QA, DEV, universidade/lore, erros/404, loading, easter eggs, rodapé, commits, mensagens internas, frases de impacto, Beyblade e New Tamar World.

As 102 candidatas públicas, 68 easter eggs e 85 frases de caos interno continuam como rascunhos. “Público” é uma indicação editorial, não seleção automática para a interface. As piadas são propostas criativas e não estabelecem fatos canônicos.

## Processo por gates

Gate 1 — Benchmark: **aprovado**.  
Próximo gate permitido: **Gate 2 — Escopo V1**.  
Frontend/Home: **bloqueado até os gates anteriores serem concluídos e aprovados**.

A escolha de hospedagem e a publicação do site permanecem para etapas posteriores.
