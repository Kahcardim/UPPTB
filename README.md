# UPPTB

**Universidade Pública Peculiar Turtle and Beys**

Laboratório autoral de QA, programação, inglês, Turtle Step, Beyblade e caos controlado. A universidade é fictícia. A engenharia, os testes e o aprendizado são reais.

## Stack atual

- Node.js 24 LTS
- pnpm 11.19.0
- Vite 7
- Express 5
- HTML5, CSS e JavaScript
- node:test
- GitHub Actions + GitHub Pages

## Desenvolvimento local

```sh
pnpm install
pnpm dev
```

O Vite serve o frontend em desenvolvimento. Para a API Express:

```sh
pnpm dev:api
```

Para validar antes de publicar:

```sh
pnpm test
pnpm build
pnpm smoke
```

A regressão está dividida em dois níveis: `tests/` protege contratos estáveis do produto e `scripts/smoke-dist.mjs` valida o build real em navegador. Testes antigos que apenas congelavam números de versão ou detalhes internos não fazem parte do gate atual.

## Arquitetura

```text
public/    páginas, scripts, estilos e assets do frontend
src/       aplicação Node.js / Express
tests/     contratos atuais de API e produto
scripts/   gates de build e smoke cross-browser
content/   catálogo editorial
docs/      arquitetura, requisitos atuais e histórico de gates
dist/      build de produção gerado pelo Vite, nunca versionado
```

O frontend é multipage: Home, Laboratório Beyblade, Desenvolvimento de Inglês, Memórias e Alice. O motor F5 distribui elementos do caos entre páginas normais. Alice permanece um domínio isolado.

## CI/CD

O pipeline executa instalação, regressão e build Vite. O deploy para GitHub Pages fica bloqueado quando o gate falha. O artefato publicado é gerado em `dist/`, não uma cópia manual de `public/`.

## Requisitos protegidos

O fóssil fundador da Home não deve ser corrigido:

> Let's rip, dude. Turtle Step. Robin loses. Multi reborn. Site created.

O Efeito Alice mantém a composição não determinística por F5 nas páginas do campus. Alice possui regras próprias e não recebe as tartarugas globais.

## Documentação

A pasta `docs/` contém os gates, arquitetura, escopo de regressão e o Forbidden Turtle Archive.

## Estado

Projeto em evolução contínua na branch de implementação. Mudanças relevantes passam pelo gate automatizado antes do deploy.


## Cache e estado local

Assets estáticos usam revisão explícita na URL para evitar CSS/JS antigo em navegador. Os registros locais de randomização também possuem schema versionado; quando o schema muda, chaves antigas da UPPTB são podadas automaticamente.

O cache de dependências do GitHub Actions usa `.github/cache-version` como parte da chave lógica. Alterar esse arquivo força uma nova geração sem precisar manter lixo de cache dentro do repositório.
