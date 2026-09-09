# UPPTB

# Escopo da V1 e banco de frases

Documento de trabalho editável • Versão 0.2 • 9 de setembro de 2026

Backend e framework fazem parte da V1 desde a origem. JavaScript é a linguagem escolhida e Node.js é o ambiente de execução do backend. A base inicial usa Express como framework de servidor.

A decisão busca reduzir a chance de uma troca estrutural posterior. Ela não elimina refatorações: a arquitetura deve continuar simples, documentada e ajustável conforme o produto amadurece.

Este documento reúne as decisões confirmadas, uma proposta atualizada de escopo e 255 frases em 17 categorias. Serve às frentes de Coordenação, Requisitos, Design, Desenvolvimento, QA e Conteúdo.

# Situação desta entrega

Documento e estrutura básica do backend autorizados. Repositório público: Kahcardim/UPPTB. Frontend não iniciado. Propostas editoriais e requisitos novos ainda dependem de seleção para a baseline do produto.

# Leitura sugerida

Decisões e limites → Escopo → Arquitetura → Qualidade → Sequência de trabalho → Guia editorial → Banco de frases. Use o painel de navegação do Word para acessar cada categoria.

---

# 1 Decisões e limites da V1

# Decisões confirmadas pelo usuário

D01 — Backend e framework entram na primeira versão. D02 — Linguagem JavaScript e backend em Node.js. D03 — Nome do repositório UPPTB, com visibilidade pública. D04 — Criar o básico agora; não iniciar o frontend nesta etapa.

# Identidade já solicitada

Verde como cor principal. Tipografia com a identidade de Beyblade, ainda sem arquivo de fonte definido. Menu fixo com Home, Quem é a UPPTB, Como surgiu, Beyblade, Army Turtle, MULTI e New Tamar World. Easter eggs relacionados a marcas importantes da história do projeto.

# Decisão técnica desta base

Express no servidor, escolhido para uma base pequena em JavaScript com rotas explícitas. Node.js é o ambiente de execução, não o framework. O framework visual do futuro frontend permanece por definir antes da implementação das telas.

# O que muda no escopo anterior

A análise deixa de perguntar se haverá backend e passa a definir suas responsabilidades, contratos, persistência e operação. A escolha de ferramentas deve respeitar essa premissa, sem adiar o servidor para uma V2.

# O que esta decisão não promete

Antecipar a fundação pode reduzir retrabalho estrutural, mas também traz manutenção e configuração desde cedo. Não há garantia de ausência de refatoração nem necessidade automática de microsserviços, login, painel administrativo ou banco remoto.

# Natureza do projeto

A visão consolidada é a de um laboratório pessoal e portfólio vivo que reúne tecnologia, QA, programação, Turtle Step, Beyblade e um universo ficcional. Universidade é parte da identidade criativa; a proposta não oferece formação acadêmica reconhecida.

---

# 2 Grande escopo inicial atualizado

A V1 proposta deve apresentar o universo UPPTB, organizar sua história e demonstrar uma base técnica real. As páginas abaixo são destinos de conteúdo solicitados; os detalhes funcionais são propostas para refinamento.

# Home e identidade

Home: apresentação curta, acesso às áreas principais e uma frase pública selecionada. Quem é a UPPTB: propósito, identidade e natureza experimental. Como surgiu: linha do tempo com fatos e referências fornecidos pelo fundador, sem completar lacunas com invenções.

# Áreas do universo

Beyblade: conteúdo de fã e registros de experimentos. Army Turtle: identidade e espírito de equipe. MULTI: página de personagem e lore validada. New Tamar World: apresentação do universo, cuja definição detalhada ainda está pendente.

# Turtle Step e projetos

Proposta: organizar aprendizados e projetos dentro das áreas existentes antes de ampliar o menu. Cada registro pode apresentar objetivo, tentativa, aprendizado e próximo passo. Turtle Step não ganha uma nova entrada de menu automaticamente.

# Conteúdo e frases

Proposta: catálogo versionado com identificador, categoria, idioma, classificação editorial e estado de aprovação. O documento contém todas as candidatas; somente frases selecionadas devem entrar em uma futura interface principal.

# Fora da primeira base

Não implementar agora telas, componentes visuais, autenticação, matrícula, emissão de diplomas, pagamentos, ranking, fórum ou painel administrativo. Essas funcionalidades exigem necessidade explícita e requisitos próprios. Nenhum deploy faz parte desta entrega.

# Entregável básico autorizado

Servidor executável, rota de saúde, resposta JSON para rota inexistente, testes essenciais, comandos de execução, configuração de exemplo, documentação de arquitetura e catálogo de frases. O conteúdo é inicial e não representa a V1 completa do site.

---

# 3 Arquitetura da primeira versão

# Organização proposta

Um repositório e um backend modular. src/app.js configura a aplicação; src/server.js inicia o servidor; tests contém verificações; content guarda o catálogo editorial; docs registra escopo e decisões. Não criar a pasta de frontend com telas provisórias.

# Responsabilidades do servidor

Nesta base, responder GET /api/v1/health com status 200 e JSON; retornar 404 JSON para rotas inexistentes. Na evolução da V1, disponibilizar apenas o conteúdo aprovado por meio de contratos versionados. O servidor não deve depender da estrutura de uma tela.

# Contrato de conteúdo proposto

Frase: id, category, text, language, classification e status. Classificações: public, easter_egg e internal_chaos. Estado inicial: draft. Público significa adequação editorial sugerida, não autorização automática de exibição. Inglês e memes devem ser complementares ao português.

# Persistência e evolução

O catálogo inicial é um arquivo JSON versionado e editável. Não é um banco de dados nem uma API pública de frases. A necessidade de escrita por usuários ou painel será o gatilho para definir banco, modelo de dados e migrações. Separar a futura leitura de conteúdo das rotas permite trocar a persistência com menor impacto.

# Operação e configuração

Base direcionada ao Node.js 24 LTS, dependências fixadas no arquivo de lock e configuração de porta por ambiente. Segredos ficam fora do repositório. O servidor inicia localmente; hospedagem, domínio, monitoramento e orçamento continuam pendentes.

# Escolhas ainda abertas

Framework de frontend, banco de dados se necessário, hospedagem, fonte final, identidade visual detalhada e domínio. A API proposta e a base do servidor dão continuidade à decisão arquitetural sem fechar essas escolhas por suposição.

---

# 4 Requisitos e critérios de aceite

Critérios da base técnica atual e propostas para a futura V1 são separados abaixo. Aprovação da fundação não significa aprovação das telas ou de todo o conteúdo.

# Aceite da base atual

BT01 — Instalação reproduzível a partir do lock. BT02 — Servidor inicia com JavaScript e Node.js. BT03 — /api/v1/health responde 200 em JSON. BT04 — Rota desconhecida responde 404 sem detalhes internos. BT05 — Testes passam. BT06 — Nenhum frontend implementado. BT07 — Catálogo contém 255 IDs únicos e classificações válidas.

# Navegação e acessibilidade da V1

Proposta RF01 — Os sete destinos solicitados estão acessíveis pelo menu. RF02 — O menu fixo não cobre títulos nem foco ao navegar. RNF01 — Uso por teclado, foco visível, hierarquia de títulos, contraste legível, alternativas textuais e respeito à preferência por movimento reduzido. Definir a matriz de testes antes das telas.

# Identidade e tipografia

Proposta RNF02 — Verde é a cor principal, com paleta e contrastes testados. A fonte inspirada em Beyblade deve ser avaliada quanto à disponibilidade e uso permitido; limitar estilo expressivo a títulos se prejudicar leitura. Corpo e controles precisam de uma fonte legível. Nenhuma licença de fonte ou ativo foi presumida.

# Humor funcional

Proposta RNF03 — Erros explicam o problema e oferecem ação. Loading não inventa porcentagens nem sugere uma operação inexistente. Easter eggs são opcionais, acessíveis e não bloqueiam conteúdo. Texto caótico não substitui rótulos de navegação, formulários ou mensagens críticas.

# Qualidade de publicação

Proposta RNF04 — Separar fato histórico de lore inventada. Não publicar credenciais ou dados pessoais nos exemplos. Testar os estados de indisponibilidade e conteúdo vazio quando as rotas de conteúdo forem implementadas. Conferir o resultado publicado quando houver autorização para hospedagem.

---

# 5 Sequência de trabalho e pendências

# Primeiro ciclo

Coordenação consolida objetivo e público; Requisitos detalha as sete áreas; Conteúdo seleciona frases e fatos históricos. Design pesquisa referências universitárias e define paleta, tipografia, logo e estrutura, sem iniciar frontend nesta entrega.

# Segundo ciclo

Desenvolvimento mantém a base do backend e documenta contratos de conteúdo. A escolha de framework visual deve ocorrer antes das telas. QA transforma os critérios em uma lista verificável de navegação, acessibilidade, conteúdo e integração.

# Condição para iniciar o frontend

Obter autorização explícita para a implementação visual, com identidade e escopo suficientemente definidos. A instrução de criar o básico autoriza a fundação técnica, mas mantém o limite de não iniciar o frontend.

# Condição para publicar o site

Validar conteúdo selecionado, navegação, acessibilidade e comportamento do servidor; escolher hospedagem e domínio; registrar configuração e forma de recuperação. O repositório público não equivale a um site em produção.

# Pendências do fundador

Confirmar o nome oficial completo do site e a expansão da sigla; fornecer cronologia, significado de New Tamar World e marcas históricas dos easter eggs; escolher logo e fonte; priorizar conteúdo de lançamento; decidir framework visual e hospedagem. O nome do repositório UPPTB já está definido.

# Governança simples

Ideia → discussão → requisito ou proposta editorial → seleção do responsável → baseline. Coordenação mantém a decisão central. Mudanças de escopo devem registrar o que mudou e por quê. Novas frases não criam funcionalidades ou fatos históricos por conta própria.

# Fontes e limites

Fonte de contexto: conversa Criação UPPTB e instruções desta tarefa. O trecho inicial do grande escopo estava truncado; esta é uma consolidação ampliada, não uma transcrição integral. Referências técnicas consultadas: expressjs.com/en/starter/installing/ e nodejs.org/en/about/previous-releases em 9 de setembro de 2026.

---

# 6 Guia editorial do banco de frases

São 255 candidatas, com 15 frases em cada uma das 17 categorias. A curadoria usa três classes, sempre escritas em texto. Todas começam como rascunho, inclusive as fortes para uso público.

# P Público forte

102 frases compreensíveis e adequadas como candidatas de destaque, textos de apoio ou mensagens. Escolher conforme o contexto; não usar todas simultaneamente. Nas categorias técnicas, P indica adequação para um contexto público pertinente, como documentação ou histórico de commits.

# E Easter egg

68 frases dependem de repertório da comunidade, brincam com a interface ou funcionam melhor como descoberta opcional. Podem aparecer em um espaço secundário e contextualizado, sem esconder informação necessária.

# C Caos interno

85 frases são absurdas demais para a interface principal. Reservar ao laboratório de ideias, conversas internas ou conteúdo deliberadamente caótico após seleção explícita. Não usar como mensagem de erro real, orientação de tarefa ou comunicação institucional séria.

# Proveniência e lore

TST-07 reproduz a frase presente no histórico: “Turtle Step não mede velocidade. Mede estabilidade.” O restante é criação ou adaptação editorial proposta para este banco. Robin perdendo, Multi na reitoria e o h2 fóssil são referências criativas do contexto; as novas situações não são fatos canônicos confirmados.

# Como escolher e reutilizar

Começar por HOM-01, TST-01, QAT-01, UNI-01, IMP-01 e ROD-01. Registrar o ID, destino, responsável e estado de cada seleção. Usar uma frase de destaque por bloco. Para commits, substituir o exemplo genérico por uma descrição exata da mudança e deixar o humor como complemento.

# Erros e espera

Na 404, manter “Página não encontrada” e uma ação clara como “Voltar para a Home”; adicionar a piada apenas como apoio. No loading, não anunciar validações, salvamentos ou progressos que não estejam ocorrendo. As frases C dessas categorias são só material de bastidor.

---

# Home

Entrada pública com humor compreensível sem conhecer a lore.

P = Público forte   |   E = Easter egg   |   C = Caos interno

HOM-01  [P]  Bem-vindo à UPPTB. Aqui até a ideia sem pé nem cabeça ganhou um casco.

HOM-02  [P]  Conhecimento em movimento. Às vezes em círculos.

HOM-03  [P]  Entre por curiosidade. Fique porque a tartaruga bloqueou a saída conceitual.

HOM-04  [P]  Um laboratório para ideias que não cabiam no grupo da família.

HOM-05  [P]  Seu próximo grande projeto pode começar com uma pergunta muito idiota.

HOM-06  [P]  A UPPTB abriu as portas. A lógica entrou pela janela.

HOM-07  [E]  A reitoria pede que não alimentem os botões depois da meia-noite.

HOM-08  [E]  Se o site piscar, foi uma tartaruga confirmando presença.

HOM-09  [E]  Você está a três cliques de uma decisão que o conselho não entende.

HOM-10  [E]  Welcome to the shell side.

HOM-11  [C]  O campus foi construído sobre três certezas e um miojo estrutural.

HOM-12  [C]  A recepção é um repolho com crachá e acesso de administrador.

HOM-13  [C]  O porteiro é um Beyblade aposentado que só aceita matrícula por rotação.

HOM-14  [C]  A gravidade está em período de experiência nesta instituição.

HOM-15  [C]  Hoje a aula inaugural será ministrada por uma cadeira que cansou de apoiar decisões.

---

# Turtle Step

Aprendizado e progresso sem transformar descanso em culpa.

P = Público forte   |   E = Easter egg   |   C = Caos interno

TST-01  [P]  Devagar também é uma direção.

TST-02  [P]  Um passo pequeno ainda muda o lugar onde você está.

TST-03  [P]  O casco pesa. O próximo passo continua possível.

TST-04  [P]  Aprender é deixar o erro de ontem um pouco menos misterioso.

TST-05  [P]  Hoje um conceito. Amanhã uma gambiarra melhor documentada.

TST-06  [P]  Seu ritmo não precisa pedir desculpas.

TST-07  [E]  Turtle Step não mede velocidade. Mede estabilidade.

TST-08  [E]  Slow progress. Strong shell.

TST-09  [E]  A tartaruga chegou depois, mas trouxe o histórico de versões.

TST-10  [E]  Checkpoint salvo no departamento de pequenas vitórias.

TST-11  [C]  Minha meta é ultrapassar a lesma, mas ela abriu uma consultoria.

TST-12  [C]  Fiz um Turtle Step e o chão pediu revisão de escopo.

TST-13  [C]  O cronograma saiu correndo. A tartaruga abriu um chamado por abandono.

TST-14  [C]  Meu plano de carreira é uma escada rolante desligada dentro de um aquário.

TST-15  [C]  Hoje aprendi um conceito e precisei reiniciar o mamífero inteiro.

---

# Robin

Piadas de personagem e competição fictícia sem ataque pessoal.

P = Público forte   |   E = Easter egg   |   C = Caos interno

ROB-01  [P]  Na UPPTB, toda revanche merece uma hipótese nova.

ROB-02  [P]  O placar conta uma partida. O treino conta o resto.

ROB-03  [P]  Robin voltou para a arena. A aula continua.

ROB-04  [P]  Uma derrota pode render um bom estudo de caso.

ROB-05  [P]  Aqui a revanche começa com uma pergunta melhor.

ROB-06  [P]  Robin trouxe disposição. O resultado ainda está em análise.

ROB-07  [E]  O placar pediu para conversar com Robin em particular.

ROB-08  [E]  Robin não perdeu. Produziu dados para a próxima aula.

ROB-09  [E]  Achievement unlocked: pedir revanche antes de o pião parar.

ROB-10  [E]  O histórico de partidas está sob proteção do departamento de autoestima.

ROB-11  [C]  Robin foi disputar cara ou coroa e a moeda pediu transferência.

ROB-12  [C]  O troféu viu Robin chegando e ativou o modo avião.

ROB-13  [C]  Robin perdeu no tutorial de abrir a caixa.

ROB-14  [C]  O replay entrou com pedido de férias por repetição de trauma esportivo.

ROB-15  [C]  Robin trouxe um plano infalível. A arena trouxe os termos e condições.

---

# Multi

Reitoria imaginária e burocracia absurda como proposta de lore.

P = Público forte   |   E = Easter egg   |   C = Caos interno

MUL-01  [P]  Multi tem um plano. A versão será informada em breve.

MUL-02  [P]  A reitoria aceita ideias. Até as que chegam girando.

MUL-03  [P]  Toda boa pergunta merece espaço no campus.

MUL-04  [P]  Multi convocou o conselho de possibilidades improváveis.

MUL-05  [P]  Uma ideia entrou na reunião e saiu com um departamento.

MUL-06  [P]  A pauta de hoje é descobrir o que a pauta de ontem quis dizer.

MUL-07  [E]  Multi assinou o documento em três dimensões e um guardanapo.

MUL-08  [E]  Reitoria em modo multitarefa. Resultado em modo surpresa.

MUL-09  [E]  This meeting could have been a Beyblade battle.

MUL-10  [E]  A cadeira da reitoria exige autenticação por giro.

MUL-11  [C]  Multi privatizou a quarta-feira e nacionalizou o intervalo.

MUL-12  [C]  A caneta de Multi tem vice-reitor, assessor e plano odontológico.

MUL-13  [C]  Multi abriu uma filial da reitoria dentro da própria gaveta.

MUL-14  [C]  O carimbo de Multi foi promovido e agora carimba o próprio salário.

MUL-15  [C]  A reunião acabou quando Multi concedeu autonomia universitária ao ventilador.

---

# Army Turtle

Espírito de equipe fictício e mobilização para aprender.

P = Público forte   |   E = Easter egg   |   C = Caos interno

ARM-01  [P]  Ninguém precisa carregar o casco sozinho.

ARM-02  [P]  Army Turtle em formação. Cada um no seu ritmo.

ARM-03  [P]  Missão de hoje: aprender algo e compartilhar o caminho.

ARM-04  [P]  Nossa estratégia começa por não deixar ninguém para trás.

ARM-05  [P]  Reunir, estudar, testar, repetir.

ARM-06  [P]  Uma equipe forte também sabe pedir ajuda.

ARM-07  [E]  Pelotão autorizado a avançar três centímetros conceituais.

ARM-08  [E]  A unidade de reconhecimento encontrou um bug e fez amizade.

ARM-09  [E]  Shell formation complete.

ARM-10  [E]  Operação Alface: objetivos verdes, resultados documentados.

ARM-11  [C]  O general é uma tartaruga de chinelo com doutorado em fila.

ARM-12  [C]  O batalhão chegou atrasado porque o mapa tinha uma folha de alface desenhada.

ARM-13  [C]  Nosso tanque é um aquário com rodinhas e autoestima.

ARM-14  [C]  A marcha oficial foi interrompida por um pedágio de capivaras.

ARM-15  [C]  A missão secreta vazou porque o rádio só transmitia barulho de mastigação.

---

# QA

Qualidade com evidência e humor voltado ao defeito.

P = Público forte   |   E = Easter egg   |   C = Caos interno

QAT-01  [P]  Confiança é boa. Evidência é reproduzível.

QAT-02  [P]  O teste passou. A curiosidade continua.

QAT-03  [P]  Encontrar um erro também é fazer o projeto avançar.

QAT-04  [P]  O caminho feliz trouxe companhia: os casos de borda.

QAT-05  [P]  Qualidade começa quando a pergunta fica específica.

QAT-06  [P]  Requisito lembrado, comportamento conferido.

QAT-07  [E]  A tartaruga clicou duas vezes. O sistema contou uma história diferente.

QAT-08  [E]  Bug encontrado no habitat natural: sexta-feira.

QAT-09  [E]  Works on my shell is not a test plan.

QAT-10  [E]  Não toque no fóssil sem um teste de regressão.

QAT-11  [C]  O bug reproduziu, fez graduação e agora revisa meu código.

QAT-12  [C]  QA entrou na sala e a exceção fingiu ser requisito.

QAT-13  [C]  Testei o limite da paciência. Retornou 429 com um suspiro.

QAT-14  [C]  O caso de borda caiu da borda e abriu outro caso.

QAT-15  [C]  O botão funcionou tão errado que desbloqueou a pós-graduação.

---

# DEV

Desenvolvimento e pequenas vitórias técnicas.

P = Público forte   |   E = Easter egg   |   C = Caos interno

DEV-01  [P]  Código legível também ajuda quem você será amanhã.

DEV-02  [P]  Uma função de cada vez. O universo pode esperar.

DEV-03  [P]  Construindo o próximo passo com espaço para aprender.

DEV-04  [P]  A solução ficou menor. O entendimento ficou maior.

DEV-05  [P]  Antes do grande sistema, um comportamento que funciona.

DEV-06  [P]  Documentar é deixar uma lanterna para a próxima visita.

DEV-07  [E]  O ponto e vírgula foi visto saindo pela porta dos fundos.

DEV-08  [E]  Há uma tartaruga fazendo code review deste comentário.

DEV-09  [E]  Keep calm and return JSON.

DEV-10  [E]  O backend chegou cedo para escolher a melhor cadeira.

DEV-11  [C]  Minha variável tem nome provisório há três gerações.

DEV-12  [C]  O JavaScript somou uma string com minha estabilidade emocional.

DEV-13  [C]  Instalei uma dependência e ganhei a árvore genealógica inteira.

DEV-14  [C]  O callback chamou outro callback e agora temos um congresso.

DEV-15  [C]  A função é pura. O desenvolvedor está em estado gasoso.

---

# Universidade e lore

Identidade ficcional sem promessa de formação reconhecida.

P = Público forte   |   E = Easter egg   |   C = Caos interno

UNI-01  [P]  Universidade imaginária. Curiosidade de verdade.

UNI-02  [P]  O campus existe onde alguém decide aprender.

UNI-03  [P]  Aqui a pergunta estranha pode virar projeto.

UNI-04  [P]  Nosso acervo cresce a cada tentativa documentada.

UNI-05  [P]  A tradição da casa é experimentar com cuidado.

UNI-06  [P]  Conhecimento, casco e uma quantidade discutível de piões.

UNI-07  [E]  Biblioteca fechada para catalogação de pensamentos que fugiram.

UNI-08  [E]  O diploma honorário vem com um pequeno ruído de rotação.

UNI-09  [E]  A matéria optativa escolheu você.

UNI-10  [E]  Major in Turtle Studies. Minor in Unexpected Events.

UNI-11  [C]  O professor faltou porque foi citado como fonte e ficou preso na bibliografia.

UNI-12  [C]  A secretaria exige comprovante de existência em três vias metafísicas.

UNI-13  [C]  O bandejão serve sopa de tese com croutons de referência cruzada.

UNI-14  [C]  O prédio de humanas discutiu com o de exatas e nasceu um estacionamento interdisciplinar.

UNI-15  [C]  Minha matrícula foi aceita por uma impressora que acredita em reencarnação acadêmica.

---

# Erros e 404

Humor secundário acompanhado de erro claro e ação útil.

P = Público forte   |   E = Easter egg   |   C = Caos interno

ERR-01  [P]  Página não encontrada. A tartaruga também conferiu o mapa.

ERR-02  [P]  Este caminho terminou. Você pode voltar para a Home.

ERR-03  [P]  Não encontramos esse conteúdo. Vamos tentar outro caminho?

ERR-04  [P]  Algo falhou por aqui. Tente novamente em instantes.

ERR-05  [P]  A página mudou de endereço ou ainda não existe.

ERR-06  [P]  Não foi possível concluir a solicitação. Você pode tentar de novo.

ERR-07  [E]  404: esta sala foi transferida para o semestre que vem.

ERR-08  [E]  O mapa reconhece sua coragem, mas não este endereço.

ERR-09  [E]  Page not found. Shell still intact.

ERR-10  [E]  Multi autorizou a sala. Esqueceu de autorizar a existência.

ERR-11  [C]  Erro 404: o corredor comeu a porta e está negando em depoimento.

ERR-12  [C]  A página foi fazer intercâmbio numa torradeira e perdeu o passaporte.

ERR-13  [C]  O servidor tropeçou numa abstração e caiu dentro da própria documentação.

ERR-14  [C]  A realidade retornou undefined e saiu para comprar pão.

ERR-15  [C]  O endpoint virou um ponto final. A gramática assumiu o incidente.

---

# Loading

Mensagens de espera sem progresso falso nem demora artificial.

P = Público forte   |   E = Easter egg   |   C = Caos interno

LOD-01  [P]  Carregando o próximo passo.

LOD-02  [P]  Buscando o conteúdo. Um instante.

LOD-03  [P]  Preparando a próxima parada do campus.

LOD-04  [P]  Organizando as ideias por aqui.

LOD-05  [P]  Carregando. O casco já está a caminho.

LOD-06  [P]  Só um momento enquanto reunimos o conteúdo.

LOD-07  [E]  Consultando uma tartaruga com boa memória.

LOD-08  [E]  Alinhando os piões com as leis locais da física.

LOD-09  [E]  Loading tiny academic chaos.

LOD-10  [E]  Pedindo à biblioteca que devolva a biblioteca.

LOD-11  [C]  Ensinando o servidor a respirar sem abrir uma reunião.

LOD-12  [C]  Aguardando o elevador terminar o mestrado.

LOD-13  [C]  Convertendo ansiedade em um formato que o navegador aceite.

LOD-14  [C]  Contando grãos de areia para descobrir qual deles é o administrador.

LOD-15  [C]  O loading está carregando outro loading. É um programa de mentoria.

---

# Easter eggs

Descobertas opcionais que não escondem conteúdo essencial.

P = Público forte   |   E = Easter egg   |   C = Caos interno

EGG-01  [P]  Você encontrou um detalhe escondido. Boa exploração.

EGG-02  [P]  Curiosidade recompensada com uma pequena bobagem.

EGG-03  [P]  Este canto do campus estava esperando uma visita.

EGG-04  [P]  Nem toda descoberta precisa valer pontos.

EGG-05  [P]  A tartaruga viu você olhando com atenção.

EGG-06  [P]  Uma surpresa pequena para quem saiu da trilha.

EGG-07  [E]  Você inspecionou o casco. O casco está inspecionando você.

EGG-08  [E]  Aqui jaz um h2. Ninguém sabe por que ele resistiu tanto.

EGG-09  [E]  Secret shell society: visitor detected.

EGG-10  [E]  O fundador deixou uma marca. O QA deixou um comentário ao lado.

EGG-11  [C]  Parabéns. Você desbloqueou uma geladeira que dá aula de epistemologia.

EGG-12  [C]  A senha secreta é uma alface pronunciada em itálico.

EGG-13  [C]  O conselho dos rodapés se reúne aqui para julgar os cabeçalhos.

EGG-14  [C]  Você achou o botão que ensina o mouse a duvidar de si mesmo.

EGG-15  [C]  Este comentário foi enterrado por uma civilização de divs sencientes.

---

# Rodapé

Assinaturas curtas que preservam links e informações úteis.

P = Público forte   |   E = Easter egg   |   C = Caos interno

ROD-01  [P]  Feito com curiosidade e revisões.

ROD-02  [P]  Mais um passo registrado.

ROD-03  [P]  O campus termina aqui. As ideias continuam.

ROD-04  [P]  UPPTB. Um projeto em aprendizado constante.

ROD-05  [P]  Obrigado por visitar este pequeno universo.

ROD-06  [P]  Até a próxima volta.

ROD-07  [E]  Você chegou ao rodapé. A tartaruga respeita a dedicação.

ROD-08  [E]  Abaixo desta linha, apenas raízes de dependências.

ROD-09  [E]  End of page. Not end of lore.

ROD-10  [E]  O rodapé sustenta opiniões que não foram consultadas.

ROD-11  [C]  Este rodapé foi aprovado por seis tijolos e um orientador invisível.

ROD-12  [C]  A margem inferior está cursando direito para processar o scroll infinito.

ROD-13  [C]  Se você cavar mais, encontra a versão beta do planeta.

ROD-14  [C]  Nenhuma cadeira foi promovida durante a fabricação deste rodapé. Ainda.

ROD-15  [C]  O fundo do site é alugado de uma tartaruga que só recebe em vírgulas.

---

# Commits

Complementos de humor após uma descrição técnica verdadeira.

P = Público forte   |   E = Easter egg   |   C = Caos interno

COM-01  [P]  chore: preparar a base do campus

COM-02  [P]  docs: registrar o próximo Turtle Step

COM-03  [P]  test: conferir o caminho antes da próxima volta

COM-04  [P]  fix: corrigir a rota que saiu da trilha

COM-05  [P]  refactor: abrir espaço para a próxima ideia

COM-06  [P]  feat: entregar mais um pequeno passo

COM-07  [E]  docs: deixar uma lanterna para o eu do futuro

COM-08  [E]  test: impedir que o mesmo fantasma volte sem crachá

COM-09  [E]  chore: shell we begin

COM-10  [E]  fix: devolver ao botão sua única responsabilidade

COM-11  [C]  fix: exorcizar a vírgula que assumiu a reitoria

COM-12  [C]  chore: retirar o micro-ondas do comitê de arquitetura

COM-13  [C]  refactor: desembaraçar o macarrão sem convocar a Itália

COM-14  [C]  test: provar que a capivara não é uma variável global

COM-15  [C]  docs: registrar o acordo de paz entre duas chaves

---

# Mensagens internas

Bastidores da equipe e respostas de coordenação.

P = Público forte   |   E = Easter egg   |   C = Caos interno

INT-01  [P]  Decisão registrada. Seguimos para o próximo passo.

INT-02  [P]  Precisamos confirmar este ponto antes de implementar.

INT-03  [P]  Revisão concluída. Os ajustes estão descritos abaixo.

INT-04  [P]  Ideia recebida. Ainda não entrou no escopo.

INT-05  [P]  Encontramos uma diferença entre o combinado e o resultado.

INT-06  [P]  Pausa registrada. Retomamos com o contexto preservado.

INT-07  [E]  O conselho do casco pede um exemplo reproduzível.

INT-08  [E]  Essa ideia recebeu o selo provisório de maluquice promissora.

INT-09  [E]  Plot twist: era um requisito não documentado.

INT-10  [E]  A reitoria agradece e solicita menos telepatia entre as frentes.

INT-11  [C]  A pauta adquiriu consciência e convocou outra pauta.

INT-12  [C]  O prazo está latindo para a planilha. Ninguém faça contato visual.

INT-13  [C]  A ata foi redigida por um pião e só pode ser lida em rotação.

INT-14  [C]  Meu cérebro abriu dez abas e todas estão tocando o hino do campus.

INT-15  [C]  Suspender a reunião: o projetor acaba de se candidatar a reitor.

---

# Frases de impacto

Candidatas de destaque com identidade própria.

P = Público forte   |   E = Easter egg   |   C = Caos interno

IMP-01  [P]  O próximo passo não precisa impressionar. Precisa existir.

IMP-02  [P]  A curiosidade merece uma estrutura onde possa crescer.

IMP-03  [P]  Devagar o bastante para entender. Constante o bastante para avançar.

IMP-04  [P]  Transforme a tentativa em algo que você possa revisitar.

IMP-05  [P]  Seu aprendizado também pode deixar uma trilha.

IMP-06  [P]  Uma ideia absurda pode ser o começo de uma pergunta séria.

IMP-07  [E]  O casco guarda a história. O passo escreve a próxima linha.

IMP-08  [E]  Small steps. Unexpected worlds.

IMP-09  [E]  A rotação chama atenção. A constância constrói o caminho.

IMP-10  [E]  O universo não estava pronto. Criamos uma pasta docs.

IMP-11  [C]  Se a vida fechar uma porta, investigue por que ela virou um crustáceo.

IMP-12  [C]  Sonhe alto, mas confira se o teto não está em manutenção acadêmica.

IMP-13  [C]  Você é maior que seus medos e menor que o node_modules.

IMP-14  [C]  Acredite no impossível. O possível está aguardando aprovação de orçamento.

IMP-15  [C]  Seja a tartaruga que sua planilha teme encontrar numa segunda-feira.

---

# Beyblade

Arena e experimentação como conteúdo de fã.

P = Público forte   |   E = Easter egg   |   C = Caos interno

BEY-01  [P]  Cada giro deixa uma pergunta para a próxima rodada.

BEY-02  [P]  Teste a hipótese. Observe a arena. Ajuste o próximo lançamento.

BEY-03  [P]  A batalha termina. A análise começa.

BEY-04  [P]  Um bom lançamento também aprende com o anterior.

BEY-05  [P]  Experimentos de arena, curiosidade em rotação.

BEY-06  [P]  Treinar é dar à próxima tentativa uma chance diferente.

BEY-07  [E]  Let’s rip. Depois a gente documenta.

BEY-08  [E]  A arena não aceita argumento de autoridade.

BEY-09  [E]  O pião está girando mais que a discussão sobre a stack.

BEY-10  [E]  A física entrou no chat e pediu os dados do experimento.

BEY-11  [C]  Meu Beyblade abriu uma startup e agora pivota por assinatura.

BEY-12  [C]  A arena virou uma centrífuga de decisões questionáveis.

BEY-13  [C]  Lancei com tanta convicção que a hipótese saiu antes do pião.

BEY-14  [C]  O pião parou, mas o departamento de desculpas continua em alta rotação.

BEY-15  [C]  O juiz é um ventilador e foi afastado por conflito de interesses.

---

# New Tamar World

Exploração de um universo ainda em definição.

P = Público forte   |   E = Easter egg   |   C = Caos interno

NTW-01  [P]  Um novo mundo começa com uma trilha ainda sem nome.

NTW-02  [P]  Explore as histórias que estamos começando a construir.

NTW-03  [P]  Cada descoberta pode abrir uma parte do mapa.

NTW-04  [P]  New Tamar World está ganhando forma, um detalhe por vez.

NTW-05  [P]  Há espaço neste mundo para perguntas que ainda não chegaram.

NTW-06  [P]  O mapa cresce junto com a história.

NTW-07  [E]  Fronteira provisória. Tartarugas podem estar redesenhando o horizonte.

NTW-08  [E]  New world. Same curious turtle.

NTW-09  [E]  O cartógrafo deixou uma ilha em rascunho.

NTW-10  [E]  Você atravessou uma hipótese geográfica.

NTW-11  [C]  O oceano pediu um período sabático e deixou um copo d’água no lugar.

NTW-12  [C]  A montanha mudou de curso e agora estuda comunicação visual.

NTW-13  [C]  O sol é terceirizado e esqueceu a senha do amanhecer.

NTW-14  [C]  A capital fica na terceira gaveta de uma tartaruga extradimensional.

NTW-15  [C]  O planeta gira porque ninguém encontrou o botão de cancelar reunião.
