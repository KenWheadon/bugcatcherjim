// Bug Catcher Jim - Game configuration and constants
const CONFIG = {
  // Game world settings
  WORLD: {
    WIDTH: 2400, // Large world size
    HEIGHT: 1800, // Large world size
    MIN_CANVAS_WIDTH: 800,
    MIN_CANVAS_HEIGHT: 600,
    // Canvas dimensions will be set dynamically based on screen size
    CANVAS_WIDTH: 800, // Will be updated on init
    CANVAS_HEIGHT: 600, // Will be updated on init
  },

  // Player settings
  PLAYER: {
    SIZE: 80, // Doubled from 40
    SPEED: 4, // Slightly increased
    START_X: 1200, // Center of larger world
    START_Y: 900, // Center of larger world
  },

  // Bug settings
  BUGS: {
    COUNT: 6,
    SIZE: 60, // Doubled from 30
    MAX_SPEED: 2,
    SPAWN_MARGIN: 100,
  },

  // Collection bin
  BIN: {
    SIZE: 80, // Increased from 40
    X: 1200, // Center of larger world
    Y: 900, // Center of larger world
  },

  // Day/Night cycle
  TIME: {
    DAY_DURATION: 60, // 60 seconds
    NIGHT_DURATION: 30, // 30 seconds
    RESPONSE_TIME: 2000, // 2 seconds to show responses
  },

  // Monster settings
  MONSTERS: {
    COUNT: 6,
    SIZE: 50, // Increased from 20
    VISION_RANGES: [180, 220, 260, 200, 240, 300], // Larger vision ranges for 6 monster types
    CONE_ANGLES: [
      Math.PI / 4,
      Math.PI / 3,
      Math.PI / 6,
      Math.PI / 2,
      Math.PI / 5,
      Math.PI / 3,
    ], // Larger cone angles
    SPEEDS: [1.8, 2.8, 1.5, 2.2, 1.6, 2.0], // 6 different speeds
    HUNT_PATTERNS: [
      "aggressive",
      "stalker",
      "patrol",
      "ambush",
      "pack",
      "berserker",
    ], // 6 unique hunt patterns
  },

  // Game progression
  DEATH_CONDITIONS: {
    CARRYING_AT_NIGHT: true,
    MONSTER_COLLISION: true,
  },

  // Audio settings
  MUSIC_VOLUME: 0.3,
  SFX_VOLUME: 0.7,

  // File paths (updated for Bug Catcher Jim)
  IMAGES: {
    JIM_PREFIX: "images/jim-", // Changed from duck references
    JIM_EXTENSION: ".png",
    BACKGROUND: "images/research-station.jpg", // Changed from airplane cabin

    // Game element images
    COLLECTION_BIN: "images/collection-bin.png",
    JIM_PLAYER: "images/jim-1.png", // Updated to use jim-1.png
    MONSTER: "images/monster.png",
    // Individual monster images for each bug type
    FIREFLY_MONSTER: "images/firefly-monster.png",
    BEETLE_MONSTER: "images/beetle-monster.png",
    BUTTERFLY_MONSTER: "images/butterfly-monster.png",
    LADYBUG_MONSTER: "images/ladybug-monster.png",
    GRASSHOPPER_MONSTER: "images/grasshopper-monster.png",
    DRAGONFLY_MONSTER: "images/dragonfly-monster.png",

    // UI icons
    BUG_ICON: "images/bug-icon.png",
    TROPHY_ICON: "images/trophy-icon.png",
    ACHIEVEMENT_UNLOCK: "images/achievement-unlock.png",
    STATS_ICON: "images/stats-icon.png",
    CONTROLS_ICON: "images/controls-icon.png",

    // Particle images
    HAND_PARTICLE: "images/hand.png",
    THUMBS_PARTICLE: "images/thumbs.png",
  },

  AUDIO: {
    BACKGROUND_MUSIC_DAY: "background-music-day",
    BACKGROUND_MUSIC_NIGHT: "background-music-night",
    BACKGROUND_MUSIC_DEATH: "background-music-death",
    COLLECT_SOUND: "collect-sound", // Changed from choice-sound
    UI_HOVER: "ui-hover", // Changed from choice-hover
    ORDER_COMPLETE: "order-complete", // Changed from airplane-ding
    TIMER_TICK: "timer-tick",
    MONSTER_SPAWN: "monster-spawn", // Changed from rage-increase
    DEATH_SOUND: "death-sound",
    DAY_TRANSITION: "day-transition", // Changed from landing-sound
  },

  // Bug types with image paths
  BUG_TYPES: [
    { name: "Firefly", color: "#ffeb3b", symbol: "✨", image: "firefly.png" },
    { name: "Beetle", color: "#8bc34a", symbol: "🪲", image: "beetle.png" },
    {
      name: "Butterfly",
      color: "#e91e63",
      symbol: "🦋",
      image: "butterfly.png",
    },
    { name: "Ladybug", color: "#f44336", symbol: "🐞", image: "ladybug.png" },
    {
      name: "Grasshopper",
      color: "#4caf50",
      symbol: "🦗",
      image: "grasshopper.png",
    },
    {
      name: "Dragonfly",
      color: "#2196f3",
      symbol: "🪃",
      image: "dragonfly.png",
    },
  ],

  // Particle settings
  PARTICLES: {
    BUG_COLLECTION: {
      COUNT: 8,
      LIFETIME: 60, // frames
      SPEED: 2,
      SIZE: 20,
      IMAGE: "hand.png",
    },
    ORDER_COMPLETE: {
      COUNT: 12,
      LIFETIME: 90, // frames
      SPEED: 3,
      SIZE: 24,
      IMAGE: "thumbs.png",
    },
  },

  // Achievement system
  ACHIEVEMENTS: {
    FIRST_GAME: {
      id: "first-game",
      name: "First Hunt",
      description: "Started your first bug catching adventure",
      icon: "🐛",
    },
    FIRST_BUG: {
      id: "first-bug",
      name: "Bug Collector",
      description: "Caught your first bug",
      icon: "🦋",
    },
    FIRST_ORDER: {
      id: "first-order",
      name: "Order Complete",
      description: "Completed your first order for Linda",
      icon: "📋",
    },
    FIVE_ORDERS: {
      id: "five-orders",
      name: "Busy Bee",
      description: "Completed 5 orders",
      icon: "🐝",
    },
    FIRST_DAY: {
      id: "first-day",
      name: "Day Survivor",
      description: "Survived your first complete day",
      icon: "☀️",
    },
    FIRST_NIGHT: {
      id: "first-night",
      name: "Night Survivor",
      description: "Survived your first night",
      icon: "🌙",
    },
    FIREFLY: {
      id: "firefly",
      name: "Firefly Hunter",
      description: "Caught a Firefly",
      icon: "✨",
    },
    BEETLE: {
      id: "beetle",
      name: "Beetle Collector",
      description: "Caught a Beetle",
      icon: "🪲",
    },
    BUTTERFLY: {
      id: "butterfly",
      name: "Butterfly Net",
      description: "Caught a Butterfly",
      icon: "🦋",
    },
    LADYBUG: {
      id: "ladybug",
      name: "Lucky Catch",
      description: "Caught a Ladybug",
      icon: "🐞",
    },
    GRASSHOPPER: {
      id: "grasshopper",
      name: "Jump Shot",
      description: "Caught a Grasshopper",
      icon: "🦗",
    },
    DRAGONFLY: {
      id: "dragonfly",
      name: "Sky Hunter",
      description: "Caught a Dragonfly",
      icon: "🪃",
    },
    MONSTER_DEATH: {
      id: "monster-death",
      name: "Monster Meal",
      description: "Got caught by a monster",
      icon: "👹",
    },
    NIGHT_DEATH: {
      id: "night-death",
      name: "Caught Red-Handed",
      description: "Was holding a bug when night fell",
      icon: "🌃",
    },
    TEN_ORDERS: {
      id: "ten-orders",
      name: "Research Assistant",
      description: "Completed 10 orders for Linda",
      icon: "🔬",
    },
    SURVIVE_FIVE_NIGHTS: {
      id: "survive-five-nights",
      name: "Night Veteran",
      description: "Survived 5 nights",
      icon: "🌙",
    },
  },

  // Achievement storage key
  ACHIEVEMENT_STORAGE_KEY: "bug-catcher-jim-achievements",
};

// Utility functions (updated for Bug Catcher Jim)
const UTILS = {
  // Get Jim sprite path (updated from duck references)
  getJimImagePath: (state = 0) => {
    const clampedState = Math.max(0, Math.min(12, state));
    return `${CONFIG.IMAGES.JIM_PREFIX}${clampedState}${CONFIG.IMAGES.JIM_EXTENSION}`;
  },

  // Play audio with volume control
  playAudio: (audioId, volume = CONFIG.SFX_VOLUME) => {
    const audio = document.getElementById(audioId);
    if (audio) {
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch((e) => console.log("Audio play failed:", e));
    }
  },

  // Switch background music based on game phase
  switchBackgroundMusic: (phase, currentTrack = null) => {
    let newTrack;

    switch (phase) {
      case "day":
        newTrack = CONFIG.AUDIO.BACKGROUND_MUSIC_DAY;
        break;
      case "night":
        newTrack = CONFIG.AUDIO.BACKGROUND_MUSIC_NIGHT;
        break;
      case "death":
        newTrack = CONFIG.AUDIO.BACKGROUND_MUSIC_DEATH;
        break;
      default:
        newTrack = CONFIG.AUDIO.BACKGROUND_MUSIC_DAY;
    }

    // Don't switch if already playing the correct track
    if (currentTrack === newTrack) return newTrack;

    // Stop all music tracks
    const allTracks = [
      CONFIG.AUDIO.BACKGROUND_MUSIC_DAY,
      CONFIG.AUDIO.BACKGROUND_MUSIC_NIGHT,
      CONFIG.AUDIO.BACKGROUND_MUSIC_DEATH,
    ];

    allTracks.forEach((trackId) => {
      const audio = document.getElementById(trackId);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    // Start the new track
    const newAudio = document.getElementById(newTrack);
    if (newAudio) {
      newAudio.volume = CONFIG.MUSIC_VOLUME;
      newAudio.play().catch((e) => console.log("Music switch failed:", e));
    }

    return newTrack;
  },

  // Clamp value between min and max
  clamp: (value, min, max) => {
    return Math.max(min, Math.min(max, value));
  },

  // Calculate distance between two points
  distance: (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  },

  // Check if point is in vision cone
  isInVisionCone: (
    viewerX,
    viewerY,
    viewerAngle,
    targetX,
    targetY,
    range,
    coneAngle
  ) => {
    const dist = UTILS.distance(viewerX, viewerY, targetX, targetY);
    if (dist > range) return false;

    const angleToTarget = Math.atan2(targetY - viewerY, targetX - viewerX);
    let angleDiff = Math.abs(angleToTarget - viewerAngle);

    // Normalize angle difference
    if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;

    return angleDiff < coneAngle;
  },

  // Generate random position within bounds
  randomPosition: (minX, minY, maxX, maxY, margin = 0) => {
    return {
      x: minX + margin + Math.random() * (maxX - minX - 2 * margin),
      y: minY + margin + Math.random() * (maxY - minY - 2 * margin),
    };
  },

  // Convert world coordinates to display coordinates (relative to center)
  worldToDisplayCoords: (worldX, worldY) => {
    const centerX = CONFIG.WORLD.WIDTH / 2;
    const centerY = CONFIG.WORLD.HEIGHT / 2;
    return {
      x: Math.round(worldX - centerX),
      y: Math.round(worldY - centerY),
    };
  },

  // Calculate optimal canvas size based on screen dimensions
  calculateCanvasSize: () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Leave some margin for UI elements
    const availableWidth = screenWidth - 40; // 20px margin on each side
    const availableHeight = screenHeight - 140; // Space for UI at top and bottom

    // Maintain a reasonable aspect ratio (4:3 or 16:10)
    let canvasWidth = Math.max(CONFIG.WORLD.MIN_CANVAS_WIDTH, availableWidth);
    let canvasHeight = Math.max(
      CONFIG.WORLD.MIN_CANVAS_HEIGHT,
      availableHeight
    );

    // Ensure we don't exceed world bounds
    canvasWidth = Math.min(canvasWidth, CONFIG.WORLD.WIDTH);
    canvasHeight = Math.min(canvasHeight, CONFIG.WORLD.HEIGHT);

    return {
      width: Math.floor(canvasWidth),
      height: Math.floor(canvasHeight),
    };
  },

  // Update canvas dimensions
  updateCanvasDimensions: () => {
    const size = UTILS.calculateCanvasSize();
    CONFIG.WORLD.CANVAS_WIDTH = size.width;
    CONFIG.WORLD.CANVAS_HEIGHT = size.height;

    console.log(`Canvas dimensions updated: ${size.width}x${size.height}`);
    return size;
  },

  // Image loading and caching system
  imageCache: new Map(),
  imagesLoaded: false,

  // Load all game images
  loadImages: () => {
    return new Promise((resolve, reject) => {
      const imagesToLoad = [];

      // Bug images
      CONFIG.BUG_TYPES.forEach((bugType) => {
        imagesToLoad.push({
          key: `bug_${bugType.image}`,
          src: `images/${bugType.image}`,
        });
      });

      // Game element images
      imagesToLoad.push(
        { key: "collection_bin", src: CONFIG.IMAGES.COLLECTION_BIN },
        { key: "jim_1", src: CONFIG.IMAGES.JIM_PLAYER }, // Updated key name
        { key: "monster", src: CONFIG.IMAGES.MONSTER },
        { key: "firefly_monster", src: CONFIG.IMAGES.FIREFLY_MONSTER },
        { key: "beetle_monster", src: CONFIG.IMAGES.BEETLE_MONSTER },
        { key: "butterfly_monster", src: CONFIG.IMAGES.BUTTERFLY_MONSTER },
        { key: "ladybug_monster", src: CONFIG.IMAGES.LADYBUG_MONSTER },
        { key: "grasshopper_monster", src: CONFIG.IMAGES.GRASSHOPPER_MONSTER },
        { key: "dragonfly_monster", src: CONFIG.IMAGES.DRAGONFLY_MONSTER },
        { key: "bug_icon", src: CONFIG.IMAGES.BUG_ICON },
        { key: "trophy_icon", src: CONFIG.IMAGES.TROPHY_ICON },
        { key: "achievement_unlock", src: CONFIG.IMAGES.ACHIEVEMENT_UNLOCK },
        { key: "stats_icon", src: CONFIG.IMAGES.STATS_ICON },
        { key: "controls_icon", src: CONFIG.IMAGES.CONTROLS_ICON },
        { key: "hand_particle", src: CONFIG.IMAGES.HAND_PARTICLE },
        { key: "thumbs_particle", src: CONFIG.IMAGES.THUMBS_PARTICLE }
      );

      let loadedCount = 0;
      const totalCount = imagesToLoad.length;

      console.log(`Loading ${totalCount} images...`);

      imagesToLoad.forEach((imageInfo) => {
        const img = new Image();
        img.onload = () => {
          UTILS.imageCache.set(imageInfo.key, img);
          loadedCount++;
          console.log(
            `Loaded: ${imageInfo.key} (${loadedCount}/${totalCount})`
          );

          if (loadedCount === totalCount) {
            UTILS.imagesLoaded = true;
            console.log("All images loaded successfully!");
            resolve();
          }
        };

        img.onerror = () => {
          console.error(`Failed to load image: ${imageInfo.src}`);
          // Still count as "loaded" to prevent blocking
          loadedCount++;
          if (loadedCount === totalCount) {
            UTILS.imagesLoaded = true;
            resolve();
          }
        };

        img.src = imageInfo.src;
      });
    });
  },

  // Get cached image
  getImage: (key) => {
    return UTILS.imageCache.get(key);
  },

  // Draw image with fallback to emoji - preserves aspect ratio
  drawImageOrEmoji: (ctx, imageKey, emoji, x, y, width, height) => {
    const image = UTILS.getImage(imageKey);
    if (image && UTILS.imagesLoaded) {
      // Calculate aspect ratio and adjust dimensions to preserve it
      const imageAspect = image.width / image.height;
      const targetAspect = width / height;

      let drawWidth = width;
      let drawHeight = height;

      if (imageAspect > targetAspect) {
        // Image is wider than target - fit by width
        drawHeight = width / imageAspect;
      } else {
        // Image is taller than target - fit by height
        drawWidth = height * imageAspect;
      }

      ctx.drawImage(
        image,
        x - drawWidth / 2,
        y - drawHeight / 2,
        drawWidth,
        drawHeight
      );
    } else {
      // Fallback to emoji
      ctx.fillStyle = "white";
      ctx.font = `bold ${Math.floor(height * 0.8)}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(emoji, x, y + height * 0.3);
    }
  },

  // Create particle effect
  createParticles: (x, y, type) => {
    const particles = [];
    const config = CONFIG.PARTICLES[type];

    for (let i = 0; i < config.COUNT; i++) {
      const angle = (Math.PI * 2 * i) / config.COUNT + Math.random() * 0.5;
      const speed = config.SPEED + Math.random() * config.SPEED;

      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: config.LIFETIME,
        maxLife: config.LIFETIME,
        size: config.SIZE + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        type: type,
      });
    }

    return particles;
  },

  // Update particles
  updateParticles: (particles) => {
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Apply gravity and air resistance
      particle.vy += 0.1;
      particle.vx *= 0.98;
      particle.vy *= 0.98;

      // Update rotation
      particle.rotation += particle.rotationSpeed;

      // Update life
      particle.life--;

      // Remove dead particles
      if (particle.life <= 0) {
        particles.splice(i, 1);
      }
    }
  },

  // Render particles
  renderParticles: (ctx, particles, cameraX, cameraY) => {
    particles.forEach((particle) => {
      const x = particle.x - cameraX;
      const y = particle.y - cameraY;

      // Skip if off-screen
      if (
        x < -50 ||
        x > CONFIG.WORLD.CANVAS_WIDTH + 50 ||
        y < -50 ||
        y > CONFIG.WORLD.CANVAS_HEIGHT + 50
      )
        return;

      const alpha = particle.life / particle.maxLife;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(particle.rotation);

      // Get the appropriate image
      const config = CONFIG.PARTICLES[particle.type];
      const imageKey =
        particle.type === "BUG_COLLECTION"
          ? "hand_particle"
          : "thumbs_particle";
      const emoji = particle.type === "BUG_COLLECTION" ? "👋" : "👍";

      UTILS.drawImageOrEmoji(
        ctx,
        imageKey,
        emoji,
        0,
        0,
        particle.size,
        particle.size
      );

      ctx.restore();
    });
  },
};
