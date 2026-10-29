// Project Anna — config.js
// Configurações gerais, constantes de grade, paleta de cores e banco de questões da prova.
// Arquivo puramente declarativo em JavaScript ES Modules, sem dependências externas.

// Dimensões internas da tela (proporção 16:9)
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

// Configuração da grade arcade
export const GRID_SIZE = 80;
export const COLS = 16;
export const ROWS = 9;

// Parâmetros de tempo da travessia
export const INITIAL_TIME_LIMIT = 60;

// Dimensões do sprite de Anna
export const ANNA_SPRITE_SIZE = 52;
export const ANNA_CELL_OFFSET = (GRID_SIZE - ANNA_SPRITE_SIZE) / 2; // 14px

// Paleta de cores temática do projeto (R, G, B)
export const PALETTE = {
  bg: [13, 27, 42],
  safeZoneStart: [27, 38, 59],
  safeZoneMiddle: [35, 45, 68],
  safeZoneGoal: [48, 25, 82],
  roadLaneEven: [18, 22, 34],
  roadLaneOdd: [22, 28, 42],
  annaBody: [107, 63, 160],
  textLight: [224, 215, 247],
  accentSuccess: [76, 201, 144],
  accentFail: [230, 57, 70],
  timerNormal: [224, 215, 247],
  timerWarning: [244, 162, 97],
  timerCritical: [230, 57, 70],
  quizBox: [22, 28, 46],
  quizOptionBg: [32, 40, 64],
  quizOptionSelected: [92, 53, 138],
};

// Configuração das faixas de obstáculos (Row 1 a Row 7)
export const LANE_CONFIGS = [
  { row: 1, baseSpeed: 280, width: 120, height: 40, sprite: "onibus_azul_dir", count: 2 },
  { row: 2, baseSpeed: -210, width: 120, height: 40, sprite: "onibus_amarelo_esq", count: 2 },
  { row: 3, baseSpeed: 170, width: 60, height: 40, sprite: "sono_nuvem", count: 3 },
  // Row 4: calçada segura intermediária
  { row: 5, baseSpeed: -190, width: 120, height: 40, sprite: "onibus_creme_esq", count: 2 },
  { row: 6, baseSpeed: 260, width: 120, height: 40, sprite: "onibus_amarelo_dir", count: 2 },
  { row: 7, baseSpeed: -160, width: 60, height: 40, sprite: "sono_nuvem", count: 3 },
];

// Banco de perguntas da Prova Final (Fase 5 / Quiz Hardcore)
export const QUIZ_QUESTIONS = [
  {
    topic: "ALGORITMOS E ESTRUTURAS",
    question: "1. Qual é a complexidade de tempo média de busca em uma Hash Table eficiente?",
    options: [
      { text: "A) O(n) — Linear proporcional aos dados", isCorrect: false },
      { text: "B) O(1) — Constante independente do volume", isCorrect: true },
      { text: "C) O(n²) — Quadrática dependente da tabela", isCorrect: false },
    ],
  },
  {
    topic: "ENGENHARIA DE SOFTWARE",
    question: "2. No ciclo TDD (Test-Driven Development), qual é a ordem correta das etapas?",
    options: [
      { text: "A) Escrever teste falho -> Fazer passar -> Refatorar", isCorrect: true },
      { text: "B) Implementar código -> Criar testes -> Documentar", isCorrect: false },
      { text: "C) Escrever requisitos -> Refatorar -> Criar teste", isCorrect: false },
    ],
  },
  {
    topic: "ARQUITETURA DE COMPUTADORES",
    question: "3. Qual memória do computador oferece a menor latência de acesso para a CPU?",
    options: [
      { text: "A) Memória RAM (DDR5)", isCorrect: false },
      { text: "B) Armazenamento SSD NVMe", isCorrect: false },
      { text: "C) Registradores e Memória Cache L1", isCorrect: true },
    ],
  },
];
