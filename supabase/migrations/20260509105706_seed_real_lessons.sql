/*
  # Seed Real Lessons with Questions

  1. Changes
    - Delete existing lesson data
    - Insert 5 English lessons with real multiple-choice, fill-in-the-blank, and matching questions
    - Insert 5 Math lessons with real multiple-choice questions and explanations
    - Each lesson has content_json with a "questions" array following the standard format

  2. Lesson Format
    Each content_json contains:
    - questions: array of question objects
    - type: "choice" | "fill" | "match"
    - prompt: the question text
    - options: array of answer options
    - answer: index of correct option (for choice/fill)
    - pairs: array of {left, right} objects (for match)
    - explanation: explanation shown on wrong answer

  3. Important Notes
    - Uses DELETE to clear old seed data first
    - All questions are in Portuguese with English content for English lessons
    - Math questions use real ENEM-style problems
*/

-- Clear old seed data
DELETE FROM lessons;

-- ENGLISH LESSONS

INSERT INTO lessons (id, module, category, level, title, content_json, xp_reward) VALUES
(
  gen_random_uuid(), 'ingles', 'vocabulario', 1, 'Saudações e Apresentações',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "Como se diz ''Bom dia'' em inglês?",
        "options": ["Good night", "Good morning", "Good evening", "Good afternoon"],
        "answer": 1,
        "explanation": "Good morning = Bom dia. Good night = Boa noite. Good evening = Boa tarde/noite. Good afternoon = Boa tarde."
      },
      {
        "type": "fill",
        "prompt": "Nice to ___ you! (conhecer)",
        "options": ["see", "meet", "know", "find"],
        "answer": 1,
        "explanation": "Nice to meet you = Prazer em conhecer você. É a forma mais comum de se apresentar em inglês."
      },
      {
        "type": "choice",
        "prompt": "Qual é a resposta para ''How are you?''",
        "options": ["I have 20 years", "I am fine, thank you", "I am good person", "Yes, I am"],
        "answer": 1,
        "explanation": "I am fine, thank you = Estou bem, obrigado. Nunca diga ''I have 20 years'' — em inglês usamos ''I am 20 years old''."
      },
      {
        "type": "match",
        "prompt": "Relacione as saudações",
        "pairs": [
          {"left": "Hello", "right": "Olá"},
          {"left": "Goodbye", "right": "Tchau"},
          {"left": "Please", "right": "Por favor"},
          {"left": "Thank you", "right": "Obrigado"}
        ],
        "explanation": "Essas são as saudações mais básicas e importantes do inglês."
      },
      {
        "type": "choice",
        "prompt": "O que significa ''See you later''?",
        "options": ["Até logo", "Vejo você", "Olhe depois", "Até nunca"],
        "answer": 0,
        "explanation": "See you later = Até logo. É uma forma informal e muito comum de se despedir."
      }
    ]
  }'::jsonb, 50
),
(
  gen_random_uuid(), 'ingles', 'vocabulario', 2, 'Comida e Bebida',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "Como se diz ''pão'' em inglês?",
        "options": ["Bread", "Cake", "Rice", "Soup"],
        "answer": 0,
        "explanation": "Bread = pão. Cake = bolo. Rice = arroz. Soup = sopa."
      },
      {
        "type": "fill",
        "prompt": "I would like a ___ of water, please. (copo)",
        "options": ["cup", "glass", "bottle", "plate"],
        "answer": 1,
        "explanation": "Glass = copo (de vidro). A glass of water = um copo de água. Cup é usado para xícara."
      },
      {
        "type": "choice",
        "prompt": "Qual é o significado de ''beverage''?",
        "options": ["Comida", "Bebida", "Sobremesa", "Aperitivo"],
        "answer": 1,
        "explanation": "Beverage = bebida. É uma palavra mais formal para drink."
      },
      {
        "type": "match",
        "prompt": "Relacione as comidas",
        "pairs": [
          {"left": "Chicken", "right": "Frango"},
          {"left": "Beef", "right": "Carne bovina"},
          {"left": "Pork", "right": "Carne suína"},
          {"left": "Fish", "right": "Peixe"}
        ],
        "explanation": "Esses são os tipos de carne mais comuns em inglês."
      },
      {
        "type": "choice",
        "prompt": "''I''m starving'' significa:",
        "options": ["Estou morrendo", "Estou com muita fome", "Estou com sede", "Estou cansado"],
        "answer": 1,
        "explanation": "Starving = morrendo de fome. É uma expressão comum para dizer que está com muita fome."
      }
    ]
  }'::jsonb, 60
),
(
  gen_random_uuid(), 'ingles', 'gramatica', 1, 'Present Simple',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "Complete: She ___ to school every day.",
        "options": ["go", "goes", "going", "gone"],
        "answer": 1,
        "explanation": "No Present Simple, com he/she/it, adicionamos -s ou -es ao verbo. She goes = Ela vai."
      },
      {
        "type": "fill",
        "prompt": "They ___ (não jogam) soccer on Mondays.",
        "options": ["don''t play", "doesn''t play", "not play", "no play"],
        "answer": 0,
        "explanation": "Com I/you/we/they, usamos don''t + verbo. They don''t play = Eles não jogam."
      },
      {
        "type": "choice",
        "prompt": "Qual a forma negativa de ''He likes coffee''?",
        "options": ["He don''t like coffee", "He doesn''t like coffee", "He not like coffee", "He no like coffee"],
        "answer": 1,
        "explanation": "Com he/she/it, usamos doesn''t + verbo base (sem -s). He doesn''t like = Ele não gosta."
      },
      {
        "type": "choice",
        "prompt": "___ your mother work in a hospital?",
        "options": ["Do", "Does", "Is", "Are"],
        "answer": 1,
        "explanation": "Com he/she/it, usamos Does para perguntas. Does your mother work = Sua mãe trabalha?"
      },
      {
        "type": "choice",
        "prompt": "Escolha a frase correta no Present Simple:",
        "options": ["I am go to work", "I goes to work", "I go to work", "I going to work"],
        "answer": 2,
        "explanation": "I go to work = Eu vou ao trabalho. Present Simple: sujeito + verbo base (I/you/we/they)."
      }
    ]
  }'::jsonb, 70
),
(
  gen_random_uuid(), 'ingles', 'gramatica', 2, 'Past Simple',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "Complete: I ___ (comer) pizza yesterday.",
        "options": ["eat", "ate", "eaten", "eating"],
        "answer": 1,
        "explanation": "Ate é o passado de eat. I ate pizza yesterday = Eu comi pizza ontem."
      },
      {
        "type": "fill",
        "prompt": "She ___ (não foi) to the party last night.",
        "options": ["didn''t go", "doesn''t go", "don''t go", "not went"],
        "answer": 0,
        "explanation": "No Past Simple negativo: didn''t + verbo base. She didn''t go = Ela não foi."
      },
      {
        "type": "choice",
        "prompt": "Qual é o passado de ''buy''?",
        "options": ["Buyed", "Bought", "Boughted", "Buied"],
        "answer": 1,
        "explanation": "Bought é o passado irregular de buy. Buy → Bought → Bought."
      },
      {
        "type": "match",
        "prompt": "Relacione os verbos com o passado",
        "pairs": [
          {"left": "go", "right": "went"},
          {"left": "see", "right": "saw"},
          {"left": "have", "right": "had"},
          {"left": "make", "right": "made"}
        ],
        "explanation": "Esses são verbos irregulares muito comuns no Past Simple."
      },
      {
        "type": "choice",
        "prompt": "___ you watch the movie last night?",
        "options": ["Do", "Did", "Does", "Are"],
        "answer": 1,
        "explanation": "Did é usado para perguntas no Past Simple. Did you watch = Você assistiu?"
      }
    ]
  }'::jsonb, 70
),
(
  gen_random_uuid(), 'ingles', 'conversacao', 1, 'No Restaurante',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "O garçom pergunta: ''Are you ready to order?'' Você responde:",
        "options": ["Yes, I would like the pasta", "Yes, I want eat", "No, I no ready", "I am order now"],
        "answer": 0,
        "explanation": "Yes, I would like the pasta = Sim, eu gostaria da massa. É a forma mais educada de fazer um pedido."
      },
      {
        "type": "fill",
        "prompt": "Can I have the ___, please? (conta)",
        "options": ["bill", "menu", "table", "food"],
        "answer": 0,
        "explanation": "Bill = conta. Can I have the bill, please? = Pode me trazer a conta, por favor?"
      },
      {
        "type": "choice",
        "prompt": "''I''ll have the steak'' significa:",
        "options": ["Eu terei o bife", "Eu quero o bife", "Eu comi o bife", "Eu paguei o bife"],
        "answer": 1,
        "explanation": "I''ll have = Eu quero/peço. É a forma comum de fazer um pedido no restaurante."
      },
      {
        "type": "choice",
        "prompt": "Como pedir água ao garçom?",
        "options": ["Give water", "Water now", "Could I have some water, please?", "I need water"],
        "answer": 2,
        "explanation": "Could I have some water, please? = Poderia me trazer um pouco de água? É a forma mais educada."
      },
      {
        "type": "choice",
        "prompt": "O que significa ''tip'' no contexto de restaurante?",
        "options": ["Dica", "Gorjeta", "Desconto", "Cardápio"],
        "answer": 1,
        "explanation": "Tip = gorjeta. Nos EUA, é comum deixar 15-20% de tip."
      }
    ]
  }'::jsonb, 80
),

-- MATH LESSONS

(
  gen_random_uuid(), 'matematica', 'basica', 1, 'Operações Fundamentais',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "Quanto é 234 + 567?",
        "options": ["801", "791", "811", "701"],
        "answer": 0,
        "explanation": "234 + 567 = 801. Some unidades: 4+7=11 (vai 1), dezenas: 3+6+1=10 (vai 1), centenas: 2+5+1=8."
      },
      {
        "type": "choice",
        "prompt": "Qual é o resultado de 15 × 12?",
        "options": ["170", "180", "190", "160"],
        "answer": 1,
        "explanation": "15 × 12 = 15 × 10 + 15 × 2 = 150 + 30 = 180. Use a propriedade distributiva."
      },
      {
        "type": "choice",
        "prompt": "Quanto é 456 - 189?",
        "options": ["267", "277", "257", "287"],
        "answer": 0,
        "explanation": "456 - 189 = 267. Subtraia emprestando: unidades 6-9 (empresta), dezenas 4-8 (empresta), centenas 3-1=2."
      },
      {
        "type": "choice",
        "prompt": "Qual é o resto da divisão de 47 por 6?",
        "options": ["1", "5", "3", "7"],
        "answer": 1,
        "explanation": "47 ÷ 6 = 7 com resto 5, pois 6 × 7 = 42 e 47 - 42 = 5."
      },
      {
        "type": "choice",
        "prompt": "Qual é o MMC (mínimo múltiplo comum) de 4 e 6?",
        "options": ["24", "12", "6", "2"],
        "answer": 1,
        "explanation": "Múltiplos de 4: 4,8,12,16... Múltiplos de 6: 6,12,18... O menor comum é 12."
      }
    ]
  }'::jsonb, 50
),
(
  gen_random_uuid(), 'matematica', 'algebra', 1, 'Equações do 1º Grau',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "Resolva: 2x + 6 = 14",
        "options": ["x = 4", "x = 10", "x = 3", "x = 5"],
        "answer": 0,
        "explanation": "2x + 6 = 14 → 2x = 14 - 6 → 2x = 8 → x = 4. Isole o x subtraindo 6 e dividindo por 2."
      },
      {
        "type": "choice",
        "prompt": "Resolva: 3x - 9 = 0",
        "options": ["x = 3", "x = -3", "x = 9", "x = -9"],
        "answer": 0,
        "explanation": "3x - 9 = 0 → 3x = 9 → x = 3. Passe o -9 para o outro lado e divida por 3."
      },
      {
        "type": "choice",
        "prompt": "Se 5x + 3 = 2x + 12, qual é o valor de x?",
        "options": ["x = 3", "x = 5", "x = 9", "x = 15"],
        "answer": 0,
        "explanation": "5x + 3 = 2x + 12 → 5x - 2x = 12 - 3 → 3x = 9 → x = 3. Junte os termos com x de um lado."
      },
      {
        "type": "choice",
        "prompt": "A soma de um número com o seu dobro é 27. Qual é o número?",
        "options": ["9", "7", "6", "8"],
        "answer": 0,
        "explanation": "x + 2x = 27 → 3x = 27 → x = 9. O número é 9 e seu dobro é 18. 9 + 18 = 27."
      },
      {
        "type": "choice",
        "prompt": "Resolva: -4x + 20 = 0",
        "options": ["x = 5", "x = -5", "x = 4", "x = -4"],
        "answer": 0,
        "explanation": "-4x + 20 = 0 → -4x = -20 → x = 5. Divida ambos os lados por -4."
      }
    ]
  }'::jsonb, 60
),
(
  gen_random_uuid(), 'matematica', 'geometria', 1, 'Áreas de Figuras Planas',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "Qual é a área de um retângulo com base 8 cm e altura 5 cm?",
        "options": ["40 cm²", "26 cm²", "13 cm²", "80 cm²"],
        "answer": 0,
        "explanation": "Área do retângulo = base × altura = 8 × 5 = 40 cm²."
      },
      {
        "type": "choice",
        "prompt": "A área de um triângulo com base 10 cm e altura 6 cm é:",
        "options": ["60 cm²", "30 cm²", "16 cm²", "36 cm²"],
        "answer": 1,
        "explanation": "Área do triângulo = (base × altura) / 2 = (10 × 6) / 2 = 30 cm²."
      },
      {
        "type": "choice",
        "prompt": "Qual é a área de um círculo com raio 7 cm? (use π ≈ 3,14)",
        "options": ["153,86 cm²", "43,96 cm²", "21,98 cm²", "49 cm²"],
        "answer": 0,
        "explanation": "Área do círculo = π × r² = 3,14 × 7² = 3,14 × 49 = 153,86 cm²."
      },
      {
        "type": "choice",
        "prompt": "Um quadrado tem área de 64 cm². Qual é o seu lado?",
        "options": ["8 cm", "16 cm", "32 cm", "4 cm"],
        "answer": 0,
        "explanation": "Área = lado² → 64 = lado² → lado = √64 = 8 cm."
      },
      {
        "type": "choice",
        "prompt": "A área de um losango com diagonais 6 cm e 8 cm é:",
        "options": ["48 cm²", "24 cm²", "14 cm²", "32 cm²"],
        "answer": 1,
        "explanation": "Área do losango = (D × d) / 2 = (8 × 6) / 2 = 24 cm²."
      }
    ]
  }'::jsonb, 60
),
(
  gen_random_uuid(), 'matematica', 'porcentagem', 1, 'Porcentagem no Dia a Dia',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "15% de 200 é igual a:",
        "options": ["30", "20", "15", "35"],
        "answer": 0,
        "explanation": "15% de 200 = (15/100) × 200 = 0,15 × 200 = 30."
      },
      {
        "type": "choice",
        "prompt": "Uma camisa de R$80 está com 25% de desconto. Qual o preço final?",
        "options": ["R$ 60", "R$ 55", "R$ 65", "R$ 20"],
        "answer": 0,
        "explanation": "Desconto = 25% de 80 = R$20. Preço final = 80 - 20 = R$60."
      },
      {
        "type": "choice",
        "prompt": "Um salário de R$2.000 teve aumento de 10%. Qual o novo salário?",
        "options": ["R$ 2.200", "R$ 2.100", "R$ 2.010", "R$ 2.500"],
        "answer": 0,
        "explanation": "Aumento = 10% de 2000 = R$200. Novo salário = 2000 + 200 = R$2.200."
      },
      {
        "type": "choice",
        "prompt": "Se 30 é 20% de um número, qual é esse número?",
        "options": ["150", "60", "300", "100"],
        "answer": 0,
        "explanation": "20% de x = 30 → 0,2x = 30 → x = 30/0,2 = 150."
      },
      {
        "type": "choice",
        "prompt": "Um produto subiu de R$50 para R$60. Qual foi o percentual de aumento?",
        "options": ["20%", "10%", "50%", "25%"],
        "answer": 0,
        "explanation": "Aumento = 60 - 50 = R$10. Percentual = (10/50) × 100 = 20%."
      }
    ]
  }'::jsonb, 70
),
(
  gen_random_uuid(), 'matematica', 'estatistica', 1, 'Média e Mediana',
  '{
    "questions": [
      {
        "type": "choice",
        "prompt": "Qual é a média aritmética de 4, 6, 8 e 10?",
        "options": ["7", "6", "8", "9"],
        "answer": 0,
        "explanation": "Média = (4 + 6 + 8 + 10) / 4 = 28 / 4 = 7."
      },
      {
        "type": "choice",
        "prompt": "Qual é a mediana de: 3, 5, 7, 9, 11?",
        "options": ["7", "5", "9", "35"],
        "answer": 0,
        "explanation": "Com 5 números ímpares, a mediana é o valor central: 7."
      },
      {
        "type": "choice",
        "prompt": "Qual é a moda de: 2, 3, 3, 5, 7, 3, 8?",
        "options": ["3", "5", "2", "7"],
        "answer": 0,
        "explanation": "A moda é o valor que mais se repete. O 3 aparece 3 vezes."
      },
      {
        "type": "choice",
        "prompt": "A média de 5 números é 8. Se um dos números é 12, a soma dos outros 4 é:",
        "options": ["28", "32", "40", "20"],
        "answer": 0,
        "explanation": "Soma total = 5 × 8 = 40. Soma dos outros 4 = 40 - 12 = 28."
      },
      {
        "type": "choice",
        "prompt": "Qual é a mediana de: 2, 4, 6, 8?",
        "options": ["5", "4", "6", "7"],
        "answer": 0,
        "explanation": "Com número par de dados, a mediana é a média dos dois centrais: (4+6)/2 = 5."
      }
    ]
  }'::jsonb, 70
);
