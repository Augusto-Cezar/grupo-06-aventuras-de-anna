# Project Anna

Um jogo arcade de travessia em pixel art com temática universitária, inspirado na mecânica clássica de *Frogger*.

<!-- Demonstração do jogo: adicione aqui uma captura de tela ou GIF animado -->

---

## Sobre o jogo

Em **Project Anna**, você acompanha a jornada de Anna, uma estudante universitária que acorda atrasada no dia mais decisivo do semestre. Para não perder o ano, ela precisa cruzar as ruas movimentadas da cidade, desviar do trânsito caótico e das ondas de sono, chegar a tempo à faculdade e gabaritar a prova final.

O jogo combina a precisão do movimento clássico em grade com a pressão de um temporizador regressivo e um desafio acadêmico: qualquer erro — seja um atropelamento no trânsito ou uma resposta errada no exame — reprova a estudante e reinicia toda a jornada do início.

---

## Como jogar

O objetivo é atravessar todas as faixas da rua até alcançar a sala da prova e acertar as 3 questões de múltipla escolha.

### Controles na Travessia

* **Mover para a frente:** `W` ou `Seta para Cima`
* **Mover para a esquerda:** `A` ou `Seta para a Esquerda`
* **Mover para a direita:** `D` ou `Seta para a Direita`
* *Nota:* Não é permitido recuar (andar para trás). O percurso segue sempre em direção ao destino.

### Controles na Prova Final

* **Responder diretamente:** Teclas numéricas `1`, `2` ou `3`
* **Navegar e confirmar:** `Setas para Cima/Baixo` para selecionar a alternativa e `Enter` ou `Barra de Espaço` para confirmar

### Reiniciar Partida

* Nas telas de **Game Over** ou de **Vitória**, pressione `Barra de Espaço` ou `Enter` para recomeçar.

---

## Tecnologias

O projeto foi desenvolvido de forma direta e sem ferramentas complexas de compilação, priorizando legibilidade e código nativo para a web:

* **HTML5:** estrutura semântica da página e elemento de renderização `<canvas>`.
* **CSS3:** folha de estilos responsiva, mantendo a proporção de tela em 16:9 sem distorção visual.
* **JavaScript (ES Modules):** lógica orientada a módulos nativos do navegador (`import`/`export`), sem necessidade de bundlers.
* **Kaboom.js (v3000.1.17):** biblioteca gráfica e de física leve carregada via CDN para gerenciamento de cenas, sprites e colisões.

---

## Como executar localmente

Como o jogo utiliza módulos ES e recursos estáticos, é necessário executá-lo por meio de um servidor local (evite abrir o arquivo `index.html` diretamente pelo explorador de arquivos com duplo clique):

1. Abra um terminal na pasta raiz do projeto.
2. Inicie um servidor HTTP simples. Por exemplo, com Python:
   ```bash
   python -m http.server 5500
   ```
   *(ou utilize uma extensão de servidor local no seu editor de código, como o Live Server)*.
3. Abra o navegador e acesse:
   ```
   http://127.0.0.1:5500
   ```
