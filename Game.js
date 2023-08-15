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
    // Define los valores de matiz para la rueda cromática en cada nivel
    this.hueValues = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324, 0]; // 10 cambios
    
    // Establece el valor de matiz inicial (rojo) para el fondo
    this.cameras.main.setBackgroundColor(this.hueToColor(this.hueValues[0]));

    // Configuración inicial del juego
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Crea la plataforma y ajusta sus propiedades
    this.platform = this.physics.add.sprite(400, 550, "platform").setImmovable();
    this.platform.body.allowGravity = false;
    this.platform.setCollideWorldBounds(true);
    this.platform.setScale(1.5);

    // Crea la pelota y ajusta sus propiedades
    this.ball = this.physics.add.sprite(400, 0, "ball");
    this.ball.setBounce(1);
    this.ball.setCollideWorldBounds(true);
    this.ballVelocity = 200;
    this.ball.setVelocity(this.ballVelocity, this.ballVelocity);
    this.ball.setScale(0.1);

    // Crea un grupo para almacenar los obstáculos y configura su inmovilidad
    this.obstacles = this.physics.add.group({ immovable: true });

    // Configura la velocidad de la plataforma
    this.platformVelocity = 400;

    // Establece una colisión entre la plataforma y la pelota, con una función de manejo
    this.physics.add.collider(this.platform, this.ball, this.handleCollision, null, this);

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

    // Establece colisiones entre la pelota y los obstáculos
    this.physics.add.collider(this.ball, this.obstacles, this.handleBallObstacleCollision, null, this);
  }

  update() {
    // Actualización del juego en cada cuadro
    if (this.collisionCount >= 10) {
      // Cambia el color del fondo al pasar de nivel
      this.currentLevel++;
      if (this.currentLevel < this.hueValues.length) {
        this.cameras.main.setBackgroundColor(this.hueToColor(this.hueValues[this.currentLevel]));
      }
      
      // Reinicia la puntuación y genera un nuevo obstáculo
      this.collisionCount = 0;
      this.levelText.setText(`Nivel ${this.currentLevel}`);
      this.ballVelocity *= 1.1; 
      this.generateObstacle(); 
    }
  
    // Movimiento de la plataforma
    if (this.cursors.left.isDown) {
      this.platform.setVelocityX(-this.platformVelocity);
    } else if (this.cursors.right.isDown) {
      this.platform.setVelocityX(this.platformVelocity);
    } else {
      this.platform.setVelocityX(0);
    }
  }

  generateObstacle() {
    // Genera un obstáculo en una posición aleatoria dentro de los límites del juego
    const randomX = Phaser.Math.Between(50, this.sys.game.config.width - 50);
    const randomY = Phaser.Math.Between(50, 500);
    const randomScale = Phaser.Math.FloatBetween(0.5, 1.5); 
    const obstacle = this.physics.add.sprite(randomX, randomY, "obstacle");
    obstacle.body.allowGravity = false;
    obstacle.setScale(randomScale);
    obstacle.setData('life', 10); 
    this.obstacles.add(obstacle);
  }
  

  handleCollision() {
    // Maneja la colisión entre la pelota y la plataforma
    this.collisionCount++;
    this.counterText.setText(`Puntos: ${this.collisionCount}`);
  }

  handleBallObstacleCollision(ball, obstacle) {
    // Reduce la vida del obstáculo al colisionar con la pelota
    obstacle.setData('life', obstacle.getData('life') - 1);
    console.log(`Vida del obstáculo: ${obstacle.getData('life')}`);

    // Si la vida del obstáculo llega a cero, se destruye
    if (obstacle.getData('life') <= 0) {
      obstacle.destroy();
    }
  }

  hueToColor(hue) {
    // Convierte el valor de matiz a un color RGB usando el modelo HSV
    let rgbColor = Phaser.Display.Color.HSVToRGB(hue / 360, 1, 0.5); 
    return rgbColor.color;
  }
}
