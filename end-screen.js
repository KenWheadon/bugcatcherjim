// Bug Catcher Jim - Ending screen component (Game Jam Pivot)
const EndingScreen = {
  render: (gameState) => {
    const ending = MESSAGES.ENDINGS.FINAL_GAME_OVER;

    return `
      <div class="ending-screen">
        <div class="ending-content">
          <h1 class="ending-title" style="color: ${ending.color}">
            ${ending.title}
          </h1>
          <p class="ending-message">${ending.message}</p>
          
          <div class="stage-results">
            <h2>Your Journey</h2>
            
            <div class="stage-result">
              <div class="stage-info">
                <img src="${UTILS.getJimImagePath(
                  1
                )}" alt="Stage 1 Jim" class="stage-jim-image" />
                <div class="stage-details">
                  <h3>Stage 1 - Full Body</h3>
                  <p>Could carry 3 bugs and sprint freely</p>
                  <p class="stage-score">Score: ${gameState.stageScores[0]}</p>
                </div>
              </div>
            </div>
            
            <div class="stage-result">
              <div class="stage-info">
                <img src="${UTILS.getJimImagePath(
                  2
                )}" alt="Stage 2 Jim" class="stage-jim-image" />
                <div class="stage-details">
                  <h3>Stage 2 - Armless</h3>
                  <p>Could carry 1 bug but still sprint</p>
                  <p class="stage-score">Score: ${gameState.stageScores[1]}</p>
                </div>
              </div>
            </div>
            
            <div class="stage-result">
              <div class="stage-info">
                <img src="${UTILS.getJimImagePath(
                  3
                )}" alt="Stage 3 Jim" class="stage-jim-image" />
                <div class="stage-details">
                  <h3>Stage 3 - Head Only</h3>
                  <p>Could carry 1 bug, slower when carrying, no sprint</p>
                  <p class="stage-score">Score: ${gameState.stageScores[2]}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="final-stats">
            <h2>Final Results</h2>
            <p><strong>Total Score:</strong> ${gameState.score}</p>
            <p><strong>Final Stage Reached:</strong> ${gameState.stage}</p>
            <p><strong>Bugs Currently Carrying:</strong> ${
              gameState.player.carrying.length
            }</p>
          </div>
          
          <button id="restart-button" class="restart-button">
            ${MESSAGES.UI.RESTART_BUTTON}
          </button>
        </div>
      </div>
    `;
  },

  attachEventListeners: () => {
    const restartButton = document.getElementById("restart-button");
    if (restartButton) {
      restartButton.addEventListener("click", () => {
        UTILS.playAudio(CONFIG.AUDIO.COLLECT_SOUND);
        Game.resetGame();
        StartScreen.init();
      });

      // Add hover sound effect
      restartButton.addEventListener("mouseenter", () => {
        UTILS.playAudio(CONFIG.AUDIO.UI_HOVER, 0.4);
      });
    }
  },

  init: (gameState) => {
    const container = document.getElementById("game-container");
    container.innerHTML = EndingScreen.render(gameState);

    // Attach event listeners
    EndingScreen.attachEventListeners();

    // Play death sound
    UTILS.playAudio(CONFIG.AUDIO.DEATH_SOUND);
  },
};
