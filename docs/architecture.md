# Arquitetura inicial

## Decisão

Backend e framework entram na V1 para reduzir retrabalho estrutural posterior. A decisão não elimina refatorações. JavaScript e Node.js foram escolhidos pelo fundador. Esta base adota Express como framework do servidor e Node.js 24 LTS como alvo.

O frontend não foi iniciado. A escolha de seu framework deve ocorrer antes das telas. Esta fundação não representa o site completo.

## Responsabilidades

- `src/app.js`: aplicação HTTP, independente da abertura da porta para permitir testes.
- `src/server.js`: processo e configuração por ambiente.
- `content/phrases.json`: catálogo editorial, sem endpoint público nesta base.
- `tests/`: contratos HTTP e integridade do catálogo.
- `docs/`: escopo, documento editável e decisões.

## Contrato atual

`GET /api/v1/health` retorna `200` e `{"status":"ok","service":"UPPTB"}`.
Rotas e métodos não implementados retornam `404` com `error.code=NOT_FOUND` e mensagem em português. HEAD na rota de saúde mantém a semântica HTTP de GET sem corpo.

## Conteúdo futuro

Frases têm `id`, `category`, `text`, `language`, `classification` e `status`. Todas são `draft`; classificação `public` indica adequação editorial sugerida, não aprovação. O futuro serviço de conteúdo deve filtrar explicitamente por aprovação e destino antes de expor frases na interface. Publicar o catálogo de desenvolvimento no GitHub não equivale a selecionar suas frases para a Home.

JSON versionado é persistência inicial de conteúdo, não um banco de dados. Banco, escrita, autenticação e painel só devem ser definidos quando houver requisitos correspondentes. Prever uma camada de acesso ao conteúdo na evolução das rotas, evitando vincular telas ao armazenamento.

## Pendências

Framework visual, banco se necessário, hospedagem, domínio, identidade visual, fonte e fatos canônicos da lore. Não há deploy nem workflow de produção nesta base.

## Referências

- [Express — instalação](https://expressjs.com/en/starter/installing/)
- [Node.js — versões e suporte](https://nodejs.org/en/about/previous-releases)

Consultadas em 9 de setembro de 2026.
