# UPPTB | Gate 2 — Escopo V1

**Status:** candidato para QA/PO  
**Data:** 9 de setembro de 2026  
**Branch:** `feature/home-v1-requirements`

## Objetivo

Fechar o que a V1 precisa conter antes de definir arquitetura de informação, arquitetura técnica e implementação visual. Este gate define fronteiras de produto. Não define ainda URLs finais, framework de frontend, estratégia de renderização, cache, banco, hospedagem ou componentes.

## Regra de produto

A UPPTB é uma universidade informal e fictícia que funciona como laboratório pessoal de aprendizado, tecnologia, QA e projetos. A experiência não será simplificada para agradar recrutadores. Clareza estrutural continua obrigatória, mas a identidade, a descoberta, o humor e a lore fazem parte do produto.

## Escopo obrigatório da V1

### 1. Home

A Home deve funcionar como entrada para o universo UPPTB, sem tentar explicar todo o projeto de uma vez. Deve apresentar identidade, acesso aos principais destinos e sinais claros de que há metodologia, estudo, laboratórios, projetos, documentos e lore por trás da experiência.

A Home não será detalhada neste gate. Sua composição exata será consequência dos Gates 3 a 7.

### 2. Quem é a UPPTB

Área para explicar o significado da sigla, a natureza informal/fictícia da universidade, propósito, princípios e o motivo de existir.

Não deve sugerir credenciamento acadêmico, emissão de diploma reconhecido, matrícula formal ou vínculo com instituição de ensino real.

### 3. Como surgiu

Área histórica com origem do projeto, evolução das ideias, Turtle Step, contexto dos easter eggs e marcos que explicam como o caos virou produto.

Fatos históricos e lore devem ser distinguíveis. Lacunas não podem ser completadas por invenção apresentada como fato.

### 4. Graduação Peculiar

A V1 deve conter uma camada acadêmica informal. O nome de navegação final e a posição na arquitetura serão definidos no Gate 3, mas o conceito entra no escopo agora.

A graduação informal deve conseguir acomodar pelo menos:

- Turtle Step V1 — Learning
- Turtle Step V2 — Projects
- Turtle Step V3 — Life
- Turtle Drill
- Turtle Talk
- Negation and Negation
- Turtle Suicide

Esses conteúdos podem ser organizados como métodos, disciplinas, trilhas, módulos ou outra estrutura coerente. O Gate 3 decidirá a relação entre eles. A V1 não precisa simular grade curricular universitária tradicional.

### 5. Laboratórios

A V1 deve prever áreas de experimentação real, não apenas páginas de lore.

Escopo mínimo:

- Beyblade Lab: lógica, programação contextualizada, experimentos e futuros registros práticos.
- QA Lab: requisitos, testes, bugs, análise de risco, validações e experiências de qualidade.
- Projects Lab: aplicação prática do aprendizado em projetos reais ou experimentais.

O Gate 3 decidirá se esses laboratórios ficam dentro da Graduação Peculiar, como áreas independentes ou em estrutura híbrida.

### 6. Beyblade

Destino já definido no menu original. Deve reunir a camada de fã, contexto educacional, experimentos relacionados e identidade visual/lore associada ao aprendizado com Beyblade.

Não autoriza uso irrestrito de ativos oficiais protegidos. Decisões de propriedade intelectual e ativos serão tratadas nos gates técnicos e de conteúdo.

### 7. Army Turtle

Área de identidade, espírito de equipe e universo próprio. Na V1 pode começar como conteúdo editorial/lore, sem necessidade de funcionalidade social, ranking ou comunidade.

### 8. MULTI

Área dedicada à personagem/lore MULTI e ao que estiver explicitamente validado como cânone do projeto.

A V1 não deve inventar fatos futuros como se já tivessem ocorrido.

### 9. New Tamar World

Área que representa a visão de longo prazo ligada ao universo das tartarugas e conservação. Deve deixar claro que é conceito próprio da UPPTB e não afiliação, propriedade ou extensão do Projeto TAMAR.

Na V1, o foco é apresentar visão, origem e contexto. Não entra operação de ONG, doação, adoção, cadastro ambiental ou atividade institucional real.

### 10. Downloads / Arquivo Histórico

A V1 deve prever uma área pública para documentos históricos e materiais do projeto.

Cada item publicado deve poder apresentar, no mínimo:

- título
- versão
- data
- descrição
- tipo de arquivo
- contexto

O Arquivo Colossal de Lore & Easter Eggs é um candidato explícito para essa área. A arquitetura de armazenamento e entrega será definida depois.

### 11. Banco de frases e easter eggs

O catálogo existente continua como fonte editorial, não como obrigação de exibir todas as frases.

A V1 deve suportar seleção controlada de frases públicas e easter eggs. Frases classificadas como caos interno não entram automaticamente na interface.

Easter eggs não podem bloquear navegação, esconder informação crítica, prejudicar acessibilidade ou comprometer código legível.

### 12. Evidência técnica

A V1 deve preservar e expor, onde fizer sentido, a existência de engenharia real por trás do produto: código, documentação, testes, decisões e histórico do projeto.

Isso não significa transformar a UX em portfólio para recrutador. O código e os artefatos técnicos devem ser verificáveis sem governar a identidade visual ou editorial.

## Escopo técnico funcional da V1

O produto deve possuir backend Node.js/Express desde a V1, conforme decisão já aprovada. O backend deve continuar oferecendo health check e poderá evoluir para disponibilizar conteúdo aprovado por contratos versionados.

Este gate não decide quais conteúdos serão servidos por API, quais serão empacotados no build ou quais serão estáticos. Essa decisão pertence aos Gates 4 e 5.

A V1 deve ser preparada para múltiplas páginas, conteúdo editorial crescente, imagens, documentos para download, laboratórios e expansão futura sem exigir reescrita completa da estrutura.

## Fora do escopo da V1

Não entram nesta versão, salvo nova mudança formal de escopo:

- autenticação de usuários
- cadastro real de alunos
- matrícula real
- emissão de diplomas ou certificados reconhecidos
- pagamentos
- fórum
- chat
- ranking competitivo
- painel administrativo completo
- comunidade social própria
- sistema de notas acadêmicas
- banco de dados remoto por obrigação arquitetural
- microsserviços apenas por antecipação
- filas, Redis, Kubernetes ou infraestrutura distribuída sem necessidade comprovada
- operação ambiental ou institucional real do New Tamar World
- plataforma completa de Beyblade TCG

Esses itens podem existir em backlog futuro, mas não são dependências para a V1.

## Regras de crescimento

1. Conteúdo novo não cria item novo de menu automaticamente.
2. Lore nova não cria requisito funcional automaticamente.
3. Ideia aprovada para arquivo histórico não equivale a feature aprovada.
4. O site deve conseguir crescer em profundidade antes de crescer descontroladamente em navegação principal.
5. Nenhuma decisão deste gate autoriza implementação visual antes dos gates de arquitetura, dados, RNFs e qualidade.

## Critérios de aceite do Gate 2

O Gate 2 pode ser aprovado quando o PO/QA confirmar que:

1. os domínios de conteúdo essenciais da V1 estão representados;
2. a Graduação Peculiar e os modos de estudo estão dentro do produto;
3. os laboratórios reais estão previstos;
4. as sete áreas originalmente definidas não foram descartadas;
5. downloads e arquivo histórico estão contemplados;
6. o que está fora da V1 está explícito;
7. não foram tomadas decisões prematuras de arquitetura ou UI.

## Decisões deliberadamente adiadas

Ficam bloqueadas para os próximos gates:

- posição da Graduação Peculiar no menu
- relação entre Graduação, Labs e páginas atuais
- URLs e hierarquia de navegação
- sitemap
- frontend framework
- SSR, SSG ou SPA
- estratégia de assets
- CDN/cache
- persistência e banco
- endpoints de conteúdo
- hospedagem
- domínio
- CI/CD
- budgets de performance
- matriz completa de acessibilidade
- estratégia de testes da interface

## Próximo gate após aprovação

**Gate 3 — Arquitetura de Informação.**

**Frontend/Home:** continua bloqueado.
