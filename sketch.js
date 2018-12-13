

var jumpSound;
var backgroundSound;
var fallSound;
var coinSound;
var gameoverSound;
var finishgameSound;

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var canyons;
var collectable;

var game_score;
var flagpole;
var lives;
gameoverSoundN = 0
finishgameSoundN = 0

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.5);
    backgroundSound = loadSound('assets/backgroundmusic.mp3');
    backgroundSound.setVolume(0.2);
    fallSound = loadSound('assets/fall.mp3');
    fallSound.setVolume(0.4);
    coinSound = loadSound('assets/coin.wav');
    coinSound.setVolume(0.5);
    gameoverSound = loadSound('assets/gameover.mp3');
    gameoverSound.setVolume(0.7);
    finishgameSound = loadSound('assets/finishgame.wav');
    finishgameSound.setVolume(0.7);
}

function setup()
{
    backgroundSound.play();
	createCanvas(1024, 576);
	lives = 4;
    textSize(20);
    startGame();
}

function startGame()
{
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.

	clouds = [
		{x:140, y:60 , size:1},
		{x:370, y:50 , size:1},
        {x:512, y:70 , size:1},
        {x:913, y:10 , size:1},
		{x:1038, y:35 , size:1},
		{x:1800, y:90 , size:1}
		
	]

	mountains = [
        {x:10, y:0 , size:1},
        {x:300, y:0 , size:1},
        {x:430, y:0 , size:1},
        {x:970, y:0 , size:1},
        {x:890, y:0 , size:1},
        {x:1700, y:0 , size:1}
	]

	trees_x = [100,352,488,852, 1024, 1700];
	
	canyons = [
		{posX:-200, y:0 , width:175},
        {posX:200, y:0 , width:175},
        {posX:670, y:0 , width:175},
        {posX:988, y:0 , width:175},
        {posX:1500, y:0 , width:175},
        {posX:2300, y:0 , width:175}
	]

	collectable = [
		{posX:30, posY: floorPos_y  , size:50, isFound:false},
        {posX:170, posY: floorPos_y   , size:50, isFound:false},
        {posX:600, posY: floorPos_y  , size:50, isFound:false},
        {posX:900, posY: floorPos_y , size:50, isFound:false},
        {posX:1700, posY: floorPos_y , size:50, isFound:false},
        {posX:1300, posY: floorPos_y , size:50, isFound:false}
	]
	collectable_x = [180, 736, 1379]				

	game_score = 0;

	flagpole = {
	x_pos: 3000,
	isReached: false
	}

	lives -= 1;
	}

function draw()
{
	var Sky = color(250,113,54)
    var Ground = color(51,0,51)
    var Ground2 = color(51,0,25)
    
    
    
	background(Sky); //fill the sky

	noStroke();
	fill(Ground);
	rect(0, 432, 1024, 144); //draw ground
	push();
    translate(scrollPos,0);

	// Draw clouds.
	drawClouds();
	// Draw mountains.
	drawMountains();
	// Draw trees.
	drawTrees();
	// Draw canyons.
	for(i = 0; i < canyons.length; i++)
        {
            drawCanyon(canyons[i]);
            checkCanyon(canyons[i]);
        }
    
	// Draw collectable items.
	for(var s=0; s < collectable.length; s++)
	{
		
	
		if(!collectable[s].isFound)
		{
			drawCollectable(collectable[s]);
			checkCollectable(collectable[s]);
		}
			
		
	  }
	  
	renderFlagpole();
	pop();
  
	// Draw game character.
	
	drawGameChar();

	// draw screen
    textFont('Helvetica');
    textSize(30)
    text("Score: " + game_score, 20, 30);
    text("Lives: " + lives, 20, 70);
    
    if(lives < 1)
        {   
            
            if (gameoverSoundN == 0)
            {
                gameoverSound.play();
            }
            
            stroke(139,0,0);
            strokeWeight(5);
            fill(255,0,0);
            textFont('Forte');
            textSize(120);
            text("Game Over", width/2 - 300, height/2);
            gameoverSoundN = 1
            return;
        }
    else if(flagpole.isReached)
        {
            stroke(0,255,255);
            strokeWeight(3);
            fill(64,244,208);
            textFont('Impact');
            textSize(120);
            text("Level Complete", width/2 -350,height/2);
            return;
        }
    
      if(gameChar_y > height)
            {
                if(lives > 0)startGame();
			}
	
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
		
	
	}

	// Logic to make the game character rise and fall
	if(isLeft)
	{
		gameChar_x -= 0.25;
		   
	}
   
   if(isRight)
	{
	   gameChar_x += 0.25;
	}
   
   if(gameChar_y != floorPos_y)
	   {
		   isFalling = true;
		
	   }
   else
	   {
		   isFalling = false;
	   }
   
   if (isFalling == true)
	   {
		   gameChar_y += 2;
	   }
   
   if (isPlummeting)
	   {
		   gameChar_y += 5;
	   }
   
   if(flagpole.isReached != true)
	   {
		   checkFlagpole();
	   }
	 
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
	// if statements to control the animation of the character when
	// keys are pressed.
    

	//open up the console to see how these work
	console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);
    //37 == left
    //39 == right
    if (key == "a" || keyCode == 37)
        {
            isLeft = true;
            console.log("isLeft:" + isLeft);
        }
    if (key == "d" || keyCode == 39)
        {
            isRight = true;
            console.log("isRight" + isRight);
        }
	if (key == " " || key == "w")
		{
            jumpSound.play();
			if(!isFalling)
			{
				gameChar_y -= 100
			}
		}
        
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.

	console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);
    
    if (key == "a" || keyCode == 37)
        {
            isLeft = false;
            console.log("isLeft:" + isLeft);
        }
    if (key == "d" || keyCode == 39)
        {
            isRight = false;
            console.log("isRight" + isRight);
        }
    if (key == " " || key == "w" || keyCode == 32)
        {
            isPlummeting = false;
            console.log("isPlummeting" + isPlummeting);
        }  
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
        fill(255,229,204)
        ellipse(gameChar_x,(gameChar_y)-45,15,20) //face
        fill(204,0,0)
        ellipse((gameChar_x)-6,(gameChar_y)-48,2,2) //left eye
        fill(0)
        rect((gameChar_x)-6,(gameChar_y)-40,3,1) //Mouth
        fill(0,0,102)
        quad((gameChar_x)-3,(gameChar_y)-36,(gameChar_x)+3,(gameChar_y)-36,(gameChar_x)+8,(gameChar_y)-15,(gameChar_x)-8,(gameChar_y)-15) //body
        fill(0,51,102)
        rect((gameChar_x)-7,(gameChar_y)-15,6,7) //left leg
        rect((gameChar_x)+1,(gameChar_y)-15,6,7) //right leg
        rect((gameChar_x)-2,(gameChar_y)-15,3,3)
        fill(51,25,0)
        rect((gameChar_x)-6,(gameChar_y)-8,7,5) //left shoe
        rect((gameChar_x)+2,(gameChar_y)-8,7,5) //right shoe
        fill(0,51,102)
        rect((gameChar_x)-7,(gameChar_y)-33,4,14) //left arm
        fill(0,0,102)
        quad((gameChar_x)-5,(gameChar_y)-57,(gameChar_x)+5,(gameChar_y)-57,(gameChar_x)+13,(gameChar_y)-47,(gameChar_x)-13,(gameChar_y)-47) //hat
        triangle((gameChar_x)-5,(gameChar_y)-59,(gameChar_x)+5,(gameChar_y)-59,(gameChar_x),(gameChar_y)-70)
        fill(65,67,98)
        rect((gameChar_x)-5,(gameChar_y)-59,10,2)

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        fill(255,229,204)
        ellipse(gameChar_x,(gameChar_y)-45,15,20) //face
        fill(0,76,153)
        ellipse((gameChar_x)+3,(gameChar_y)-48,2,2) //Right eye
        fill(0)
        rect((gameChar_x)+3,(gameChar_y)-40,3,1) //Mouth
        fill(0,0,102)
        quad((gameChar_x)-3,(gameChar_y)-36,(gameChar_x)+3,(gameChar_y)-36,(gameChar_x)+8,(gameChar_y)-15,(gameChar_x)-8,(gameChar_y)-15) //body
        fill(0,51,102)
        rect((gameChar_x)-6,(gameChar_y)-15,6,7) //left leg
        rect((gameChar_x)+2,(gameChar_y)-15,6,7) //right leg
        rect((gameChar_x),(gameChar_y)-15,3,3)
        fill(51,25,0)
        rect((gameChar_x)-8,(gameChar_y)-8,7,5) //left shoe
        rect((gameChar_x),(gameChar_y)-8,7,5) //right shoe
        fill(0,51,102)

        rect((gameChar_x)+2,(gameChar_y)-33,4,14) //right arm
        fill(0,0,102)
        quad((gameChar_x)-5,(gameChar_y)-57,(gameChar_x)+5,(gameChar_y)-57,(gameChar_x)+13,(gameChar_y)-47,(gameChar_x)-13,(gameChar_y)-47) //hat
        triangle((gameChar_x)-5,(gameChar_y)-59,(gameChar_x)+5,(gameChar_y)-59,(gameChar_x),(gameChar_y)-70)
        fill(65,67,98)
        rect((gameChar_x)-5,(gameChar_y)-59,10,2)

	}
	else if(isLeft)
	{
		// add your walking left code
        fill(255,229,204)
        ellipse(gameChar_x,(gameChar_y)-45,15,20) //face
        fill(204,0,0)
        ellipse((gameChar_x)-6,(gameChar_y)-48,2,2) //left eye
        fill(0)
        rect((gameChar_x)-6,(gameChar_y)-40,3,1) //Mouth
        fill(0,0,102)
        quad((gameChar_x)-3,(gameChar_y)-36,(gameChar_x)+3,(gameChar_y)-36,(gameChar_x)+8,(gameChar_y)-15,(gameChar_x)-8,(gameChar_y)-15) //body
        fill(0,51,102)
        rect((gameChar_x)-7,(gameChar_y)-15,6,14) //left leg
        rect((gameChar_x)+1,(gameChar_y)-15,6,14) //right leg
        rect((gameChar_x)-2,(gameChar_y)-15,3,3)
        fill(51,25,0)
        rect((gameChar_x)-8,(gameChar_y)-2,7,5) //left shoe
        rect((gameChar_x),(gameChar_y)-2,7,5) //right shoe
        fill(0,51,102)
        rect((gameChar_x)-7,(gameChar_y)-33,4,14) //left arm
        fill(0,0,102)
        quad((gameChar_x)-5,(gameChar_y)-57,(gameChar_x)+5,(gameChar_y)-57,(gameChar_x)+11,(gameChar_y)-50,(gameChar_x)-11,(gameChar_y)-50) //hat
        triangle((gameChar_x)-5,(gameChar_y)-59,(gameChar_x)+5,(gameChar_y)-59,(gameChar_x),(gameChar_y)-70)
        fill(65,67,98)
        rect((gameChar_x)-5,(gameChar_y)-59,10,2)

	}
	else if(isRight)
	{
		// add your walking right code
        fill(255,229,204)
        ellipse(gameChar_x,(gameChar_y)-45,15,20) //face
        fill(0,76,153)
        ellipse((gameChar_x)+3,(gameChar_y)-48,2,2) //Right eye
        fill(0)
        rect((gameChar_x)+3,(gameChar_y)-40,3,1) //Mouth
        fill(0,0,102)
        quad((gameChar_x)-3,(gameChar_y)-36,(gameChar_x)+3,(gameChar_y)-36,(gameChar_x)+8,(gameChar_y)-15,(gameChar_x)-8,(gameChar_y)-15) //body
        fill(0,51,102)
        rect((gameChar_x)-6,(gameChar_y)-15,6,14) //left leg
        rect((gameChar_x)+2,(gameChar_y)-15,6,14) //right leg
        rect((gameChar_x),(gameChar_y)-15,3,3)
        fill(51,25,0)
        rect((gameChar_x)-6,(gameChar_y)-2,7,5) //left shoe
        rect((gameChar_x)+2,(gameChar_y)-2,7,5) //right shoe
        fill(0,51,102)

        rect((gameChar_x)+2,(gameChar_y)-33,4,14) //right arm
        fill(0,0,102)
        quad((gameChar_x)-5,(gameChar_y)-57,(gameChar_x)+5,(gameChar_y)-57,(gameChar_x)+11,(gameChar_y)-50,(gameChar_x)-11,(gameChar_y)-50) //hat
        triangle((gameChar_x)-5,(gameChar_y)-59,(gameChar_x)+5,(gameChar_y)-59,(gameChar_x),(gameChar_y)-70)
        fill(65,67,98)
        rect((gameChar_x)-5,(gameChar_y)-59,10,2)

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        fill(255,229,204)
        ellipse(gameChar_x,(gameChar_y)-45,15,20) //face
        fill(0,76,153)
        ellipse((gameChar_x)-3,(gameChar_y)-48,2,2) //left eye
        fill(204,0,0)
        ellipse((gameChar_x)+3,(gameChar_y)-48,2,2) //Right eye
        fill(0)
        rect((gameChar_x)-3,(gameChar_y)-40,6,1) //Mouth
        fill(0,0,102)
        quad((gameChar_x)-3,(gameChar_y)-36,(gameChar_x)+3,(gameChar_y)-36,(gameChar_x)+8,(gameChar_y)-15,(gameChar_x)-8,(gameChar_y)-15) //body
        fill(0,51,102)
        rect((gameChar_x)-6,(gameChar_y)-15,6,7) //left leg
        rect((gameChar_x)+1,(gameChar_y)-15,6,7) //right leg
        rect((gameChar_x),(gameChar_y)-15,3,3)
        fill(51,25,0)
        rect((gameChar_x)-7,(gameChar_y)-8,7,5) //left shoe
        rect((gameChar_x)+1,(gameChar_y)-8,7,5) //right shoe
        fill(0,51,102)
        rect((gameChar_x)-7,(gameChar_y)-33,4,14) //left arm
        rect((gameChar_x)+2,(gameChar_y)-33,4,14) //right arm
        fill(0,0,102)
        quad((gameChar_x)-5,(gameChar_y)-57,(gameChar_x)+5,(gameChar_y)-57,(gameChar_x)+13,(gameChar_y)-47,(gameChar_x)-13,(gameChar_y)-47) //hat
        triangle((gameChar_x)-5,(gameChar_y)-59,(gameChar_x)+5,(gameChar_y)-59,(gameChar_x),(gameChar_y)-70)
        fill(65,67,98)
        rect((gameChar_x)-5,(gameChar_y)-59,10,2)

	}
    
    
	else
	{
		// add your standing front facing code
        fill(255,229,204)
        ellipse(gameChar_x,(gameChar_y)-45,15,20) //face
        fill(0,76,153)
        ellipse((gameChar_x)-3,(gameChar_y)-48,2,2) //left eye
        fill(204,0,0)
        ellipse((gameChar_x)+3,(gameChar_y)-48,2,2) //Right eye
        fill(0)
        rect((gameChar_x)-3,(gameChar_y)-40,6,1) //Mouth
        fill(0,0,102)
        quad((gameChar_x)-3,(gameChar_y)-36,(gameChar_x)+3,(gameChar_y)-36,(gameChar_x)+8,(gameChar_y)-15,(gameChar_x)-8,(gameChar_y)-15) //body
        fill(0,51,102)
        rect((gameChar_x)-6,(gameChar_y)-15,6,14) //left leg
        rect((gameChar_x)+1,(gameChar_y)-15,6,14) //right leg
        rect((gameChar_x),(gameChar_y)-15,3,3)
        fill(51,25,0)
        rect((gameChar_x)-7,(gameChar_y)-2,7,5) //left shoe
        rect((gameChar_x)+1,(gameChar_y)-2,7,5) //right shoe
        fill(0,51,102)
        rect((gameChar_x)-7,(gameChar_y)-33,4,14) //left arm
        rect((gameChar_x)+2,(gameChar_y)-33,4,14) //right arm
        fill(0,0,102)
        quad((gameChar_x)-5,(gameChar_y)-57,(gameChar_x)+5,(gameChar_y)-57,(gameChar_x)+11,(gameChar_y)-50,(gameChar_x)-11,(gameChar_y)-50) //hat
        triangle((gameChar_x)-5,(gameChar_y)-59,(gameChar_x)+5,(gameChar_y)-59,(gameChar_x),(gameChar_y)-70)
        fill(65,67,98)
        rect((gameChar_x)-5,(gameChar_y)-59,10,2)

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    
 for(var o=0; o < clouds.length; o++) 
        {
                fill(250)
				ellipse(clouds[o].x+150,clouds[o].y+150,clouds[o].size*90,clouds[o].size*50) //Cloud 1 
				ellipse(clouds[o].x+200,clouds[o].y+150,clouds[o].size*90,clouds[o].size*50)
				ellipse(clouds[o].x+250,clouds[o].y+150,clouds[o].size*90,clouds[o].size*50)
				ellipse(clouds[o].x+175,clouds[o].y+120,clouds[o].size*65,clouds[o].size*50)
				ellipse(clouds[o].x+220,clouds[o].y+120,clouds[o].size*65,clouds[o].size*50)
				ellipse(clouds[o].x+197,clouds[o].y+98,clouds[o].size*35,clouds[o].size*30)
				
				ellipse(clouds[o].x+300,clouds[o].y+70,clouds[o].size*90,clouds[o].size*50) //Cloud 2 
				ellipse(clouds[o].x+350,clouds[o].y+70,clouds[o].size*90,clouds[o].size*50)
				ellipse(clouds[o].x+400,clouds[o].y+70,clouds[o].size*90,clouds[o].size*50)
				ellipse(clouds[o].x+325,clouds[o].y+40,clouds[o].size*65,clouds[o].size*50)
				ellipse(clouds[o].x+370,clouds[o].y+40,clouds[o].size*65,clouds[o].size*50)
            
        
        }
}
// Function to draw mountains objects.
function drawMountains()
{
    var Mountain = color(96,96,96)
	for(var m=0; m < mountains.length; m++) 
		   {
			noStroke();
			fill(Mountain);
			triangle(mountains[m].x+500,(-1*mountains[m].y)+250, mountains[m].x+400,432,mountains[m].x+600,432)
			triangle(mountains[m].x+600,(-1*mountains[m].y)+200, mountains[m].x+450,432,mountains[m].x+700,432)
		   }
}
// Function to draw trees objects.

function drawTrees()
{
	var Cas1 = color(192,192,192)
    var Cas2 = color(64,64,64)
    var Cas3 = color(23,67,89)
    for(var i=0; i < trees_x.length; i++)
        {
			//3. a Castle
			//... add your code here
			fill(Cas2)
			rect(290+ trees_x[i],280,180,150) //1
			rect(210+ trees_x[i],392,280,40) //3
			fill(Cas2)
			rect(210+ trees_x[i],312,60,80) //4
			fill(Cas2)
			rect(210+ trees_x[i],220,30,100)
			//Roof
			fill(Cas3)
			quad(290+ trees_x[i],270,470+ trees_x[i],270,490+ trees_x[i],290,270+ trees_x[i],290)
			quad(210+ trees_x[i],382,490+ trees_x[i],382,510+ trees_x[i],402,190+ trees_x[i],402)
			quad(210+ trees_x[i],302,270+ trees_x[i],302,290+ trees_x[i],322,190+ trees_x[i],322)
			quad(210+ trees_x[i],200,240+ trees_x[i],200,260+ trees_x[i],220,190+ trees_x[i],220)
        }
}
// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
	var Sky = color(250,113,54)
	var Ground = color(51,0,51)
    var Ground2 = color(51,0,25)
    var Q1_1 = t_canyon.posX
    var Q1_2 = t_canyon.posX+100
    var Q1_A = (Q1_2-Q1_1)*(t_canyon.width/100)
    var LENGTH1 = Q1_1 + Q1_A
    
    var Q1_3 = t_canyon.posX+170
    var Q1_4 = t_canyon.posX+70
    var Q1_B = (Q1_3-Q1_4)*(t_canyon.width/100)
    var LENGTH2 = Q1_4 + Q1_B
    
    var LAVA_1 = t_canyon.posX+52
    var LAVA_2 = t_canyon.posX+230
    var LAVA_A = (LAVA_2-LAVA_1)*(t_canyon.width/100)
    var LAVA_LENGTH = LAVA_1 + LAVA_A
    
    var LAVA_3 = t_canyon.posX+170
    var LAVA_4 = t_canyon.posX+70
    var LAVA_B = (LAVA_3-LAVA_4)*(t_canyon.width/100)
    var LAVA_LENGTH2 = LAVA_4 + LAVA_B

    noStroke();
    fill(Sky);
    quad(Q1_1,432,LENGTH1,432,LENGTH1-30,700,Q1_1+30,700); //lava
    noStroke();
    fill(102,0,0);
    quad(Q1_1+10,550,LENGTH1-10,550,LENGTH1-30,700,Q1_1+30,700); //red lava
    fill(Ground2);
    triangle(t_canyon.posX,432,t_canyon.posX-21,432,t_canyon.posX+20,600); //left purple triange
    triangle(LENGTH1,432,LENGTH1+30,432,LENGTH1-20,600); //right purple triangle
    fill(Ground);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{	
	var Q1_1 = t_canyon.posX
    var Q1_2 = t_canyon.posX+100
    var Q1_A = (Q1_2-Q1_1)*(t_canyon.width/100)
    var LENGTH1 = Q1_1 + Q1_A
	if(gameChar_world_x  > t_canyon.posX && gameChar_world_x < t_canyon.posX + (t_canyon.width) && gameChar_y >= floorPos_y)
		{
            fallSound.play();
            isPlummeting = true;
            console.log("FALLINGGSS")
				
		}


}
// ----------------------------------
// Collectable items render and check functions
// ----------------------------------
function renderFlagpole()
{
    push();
    stroke(150);
    strokeWeight(5);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);
    
    if(flagpole.isReached)
        {   
            if(finishgameSoundN == 0)
            {
                finishgameSound.play();
            }
            noStroke();
            fill(255,0,0);
			rect(flagpole.x_pos, floorPos_y - 200, 50, 50);
			fill(255,255,0)
			ellipse(flagpole.x_pos + 25, floorPos_y - 175, 30)
			fill(255,0,0);
            ellipse(flagpole.x_pos + 25, floorPos_y - 175, 25)
            finishgameSoundN = 1
        }
    else
        {
            noStroke();
            fill(255,0,0); // LEVEL NOT COMPLETE
			rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
			fill(255,255,0)
			ellipse(flagpole.x_pos + 25, floorPos_y - 25, 30)
			fill(255,0,0);
			ellipse(flagpole.x_pos + 25, floorPos_y - 25, 25)
         }
    pop();
}

function checkFlagpole()
{
    
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(d < 50)
        {
            flagpole.isReached = true;
        }
}


// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    
    fill(44,122,182)
    quad(t_collectable.posX -15, t_collectable.posY-15, t_collectable.posX , t_collectable.posY - 5, t_collectable.posX +15, t_collectable.posY-15, t_collectable.posX , t_collectable.posY -40)
    fill(0,0,0)
    ellipse(t_collectable.posX , t_collectable.posY -15, 20 , 20)
}
// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    var d = dist(gameChar_world_x, gameChar_y, t_collectable.posX, t_collectable.posY)
    console.log(d)
    //ellipse(t_collectable.posX, t_collectable.posY, 20 , 20)
	if (d < 10) 
   {
	   t_collectable.isFound = true;
       game_score += t_collectable.size;
       coinSound.play();
   }
   
}


