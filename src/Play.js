class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
      this.shotsTaken = 0;
      this.score = 0;
    }
  
    init() {
      // useful variables
        // treating it as a constant so capitalizing it
      this.SHOT_VELOCITY_X = 200;
      this.SHOT_VELOCITY_Y_MIN = 700;
      this.SHOT_VELOCITY_Y_MAX = 1100;
    }
  
    preload() {
      this.load.path = "./assets/img/";
      this.load.image("grass", "grass.jpg");
      this.load.image("cup", "cup.jpg");
      this.load.image("ball", "ball.png");
      this.load.image("wall", "wall.png");
      this.load.image("oneway", "one_way_wall.png");
    }
  
    create() {
      // add background grass
      this.grass = this.add.image(0, 0, "grass").setOrigin(0);
  
      // add cup
      this.cup = this.physics.add.sprite(width / 2, height / 10, "cup");
        // cup to behave like we want
      this.cup.body.setCircle(this.cup.width / 4);
      this.cup.body.setOffset(this.cup.width / 4);
      this.cup.body.setImmovable(true) // command D to edit and highlight all the code u want
      // add ball
      this.ball = this.physics.add.sprite(
        width / 2,
        height - height / 10,
        "ball"
      );
      this.ball.body.setCircle(this.ball.width / 2);
      this.ball.body.setCollideWorldBounds(true);
      this.ball.body.setBounce(0.5);
      this.ball.body.setDamping(true).setDrag(0.5);
      
      // add walls
      //corrected scattering walls
      let wallA = this.physics.add.sprite(0, height / 6, "wall");
      wallA.setX(Phaser.Math.Between(width / 4, (3 * width) / 4));
      wallA.body.setImmovable(true);
  
      let wallB = this.physics.add.sprite(0, height / 2, "wall");
      wallB.setX(Phaser.Math.Between(width / 4, (3 * width) / 4));
      wallB.body.setImmovable(true);
  
      this.walls = this.add.group([wallA, wallB]);
      // add one-way
      this.oneWay = this.physics.add.sprite(width / 2, height / 4 + 3, "oneway");
      this.oneWay.setX(
        Phaser.Math.Between(
          0 + this.oneWay.width / 2,
          width - this.oneWay.width / 2
        )
      );
      this.oneWay.body.setImmovable(true);
      this.oneWay.body.checkCollision.down = false;
      
      // add pointer input
        // add scene event handler for input
      this.input.on("pointerdown", (pointer) => { //string defined by phaser, and defined function w anon arrow function
        this.shotsTaken++;
        let shotDirection = pointer.y <= this.ball.y ? 1 : -1; // if statement and true or false
        let shotXDirection = pointer.x - this.ball.x;
        this.ball.body.setVelocityX(shotXDirection * 3);
        this.ball.body.setVelocityY(
          Phaser.Math.Between(
            this.SHOT_VELOCITY_Y_MIN,
            this.SHOT_VELOCITY_Y_MAX
          ) * shotDirection
        );
      });
      // cup/ball collision
      this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
        this.score++; // gain points
        ball.setPosition(width / 2, height - height / 10); // reset
        ball.body.setVelocity(0, 0);
      });
  
      //moving walls
      this.tweens.add({
        targets: wallA,
        wallB,
        x: { from: 0, to: width },
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        duration: 4000,
      });
  
      // ball/wall collision
      this.physics.add.collider(this.ball, this.walls);
      // ball/one-way collision
      this.physics.add.collider(this.ball, this.oneWay);
      this.shotText = this.add.text(10, 10, "", {
        fontSize: "16px",
        fill: "#FFF",
      });
    }
  
    update() {
      this.shotText.setText(
        `Shots: ${this.shotsTaken} Score: ${this.score} Accuracy: ${
          this.shotsTaken > 0
            ? Math.round((this.score / this.shotsTaken) * 100)
            : 0
        }%`
      );
    }
  }
  
  // Correctly defining the ballReset method inside the Play class
  
  /*
  CODE CHALLENGE
  Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
  [ ] Add ball reset logic on successful shot
  [ ] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
  [ ] Make one obstacle move left/right and bounce against screen edges
  [ ] Create and display shot counter, score, and successful shot percentage
  */