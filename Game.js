export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
    this.collisionCount = 0;
    this.currentLevel = 1;
  }

  preload() {
    // Carga las imágenes necesarias para el juego
    this.load.image("platform", "images/platform.png");
    this.load.image("ball", "images/Circulo.png");
    this.load.image("obstacle", "images/obstacle.png");
  }

  create() {
    // Configuración inicial del juego
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Crea la plataforma y ajusta sus propiedades
    this.platform = this.physics.add.sprite(400, 500, "platform").setImmovable();
    this.platform.body.allowGravity = false;
    this.platform.setCollideWorldBounds(true);
    this.platform.setScale(0.5);

    // Crea la pelota y ajusta sus propiedades
    this.ball = this.physics.add.sprite(400, 0, "ball");
    this.ball.setBounce(1);
    this.ball.setCollideWorldBounds(true);
    this.ballVelocity = 200;
    this.ball.setVelocity(this.ballVelocity, this.ballVelocity);
    this.ball.setScale(0.5);

    // Crea un grupo para almacenar los obstáculos y configura su inmovilidad
    this.obstacles = this.physics.add.group({ immovable: true });

    // Configura la velocidad de la plataforma
    this.platformVelocity = 400;

    // Establece una colisión entre la plataforma y la pelota, con una función de manejo
    this.physics.add.collider(
      this.platform,
      this.ball,
      this.handleCollision,
      null,
      this
    );

    // Crea teclas de cursor para el movimiento de la plataforma
    this.cursors = this.input.keyboard.createCursorKeys();

    // Crea texto para mostrar el nivel y la puntuación
    this.levelText = this.add.text(this.sys.game.config.width / 2, 20, `Nivel ${this.currentLevel}`, {
      fontSize: '24px',
      fill: '#ffffff',
    });
    this.levelText.setOrigin(0.5);

    this.counterText = this.add.text(this.sys.game.config.width / 2, 50, `Puntos: ${this.collisionCount}`, {
      fontSize: '24px',
      fill: '#ffffff',
    });
    this.counterText.setOrigin(0.5);

    // Genera el primer obstáculo al iniciar el juego
    this.generateObstacle();
  }

  update() {
    // Actualización del juego en cada cuadro
    if (this.collisionCount >= 10) {
      // Si la puntuación llega a 10, aumenta el nivel y reinicia la puntuación
      this.currentLevel++;
      this.collisionCount = 0;
      this.levelText.setText(`Nivel ${this.currentLevel}`);
      this.ballVelocity *= 1.1; // Aumenta la velocidad de la pelota en un 10%
      this.generateObstacle(); // Genera un nuevo obstáculo
    }

    if (this.currentLevel <= 2) {
      // Si el nivel es 2 o menor, permite el movimiento de la plataforma con las teclas de cursor
      if (this.cursors.left.isDown) {
        this.platform.setVelocityX(-this.platformVelocity);
      } else if (this.cursors.right.isDown) {
        this.platform.setVelocityX(this.platformVelocity);
      } else {
        this.platform.setVelocityX(0);
      }

      if (this.cursors.up.isDown) {
        this.platform.setVelocityY(-this.platformVelocity);
      } else if (this.cursors.down.isDown) {
        this.platform.setVelocityY(this.platformVelocity);
      } else {
        this.platform.setVelocityY(0);
      }
    }
  }

  generateObstacle() {
    // Genera un obstáculo en una posición aleatoria dentro de los límites del juego
    const randomX = Phaser.Math.Between(50, this.sys.game.config.width - 50);
    const randomY = Phaser.Math.Between(50, this.sys.game.config.height - 50);
    const obstacle = this.physics.add.sprite(randomX, randomY, "obstacle");
    obstacle.body.allowGravity = false;
    this.obstacles.add(obstacle);
  }

  handleCollision() {
    // Maneja la colisión entre la pelota y la plataforma
    this.collisionCount++;
    this.counterText.setText(`Puntos: ${this.collisionCount}`);
  }
}