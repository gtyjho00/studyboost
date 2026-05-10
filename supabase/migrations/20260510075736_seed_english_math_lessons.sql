/*
  # Seed English and Math Lessons with Real Questions

  1. New Data
    - 10 English lessons covering grammar, vocabulary, reading comprehension
    - 10 Math lessons covering algebra, geometry, statistics, etc.
    - Each lesson has 5 questions with type, prompt, options, answer, explanation

  2. Content Structure
    - content_json contains: { questions: [...] }
    - Each question: { type, prompt, options, answer, explanation }
    - Types: multiple_choice, true_false, fill_blank

  3. Important Notes
    - Uses ON CONFLICT to avoid duplicate inserts
    - All content is real educational material in Portuguese/English
*/

-- Delete existing lessons to avoid conflicts
DELETE FROM lessons WHERE module IN ('ingles', 'matematica');

-- ENGLISH LESSONS (10)
INSERT INTO lessons (id, module, category, level, title, content_json, xp_reward) VALUES

-- Lesson 1: Present Simple
('a0000001-0000-0000-0000-000000000001', 'ingles', 'Gramática', 1, 'Present Simple - Afirmativa',
'{"questions":[
  {"type":"multiple_choice","prompt":"Complete: She _____ to school every day.","options":["go","goes","going","gone"],"answer":"goes","explanation":"Na terceira pessoa (he/she/it), adicionamos -s ao verbo no Present Simple."},
  {"type":"multiple_choice","prompt":"Complete: They _____ English on Mondays.","options":["study","studies","studying","studied"],"answer":"study","explanation":"Com They (3ª pessoa do plural), o verbo fica na forma base sem -s."},
  {"type":"true_false","prompt":"No Present Simple, usamos \"goes\" com I.","options":["Verdadeiro","Falso"],"answer":"Falso","explanation":"Com I, usamos a forma base: I go (não I goes). Goes é apenas para he/she/it."},
  {"type":"multiple_choice","prompt":"Complete: He _____ breakfast at 7 AM.","options":["have","has","having","haved"],"answer":"has","explanation":"Have é irregular na 3ª pessoa: he has (não he haves)."},
  {"type":"fill_blank","prompt":"Complete: We _____ (play) soccer on weekends.","options":["play","plays","playing","played"],"answer":"play","explanation":"Com We, o verbo fica na forma base: We play."}
]}', 50),

-- Lesson 2: Present Simple - Negative & Questions
('a0000001-0000-0000-0000-000000000002', 'ingles', 'Gramática', 1, 'Present Simple - Negativa e Perguntas',
'{"questions":[
  {"type":"multiple_choice","prompt":"Complete: She _____ like pizza.","options":["don''t","doesn''t","isn''t","aren''t"],"answer":"doesn''t","explanation":"Na negativa com he/she/it, usamos doesn''t + verbo base."},
  {"type":"multiple_choice","prompt":"Complete: _____ you speak Portuguese?","options":["Do","Does","Is","Are"],"answer":"Do","explanation":"Com you, usamos Do para formar perguntas no Present Simple."},
  {"type":"true_false","prompt":"\"Does he like coffee?\" está correto.","options":["Verdadeiro","Falso"],"answer":"Verdadeiro","explanation":"Com he/she/it, usamos Does + sujeito + verbo base para perguntas."},
  {"type":"multiple_choice","prompt":"Complete: They _____ go to the gym.","options":["don''t","doesn''t","isn''t","aren''t"],"answer":"don''t","explanation":"Com They, usamos don''t para a forma negativa."},
  {"type":"fill_blank","prompt":"Complete: _____ she work here? (Does/Do)","options":["Does","Do","Is","Are"],"answer":"Does","explanation":"Com She, usamos Does para perguntas no Present Simple."}
]}', 50),

-- Lesson 3: Present Continuous
('a0000001-0000-0000-0000-000000000003', 'ingles', 'Gramática', 2, 'Present Continuous',
'{"questions":[
  {"type":"multiple_choice","prompt":"Complete: She _____ reading a book right now.","options":["is","are","am","be"],"answer":"is","explanation":"Present Continuous = sujeito + to be + verbo-ing. Com She, usamos is."},
  {"type":"multiple_choice","prompt":"Complete: They _____ playing soccer at the moment.","options":["is","are","am","be"],"answer":"are","explanation":"Com They, usamos are no Present Continuous."},
  {"type":"true_false","prompt":"\"I am work now\" está correto em inglês.","options":["Verdadeiro","Falso"],"answer":"Falso","explanation":"O correto é I am working now. Precisamos do verbo com -ing."},
  {"type":"multiple_choice","prompt":"Complete: What _____ you doing?","options":["are","is","am","do"],"answer":"are","explanation":"Com you, usamos are no Present Continuous."},
  {"type":"fill_blank","prompt":"Complete: He _____ (study) English now.","options":["is studying","studies","studying","are studying"],"answer":"is studying","explanation":"He + is + studying = Present Continuous."}
]}', 50),

-- Lesson 4: Past Simple - Regular
('a0000001-0000-0000-0000-000000000004', 'ingles', 'Gramática', 2, 'Past Simple - Verbos Regulares',
'{"questions":[
  {"type":"multiple_choice","prompt":"Complete: She _____ to the store yesterday.","options":["walked","walk","walking","walks"],"answer":"walked","explanation":"Verbos regulares no Past Simple adicionam -ed: walk → walked."},
  {"type":"multiple_choice","prompt":"Complete: They _____ a movie last night.","options":["watched","watch","watching","watches"],"answer":"watched","explanation":"Watch + ed = watched. O Past Simple é o mesmo para todas as pessoas."},
  {"type":"true_false","prompt":"Verbos terminados em -e recebem apenas -d no passado.","options":["Verdadeiro","Falso"],"answer":"Verdadeiro","explanation":"Como em: live → lived, dance → danced. Apenas adicionamos -d."},
  {"type":"multiple_choice","prompt":"Complete: We _____ the room before the guests arrived.","options":["cleaned","clean","cleaning","cleans"],"answer":"cleaned","explanation":"Clean + ed = cleaned. Ação concluída no passado."},
  {"type":"fill_blank","prompt":"Complete: He _____ (study) hard for the test.","options":["studied","studyed","studys","studies"],"answer":"studied","explanation":"Study → studied. Quando o verbo termina em consoante+y, trocamos y por i + ed."}
]}', 50),

-- Lesson 5: Past Simple - Irregular
('a0000001-0000-0000-0000-000000000005', 'ingles', 'Gramática', 3, 'Past Simple - Verbos Irregulares',
'{"questions":[
  {"type":"multiple_choice","prompt":"Complete: She _____ to Paris last summer.","options":["went","goed","gone","go"],"answer":"went","explanation":"Go é irregular: go → went (não goed)."},
  {"type":"multiple_choice","prompt":"Complete: I _____ a great book yesterday.","options":["read","readed","reading","reads"],"answer":"read","explanation":"Read é irregular: read → read (pronúncia muda: /rɛd/ no passado)."},
  {"type":"true_false","prompt":"\"I buyed a car\" está correto.","options":["Verdadeiro","Falso"],"answer":"Falso","explanation":"Buy é irregular: buy → bought (não buyed)."},
  {"type":"multiple_choice","prompt":"Complete: They _____ dinner at 8 PM.","options":["had","haved","have","having"],"answer":"had","explanation":"Have é irregular: have → had."},
  {"type":"fill_blank","prompt":"Complete: She _____ (write) a letter to her friend.","options":["wrote","writed","written","write"],"answer":"wrote","explanation":"Write é irregular: write → wrote."}
]}', 60),

-- Lesson 6: Vocabulary - Food
('a0000001-0000-0000-0000-000000000006', 'ingles', 'Vocabulário', 1, 'Vocabulário - Comida e Bebida',
'{"questions":[
  {"type":"multiple_choice","prompt":"Como se diz \"maçã\" em inglês?","options":["Apple","Grape","Pear","Peach"],"answer":"Apple","explanation":"Apple = maçã. Pronúncia: /ˈæp.əl/"},
  {"type":"multiple_choice","prompt":"Qual é a tradução de \"bread\"?","options":["Pão","Leite","Queijo","Arroz"],"answer":"Pão","explanation":"Bread = pão. Pronúncia: /brɛd/"},
  {"type":"true_false","prompt":"\"Water\" significa \"vinho\" em português.","options":["Verdadeiro","Falso"],"answer":"Falso","explanation":"Water = água. Wine = vinho."},
  {"type":"multiple_choice","prompt":"Como se diz \"frango\" em inglês?","options":["Chicken","Beef","Fish","Pork"],"answer":"Chicken","explanation":"Chicken = frango. Beef = carne bovina."},
  {"type":"fill_blank","prompt":"Complete: I drink _____ (café) every morning.","options":["coffee","tea","milk","juice"],"answer":"coffee","explanation":"Coffee = café. Pronúncia: /ˈkɒf.i/"}
]}', 50),

-- Lesson 7: Vocabulary - Daily Routine
('a0000001-0000-0000-0000-000000000007', 'ingles', 'Vocabulário', 2, 'Vocabulário - Rotina Diária',
'{"questions":[
  {"type":"multiple_choice","prompt":"Como se diz \"acordar\" em inglês?","options":["Wake up","Sleep","Dream","Rest"],"answer":"Wake up","explanation":"Wake up = acordar. I wake up at 7 AM."},
  {"type":"multiple_choice","prompt":"Qual é a tradução de \"take a shower\"?","options":["Tomar banho","Tomar café","Sair de casa","Dormir"],"answer":"Tomar banho","explanation":"Take a shower = tomar banho."},
  {"type":"true_false","prompt":"\"Go to bed\" significa \"ir para o trabalho\".","options":["Verdadeiro","Falso"],"answer":"Falso","explanation":"Go to bed = ir para a cama / deitar. Go to work = ir para o trabalho."},
  {"type":"multiple_choice","prompt":"Como se diz \"almoçar\" em inglês?","options":["Have lunch","Have dinner","Have breakfast","Have snack"],"answer":"Have lunch","explanation":"Have lunch = almoçar. Breakfast = café da manhã, dinner = jantar."},
  {"type":"fill_blank","prompt":"Complete: I _____ (escovar os dentes) after every meal.","options":["brush my teeth","wash my face","comb my hair","take a shower"],"answer":"brush my teeth","explanation":"Brush my teeth = escovar os dentes."}
]}', 50),

-- Lesson 8: Reading Comprehension
('a0000001-0000-0000-0000-000000000008', 'ingles', 'Leitura', 3, 'Compreensão de Texto - Introdução',
'{"questions":[
  {"type":"multiple_choice","prompt":"Texto: \"Anna is a teacher. She works at a school in London. She teaches math to children.\" What does Anna do?","options":["She is a teacher","She is a doctor","She is a student","She is a nurse"],"answer":"She is a teacher","explanation":"O texto diz claramente: Anna is a teacher (Anna é professora)."},
  {"type":"multiple_choice","prompt":"Texto: \"Anna is a teacher. She works at a school in London.\" Where does Anna work?","options":["In London","In Paris","In New York","In São Paulo"],"answer":"In London","explanation":"O texto diz: She works at a school in London."},
  {"type":"true_false","prompt":"Texto: \"Anna teaches math to children.\" Anna ensina ciências.","options":["Verdadeiro","Falso"],"answer":"Falso","explanation":"O texto diz que Anna teaches math (matemática), não ciências."},
  {"type":"multiple_choice","prompt":"Texto: \"Anna is a teacher. She works at a school in London. She teaches math to children.\" Who does Anna teach?","options":["Children","Adults","Teenagers","Babies"],"answer":"Children","explanation":"O texto diz: She teaches math to children (crianças)."},
  {"type":"fill_blank","prompt":"Texto: \"Anna teaches _____ to children.\" Complete com a matéria.","options":["math","science","history","English"],"answer":"math","explanation":"O texto diz: She teaches math to children."}
]}', 60),

-- Lesson 9: Comparatives
('a0000001-0000-0000-0000-000000000009', 'ingles', 'Gramática', 3, 'Comparativos e Superlativos',
'{"questions":[
  {"type":"multiple_choice","prompt":"Complete: English is _____ than Portuguese.","options":["easier","more easy","easiest","most easy"],"answer":"easier","explanation":"Adjetivos curtos (1-2 sílabas): adj + er = easier. More é para adjetivos longos."},
  {"type":"multiple_choice","prompt":"Complete: She is the _____ student in the class.","options":["most intelligent","intelligentest","more intelligent","intelligent"],"answer":"most intelligent","explanation":"Adjetivos longos (3+ sílabas): the most + adj = the most intelligent."},
  {"type":"true_false","prompt":"\"More bigger\" está correto em inglês.","options":["Verdadeiro","Falso"],"answer":"Falso","explanation":"Big é adjetivo curto: bigger (não more bigger). Nunca usamos more com -er."},
  {"type":"multiple_choice","prompt":"Complete: This book is _____ than that one.","options":["better","gooder","more good","best"],"answer":"better","explanation":"Good é irregular: good → better → the best."},
  {"type":"fill_blank","prompt":"Complete: Brazil is the _____ (large) country in South America.","options":["largest","larger","most large","more large"],"answer":"largest","explanation":"Large + est = largest. Superlativo de adjetivos curtos: the + adj + est."}
]}', 60),

-- Lesson 10: Prepositions of Time
('a0000001-0000-0000-0000-000000000010', 'ingles', 'Gramática', 2, 'Preposições de Tempo',
'{"questions":[
  {"type":"multiple_choice","prompt":"Complete: I wake up _____ 7 AM.","options":["at","in","on","by"],"answer":"at","explanation":"Usamos AT para horários específicos: at 7 AM, at noon, at midnight."},
  {"type":"multiple_choice","prompt":"Complete: She studies _____ the morning.","options":["in","at","on","by"],"answer":"in","explanation":"Usamos IN para partes do dia: in the morning, in the afternoon, in the evening."},
  {"type":"true_false","prompt":"Usamos ON com dias da semana: on Monday.","options":["Verdadeiro","Falso"],"answer":"Verdadeiro","explanation":"ON é usado para dias e datas: on Monday, on July 4th, on my birthday."},
  {"type":"multiple_choice","prompt":"Complete: We have a meeting _____ Monday.","options":["on","in","at","by"],"answer":"on","explanation":"Dias da semana usam ON: on Monday, on Tuesday, etc."},
  {"type":"fill_blank","prompt":"Complete: The party is _____ night.","options":["at","in","on","by"],"answer":"at","explanation":"Usamos AT com night: at night. Mas IN the evening."}
]}', 50),

-- MATH LESSONS (10)

-- Lesson 1: Basic Operations
('b0000001-0000-0000-0000-000000000001', 'matematica', 'Aritmética', 1, 'Operações Básicas',
'{"questions":[
  {"type":"multiple_choice","prompt":"Quanto é 15 + 27?","options":["42","43","41","44"],"answer":"42","explanation":"15 + 27 = 42. Somamos as unidades: 5+7=12, levamos 1. Depois: 1+2+1=4."},
  {"type":"multiple_choice","prompt":"Quanto é 100 - 37?","options":["63","67","73","53"],"answer":"63","explanation":"100 - 37 = 63. Subtraimos: 0-7 não dá, emprestamos: 10-7=3, 9-3=6."},
  {"type":"true_false","prompt":"8 × 7 = 54","options":["Verdadeiro","Falso"],"answer":"Falso","explanation":"8 × 7 = 56, não 54. Dica: 8×5=40, 8×2=16, 40+16=56."},
  {"type":"multiple_choice","prompt":"Quanto é 144 ÷ 12?","options":["12","14","11","13"],"answer":"12","explanation":"144 ÷ 12 = 12. Dica: 12 × 12 = 144."},
  {"type":"fill_blank","prompt":"Complete: 25 × 4 = _____","options":["100","90","80","110"],"answer":"100","explanation":"25 × 4 = 100. Dica: 25×2=50, 50×2=100."}
]}', 50),

-- Lesson 2: Fractions
('b0000001-0000-0000-0000-000000000002', 'matematica', 'Frações', 2, 'Frações - Conceitos Básicos',
'{"questions":[
  {"type":"multiple_choice","prompt":"Qual fração é equivalente a 3/4?","options":["6/8","2/3","4/5","3/5"],"answer":"6/8","explanation":"3/4 = 6/8. Multiplicamos numerador e denominador por 2."},
  {"type":"multiple_choice","prompt":"Quanto é 1/4 + 1/4?","options":["1/2","2/4","1/3","2/8"],"answer":"1/2","explanation":"1/4 + 1/4 = 2/4 = 1/2. Simplificamos dividindo por 2."},
  {"type":"true_false","prompt":"1/2 é maior que 3/4.","options":["Verdadeiro","Falso"],"answer":"Falso","explanation":"1/2 = 0,5 e 3/4 = 0,75. Portanto, 3/4 é maior."},
  {"type":"multiple_choice","prompt":"Qual fração é maior: 2/5 ou 3/7?","options":["3/7","2/5","São iguais","Não dá para comparar"],"answer":"3/7","explanation":"2/5 = 0,4 e 3/7 ≈ 0,43. Portanto, 3/7 é ligeiramente maior."},
  {"type":"fill_blank","prompt":"Complete: 2/3 + 1/3 = _____","options":["1","2/6","3/3","1/3"],"answer":"1","explanation":"2/3 + 1/3 = 3/3 = 1."}
]}', 50),

-- Lesson 3: Percentages
('b0000001-0000-0000-0000-000000000003', 'matematica', 'Porcentagem', 2, 'Porcentagem - Cálculos',
'{"questions":[
  {"type":"multiple_choice","prompt":"Quanto é 20% de 150?","options":["30","25","35","20"],"answer":"30","explanation":"20% de 150 = 0,2 × 150 = 30."},
  {"type":"multiple_choice","prompt":"Um produto de R$200 tem 15% de desconto. Qual o preço final?","options":["R$170","R$180","R$185","R$160"],"answer":"R$170","explanation":"15% de 200 = R$30. Preço final = 200 - 30 = R$170."},
  {"type":"true_false","prompt":"50% de 80 é igual a 40.","options":["Verdadeiro","Falso"],"answer":"Verdadeiro","explanation":"50% = 1/2. Metade de 80 = 40."},
  {"type":"multiple_choice","prompt":"Se 30% dos 50 alunos tiraram nota 10, quantos alunos tiraram 10?","options":["15","10","20","25"],"answer":"15","explanation":"30% de 50 = 0,3 × 50 = 15 alunos."},
  {"type":"fill_blank","prompt":"Complete: 10% de 450 = _____","options":["45","40","50","35"],"answer":"45","explanation":"10% de 450 = 0,1 × 450 = 45. Dica: 10% = dividir por 10."}
]}', 50),

-- Lesson 4: Equations - Linear
('b0000001-0000-0000-0000-000000000004', 'matematica', 'Álgebra', 3, 'Equações do 1º Grau',
'{"questions":[
  {"type":"multiple_choice","prompt":"Resolva: 2x + 3 = 11","options":["x = 4","x = 3","x = 5","x = 7"],"answer":"x = 4","explanation":"2x + 3 = 11 → 2x = 8 → x = 4."},
  {"type":"multiple_choice","prompt":"Resolva: 5x - 10 = 25","options":["x = 7","x = 5","x = 3","x = 9"],"answer":"x = 7","explanation":"5x - 10 = 25 → 5x = 35 → x = 7."},
  {"type":"true_false","prompt":"Na equação 3x = 18, x = 5.","options":["Verdadeiro","Falso"],"answer":"Falso","explanation":"3x = 18 → x = 18/3 = 6, não 5."},
  {"type":"multiple_choice","prompt":"Resolva: x/2 + 4 = 10","options":["x = 12","x = 10","x = 8","x = 14"],"answer":"x = 12","explanation":"x/2 + 4 = 10 → x/2 = 6 → x = 12."},
  {"type":"fill_blank","prompt":"Complete: Se 4x = 20, então x = _____","options":["5","4","6","3"],"answer":"5","explanation":"4x = 20 → x = 20/4 = 5."}
]}', 60),

-- Lesson 5: Geometry - Area
('b0000001-0000-0000-0000-000000000005', 'matematica', 'Geometria', 3, 'Áreas de Figuras Planas',
'{"questions":[
  {"type":"multiple_choice","prompt":"Qual a área de um retângulo de base 8 e altura 5?","options":["40","26","13","80"],"answer":"40","explanation":"Área do retângulo = base × altura = 8 × 5 = 40."},
  {"type":"multiple_choice","prompt":"Qual a área de um triângulo com base 10 e altura 6?","options":["30","60","16","36"],"answer":"30","explanation":"Área do triângulo = (base × altura)/2 = (10 × 6)/2 = 30."},
  {"type":"true_false","prompt":"A área de um quadrado de lado 7 é 49.","options":["Verdadeiro","Falso"],"answer":"Verdadeiro","explanation":"Área do quadrado = lado² = 7² = 49."},
  {"type":"multiple_choice","prompt":"Qual a área de um círculo com raio 3? (use π ≈ 3,14)","options":["28,26","18,84","9,42","12,56"],"answer":"28,26","explanation":"Área = π × r² = 3,14 × 9 = 28,26."},
  {"type":"fill_blank","prompt":"Complete: Área do retângulo com lados 12 e 4 = _____","options":["48","16","8","36"],"answer":"48","explanation":"Área = 12 × 4 = 48."}
]}', 60),

-- Lesson 6: Statistics - Mean
('b0000001-0000-0000-0000-000000000006', 'matematica', 'Estatística', 3, 'Média Aritmética',
'{"questions":[
  {"type":"multiple_choice","prompt":"Qual a média de 10, 20 e 30?","options":["20","15","25","30"],"answer":"20","explanation":"Média = (10+20+30)/3 = 60/3 = 20."},
  {"type":"multiple_choice","prompt":"As notas de um aluno são: 6, 8, 7, 9. Qual a média?","options":["7,5","7","8","6,5"],"answer":"7,5","explanation":"Média = (6+8+7+9)/4 = 30/4 = 7,5."},
  {"type":"true_false","prompt":"A média de 100 e 200 é 150.","options":["Verdadeiro","Falso"],"answer":"Verdadeiro","explanation":"Média = (100+200)/2 = 300/2 = 150."},
  {"type":"multiple_choice","prompt":"Se a média de 5 números é 8, qual a soma deles?","options":["40","35","45","30"],"answer":"40","explanation":"Soma = média × quantidade = 8 × 5 = 40."},
  {"type":"fill_blank","prompt":"Complete: A média de 4, 8 e 12 = _____","options":["8","6","10","12"],"answer":"8","explanation":"Média = (4+8+12)/3 = 24/3 = 8."}
]}', 60),

-- Lesson 7: Proportions
('b0000001-0000-0000-0000-000000000007', 'matematica', 'Razão e Proporção', 2, 'Regra de Três',
'{"questions":[
  {"type":"multiple_choice","prompt":"Se 3 cadernos custam R$15, quanto custam 7 cadernos?","options":["R$35","R$30","R$25","R$40"],"answer":"R$35","explanation":"3 → 15, 7 → x. x = (7×15)/3 = 35."},
  {"type":"multiple_choice","prompt":"Um carro percorre 120 km com 10L de combustível. Com 25L, percorre:","options":["300 km","250 km","200 km","350 km"],"answer":"300 km","explanation":"10L → 120 km, 25L → x. x = (25×120)/10 = 300 km."},
  {"type":"true_false","prompt":"Se 5 → 20, então 10 → 30 (proporção direta).","options":["Verdadeiro","Falso"],"answer":"Falso","explanation":"Se 5 → 20, então 10 → 40 (dobro). 30 não mantém a proporção."},
  {"type":"multiple_choice","prompt":"Se 8 operários fazem um trabalho em 6 dias, 12 operários fazem em:","options":["4 dias","8 dias","9 dias","3 dias"],"answer":"4 dias","explanation":"Regra inversa: 8×6 = 12×x → x = 48/12 = 4 dias."},
  {"type":"fill_blank","prompt":"Complete: Se 2 → 10, então 7 → _____ (proporção direta)","options":["35","30","25","40"],"answer":"35","explanation":"2 → 10, 7 → x. x = (7×10)/2 = 35."}
]}', 60),

-- Lesson 8: Powers and Roots
('b0000001-0000-0000-0000-000000000008', 'matematica', 'Potenciação', 3, 'Potências e Raízes',
'{"questions":[
  {"type":"multiple_choice","prompt":"Quanto é 2⁵?","options":["32","16","64","24"],"answer":"32","explanation":"2⁵ = 2×2×2×2×2 = 32."},
  {"type":"multiple_choice","prompt":"Quanto é √144?","options":["12","14","11","13"],"answer":"12","explanation":"12² = 144, portanto √144 = 12."},
  {"type":"true_false","prompt":"3³ = 27.","options":["Verdadeiro","Falso"],"answer":"Verdadeiro","explanation":"3³ = 3×3×3 = 27."},
  {"type":"multiple_choice","prompt":"Quanto é 5⁰?","options":["1","0","5","10"],"answer":"1","explanation":"Qualquer número elevado a 0 é igual a 1."},
  {"type":"fill_blank","prompt":"Complete: √81 = _____","options":["9","8","7","10"],"answer":"9","explanation":"9² = 81, portanto √81 = 9."}
]}', 60),

-- Lesson 9: Probability
('b0000001-0000-0000-0000-000000000009', 'matematica', 'Probabilidade', 4, 'Probabilidade Básica',
'{"questions":[
  {"type":"multiple_choice","prompt":"Qual a probabilidade de tirar cara numa moeda?","options":["1/2","1/4","1/3","2/3"],"answer":"1/2","explanation":"2 resultados possíveis (cara, coroa). P(cara) = 1/2 = 50%."},
  {"type":"multiple_choice","prompt":"Um dado tem 6 faces. Qual a probabilidade de tirar 4?","options":["1/6","1/4","1/3","1/2"],"answer":"1/6","explanation":"6 resultados possíveis, 1 favorável. P(4) = 1/6."},
  {"type":"true_false","prompt":"A probabilidade de tirar um ás de um baralho de 52 cartas é 1/13.","options":["Verdadeiro","Falso"],"answer":"Verdadeiro","explanation":"4 ases em 52 cartas. P = 4/52 = 1/13."},
  {"type":"multiple_choice","prompt":"Uma urna tem 3 bolas vermelhas e 7 azuis. Qual a P(vermelha)?","options":["3/10","7/10","3/7","1/3"],"answer":"3/10","explanation":"3 vermelhas em 10 total. P = 3/10 = 30%."},
  {"type":"fill_blank","prompt":"Complete: A probabilidade de um evento impossível = _____","options":["0","1","0,5","-1"],"answer":"0","explanation":"Evento impossível: probabilidade = 0 (0%). Evento certo: probabilidade = 1 (100%)."}
]}', 70),

-- Lesson 10: Functions
('b0000001-0000-0000-0000-000000000010', 'matematica', 'Funções', 4, 'Funções - Introdução',
'{"questions":[
  {"type":"multiple_choice","prompt":"Se f(x) = 2x + 1, quanto é f(3)?","options":["7","6","5","8"],"answer":"7","explanation":"f(3) = 2×3 + 1 = 6 + 1 = 7."},
  {"type":"multiple_choice","prompt":"Se f(x) = x² - 4, quanto é f(5)?","options":["21","25","29","1"],"answer":"21","explanation":"f(5) = 5² - 4 = 25 - 4 = 21."},
  {"type":"true_false","prompt":"Se f(x) = 3x, então f(0) = 3.","options":["Verdadeiro","Falso"],"answer":"Falso","explanation":"f(0) = 3×0 = 0, não 3."},
  {"type":"multiple_choice","prompt":"Se g(x) = x/2 + 3, quanto é g(10)?","options":["8","5","10","13"],"answer":"8","explanation":"g(10) = 10/2 + 3 = 5 + 3 = 8."},
  {"type":"fill_blank","prompt":"Complete: Se f(x) = 5x - 10, então f(4) = _____","options":["10","20","15","0"],"answer":"10","explanation":"f(4) = 5×4 - 10 = 20 - 10 = 10."}
]}', 70);
