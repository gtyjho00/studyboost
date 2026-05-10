/*
  # Seed New Subject Lessons

  1. New Lessons
    - 3 ENEM lessons (porcentagem, interpretação, redação)
    - 3 Português lessons (gramática, interpretação, literatura)
    - 3 Química lessons (básica, tabela periódica, reações)
    - 3 Física lessons (mecânica, termodinâmica, óptica)

  2. Format
    Each lesson has content_json with a "questions" array:
    - type: "choice" | "fill" | "match"
    - prompt, options, answer, explanation

  3. Important Notes
    - Does NOT delete existing lessons (English + Math remain)
    - All questions follow the same format as existing lessons
*/

INSERT INTO lessons (module, category, level, title, content_json, xp_reward) VALUES

-- ENEM LESSONS
(
  'enem', 'matematica', 1, 'ENEM - Porcentagem e Finanças',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "Um produto custa R$200 e recebeu um desconto de 15%. Qual o preço final?",
        "options": ["R$ 170", "R$ 185", "R$ 175", "R$ 180"],
        "answer": 0,
        "explanation": "Desconto = 15% de 200 = R$30. Preço final = 200 - 30 = R$170."
      },
      {
        "type": "choice",
        "prompt": "Um investimento de R$1.000 rende 8% ao mês. Após 2 meses, o montante é:",
        "options": ["R$ 1.160", "R$ 1.166,40", "R$ 1.080", "R$ 1.150"],
        "answer": 1,
        "explanation": "Juros compostos: M = 1000 × (1,08)² = 1000 × 1,1664 = R$1.166,40."
      },
      {
        "type": "choice",
        "prompt": "Se o salário de R$3.000 teve reajuste de 12%, o novo salário é:",
        "options": ["R$ 3.120", "R$ 3.360", "R$ 3.300", "R$ 3.012"],
        "answer": 1,
        "explanation": "Reajuste = 12% de 3000 = R$360. Novo salário = 3000 + 360 = R$3.360."
      },
      {
        "type": "choice",
        "prompt": "Uma loja oferece 20% de desconto à vista ou 3x sem juros. Se o produto custa R$600, a diferença entre pagar à vista e a primeira parcela é:",
        "options": ["R$ 80", "R$ 120", "R$ 200", "R$ 60"],
        "answer": 0,
        "explanation": "À vista: 600 - 20% = R$480. Parcela: 600/3 = R$200. Diferença = 200 - 480 = -R$280... Na verdade, a diferença entre o valor à vista (R$480) e a primeira parcela (R$200) é R$280. Revisando: a pergunta é sobre a diferença, que é R$200 - R$480... O valor à vista é R$480, a parcela é R$200. A economia à vista vs parcela total = 600 - 480 = R$120."
      },
      {
        "type": "choice",
        "prompt": "Um carro perdeu 25% do valor em 1 ano. Se vale R$45.000, seu valor original era:",
        "options": ["R$ 60.000", "R$ 56.250", "R$ 55.000", "R$ 50.000"],
        "answer": 0,
        "explanation": "Se perdeu 25%, vale 75%. Logo: 0,75x = 45.000 → x = R$60.000."
      }
    ]
  }'::jsonb, 80
),
(
  'enem', 'linguagens', 1, 'ENEM - Interpretação de Texto em Inglês',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "No texto: ''The weather was awful, but we decided to go anyway.'' A palavra ''awful'' significa:",
        "options": ["Ótimo", "Horrível", "Normal", "Interessante"],
        "answer": 1,
        "explanation": "Awful = horrível, terrível. O contexto reforça: o clima estava ruim, mas foram mesmo assim."
      },
      {
        "type": "choice",
        "prompt": "''She has been studying English for three years.'' Isso significa que ela:",
        "options": ["Estudou por 3 anos e parou", "Estuda há 3 anos e continua", "Vai estudar por 3 anos", "Estudou 3 anos atrás"],
        "answer": 1,
        "explanation": "Present Perfect Continuous (has been studying) indica ação que começou no passado e continua no presente."
      },
      {
        "type": "choice",
        "prompt": "''Although he was tired, he finished the race.'' A conjunção ''although'' indica:",
        "options": ["Causa", "Consequência", "Concessão (contraste)", "Adição"],
        "answer": 2,
        "explanation": "Although = embora, indica concessão/contraste. Ele estava cansado, MAS terminou a corrida."
      },
      {
        "type": "choice",
        "prompt": "''The book which I bought yesterday is amazing.'' A oração ''which I bought yesterday'' é:",
        "options": ["Oração subordinada adjetiva", "Oração subordinada substantiva", "Oração coordenada", "Oração principal"],
        "answer": 0,
        "explanation": "Which I bought yesterday é uma oração adjetiva restritiva que modifica ''the book''. Em inglês, usa-se which/that para orações adjetivas."
      },
      {
        "type": "choice",
        "prompt": "No ENEM, textos em inglês devem ser interpretados considerando:",
        "options": ["Apenas tradução literal", "Contexto, inferência e conhecimento de mundo", "Somente o vocabulário", "A gramática perfeita"],
        "answer": 1,
        "explanation": "O ENEM cobra interpretação contextual: inferir significados, identificar ideia principal e relacionar com conhecimento de mundo."
      }
    ]
  }'::jsonb, 80
),
(
  'enem', 'redacao', 1, 'ENEM - Estrutura da Redação',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "A redação do ENEM deve ter no mínimo e no máximo quantas linhas?",
        "options": ["Mínimo 15, máximo 30", "Mínimo 8, máximo 30", "Mínimo 10, máximo 25", "Mínimo 5, máximo 20"],
        "answer": 1,
        "explanation": "O ENEM exige no mínimo 8 e no máximo 30 linhas. Textos com menos de 8 linhas recebem nota 0."
      },
      {
        "type": "choice",
        "prompt": "Qual competência do ENEM avalia o uso correto da norma-padrão?",
        "options": ["Competência 1", "Competência 2", "Competência 3", "Competência 4"],
        "answer": 1,
        "explanation": "Competência 1: domínio da norma-padrão. C2: compreensão da proposta. C3: repertório. C4: coesão. C5: proposta de intervenção."
      },
      {
        "type": "choice",
        "prompt": "A proposta de intervenção social deve conter:",
        "options": ["Ação, agente, meio, efeito e detalhamento", "Apenas a ação", "Ação e agente", "Ação, agente e efeito"],
        "answer": 0,
        "explanation": "Para nota máxima na C5, a proposta deve ter: ação (o quê), agente (quem), meio/como, efeito e detalhamento."
      },
      {
        "type": "choice",
        "prompt": "O que é obrigatório na estrutura do texto dissertativo-argumentativo?",
        "options": ["Tese, argumentos e conclusão", "Introdução, desenvolvimento e proposta de intervenção", "Tese, antítese e síntese", "Narrativa, descrição e dissertação"],
        "answer": 1,
        "explanation": "A estrutura obrigatória é: introdução (com tese), desenvolvimento (com argumentos) e conclusão (com proposta de intervenção)."
      },
      {
        "type": "choice",
        "prompt": "Usar um repertório sociocultural na redação significa:",
        "options": ["Citar apenas dados estatísticos", "Incluir referências culturais, filosóficas, históricas ou científicas", "Usar vocabulário rebuscado", "Fazer paráfrase do texto motivador"],
        "answer": 1,
        "explanation": "Repertório sociocultural = usar conhecimentos de áreas como filosofia, história, sociologia, ciências para fundamentar seus argumentos."
      }
    ]
  }'::jsonb, 90
),

-- PORTUGUÊS LESSONS
(
  'portugues', 'gramatica', 1, 'Classes de Palavras',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "Na frase ''Os meninos correram rapidamente'', ''rapidamente'' é:",
        "options": ["Adjetivo", "Advérbio", "Substantivo", "Verbo"],
        "answer": 1,
        "explanation": "Rapidamente é advérbio de modo — modifica o verbo ''correram'', indicando como correram."
      },
      {
        "type": "choice",
        "prompt": "Qual palavra é uma preposição?",
        "options": ["Muito", "Durante", "Aquele", "Nossos"],
        "answer": 1,
        "explanation": "Durante é preposição quando liga duas orações com ideia de tempo. As demais não são preposições."
      },
      {
        "type": "fill",
        "prompt": "''Eles ___ (ir) ao cinema ontem.'' Complete com a forma correta:",
        "options": ["foram", "iam", "irão", "vão"],
        "answer": 0,
        "explanation": "O tempo é passado (ontem), então usamos o pretérito perfeito: foram (ir → foram)."
      },
      {
        "type": "choice",
        "prompt": "''As meninas estavam felizes.'' O sujeito é:",
        "options": ["As meninas", "felizes", "estavam", "meninas"],
        "answer": 0,
        "explanation": "O sujeito é ''As meninas'' — é de quem se declara algo (que estavam felizes)."
      },
      {
        "type": "choice",
        "prompt": "A palavra ''inacreditável'' é formada por:",
        "options": ["Prefixo + radical + sufixo", "Radical + sufixo", "Dois radicais", "Prefixo + radical"],
        "answer": 0,
        "explanation": "Inacreditável = in- (prefixo) + acredit (radical) + ável (sufixo). Processo de derivação parassintética."
      }
    ]
  }'::jsonb, 60
),
(
  'portugues', 'interpretacao', 1, 'Interpretação de Texto',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "Quando o autor usa ironia em um texto, ele pretende:",
        "options": ["Dizer o oposto do que escreve", "Ofender o leitor", "Ser engraçado", "Explicar um conceito"],
        "answer": 0,
        "explanation": "Ironia é dizer algo com sentido oposto ao literal. O autor usa para criticar de forma indireta."
      },
      {
        "type": "choice",
        "prompt": "A ideia principal de um texto é:",
        "options": ["A primeira frase", "O tema central que o autor quer transmitir", "O título", "A última frase"],
        "answer": 1,
        "explanation": "A ideia principal é o tema central, pode estar em qualquer parte do texto, não apenas na primeira frase."
      },
      {
        "type": "choice",
        "prompt": "''O texto apresenta linguagem denotativa.'' Isso significa que:",
        "options": ["É poético e subjetivo", "É objetivo e literal", "É irônico", "É figurado"],
        "answer": 1,
        "explanation": "Linguagem denotativa = sentido literal, objetivo. É o oposto da linguagem conotativa (figurada, subjetiva)."
      },
      {
        "type": "choice",
        "prompt": "Inferir uma informação significa:",
        "options": ["Copiar do texto", "Deduzir algo não explicitamente escrito", "Parafrasear", "Resumir o texto"],
        "answer": 1,
        "explanation": "Inferir = deduzir, concluir algo a partir de pistas do texto, mesmo que não esteja escrito explicitamente."
      },
      {
        "type": "choice",
        "prompt": "Um texto argumentativo tem como objetivo:",
        "options": ["Contar uma história", "Defender uma tese com argumentos", "Descrever um objeto", "Expressar sentimentos"],
        "answer": 1,
        "explanation": "Texto argumentativo defende uma ideia (tese) usando argumentos lógicos e repertório para convencer o leitor."
      }
    ]
  }'::jsonb, 70
),
(
  'portugues', 'literatura', 1, 'Movimentos Literários Brasileiros',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "Qual movimento literário valoriza a natureza e o índio como herói?",
        "options": ["Barroco", "Arcadismo", "Romantismo", "Realismo"],
        "answer": 2,
        "explanation": "O Romantismo (3ª geração: indianismo) exalta a natureza brasileira e o índio como herói nacional (ex: Iracema de José de Alencar)."
      },
      {
        "type": "choice",
        "prompt": "O Modernismo no Brasil começou com:",
        "options": ["A Semana de Arte Moderna (1922)", "A publicação de Dom Casmurro", "O Movimento Pau-Brasil", "A Geração de 30"],
        "answer": 0,
        "explanation": "A Semana de Arte Moderna de 1922, no Teatro Municipal de SP, marcou o início do Modernismo brasileiro."
      },
      {
        "type": "choice",
        "prompt": "O Realismo na literatura se caracteriza por:",
        "options": ["Idealização da realidade", "Objetividade e crítica social", "Subjetivismo e emoção", "Uso exagerado de metáforas"],
        "answer": 1,
        "explanation": "Realismo = objetividade, crítica social, linguagem direta. Rejeita o idealismo romântico. Ex: Machado de Assis."
      },
      {
        "type": "choice",
        "prompt": "''Saudosismo'' e ''fuga da realidade'' são características do:",
        "options": ["Naturalismo", "Parnasianismo", "Simbolismo", "Arcadismo"],
        "answer": 2,
        "explanation": "O Simbolismo (ou Simbolismo) valoriza o mistério, espiritualidade, saudosismo e fuga da realidade material."
      },
      {
        "type": "choice",
        "prompt": "Machado de Assis pertence a qual movimento?",
        "options": ["Romantismo", "Realismo", "Naturalismo", "Modernismo"],
        "answer": 1,
        "explanation": "Machado de Assis é o principal autor do Realismo brasileiro. Memórias Póstumas de Brás Cubas (1881) inaugurou o movimento."
      }
    ]
  }'::jsonb, 70
),

-- QUÍMICA LESSONS
(
  'quimica', 'basica', 1, 'Conceitos Fundamentais',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "Qual é o símbolo químico do Ouro?",
        "options": ["Ou", "Au", "Or", "Ag"],
        "answer": 1,
        "explanation": "Au (do latim Aurum) = Ouro. Ag = Prata (Argentum). Muitos símbolos vêm do latim."
      },
      {
        "type": "choice",
        "prompt": "Átomo é formado por:",
        "options": ["Prótons, nêutrons e elétrons", "Prótons e elétrons apenas", "Moléculas", "Íons"],
        "answer": 0,
        "explanation": "O átomo tem: núcleo (prótons + nêutrons) e eletrosfera (elétrons). Prótons (+), nêutrons (0), elétrons (-)."
      },
      {
        "type": "choice",
        "prompt": "O número atômico (Z) indica:",
        "options": ["O número de nêutrons", "O número de prótons", "A massa do átomo", "O número de elétrons na camada de valência"],
        "answer": 1,
        "explanation": "Z = número de prótons. Identifica o elemento químico. Em átomo neutro: prótons = elétrons."
      },
      {
        "type": "choice",
        "prompt": "Qual é o estado físico da água a 25°C e 1 atm?",
        "options": ["Sólido", "Líquido", "Gasoso", "Plasma"],
        "answer": 1,
        "explanation": "A 25°C e 1 atm, a água está no estado líquido (entre 0°C e 100°C)."
      },
      {
        "type": "choice",
        "prompt": "Mistura homogênea é aquela que:",
        "options": ["Tem fases visíveis", "Apresenta aspecto uniforme", "Pode ser separada por filtração", "Tem dois líquidos"],
        "answer": 1,
        "explanation": "Mistura homogênea = aspecto uniforme, uma única fase. Ex: água + sal. Heterogênea = fases visíveis."
      }
    ]
  }'::jsonb, 60
),
(
  'quimica', 'tabela_periodica', 1, 'Tabela Periódica',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "Os elementos do grupo 17 (VIIA) são chamados de:",
        "options": ["Metais alcalinos", "Halogênios", "Gases nobres", "Metais alcalinos terrosos"],
        "answer": 1,
        "explanation": "Grupo 17 = Halogênios (F, Cl, Br, I, At). São muito reativos e formam sais."
      },
      {
        "type": "choice",
        "prompt": "Os gases nobres são pouco reativos porque:",
        "options": ["São muito leves", "Têm camada de valência completa", "São metais", "Têm poucos elétrons"],
        "answer": 1,
        "explanation": "Gases nobres (He, Ne, Ar, Kr, Xe, Rn) têm 8 elétrons na camada de valência (exceto He com 2), sendo estáveis."
      },
      {
        "type": "choice",
        "prompt": "Na tabela periódica, os períodos indicam:",
        "options": ["O número de elétrons", "O número de camadas eletrônicas", "O número de prótons", "A eletronegatividade"],
        "answer": 1,
        "explanation": "Períodos = linhas horizontais. Indicam o número de camadas eletrônicas (níveis de energia)."
      },
      {
        "type": "choice",
        "prompt": "Qual elemento é um metal alcalino?",
        "options": ["Ferro", "Sódio", "Ouro", "Cloro"],
        "answer": 1,
        "explanation": "Sódio (Na) é metal alcalino — grupo 1 (IA). São muito reativos, especialmente com água."
      },
      {
        "type": "choice",
        "prompt": "A eletronegatividade na tabela periódica:",
        "options": ["Aumenta para a direita e para cima", "Aumenta para a esquerda e para baixo", "É constante", "Aumenta para a direita e para baixo"],
        "answer": 0,
        "explanation": "Eletronegatividade aumenta da esquerda para a direita e de baixo para cima. Flúor (F) é o mais eletronegativo."
      }
    ]
  }'::jsonb, 70
),
(
  'quimica', 'reacoes', 1, 'Reações Químicas',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "Na reação: 2H₂ + O₂ → 2H₂O, os reagentes são:",
        "options": ["H₂O", "H₂ e O₂", "2H₂O", "O₂ apenas"],
        "answer": 1,
        "explanation": "Reagentes = lado esquerdo da seta. Produtos = lado direito. Reagentes: H₂ e O₂. Produto: H₂O."
      },
      {
        "type": "choice",
        "prompt": "Uma reação exotérmica:",
        "options": ["Absorve calor", "Libera calor", "Não troca calor", "Absorve e libera calor igualmente"],
        "answer": 1,
        "explanation": "Exotérmica = libera calor para o ambiente. Endotérmica = absorve calor. Ex: combustão é exotérmica."
      },
      {
        "type": "choice",
        "prompt": "O que é oxidação?",
        "options": ["Ganho de elétrons", "Perda de elétrons", "Ganho de prótons", "Perda de nêutrons"],
        "answer": 1,
        "explanation": "Oxidação = perda de elétrons. Redução = ganho de elétrons. Lembre: OxiPerde, ReduzGanha."
      },
      {
        "type": "choice",
        "prompt": "Balancear: Fe + O₂ → Fe₂O₃. O coeficiente do Fe é:",
        "options": ["2", "3", "4", "1"],
        "answer": 2,
        "explanation": "4Fe + 3O₂ → 2Fe₂O₃. Lado direito: 2×3=6 oxigênios, então 3O₂. Lado direito: 2×2=4 ferros, então 4Fe."
      },
      {
        "type": "choice",
        "prompt": "Qual é um exemplo de reação de síntese?",
        "options": ["2H₂O → 2H₂ + O₂", "C + O₂ → CO₂", "NaCl → Na⁺ + Cl⁻", "AB + CD → AD + CB"],
        "answer": 1,
        "explanation": "Síntese = dois ou mais reagentes formam um produto. C + O₂ → CO₂ é síntese. A primeira é decomposição."
      }
    ]
  }'::jsonb, 70
),

-- FÍSICA LESSONS
(
  'fisica', 'mecanica', 1, 'Cinemática: Movimento Uniforme',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "No Movimento Uniforme (MU), a velocidade é:",
        "options": ["Constante", "Crescente", "Decrescente", "Variável"],
        "answer": 0,
        "explanation": "No MU, a velocidade é constante e a aceleração é zero. A função horária é: s = s₀ + vt."
      },
      {
        "type": "choice",
        "prompt": "Um carro percorre 120 km em 2 horas. Sua velocidade média é:",
        "options": ["60 km/h", "120 km/h", "240 km/h", "30 km/h"],
        "answer": 0,
        "explanation": "Vm = Δs/Δt = 120/2 = 60 km/h. Velocidade média = deslocamento / tempo."
      },
      {
        "type": "choice",
        "prompt": "A função horária s = 20 + 5t (SI) indica que a posição inicial é:",
        "options": ["5 m", "20 m", "25 m", "0 m"],
        "answer": 1,
        "explanation": "s = s₀ + vt → s₀ = 20 m e v = 5 m/s. A posição inicial é 20 metros."
      },
      {
        "type": "choice",
        "prompt": "No MUV (movimento uniformemente variado), a aceleração é:",
        "options": ["Nula", "Constante", "Variável", "Negativa sempre"],
        "answer": 1,
        "explanation": "No MUV, a aceleração é constante (não nula). A velocidade varia uniformemente. Equação: v = v₀ + at."
      },
      {
        "type": "choice",
        "prompt": "Um objeto em queda livre (g=10 m/s²) após 3 segundos tem velocidade de:",
        "options": ["30 m/s", "10 m/s", "3 m/s", "90 m/s"],
        "answer": 0,
        "explanation": "v = g × t = 10 × 3 = 30 m/s. Na queda livre, a aceleração é da gravidade (g ≈ 10 m/s²)."
      }
    ]
  }'::jsonb, 60
),
(
  'fisica', 'termodinamica', 1, 'Termodinâmica Básica',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "A 1ª Lei da Termodinâmica é a lei da:",
        "options": ["Conservação da energia", "Entropia", "Zero absoluto", "Irreversibilidade"],
        "answer": 0,
        "explanation": "1ª Lei = conservação da energia. ΔU = Q - W. A variação de energia interna = calor recebido - trabalho realizado."
      },
      {
        "type": "choice",
        "prompt": "Calor é:",
        "options": ["Temperatura", "Energia em trânsito devido à diferença de temperatura", "Estado do corpo", "Sempre medido em °C"],
        "answer": 1,
        "explanation": "Calor = energia em trânsito, transferida de um corpo mais quente para um mais frio. Unidade: Joule (J) ou caloria (cal)."
      },
      {
        "type": "choice",
        "prompt": "Dilatação térmica ocorre porque:",
        "options": ["O corpo perde massa", "As moléculas vibram mais com o aumento de temperatura", "A pressão diminui", "O corpo muda de estado"],
        "answer": 1,
        "explanation": "Ao aquecer, as moléculas vibram mais intensamente, ocupando mais espaço. Isso causa a dilatação do material."
      },
      {
        "type": "choice",
        "prompt": "Na transformação isobárica, o que permanece constante?",
        "options": ["Volume", "Temperatura", "Pressão", "Energia interna"],
        "answer": 2,
        "explanation": "Isobárica = pressão constante. Isocórica/Volumétrica = volume constante. Isotérmica = temperatura constante."
      },
      {
        "type": "choice",
        "prompt": "A temperatura de ebulição da água ao nível do mar é:",
        "options": ["90°C", "100°C", "110°C", "0°C"],
        "answer": 1,
        "explanation": "Ao nível do mar (1 atm), a água ferve a 100°C. Em altitudes maiores, a pressão é menor e a temperatura de ebulição diminui."
      }
    ]
  }'::jsonb, 70
),
(
  'fisica', 'otica', 1, 'Óptica: Reflexão e Refração',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "A reflexão da luz segue a lei: ângulo de incidência = ângulo de reflexão. Isso é a lei da reflexão:",
        "options": ["Especular", "Difusa", "Regular", "Ambas especular e difusa"],
        "answer": 3,
        "explanation": "A lei da reflexão (i = r) vale tanto para reflexão especular (espelho) quanto difusa (superfície irregular)."
      },
      {
        "type": "choice",
        "prompt": "A refração ocorre quando a luz:",
        "options": ["Muda de meio com mudança de velocidade", "Se reflete totalmente", "Se difrata", "Se polariza"],
        "answer": 0,
        "explanation": "Refração = mudança de velocidade da luz ao passar de um meio para outro com densidade óptica diferente."
      },
      {
        "type": "choice",
        "prompt": "O índice de refração absoluto (n) de um meio é:",
        "options": ["n = v/c", "n = c/v", "n = v × c", "n = 1/v"],
        "answer": 1,
        "explanation": "n = c/v, onde c = velocidade da luz no vácuo e v = velocidade no meio. Quanto maior n, mais lento no meio."
      },
      {
        "type": "choice",
        "prompt": "Um espelho côncavo pode formar imagem:",
        "options": ["Apenas real", "Apenas virtual", "Real ou virtual, dependendo da posição", "Nenhuma imagem"],
        "answer": 2,
        "explanation": "Espelho côncavo: objeto além do foco → imagem real/invertida. Objeto entre foco e espelho → imagem virtual/ampliada."
      },
      {
        "type": "choice",
        "prompt": "A luz branca se decompõe em um prisma porque:",
        "options": ["O prisma absorve cores", "Cada cor sofre refração diferente (dispersão)", "O prisma reflete a luz", "A luz muda de estado"],
        "answer": 1,
        "explanation": "Dispersão = cada cor tem um índice de refração diferente no prisma, desviando-se em ângulos diferentes. Vermelho desvia menos, violeta mais."
      }
    ]
  }'::jsonb, 70
);
