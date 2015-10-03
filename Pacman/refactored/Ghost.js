//////////////////////////////////////////////////////
// Group members: Zi Wang (ziw), Bingying Xia(bxia) //
//////////////////////////////////////////////////////

function Ghost(ctx, xCord, yCord, gColor, direction){
	this.ctx = ctx;
	this.x = xCord;
	this.y = yCord;
	this.color = gColor;
	this.dir = direction;
	this.isWeak = false;
	this.radius = Game.Public.Constants.Radius.GHOST;
	this.isMoving = false;
	this.isBlinking = false;
	this.isDead = false;
	this.speed = speed;
	this.stepCounter = 0;
}

//send this ghost back to ghost house.
//location in ghost house is determined by its color
Ghost.prototype.toGhostHouse = function() {
	var initX, initY;
	switch(this.color){
			case Game.Public.Constants.Color.ORANGE:
			initX = ghostHouse[0][1]*Game.Public.Constants.GRID_WIDTH + Game.Public.Constants.GRID_WIDTH/2;
			initY = ghostHouse[0][0]*Game.Public.Constants.GRID_WIDTH + Game.Public.Constants.GRID_WIDTH/2;
			break;

			case Game.Public.Constants.Color.CYAN:
			initX =  ghostHouse[1][1]*Game.Public.Constants.GRID_WIDTH + Game.Public.Constants.GRID_WIDTH/2;
			initY =  ghostHouse[1][0]*Game.Public.Constants.GRID_WIDTH + Game.Public.Constants.GRID_WIDTH/2;
			break;

			case Game.Public.Constants.Color.PINK:
			initX = ghostHouse[2][1]*Game.Public.Constants.GRID_WIDTH + Game.Public.Constants.GRID_WIDTH/2;
			initY = ghostHouse[2][0]*Game.Public.Constants.GRID_WIDTH + Game.Public.Constants.GRID_WIDTH/2;
  			break;

			case Game.Public.Constants.Color.RED:
			initX = ghostHouse[3][1]*Game.Public.Constants.GRID_WIDTH + Game.Public.Constants.GRID_WIDTH/2;
			initY = ghostHouse[3][0]*Game.Public.Constants.GRID_WIDTH + Game.Public.Constants.GRID_WIDTH/2;
			break;


		}
	this.x = initX;
	this.y = initY;
	this.dir = Game.Public.Constants.Direction.DOWN;
	this.stepCounter = 0;
};

Ghost.prototype.draw = function() {

	if(!this.isDead){
		// body color
		if(this.isWeak){
			if(this.isBlinking){
				this.ctx.fillStyle = Game.Public.Constants.Color.BLINKING;
			}
			else{
				this.ctx.fillStyle = Game.Public.Constants.Color.WEAK;
			}
		}
		else{
			this.ctx.fillStyle = this.color;
		}
		
		this.ctx.beginPath();

		this.ctx.arc(this.x, this.y, this.radius, Math.PI, 0, false);
		this.ctx.moveTo(this.x-this.radius, this.y);
		

		// LEGS
		if (!this.isMoving){
			this.ctx.lineTo(this.x-this.radius, this.y+this.radius);
			this.ctx.lineTo(this.x-this.radius+this.radius/3, this.y+this.radius-this.radius/4);
			this.ctx.lineTo(this.x-this.radius+this.radius/3*2, this.y+this.radius);
			this.ctx.lineTo(this.x, this.y+this.radius-this.radius/4);
			this.ctx.lineTo(this.x+this.radius/3, this.y+this.radius);
			this.ctx.lineTo(this.x+this.radius/3*2, this.y+this.radius-this.radius/4);

			this.ctx.lineTo(this.x+this.radius, this.y+this.radius);
			this.ctx.lineTo(this.x+this.radius, this.y);
		}
		else {
			this.ctx.lineTo(this.x-this.radius, this.y+this.radius-this.radius/4);
			this.ctx.lineTo(this.x-this.radius+this.radius/3, this.y+this.radius);
			this.ctx.lineTo(this.x-this.radius+this.radius/3*2, this.y+this.radius-this.radius/4);
			this.ctx.lineTo(this.x, this.y+this.radius);
			this.ctx.lineTo(this.x+this.radius/3, this.y+this.radius-this.radius/4);
			this.ctx.lineTo(this.x+this.radius/3*2, this.y+this.radius);
			this.ctx.lineTo(this.x+this.radius, this.y+this.radius-this.radius/4);
			this.ctx.lineTo(this.x+this.radius, this.y);
		}
		

		this.ctx.fill();
	}


	if(this.isWeak){

		if(this.isBlinking){
			this.ctx.fillStyle = "#f00";
			this.ctx.strokeStyle = "f00";
		}
		else{
			this.ctx.fillStyle = "white";
			this.ctx.strokeStyle = "white";
		}

		//eyes
		this.ctx.beginPath();//left eye
		this.ctx.arc(this.x-this.radius/2.5, this.y-this.radius/5, this.radius/5, 0, Math.PI*2, true); // white
		this.ctx.fill();

		this.ctx.beginPath(); // right eye
		this.ctx.arc(this.x+this.radius/2.5, this.y-this.radius/5, this.radius/5, 0, Math.PI*2, true); // white
		this.ctx.fill();

		//mouth
		this.ctx.beginPath();
		this.ctx.lineWidth=1;
		this.ctx.moveTo(this.x-this.radius+this.radius/5, this.y+this.radius/2);
		this.ctx.lineTo(this.x-this.radius+this.radius/3, this.y+this.radius/4);
		this.ctx.lineTo(this.x-this.radius+this.radius/3*2, this.y+this.radius/2);
		this.ctx.lineTo(this.x, this.y+this.radius/4);
		this.ctx.lineTo(this.x+this.radius/3, this.y+this.radius/2);
		this.ctx.lineTo(this.x+this.radius/3*2, this.y+this.radius/4);
		this.ctx.lineTo(this.x+this.radius-this.radius/5, this.y+this.radius/2);
		this.ctx.stroke();
	}
	else{
		// EYES
		this.ctx.fillStyle = "white"; //left eye
		this.ctx.beginPath();
		this.ctx.arc(this.x-this.radius/2.5, this.y-this.radius/5, this.radius/3, 0, Math.PI*2, true); // white
		this.ctx.fill();

		this.ctx.fillStyle = "white"; //right eye
		this.ctx.beginPath();
		this.ctx.arc(this.x+this.radius/2.5, this.y-this.radius/5, this.radius/3, 0, Math.PI*2, true); // white
		this.ctx.fill();


		switch(this.dir){

			case Game.Public.Constants.Direction.UP:
				this.ctx.fillStyle="black"; //left eyeball
				this.ctx.beginPath();
				this.ctx.arc(this.x-this.radius/3, this.y-this.radius/5-this.radius/6, this.radius/6, 0, Math.PI*2, true); //black
				this.ctx.fill();

				this.ctx.fillStyle="black"; //right eyeball
				this.ctx.beginPath();
				this.ctx.arc(this.x+this.radius/3, this.y-this.radius/5-this.radius/6, this.radius/6, 0, Math.PI*2, true); //black
				this.ctx.fill();
			break;

			case Game.Public.Constants.Direction.DOWN:
				this.ctx.fillStyle="black"; //left eyeball
				this.ctx.beginPath();
				this.ctx.arc(this.x-this.radius/3, this.y-this.radius/5+this.radius/6, this.radius/6, 0, Math.PI*2, true); //black
				this.ctx.fill();

				this.ctx.fillStyle="black"; //right eyeball
				this.ctx.beginPath();
				this.ctx.arc(this.x+this.radius/3, this.y-this.radius/5+this.radius/6, this.radius/6, 0, Math.PI*2, true); //black
				this.ctx.fill();
			break;

			case Game.Public.Constants.Direction.LEFT:
				this.ctx.fillStyle="black"; //left eyeball
				this.ctx.beginPath();
				this.ctx.arc(this.x-this.radius/3-this.radius/5, this.y-this.radius/5, this.radius/6, 0, Math.PI*2, true); //black
				this.ctx.fill();

				this.ctx.fillStyle="black"; //right eyeball
				this.ctx.beginPath();
				this.ctx.arc(this.x+this.radius/3-this.radius/15, this.y-this.radius/5, this.radius/6, 0, Math.PI*2, true); //black
				this.ctx.fill();
			break;

			case Game.Public.Constants.Direction.RIGHT:
				this.ctx.fillStyle="black"; //left eyeball
				this.ctx.beginPath();
				this.ctx.arc(this.x-this.radius/3+this.radius/15, this.y-this.radius/5, this.radius/6, 0, Math.PI*2, true); //black
				this.ctx.fill();

				this.ctx.fillStyle="black"; //right eyeball
				this.ctx.beginPath();
				this.ctx.arc(this.x+this.radius/3+this.radius/5, this.y-this.radius/5, this.radius/6, 0, Math.PI*2, true); //black
				this.ctx.fill();
			break;

		}

	}


	
};

Ghost.prototype.getRow = function() {
	return Game.Public.Utils.getRowIndex(this.y);
};

Ghost.prototype.getCol = function() {
	return Game.Public.Utils.getColIndex(this.x);
};

//move one step in the current direction if allowed
Ghost.prototype.moveOneStep = function() {
	// body...
	var newX =0;
	var newY =0;
	if(!Game.Public.Utils.canMove(this.x, this.y, this.dir)){
		return;
	}
	switch(this.dir){

		case Game.Public.Constants.Direction.UP:
		newY = this.y  - this.speed;
		if(newY - this.radius - Game.Public.Constants.WALL_WIDTH > 0){
			this.y = newY;
		}
		break;

		case Game.Public.Constants.Direction.DOWN:
		newY = this.y + this.speed;
		if(newY + this.radius + Game.Public.Constants.WALL_WIDTH < Game.Public.Constants.CANVAS_HEIGHT) {
			this.y = newY;

		}
		break;


		case Game.Public.Constants.Direction.LEFT:
		newX = this.x - this.speed;
		if(newX - this.radius - Game.Public.Constants.WALL_WIDTH > 0 ){
			this.x = newX;
		}
		break;

		case Game.Public.Constants.Direction.RIGHT:
		newX = this.x + this.speed;

		if(newX + this.radius + Game.Public.Constants.WALL_WIDTH < Game.Public.Constants.CANVAS_WIDTH){
			this.x = newX;
		}
		break;
		
		default:
		break;
	}
};

//make an 180-degree turn
Ghost.prototype.turnBack = function() {
	this.dir = Game.Public.Utils.oppositeDir(this.dir);
};

//try to turn(if necessary) and move the ghost
Ghost.prototype.move = function() {

	this.isMoving = !this.isMoving;//so the ghost looks like it's moving
	if(this.isWeak){
		//if weak, reduce speed and make an immediate turn.
		//Ghost starts making random moves until turning back to normal
		this.speed = speed/2;
		if(weakCounter === WEAK_DURATION){
			this.dir = Game.Public.Utils.oppositeDir(this.dir);
		}
		if(Game.Public.Utils.onGridCenter(this.x, this.y) === false){
			this.moveOneStep();
		}
		else{
			var currGrid = maze[Game.Public.Utils.getRowIndex(this.y)][Game.Public.Utils.getColIndex(this.x)];
			if(currGrid.gridType === LEFT_TOP_RIGHT){
				this.dir = Game.Public.Constants.Direction.DOWN;
				this.moveOneStep();
			}
			else if(currGrid.gridType === TOP_RIGHT_BOTTOM){
				this.dir = Game.Public.Constants.Direction.LEFT;
				this.moveOneStep();
			}
			else if(currGrid.gridType === RIGHT_BOTTOM_LEFT){
				this.dir = Game.Public.Constants.Direction.UP;
				this.moveOneStep();
			}
			else if(currGrid.gridType === BOTTOM_LEFT_TOP){
				this.dir = Game.Public.Constants.Direction.RIGHT;
				this.moveOneStep();
			}
			else{
				this.randomMove();
			}
		}

		this.stepCounter++;
	}
	else{
		//normal ghost
		if(this.stepCounter != 0 && this.stepCounter % 2 !=0){
			this.speed = speed/2;
			this.stepCounter = 0;
		}
		else{
			this.speed = speed;
		}
		if(Game.Public.Utils.onGridCenter(this.x, this.y) === false){
			this.moveOneStep();
		}
		else{
			// on grid center
			//first check if dead end
			var currGrid = maze[Game.Public.Utils.getRowIndex(this.y)][Game.Public.Utils.getColIndex(this.x)];
			if(currGrid.gridType === LEFT_TOP_RIGHT){
				this.dir = Game.Public.Constants.Direction.DOWN;
				this.moveOneStep();
			}
			else if(currGrid.gridType === TOP_RIGHT_BOTTOM){
				this.dir = Game.Public.Constants.Direction.LEFT;
				this.moveOneStep();
			}
			else if(currGrid.gridType === RIGHT_BOTTOM_LEFT){
				this.dir = Game.Public.Constants.Direction.UP;
				this.moveOneStep();
			}
			else if(currGrid.gridType === BOTTOM_LEFT_TOP){
				this.dir = Game.Public.Constants.Direction.RIGHT;
				this.moveOneStep();
			}
			else{
				switch(this.color){
					case Game.Public.Constants.Color.RED:
					//blinky
					this.blinkyMove();
					break;

					case Game.Public.Constants.Color.CYAN:
					case Game.Public.Constants.Color.ORANGE:
					//inky
					this.inkyMove();
					break;

					case Game.Public.Constants.Color.PINK:
					//pinky
					this.pinkyMove();
					break;
				}
			}
		}
	}

};

//blinky always chooses the tile that will make it closest to pacman
Ghost.prototype.blinkyMove = function() {
	this.moveToPacman(true);
};

//pinky chooses the tile that is 4 steps ahead of pacman
Ghost.prototype.pinkyMove = function() {
	this.moveToPacman(false);
};

//inky is unpredictable, makes random move
Ghost.prototype.inkyMove = function() {
	this.randomMove();
};

Ghost.prototype.moveToPacman = function(targetPacman) {
	var veryLargeDistance = Game.Public.Constants.CANVAS_WIDTH*Game.Public.Constants.CANVAS_HEIGHT;
	var leftDist, rightDist, upDist, downDist;
	var currDir = this.dir;
	var minDist = veryLargeDistance;
	//get distance if moved to left
	if(currDir === Game.Public.Constants.Direction.RIGHT || !Game.Public.Utils.canMove(this.x, this.y, Game.Public.Constants.Direction.LEFT)){
		leftDist = veryLargeDistance;
	}
	else{
		leftDist = this.getTestDistance(Game.Public.Constants.Direction.LEFT,targetPacman);
	}

	//get distance to right
	if(currDir === Game.Public.Constants.Direction.LEFT || !Game.Public.Utils.canMove(this.x, this.y, Game.Public.Constants.Direction.RIGHT)){
		rightDist = veryLargeDistance;
	}
	else{
		rightDist = this.getTestDistance(Game.Public.Constants.Direction.RIGHT,targetPacman);
	}

	//get distance - up
	if(currDir === Game.Public.Constants.Direction.DOWN || !Game.Public.Utils.canMove(this.x, this.y, Game.Public.Constants.Direction.UP)){
		upDist = veryLargeDistance;
	}
	else{
		upDist = this.getTestDistance(Game.Public.Constants.Direction.UP,targetPacman);
	}

	//get distance - down
	if(currDir === Game.Public.Constants.Direction.UP || !Game.Public.Utils.canMove(this.x, this.y, Game.Public.Constants.Direction.DOWN)){
		downDist = veryLargeDistance;
	}
	else{
		downDist = this.getTestDistance(Game.Public.Constants.Direction.DOWN, targetPacman);
	}
	this.dir = currDir;
	minDist = Math.min(Math.min(leftDist, rightDist), Math.min(upDist, downDist));
	switch(minDist){
		case leftDist:
		this.dir = Game.Public.Constants.Direction.LEFT;
		break;

		case rightDist:
		this.dir = Game.Public.Constants.Direction.RIGHT;
		break;

		case upDist:
		this.dir = Game.Public.Constants.Direction.UP;
		break;

		case downDist:
		this.dir = Game.Public.Constants.Direction.DOWN;
		break;
	}
	this.moveOneStep();
};

//get the distance from this ghost to pacman as if it moved one step in the given direction
Ghost.prototype.getTestDistance = function(dir, targetPacman) {
	var toReturn = 0;
	this.dir = dir;
	this.moveOneStep();
	if(targetPacman){
		toReturn = Math.sqrt(Math.pow( (this.x - Character.mrPacman.x)  ,2)+Math.pow( this.y -Character.mrPacman.y,2));
	}
	else{
		switch(Character.mrPacman.dir){
			case Game.Public.Constants.Direction.LEFT:
			toReturn = Math.sqrt(Math.pow( (this.x - (Character.mrPacman.x - 4*Game.Public.Constants.GRID_WIDTH))  ,2)+Math.pow( this.y -Character.mrPacman.y,2));
			break;

			case Game.Public.Constants.Direction.RIGHT:
			toReturn = Math.sqrt(Math.pow( (this.x - (Character.mrPacman.x + 4*Game.Public.Constants.GRID_WIDTH))  ,2)+Math.pow( this.y -Character.mrPacman.y,2));
			break;

			case Game.Public.Constants.Direction.UP:
			toReturn = Math.sqrt(Math.pow( (this.x - Character.mrPacman.x)  ,2)+Math.pow( this.y - (Character.mrPacman.y - 4*Game.Public.Constants.GRID_HEIGHT),2));
			break;

			case Game.Public.Constants.Direction.DOWN:
			toReturn = Math.sqrt(Math.pow( (this.x - Character.mrPacman.x)  ,2)+Math.pow( this.y - (Character.mrPacman.y  + 4*Game.Public.Constants.GRID_HEIGHT),2));
			break;

			default:
			toReturn = Math.sqrt(Math.pow( (this.x - Character.mrPacman.x)  ,2)+Math.pow( this.y -Character.mrPacman.y,2));
			break;

		}
	}
	this.turnBack();
	this.moveOneStep();
	return toReturn;
};

//make random move at intersection
Ghost.prototype.randomMove = function() {
	var nextDir =  parseInt(Math.random()*4)+1;
	while(true){
		if( nextDir != Game.Public.Utils.oppositeDir(this.dir) 
			&& Game.Public.Utils.canMove(this.x, this.y, nextDir)){
			break;
		}
		nextDir =  parseInt(Math.random()*4)+1;
	}

	this.dir = nextDir;
	this.moveOneStep();
};
