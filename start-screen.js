// Bug Catcher Jim - Start screen component (Game Jam Pivot)
const StartScreen = {
  render: () => {
    return `
      <div class="start-screen">
        <div class="start-content">
          <h1 class="game-title">${MESSAGES.UI.GAME_TITLE}</h1>
          <div class="jim-display">
            <img src="${UTILS.getJimImagePath(
              1
            )}" alt="Jim" class="jim-image" />
                      <p class="game-description">
            ${MESSAGES.UI.START_DESCRIPTION}
          </p>
          </div>

          <div class="game-instructions">
            <h3>🎮 Controls</h3>
            <p><strong>WASD or Arrow Keys:</strong> Move Jim around</p>
            <p><strong>SPACE (hold):</strong> Sprint (uses stamina)</p>
            <p><strong>Walk into bugs:</strong> Collect them (gain stamina)</p>
            <p><strong>Walk into bin:</strong> Deposit bugs for points</p>
          </div>
          <button id="start-button" class="start-button">
            ${MESSAGES.UI.START_BUTTON}
          </button>
        </div>
      </div>
    `;
  },

  attachEventListeners: () => {
    const startButton = document.getElementById("start-button");
    if (startButton) {
      startButton.addEventListener("click", () => {
        UTILS.playAudio(CONFIG.AUDIO.COLLECT_SOUND);
        Game.startGame();
      });

      // Add hover sound effect
      startButton.addEventListener("mouseenter", () => {
        UTILS.playAudio(CONFIG.AUDIO.UI_HOVER, 0.4);
      });
    }
  },

  init: () => {
    // Update canvas dimensions for current screen
    UTILS.updateCanvasDimensions();

    const container = document.getElementById("game-container");
    container.innerHTML = StartScreen.render();
    StartScreen.attachEventListeners();

    // Start background music
    UTILS.switchBackgroundMusic(CONFIG.AUDIO.BACKGROUND_MUSIC);
  },
};
