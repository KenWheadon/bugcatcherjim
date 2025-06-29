// Bug Catcher Jim - Ending screen component
const EndingScreen = {
  render: (gameState, endingReason) => {
    let ending;

    // Determine ending type
    switch (endingReason) {
      case "monster-death":
        ending = MESSAGES.ENDINGS.MONSTER_DEATH;
        break;
      case "night-death":
        ending = MESSAGES.ENDINGS.NIGHT_DEATH;
        break;
      default:
        ending = MESSAGES.ENDINGS.SURVIVED;
        break;
    }

    return `
      <div class="ending-screen">
        <div class="ending-content">
          <h1 class="ending-title" style="color: ${ending.color}">
            ${ending.title}
          </h1>
          <div class="jim-display final-jim">
            <img src="${UTILS.getJimImagePath(
              endingReason === "monster-death" || endingReason === "night-death"
                ? 12
                : 0
            )}" 
                 alt="Final Jim" 
                 class="jim-image final-jim-image" />
          </div>
          <p class="ending-message">${ending.message}</p>
          <div class="final-stats">
            <p><strong>${MESSAGES.UI.SCORE_LABEL}</strong> ${
      gameState.score
    }</p>
            <p><strong>${MESSAGES.UI.ORDERS_COMPLETED_LABEL}</strong> ${
      gameState.completedOrders
    }</p>
            <p><strong>${MESSAGES.UI.DAYS_SURVIVED_LABEL}</strong> ${
      gameState.day
    }</p>
            <p><strong>Phase:</strong> ${
              gameState.phase === "day" ? "Day" : "Night"
            }</p>
            ${
              gameState.player.carrying
                ? `<p><strong>Was Carrying:</strong> ${
                    gameState.player.carrying.name
                  } ${
                    CONFIG.BUG_TYPES[gameState.player.carrying.type].symbol
                  }</p>`
                : ""
            }
          </div>
          <div class="ending-achievements" id="ending-achievements-container">
            <h3>🏆 Recent Achievements</h3>
            <div id="recent-achievements">
              <!-- Will be populated by JavaScript -->
            </div>
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

  displayRecentAchievements: () => {
    const container = document.getElementById("recent-achievements");
    if (!container || typeof AchievementManager === "undefined") return;

    // Get recently unlocked achievements (this session)
    const allAchievements = AchievementManager.getAllAchievements();
    const recentlyUnlocked = allAchievements.filter(
      (achievement) => achievement.unlocked
    );

    if (recentlyUnlocked.length === 0) {
      container.innerHTML =
        '<p style="opacity: 0.7; font-style: italic;">No achievements unlocked yet</p>';
      return;
    }

    // Show last 3 achievements - create static HTML to prevent flickering
    const recent = recentlyUnlocked.slice(-3);
    const achievementHTML = recent
      .map(
        (achievement) => `
      <div class="recent-achievement">
        <span class="achievement-icon">${achievement.icon}</span>
        <div class="achievement-info">
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-description">${achievement.description}</div>
        </div>
      </div>
    `
      )
      .join("");

    // Set innerHTML once to prevent flickering
    container.innerHTML = achievementHTML;
  },

  init: (gameState, endingReason = "survived") => {
    const container = document.getElementById("game-container");
    container.innerHTML = EndingScreen.render(gameState, endingReason);

    // Display recent achievements immediately after rendering
    EndingScreen.displayRecentAchievements();

    // Attach event listeners
    EndingScreen.attachEventListeners();

    // Play appropriate ending sound and music
    if (endingReason === "monster-death" || endingReason === "night-death") {
      UTILS.playAudio(CONFIG.AUDIO.DEATH_SOUND);
      // Switch to death music and track it
      const deathMusic = UTILS.switchBackgroundMusic("death");
      if (typeof AchievementManager !== "undefined") {
        AchievementManager.trackMusicHeard(deathMusic);
      }
    } else {
      UTILS.playAudio(CONFIG.AUDIO.DAY_TRANSITION);
      // Keep current music from game state but ensure it's tracked
      if (
        gameState.currentMusicTrack &&
        typeof AchievementManager !== "undefined"
      ) {
        AchievementManager.trackMusicHeard(gameState.currentMusicTrack);
      }
    }

    // Update achievement drawer if it's open (but don't trigger updates)
    if (typeof AchievementDrawer !== "undefined" && AchievementDrawer.isOpen) {
      // Don't call updateIfOpen to prevent flickering
      console.log(
        "Achievement drawer is open, but not updating to prevent flickering"
      );
    }
  },
};
