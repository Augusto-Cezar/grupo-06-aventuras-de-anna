// Kaboom.js versão: 3000.1.17
// CDN: https://cdn.jsdelivr.net/npm/kaboom@3000.1.17/dist/kaboom.mjs

import kaboom from "https://cdn.jsdelivr.net/npm/kaboom@3000.1.17/dist/kaboom.mjs";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GRID_SIZE,
  COLS,
  ROWS,
  INITIAL_TIME_LIMIT,
  ANNA_SPRITE_SIZE,
  ANNA_CELL_OFFSET,
  PALETTE,
  LANE_CONFIGS,
  QUIZ_QUESTIONS,
} from "./config.js";

const canvas = document.getElementById("game-canvas");

// Inicialização do motor Kaboom.js
const k = kaboom({
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  canvas: canvas,
  scale: 1,
  letterbox: true,
  background: PALETTE.bg,
});

// Helpers de teste e automação expostos no window de forma controlada
window.__triggerTimeout = () => k.go("gameover", { reason: "timeout" });
window.__triggerQuiz = (remaining = 40) => k.go("quiz", { remainingTime: remaining });
window.__triggerWin = (score = 3) => k.go("victory", { score: score });
window.__triggerCollision = () => k.go("gameover", { reason: "collision" });

// -------------------------------------------------------------
// 1. CARREGAMENTO DOS ASSETS
// -------------------------------------------------------------
function loadGameAssets() {
  // Sprites de Anna
  k.loadSprite("anna_costas", "assets/sprites/anna_costas.png");
  k.loadSprite("anna_esquerda", "assets/sprites/anna_esquerda.png");
  k.loadSprite("anna_direita", "assets/sprites/anna_direita.png");

  // Sprites de Ônibus e Sono
  k.loadSprite("onibus_azul_dir", "assets/sprites/onibus_azul_direita.png");
  k.loadSprite("onibus_azul_esq", "assets/sprites/onibus_azul_esquerda.png");
  k.loadSprite("onibus_amarelo_dir", "assets/sprites/onibus_amarelo_direita.png");
  k.loadSprite("onibus_amarelo_esq", "assets/sprites/onibus_amarelo_esquerda.png");
  k.loadSprite("onibus_creme_dir", "assets/sprites/onibus_creme_direita.png");
  k.loadSprite("onibus_creme_esq", "assets/sprites/onibus_creme_esquerda.png");
  k.loadSprite("sono_nuvem", "assets/sprites/sono_nuvem.png");

  // HUD e Cenários
  k.loadSprite("relogio_hud", "assets/sprites/relogio_hud.png");
  k.loadSprite("bg_casa", "assets/backgrounds/faixa_inicio_casa.png");
  k.loadSprite("bg_asfalto", "assets/backgrounds/pista_asfalto_320.png");
  k.loadSprite("bg_calcada", "assets/backgrounds/calcada_intermediaria.png");
  k.loadSprite("bg_faculdade", "assets/backgrounds/calcada_faculdade.png");
}

loadGameAssets();

// -------------------------------------------------------------
// 2. CENA: TRAVESSIA URBANA ("game")
// -------------------------------------------------------------
k.scene("game", () => {
  let timeLeft = INITIAL_TIME_LIMIT;
  let gameActive = true;

  // 2.1. Cenário em camadas
  k.add([k.sprite("bg_faculdade", { width: GAME_WIDTH, height: GRID_SIZE }), k.pos(0, 0), k.z(0)]);
  k.add([k.sprite("bg_asfalto", { width: GAME_WIDTH, height: GRID_SIZE * 3 }), k.pos(0, GRID_SIZE), k.z(0)]);
  k.add([k.sprite("bg_calcada", { width: GAME_WIDTH, height: GRID_SIZE }), k.pos(0, GRID_SIZE * 4), k.z(0)]);
  k.add([k.sprite("bg_asfalto", { width: GAME_WIDTH, height: GRID_SIZE * 3 }), k.pos(0, GRID_SIZE * 5), k.z(0)]);
  k.add([k.sprite("bg_casa", { width: GAME_WIDTH, height: GRID_SIZE }), k.pos(0, GRID_SIZE * 8), k.z(0)]);

  // Rótulos informativos
  k.add([k.text("FACULDADE (SALA DA PROVA)", { size: 14 }), k.pos(20, 32), k.color(...PALETTE.textLight), k.z(2)]);
  k.add([k.text("CALÇADA SEGURA", { size: 12 }), k.pos(20, 4 * GRID_SIZE + 32), k.color(180, 200, 230), k.z(2)]);
  k.add([k.text("INÍCIO (RUA DE ANNA)", { size: 12 }), k.pos(20, 8 * GRID_SIZE + 32), k.color(200, 190, 220), k.z(2)]);

  // 2.2. HUD de Tempo
  k.add([
    k.rect(340, 50, { radius: 8 }),
    k.pos(GAME_WIDTH - 360, 15),
    k.color(18, 24, 38),
    k.outline(2, [107, 63, 160]),
    k.z(20),
  ]);

  k.add([
    k.sprite("relogio_hud", { width: 32, height: 32 }),
    k.pos(GAME_WIDTH - 350, 24),
    k.z(21),
  ]);

  const timerText = k.add([
    k.text(`TEMPO: ${Math.ceil(timeLeft)}s`, { size: 22 }),
    k.pos(GAME_WIDTH - 305, 28),
    k.color(...PALETTE.timerNormal),
    k.z(21),
  ]);

  // 2.3. Protagonista (Anna)
  let playerGridX = Math.floor(COLS / 2);
  let playerGridY = 8;

  const player = k.add([
    k.sprite("anna_costas", { width: ANNA_SPRITE_SIZE, height: ANNA_SPRITE_SIZE }),
    k.pos(playerGridX * GRID_SIZE + ANNA_CELL_OFFSET, playerGridY * GRID_SIZE + ANNA_CELL_OFFSET),
    k.area({ scale: 0.75 }),
    k.z(10),
    "player",
  ]);

  function updatePlayerVisual(direction) {
    if (direction === "up") {
      player.use(k.sprite("anna_costas", { width: ANNA_SPRITE_SIZE, height: ANNA_SPRITE_SIZE }));
    } else if (direction === "left") {
      player.use(k.sprite("anna_esquerda", { width: ANNA_SPRITE_SIZE, height: ANNA_SPRITE_SIZE }));
    } else if (direction === "right") {
      player.use(k.sprite("anna_direita", { width: ANNA_SPRITE_SIZE, height: ANNA_SPRITE_SIZE }));
    }
    player.pos.x = playerGridX * GRID_SIZE + ANNA_CELL_OFFSET;
    player.pos.y = playerGridY * GRID_SIZE + ANNA_CELL_OFFSET;
  }

  // 2.4. Movimento por Grade
  function movePlayer(dx, dy, dir) {
    if (!gameActive) return;
    if (dy > 0) return; // Bloqueio estrito de recuo

    const newX = playerGridX + dx;
    const newY = playerGridY + dy;

    if (newX < 0 || newX >= COLS) return;
    if (newY < 0 || newY > 8) return;

    playerGridX = newX;
    playerGridY = newY;
    updatePlayerVisual(dir);

    // Chegada à Faculdade -> Transição para a Prova
    if (playerGridY === 0) {
      gameActive = false;
      k.go("quiz", { remainingTime: Math.ceil(timeLeft) });
    }
  }

  k.onKeyPress("left", () => movePlayer(-1, 0, "left"));
  k.onKeyPress("a", () => movePlayer(-1, 0, "left"));
  k.onKeyPress("right", () => movePlayer(1, 0, "right"));
  k.onKeyPress("d", () => movePlayer(1, 0, "right"));
  k.onKeyPress("up", () => movePlayer(0, -1, "up"));
  k.onKeyPress("w", () => movePlayer(0, -1, "up"));

  // 2.5. Spawner de Obstáculos
  const obstacles = [];

  LANE_CONFIGS.forEach((lane) => {
    const spacing = GAME_WIDTH / lane.count;
    for (let i = 0; i < lane.count; i++) {
      const startX = i * spacing + (lane.baseSpeed > 0 ? -150 : 150);
      const startY = lane.row * GRID_SIZE + (GRID_SIZE - lane.height) / 2;

      const obs = k.add([
        k.sprite(lane.sprite, { width: lane.width, height: lane.height }),
        k.pos(startX, startY),
        k.area({ scale: 0.85 }),
        k.z(5),
        "obstacle",
        {
          baseSpeed: lane.baseSpeed,
          currentSpeed: lane.baseSpeed,
          obsWidth: lane.width,
        },
      ]);
      obstacles.push(obs);
    }
  });

  // 2.6. Atualização de Temporizador e Dificuldade Dinâmica
  k.onUpdate(() => {
    if (!gameActive) return;

    timeLeft -= k.dt();
    const displaySeconds = Math.max(0, Math.ceil(timeLeft));
    timerText.text = `TEMPO: ${displaySeconds}s`;

    if (timeLeft <= 10) {
      timerText.color = k.rgb(...PALETTE.timerCritical);
    } else if (timeLeft <= 25) {
      timerText.color = k.rgb(...PALETTE.timerWarning);
    } else {
      timerText.color = k.rgb(...PALETTE.timerNormal);
    }

    if (timeLeft <= 0) {
      gameActive = false;
      k.go("gameover", { reason: "timeout" });
      return;
    }

    // Fatores de progressão (tempo decorrido + proximidade do objetivo)
    const timeProgress = (INITIAL_TIME_LIMIT - timeLeft) / INITIAL_TIME_LIMIT;
    const timeMultiplier = 1.0 + timeProgress * 0.30;
    const rowProgress = (8 - playerGridY) / 8;
    const rowMultiplier = 1.0 + rowProgress * 0.15;
    const totalMultiplier = timeMultiplier * rowMultiplier;

    obstacles.forEach((obs) => {
      obs.currentSpeed = obs.baseSpeed * totalMultiplier;
    });
  });

  k.onUpdate("obstacle", (obs) => {
    obs.move(obs.currentSpeed, 0);
    if (obs.currentSpeed > 0 && obs.pos.x > GAME_WIDTH + 60) {
      obs.pos.x = -obs.obsWidth - 40;
    } else if (obs.currentSpeed < 0 && obs.pos.x < -obs.obsWidth - 60) {
      obs.pos.x = GAME_WIDTH + 40;
    }
  });

  player.onCollide("obstacle", () => {
    if (!gameActive) return;
    gameActive = false;
    k.go("gameover", { reason: "collision" });
  });
});

// -------------------------------------------------------------
// 3. CENA: PROVA FINAL ("quiz")
// -------------------------------------------------------------
k.scene("quiz", (data = { remainingTime: 40 }) => {
  let currentQuestionIndex = 0;
  let selectedOption = 0;
  let quizActive = true;

  // Fundo e Cabeçalho
  k.add([k.rect(GAME_WIDTH, GAME_HEIGHT), k.pos(0, 0), k.color(18, 22, 36)]);
  k.add([k.rect(GAME_WIDTH, 70), k.pos(0, 0), k.color(...PALETTE.safeZoneGoal)]);
  k.add([k.sprite("anna_costas", { width: 44, height: 44 }), k.pos(30, 13), k.z(2)]);
  k.add([k.text("FACULDADE — PROVA FINAL DECISIVA", { size: 24 }), k.pos(85, 24), k.color(...PALETTE.textLight)]);
  k.add([k.sprite("relogio_hud", { width: 28, height: 28 }), k.pos(GAME_WIDTH - 330, 21), k.z(2)]);
  k.add([
    k.text(`TEMPO DA TRAVESSIA: ${data.remainingTime}s`, { size: 18 }),
    k.pos(GAME_WIDTH - 290, 26),
    k.color(...PALETTE.accentSuccess),
  ]);

  // Card da Questão
  k.add([
    k.rect(GAME_WIDTH - 120, 560, { radius: 12 }),
    k.pos(60, 100),
    k.color(...PALETTE.quizBox),
    k.outline(3, PALETTE.annaBody),
  ]);

  const progressText = k.add([k.text("", { size: 18 }), k.pos(90, 125), k.color(160, 170, 210)]);
  const topicText = k.add([k.text("", { size: 14 }), k.pos(GAME_WIDTH - 420, 125), k.color(...PALETTE.timerWarning)]);
  const questionTitle = k.add([k.text("", { size: 24, width: GAME_WIDTH - 200 }), k.pos(90, 165), k.color(255, 255, 255)]);

  const optionBoxes = [];
  const optionTexts = [];

  for (let i = 0; i < 3; i++) {
    const boxY = 270 + i * 100;

    const box = k.add([
      k.rect(GAME_WIDTH - 180, 80, { radius: 8 }),
      k.pos(90, boxY),
      k.color(...PALETTE.quizOptionBg),
      k.outline(2, [60, 70, 100]),
    ]);

    const txt = k.add([
      k.text("", { size: 20, width: GAME_WIDTH - 220 }),
      k.pos(120, boxY + 28),
      k.color(...PALETTE.textLight),
    ]);

    optionBoxes.push(box);
    optionTexts.push(txt);
  }

  k.add([
    k.text("Controles: [1], [2], [3] para responder direto  |  [SETAS] para navegar + [ENTER] para confirmar", {
      size: 16,
      align: "center",
    }),
    k.pos(k.center().x, 615),
    k.anchor("center"),
    k.color(140, 150, 180),
  ]);

  function renderCurrentQuestion() {
    const q = QUIZ_QUESTIONS[currentQuestionIndex];
    progressText.text = `QUESTÃO ${currentQuestionIndex + 1} DE ${QUIZ_QUESTIONS.length}`;
    topicText.text = `TÓPICO: ${q.topic}`;
    questionTitle.text = q.question;

    for (let i = 0; i < 3; i++) {
      optionTexts[i].text = q.options[i].text;
    }
    updateSelectionHighlight();
  }

  function updateSelectionHighlight() {
    for (let i = 0; i < 3; i++) {
      if (i === selectedOption) {
        optionBoxes[i].color = k.rgb(...PALETTE.quizOptionSelected);
        optionBoxes[i].outline.color = k.rgb(224, 215, 247);
        optionBoxes[i].outline.width = 3;
      } else {
        optionBoxes[i].color = k.rgb(...PALETTE.quizOptionBg);
        optionBoxes[i].outline.color = k.rgb(60, 70, 100);
        optionBoxes[i].outline.width = 2;
      }
    }
  }

  function submitAnswer(chosenIndex) {
    if (!quizActive) return;
    const q = QUIZ_QUESTIONS[currentQuestionIndex];
    const isCorrect = q.options[chosenIndex].isCorrect;

    if (!isCorrect) {
      quizActive = false;
      k.go("gameover", { reason: "quiz_failed" });
      return;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < QUIZ_QUESTIONS.length) {
      selectedOption = 0;
      renderCurrentQuestion();
    } else {
      quizActive = false;
      k.go("victory", { score: QUIZ_QUESTIONS.length });
    }
  }

  k.onKeyPress("up", () => {
    if (!quizActive) return;
    selectedOption = (selectedOption + 2) % 3;
    updateSelectionHighlight();
  });

  k.onKeyPress("down", () => {
    if (!quizActive) return;
    selectedOption = (selectedOption + 1) % 3;
    updateSelectionHighlight();
  });

  k.onKeyPress("enter", () => submitAnswer(selectedOption));
  k.onKeyPress("space", () => submitAnswer(selectedOption));
  k.onKeyPress("1", () => submitAnswer(0));
  k.onKeyPress("2", () => submitAnswer(1));
  k.onKeyPress("3", () => submitAnswer(2));

  renderCurrentQuestion();
});

// -------------------------------------------------------------
// 4. CENA: VITÓRIA DEFINITIVA ("victory")
// -------------------------------------------------------------
k.scene("victory", (data = { score: 3 }) => {
  k.add([k.rect(GAME_WIDTH, GAME_HEIGHT), k.pos(0, 0), k.color(15, 28, 48)]);
  k.add([k.sprite("anna_costas", { width: 80, height: 80 }), k.pos(k.center().x, k.center().y - 180), k.anchor("center"), k.z(2)]);
  k.add([k.text("PARABÉNS! ANNA PASSOU NO SEMESTRE!", { size: 48, align: "center" }), k.pos(k.center().x, k.center().y - 80), k.anchor("center"), k.color(...PALETTE.accentSuccess)]);
  k.add([k.text("VITÓRIA COMPLETA!", { size: 36, align: "center" }), k.pos(k.center().x, k.center().y - 20), k.anchor("center"), k.color(...PALETTE.annaBody)]);
  k.add([k.text(`Anna cruzou o trânsito da cidade e gabaritou as ${data.score} questões da prova!`, { size: 24, align: "center" }), k.pos(k.center().x, k.center().y + 40), k.anchor("center"), k.color(...PALETTE.textLight)]);
  k.add([k.text("Pressione [ESPAÇO] ou [ENTER] para reiniciar a jornada", { size: 20, align: "center" }), k.pos(k.center().x, k.center().y + 120), k.anchor("center"), k.color(200, 200, 220)]);

  k.onKeyPress("space", () => k.go("game"));
  k.onKeyPress("enter", () => k.go("game"));
});

// -------------------------------------------------------------
// 5. CENA: GAME OVER ("gameover")
// -------------------------------------------------------------
k.scene("gameover", (data = { reason: "collision" }) => {
  k.add([k.rect(GAME_WIDTH, GAME_HEIGHT), k.pos(0, 0), k.color(...PALETTE.bg)]);
  k.add([k.text("GAME OVER", { size: 64, align: "center" }), k.pos(k.center().x, k.center().y - 100), k.anchor("center"), k.color(...PALETTE.accentFail)]);

  let message = "Anna colidiu no trânsito e não conseguiu chegar a tempo!";
  if (data.reason === "timeout") {
    message = "O tempo esgotou! Anna se atrasou e perdeu a prova!";
  } else if (data.reason === "quiz_failed") {
    message = "Anna errou uma resposta e REPROVOU na prova final!";
  }

  k.add([k.text(message, { size: 24, align: "center" }), k.pos(k.center().x, k.center().y - 10), k.anchor("center"), k.color(...PALETTE.textLight)]);
  k.add([k.text("Pressione [ESPAÇO] ou [ENTER] para reiniciar a partida", { size: 20, align: "center" }), k.pos(k.center().x, k.center().y + 80), k.anchor("center"), k.color(200, 200, 220)]);

  k.onKeyPress("space", () => k.go("game"));
  k.onKeyPress("enter", () => k.go("game"));
});

// Inicialização imediata
k.go("game");
