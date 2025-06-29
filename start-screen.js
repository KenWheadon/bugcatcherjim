// Bug Catcher Jim - Start screen component
const StartScreen = {
  render: () => {
    return `
      <div class="start-screen">
        <div class="start-content">
          <h1 class="game-title">${MESSAGES.UI.GAME_TITLE}</h1>
          <div class="jim-display">
            <img src="${UTILS.getJimImagePath(
              0
            )}" alt="Jim" class="jim-image" />
          </div>
          <p class="game-description">
            ${MESSAGES.UI.START_DESCRIPTION}
          </p>
          <div class="game-instructions">
            <h3>🎮 Controls</h3>
            <p><strong>WASD or Arrow Keys:</strong> Move Jim around</p>
            <p><strong>Walk into bugs:</strong> Collect them</p>
            <p><strong>Walk into collection bin:</strong> Deposit bugs</p>
            <p><strong>Survive the night:</strong> Don't get caught by monsters!</p>
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
        UTILS.playAudio(CONFIG.AUDIO.ORDER_COMPLETE);
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

    // Start background music and track it for achievements
    const currentTrack = UTILS.switchBackgroundMusic("day");
    if (typeof AchievementManager !== "undefined") {
      AchievementManager.trackMusicHeard(currentTrack);
    }

    // Make sure achievement drawer is available
    if (
      typeof AchievementDrawer !== "undefined" &&
      !document.getElementById("achievement-button")
    ) {
      AchievementDrawer.init();
    }
  },
};
