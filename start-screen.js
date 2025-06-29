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
          </div>
          <p class="game-description">
            ${MESSAGES.UI.START_DESCRIPTION}
          </p>
          <div class="game-instructions">
            <h3>🎮 Controls</h3>
            <p><strong>WASD or Arrow Keys:</strong> Move Jim around</p>
            <p><strong>SPACE (hold):</strong> Sprint (uses stamina)</p>
            <p><strong>Walk into bugs:</strong> Collect them (gain stamina)</p>
            <p><strong>Walk into bin:</strong> Deposit bugs for points</p>
            
            <h3>🐛 Bug Values</h3>
            <div class="bug-values">
              <div class="bug-value-item">
                <span class="bug-emoji">✨</span>
                <span class="bug-name">Firefly</span>
                <span class="bug-points">5 pts</span>
              </div>
              <div class="bug-value-item">
                <span class="bug-emoji">🪲</span>
                <span class="bug-name">Beetle</span>
                <span class="bug-points">10 pts</span>
              </div>
              <div class="bug-value-item">
                <span class="bug-emoji">🦋</span>
                <span class="bug-name">Butterfly</span>
                <span class="bug-points">15 pts</span>
              </div>
              <div class="bug-value-item">
                <span class="bug-emoji">🐞</span>
                <span class="bug-name">Ladybug</span>
                <span class="bug-points">25 pts</span>
              </div>
              <div class="bug-value-item">
                <span class="bug-emoji">🦗</span>
                <span class="bug-name">Grasshopper</span>
                <span class="bug-points">35 pts</span>
              </div>
              <div class="bug-value-item">
                <span class="bug-emoji">🪃</span>
                <span class="bug-name">Dragonfly</span>
                <span class="bug-points">50 pts</span>
              </div>
            </div>
            
            <h3>⚠️ Warning</h3>
            <p><strong>Monsters spawn when you deposit bugs!</strong></p>
            <p><strong>Getting caught advances you to the next stage!</strong></p>
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
