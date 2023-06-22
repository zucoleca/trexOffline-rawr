var PLAY = 1
var END = 0
var gameState = PLAY
var trex
var trex_running
var edges
var ground, invisbleGround, groundImage
var cloud, cloudImage
var score
var obstaclesGroup
var cloudsGroup
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6 
var trex_collided
var gameOverImg, restartImg
var jumpSound, checkpointSound, dieSound

function preload () {
  trex_running = loadAnimation("./images/trex1.png", "./images/trex3.png", "./images/trex4.png")
  groundImage = loadImage("./images/ground2.png")
  cloudImage = loadImage("./images/cloud.png")
  trex_collided = loadAnimation ("./images/trex_collided.png")
  obstacle1 = loadImage("./images/obstacle1.png")
  obstacle2 = loadImage("./images/obstacle2.png")
  obstacle3 = loadImage("./images/obstacle3.png")
  obstacle4 = loadImage("./images/obstacle4.png")
  obstacle5 = loadImage("./images/obstacle5.png")
  obstacle6 = loadImage("./images/obstacle6.png")
  gameOverImg = loadImage("./images/gameOver.png")
  restartImg = loadImage("./images/restart.png")
  jumpSound = loadSound("./sounds/jump.mp3")
  checkpointSound = loadSound("./sounds/checkpoint.mp3")
  dieSound = loadSound("./sounds/die.mp3")
}

function setup() {
  createCanvas(600,200);
  edges = createEdgeSprites ()

  //criar sprite trex
  trex = createSprite(50, 160, 20, 50)
  trex.addAnimation("running", trex_running)
  trex.addAnimation ("collided", trex_collided )
  trex.scale = 0.5

  //criar sprite ground
  ground = createSprite(200, 180, 400, 20)
  ground.addImage("ground", groundImage )
  ground.x = ground.width/2
  ground.velocityX = -4

  //criando invisible ground
  invisibleGround = createSprite(200, 190, 400, 10)
  invisibleGround.visible =  false 

  gameOver = createSprite(300,100)
  gameOver.addImage(gameOverImg)
  gameOver.scale = 0.5
  restart = createSprite(300,135)
  restart.addImage(restartImg)
  restart.scale = 0.5
  obstaclesGroup = createGroup()
  cloudsGroup = createGroup()

  score = 0

  trex.setCollider("circle", 0, 0, 40)
  trex.debug = false
}


function draw() {
  background("#eee");

  textSize(17)
  text("score: " + score, 500, 50)
  

  if (gameState === PLAY){
    gameOver.visible = false
    restart.visible = false

    ground.velocityX = -(4 + 3*score/100)
    score = score + Math.round(getFrameRate()/60)
    
    if(score>0 && score%100 === 0){
      checkpointSound.play()
    }

    if (ground.x < 0){
      ground.x = ground.width/2
    }

    if (keyDown("space") && trex.y >= 145 )  {
      trex.velocityY = -10
      jumpSound.play()
    }

    trex.velocityY = trex.velocityY +0.8 

    spawnClouds();
    spawnObstacles();

    if(obstaclesGroup.isTouching(trex)){
      gameState = END
      gameOver.visible = true
      restart.visible =  true
      dieSound.play()
    }

  } else if (gameState === END){
    ground.velocityX = 0
    trex.velocityY = 0

    trex.changeAnimation("collided", trex_collided)

    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
  }

  trex.collide(invisibleGround)
  
  if(mousePressedOver(restart)){
    reset()
  }

  drawSprites();
}

function reset(){
  gameState = PLAY
  gameOver.visible = false
  restart.visible = false
  score = 0
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  trex.changeAnimation("running", trex_running)
}

function spawnClouds(){
  if (frameCount % 60 === 0 ){
    cloud = createSprite(600, 100, 40, 10)
    cloud.velocityX = -3
    cloud.addImage(cloudImage)
    cloud.scale = 0.6 
    cloud.y  = Math.round(random(10, 60))

    cloud.lifetime = 210

    //ajuste da profundidade
    cloud.depth = trex.depth
    trex.depth = trex.depth +1

    cloudsGroup.add(cloud)
  }
}

function spawnObstacles(){
  if (frameCount % 60 === 0 ){
    var obstacle = createSprite(400, 165, 10, 40)
    obstacle.velocityX = -6
  
    var rand = Math.round(random(1,6))

    switch(rand){
      case 1: obstacle.addImage(obstacle1)
              break;
      case 2: obstacle.addImage(obstacle2)
              break;
      case 3: obstacle.addImage(obstacle3)
              break;
      case 4: obstacle.addImage(obstacle4)
              break;
      case 5: obstacle.addImage(obstacle5)
              break;
      case 6: obstacle.addImage(obstacle6)
              break;
      default: break;
    }

    obstacle.scale = 0.5
    obstacle.lifetime = 300
    obstaclesGroup.add(obstacle)
  }

}

