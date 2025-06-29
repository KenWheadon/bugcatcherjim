// Bug Catcher Jim - Game configuration and constants (Game Jam Pivot)
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
    SPEED: 4, // Normal speed
    SPRINT_MULTIPLIER: 2, // 2x speed when sprinting
    HEAD_SPEED_MULTIPLIER: 0.75, // 0.75x speed when carrying as head
    START_X: 1200, // Center of larger world
    START_Y: 900, // Center of larger world
    MAX_CARRYING: {
      STAGE_1: 3, // Can carry 3 bugs with arms
      STAGE_2: 1, // Can carry 1 bug without arms
      STAGE_3: 1, // Can carry 1 bug as head only
    },
  },

  // Stamina system
  STAMINA: {
    MAX: 50,
    GAIN_PER_BUG: 5,
    DRAIN_PER_SECOND: 20, // 1 stamina every 3 seconds at 60fps (60/3 = 20 frames)
  },

  // Bug settings
  BUGS: {
    COUNT: 6,
    SIZE: 60, // Doubled from 30
    MAX_SPEED: 2,
    SPAWN_MARGIN: 100,
    EDGE_SPAWN_DISTANCE: 150, // Distance from edge to spawn new bugs/monsters
  },

  // Collection bin
  BIN: {
    SIZE: 80, // Increased from 40
    X: 1200, // Center of larger world
    Y: 900, // Center of larger world
  },

  // Monster settings
  MONSTERS: {
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

  // Game stages
  STAGES: {
    STAGE_1: {
      name: "Full Body",
      image: "jim-happy.png",
      canSprint: true,
      maxCarrying: 3,
      speedMultiplier: 1,
    },
    STAGE_2: {
      name: "Armless",
      image: "jim-armless.png",
      canSprint: true,
      maxCarrying: 1,
      speedMultiplier: 1,
    },
    STAGE_3: {
      name: "Head Only",
      image: "jim-head-happy.png",
      canSprint: false,
      maxCarrying: 1,
      speedMultiplier: 0.75, // Only when carrying
    },
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
    JIM_HAPPY: "images/jim-happy.png", // Stage 1
    JIM_ARMLESS: "images/jim-armless.png", // Stage 2
    JIM_HEAD_HAPPY: "images/jim-head-happy.png", // Stage 3
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

    // Particle images
    HAND_PARTICLE: "images/hand.png",
    THUMBS_PARTICLE: "images/thumbs.png",
  },

  AUDIO: {
    BACKGROUND_MUSIC: "background-music",
    COLLECT_SOUND: "collect-sound",
    UI_HOVER: "ui-hover",
    DEPOSIT_SOUND: "deposit-sound",
    MONSTER_SPAWN: "monster-spawn",
    DEATH_SOUND: "death-sound",
    STAGE_TRANSITION: "stage-transition",
    SPRINT_START: "sprint-start",
    SPRINT_STOP: "sprint-stop",
  },

  // Bug types with point values and image paths
  BUG_TYPES: [
    {
      name: "Firefly",
      color: "#ffeb3b",
      symbol: "✨",
      image: "firefly.png",
      points: 5,
    },
    {
      name: "Beetle",
      color: "#8bc34a",
      symbol: "🪲",
      image: "beetle.png",
      points: 10,
    },
    {
      name: "Butterfly",
      color: "#e91e63",
      symbol: "🦋",
      image: "butterfly.png",
      points: 15,
    },
    {
      name: "Ladybug",
      color: "#f44336",
      symbol: "🐞",
      image: "ladybug.png",
      points: 25,
    },
    {
      name: "Grasshopper",
      color: "#4caf50",
      symbol: "🦗",
      image: "grasshopper.png",
      points: 35,
    },
    {
      name: "Dragonfly",
      color: "#2196f3",
      symbol: "🪃",
      image: "dragonfly.png",
      points: 50,
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
    POINTS_GAINED: {
      COUNT: 5,
      LIFETIME: 90, // frames
      SPEED: 1,
      SIZE: 16,
      IMAGE: "thumbs.png",
    },
  },
};

// Utility functions (updated for Bug Catcher Jim)
const UTILS = {
  // Get Jim sprite path based on stage
  getJimImagePath: (stage = 1) => {
    switch (stage) {
      case 1:
        return CONFIG.IMAGES.JIM_HAPPY;
      case 2:
        return CONFIG.IMAGES.JIM_ARMLESS;
      case 3:
        return CONFIG.IMAGES.JIM_HEAD_HAPPY;
      default:
        return CONFIG.IMAGES.JIM_HAPPY;
    }
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

  // Switch background music
  switchBackgroundMusic: (trackId) => {
    // Stop all music tracks first
    const allTracks = [CONFIG.AUDIO.BACKGROUND_MUSIC];

    allTracks.forEach((id) => {
      const audio = document.getElementById(id);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    // Start the new track
    const newAudio = document.getElementById(trackId);
    if (newAudio) {
      newAudio.volume = CONFIG.MUSIC_VOLUME;
      newAudio.play().catch((e) => console.log("Music switch failed:", e));
    }

    return trackId;
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

  // Generate random position at edge of world
  randomEdgePosition: (distance = CONFIG.BUGS.EDGE_SPAWN_DISTANCE) => {
    const side = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
    let x, y;

    switch (side) {
      case 0: // Top
        x = Math.random() * CONFIG.WORLD.WIDTH;
        y = distance;
        break;
      case 1: // Right
        x = CONFIG.WORLD.WIDTH - distance;
        y = Math.random() * CONFIG.WORLD.HEIGHT;
        break;
      case 2: // Bottom
        x = Math.random() * CONFIG.WORLD.WIDTH;
        y = CONFIG.WORLD.HEIGHT - distance;
        break;
      case 3: // Left
        x = distance;
        y = Math.random() * CONFIG.WORLD.HEIGHT;
        break;
    }

    return { x, y };
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
        { key: "jim_happy", src: CONFIG.IMAGES.JIM_HAPPY },
        { key: "jim_armless", src: CONFIG.IMAGES.JIM_ARMLESS },
        { key: "jim_head_happy", src: CONFIG.IMAGES.JIM_HEAD_HAPPY },
        { key: "monster", src: CONFIG.IMAGES.MONSTER },
        { key: "firefly_monster", src: CONFIG.IMAGES.FIREFLY_MONSTER },
        { key: "beetle_monster", src: CONFIG.IMAGES.BEETLE_MONSTER },
        { key: "butterfly_monster", src: CONFIG.IMAGES.BUTTERFLY_MONSTER },
        { key: "ladybug_monster", src: CONFIG.IMAGES.LADYBUG_MONSTER },
        { key: "grasshopper_monster", src: CONFIG.IMAGES.GRASSHOPPER_MONSTER },
        { key: "dragonfly_monster", src: CONFIG.IMAGES.DRAGONFLY_MONSTER },
        { key: "bug_icon", src: CONFIG.IMAGES.BUG_ICON },
        { key: "trophy_icon", src: CONFIG.IMAGES.TROPHY_ICON },
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
