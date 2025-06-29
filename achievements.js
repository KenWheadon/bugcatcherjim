// Achievement Management System - Bug Catcher Jim
const AchievementManager = {
  // Achievement data structure
  achievementData: {
    unlockedAchievements: [],
    statistics: {
      gamesStarted: 0,
      totalDeaths: 0,
      bugsCollected: 0,
      ordersCompleted: 0,
      nightsSurvived: 0,
      monstersEncountered: 0,
      timePlayedMinutes: 0,
      musicTracksHeard: new Set(),
    },
  },

  // Initialize achievement system
  init: () => {
    AchievementManager.loadFromStorage();
    console.log("Achievement system initialized");
  },

  // Load achievements from localStorage
  loadFromStorage: () => {
    try {
      const saved = localStorage.getItem(CONFIG.ACHIEVEMENT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        AchievementManager.achievementData = {
          ...AchievementManager.achievementData,
          ...parsed,
        };

        // Convert musicTracksHeard back to Set
        if (parsed.statistics && parsed.statistics.musicTracksHeard) {
          AchievementManager.achievementData.statistics.musicTracksHeard =
            new Set(parsed.statistics.musicTracksHeard);
        }
      }
    } catch (error) {
      console.error("Failed to load achievements:", error);
      AchievementManager.achievementData = {
        unlockedAchievements: [],
        statistics: {
          gamesStarted: 0,
          totalDeaths: 0,
          bugsCollected: 0,
          ordersCompleted: 0,
          nightsSurvived: 0,
          monstersEncountered: 0,
          timePlayedMinutes: 0,
          musicTracksHeard: new Set(),
        },
      };
    }
  },

  // Save achievements to localStorage
  saveToStorage: () => {
    try {
      const toSave = {
        ...AchievementManager.achievementData,
        statistics: {
          ...AchievementManager.achievementData.statistics,
          musicTracksHeard: Array.from(
            AchievementManager.achievementData.statistics.musicTracksHeard
          ),
        },
      };
      localStorage.setItem(
        CONFIG.ACHIEVEMENT_STORAGE_KEY,
        JSON.stringify(toSave)
      );
    } catch (error) {
      console.error("Failed to save achievements:", error);
    }
  },

  // Check if achievement is unlocked
  isUnlocked: (achievementId) => {
    return AchievementManager.achievementData.unlockedAchievements.includes(
      achievementId
    );
  },

  // Unlock an achievement
  unlockAchievement: (achievementId) => {
    if (!AchievementManager.isUnlocked(achievementId)) {
      AchievementManager.achievementData.unlockedAchievements.push(
        achievementId
      );
      AchievementManager.saveToStorage();
      AchievementManager.showAchievementNotification(achievementId);
      return true;
    }
    return false;
  },

  // Show achievement notification
  showAchievementNotification: (achievementId) => {
    const achievement =
      CONFIG.ACHIEVEMENTS[achievementId.toUpperCase().replace(/-/g, "_")];
    if (!achievement) return;

    // Create notification element
    const notification = document.createElement("div");
    notification.className = "achievement-notification";
    notification.innerHTML = `
      <div class="achievement-popup">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-text">
          <div class="achievement-title">Achievement Unlocked!</div>
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-desc">${achievement.description}</div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Play achievement sound
    UTILS.playAudio(CONFIG.AUDIO.ORDER_COMPLETE);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 4000);
  },

  // Track game started
  trackGameStarted: () => {
    AchievementManager.achievementData.statistics.gamesStarted++;

    if (AchievementManager.achievementData.statistics.gamesStarted === 1) {
      AchievementManager.unlockAchievement("first-game");
    }

    AchievementManager.saveToStorage();
  },

  // Track bug collected
  trackBugCollected: (bugType) => {
    AchievementManager.achievementData.statistics.bugsCollected++;

    if (AchievementManager.achievementData.statistics.bugsCollected === 1) {
      AchievementManager.unlockAchievement("first-bug");
    }

    // Bug-specific achievements
    const bugTypeName = CONFIG.BUG_TYPES[bugType].name.toLowerCase();
    const achievementMap = {
      firefly: "firefly",
      beetle: "beetle",
      butterfly: "butterfly",
      ladybug: "ladybug",
      grasshopper: "grasshopper",
      dragonfly: "dragonfly",
    };

    const achievementId = achievementMap[bugTypeName];
    if (achievementId) {
      AchievementManager.unlockAchievement(achievementId);
    }

    AchievementManager.saveToStorage();
  },

  // Track order completed
  trackOrderCompleted: () => {
    AchievementManager.achievementData.statistics.ordersCompleted++;

    if (AchievementManager.achievementData.statistics.ordersCompleted === 1) {
      AchievementManager.unlockAchievement("first-order");
    }

    if (AchievementManager.achievementData.statistics.ordersCompleted === 5) {
      AchievementManager.unlockAchievement("five-orders");
    }

    if (AchievementManager.achievementData.statistics.ordersCompleted === 10) {
      AchievementManager.unlockAchievement("ten-orders");
    }

    AchievementManager.saveToStorage();
  },

  // Track death
  trackDeath: (deathType) => {
    AchievementManager.achievementData.statistics.totalDeaths++;

    // Death-specific achievements
    if (deathType === "monster-death") {
      AchievementManager.unlockAchievement("monster-death");
    } else if (deathType === "night-death") {
      AchievementManager.unlockAchievement("night-death");
    }

    AchievementManager.saveToStorage();
  },

  // Track night survived
  trackNightSurvived: () => {
    AchievementManager.achievementData.statistics.nightsSurvived++;

    if (AchievementManager.achievementData.statistics.nightsSurvived === 1) {
      AchievementManager.unlockAchievement("first-night");
    }

    if (AchievementManager.achievementData.statistics.nightsSurvived === 5) {
      AchievementManager.unlockAchievement("survive-five-nights");
    }

    AchievementManager.saveToStorage();
  },

  // Track day survived
  trackDaySurvived: () => {
    if (AchievementManager.achievementData.statistics.nightsSurvived >= 1) {
      AchievementManager.unlockAchievement("first-day");
    }
    AchievementManager.saveToStorage();
  },

  // Track music heard
  trackMusicHeard: (musicTrack) => {
    AchievementManager.achievementData.statistics.musicTracksHeard.add(
      musicTrack
    );

    AchievementManager.saveToStorage();
  },

  // Get all achievements with their unlock status
  getAllAchievements: () => {
    const achievements = [];

    Object.keys(CONFIG.ACHIEVEMENTS).forEach((key) => {
      const achievement = CONFIG.ACHIEVEMENTS[key];
      achievements.push({
        ...achievement,
        unlocked: AchievementManager.isUnlocked(achievement.id),
      });
    });

    return achievements.sort((a, b) => {
      // Sort by unlocked status first (unlocked first), then by name
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      return a.name.localeCompare(b.name);
    });
  },

  // Get achievement statistics
  getStatistics: () => {
    return {
      ...AchievementManager.achievementData.statistics,
      musicTracksHeard: Array.from(
        AchievementManager.achievementData.statistics.musicTracksHeard
      ),
      totalUnlocked:
        AchievementManager.achievementData.unlockedAchievements.length,
      totalAchievements: Object.keys(CONFIG.ACHIEVEMENTS).length,
    };
  },

  // Reset all achievements (for testing)
  resetAchievements: () => {
    localStorage.removeItem(CONFIG.ACHIEVEMENT_STORAGE_KEY);
    AchievementManager.achievementData = {
      unlockedAchievements: [],
      statistics: {
        gamesStarted: 0,
        totalDeaths: 0,
        bugsCollected: 0,
        ordersCompleted: 0,
        nightsSurvived: 0,
        monstersEncountered: 0,
        timePlayedMinutes: 0,
        musicTracksHeard: new Set(),
      },
    };
    console.log("All achievements reset");
  },
};
