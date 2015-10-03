//////////////////////////////////////////////////////
// Group members: Zi Wang (ziw), Bingying Xia(bxia) //
//////////////////////////////////////////////////////

function Pacman(ctx, xCord, yCord, direction){
    this.ctx = ctx;
	this.x = xCord;
	this.y = yCord;
	this.dir = direction;
	this.nextDir = undefined; //the direction to turn at next available turning point
	this.radius = Game.Public.Constants.Radius.PACMAN;
	this.mouthOpen = true;
}


Pacman.prototype.draw = function(color) {
	if (color == undefined){
		this.ctx.fillStyle = Game.Public.Constants.Color.PACMAN;
	}
	else{
		this.ctx.fillStyle = color;
	}
	this.ctx.beginPath();

	if (!this.mouthOpen){
		switch(this.dir){
			case Game.Public.Constants.Direction.UP:
			this.ctx.arc(this.x, this.y, this.radius, 2*Math.PI-Math.PI*11/18, 2*Math.PI-Math.PI*7/18, true);
			break;

			case Game.Public.Constants.Direction.DOWN:
			this.ctx.arc(this.x, this.y, this.radius, 2*Math.PI-Math.PI*29/18, 2*Math.PI-Math.PI*25/18, true);
			break;

			case Game.Public.Constants.Direction.LEFT:
			this.ctx.arc(this.x, this.y, this.radius, 2*Math.PI-Math.PI*10/9, 2*Math.PI-Math.PI*8/9, true);
			break;

			case Game.Public.Constants.Direction.RIGHT:
			this.ctx.arc(this.x, this.y, this.radius, 2*Math.PI-Math.PI/9, 2*Math.PI-Math.PI*17/9, true);
			break;

			default:
			break;
		}
	}
	else {
		switch(this.dir){
			case Game.Public.Constants.Direction.UP:
			this.ctx.arc(this.x, this.y, this.radius, 2*Math.PI-Math.PI*7/9, 2*Math.PI-Math.PI*2/9, true);
			break;

			case Game.Public.Constants.Direction.DOWN:
			this.ctx.arc(this.x, this.y, this.radius, 2*Math.PI-Math.PI*16/9, 2*Math.PI-Math.PI*11/9, true);
			break;

			case Game.Public.Constants.Direction.LEFT:
			this.ctx.arc(this.x, this.y, this.radius, 2*Math.PI-Math.PI*23/18, 2*Math.PI-Math.PI*13/18, true);
			break;

			case Game.Public.Constants.Direction.RIGHT:
			this.ctx.arc(this.x, this.y, this.radius, 2*Math.PI-Math.PI*5/18, 2*Math.PI-Math.PI*31/18, true);
			break;

			default:
			break;

		}
	}

	this.ctx.lineTo(this.x, this.y);
	this.ctx.fill();
};

//get the row index of current location
Pacman.prototype.getRow = function() {
	return Game.Public.Utils.getRowIndex(this.y);
};

//get the col index of current location
Pacman.prototype.getCol = function() {
	return Game.Public.Utils.getColIndex(this.x);
};

//return if pacman can move with current direction & tile
Pacman.prototype.canMove = function(dir) {
	return Game.Public.Utils.canMove(this.x, this.y, dir);
};

//try to turn(if necessary) and move the pacman.
Pacman.prototype.move = function() {
	if(Game.Public.Utils.onGridCenter(this.x, this.y) === false){
		//not on a grid center
		if(this.nextDir != undefined &&  (
			(this.dir === Game.Public.Constants.Direction.UP && this.nextDir === Game.Public.Constants.Direction.DOWN )||
			(this.dir === Game.Public.Constants.Direction.DOWN && this.nextDir === Game.Public.Constants.Direction.UP) ||
			(this.dir === Game.Public.Constants.Direction.LEFT && this.nextDir === Game.Public.Constants.Direction.RIGHT) ||
 			(this.dir === Game.Public.Constants.Direction.RIGHT && this.nextDir === Game.Public.Constants.Direction.LEFT)
			))
		{
			this.dir = this.nextDir;
			this.nextDir = undefined;
		}

		this.moveOneStep();

		return;
	}
	else{
		//on grid center. change direction if needed

		if(this.nextDir != undefined && this.canMove(this.nextDir)){
			this.dir = this.nextDir;
			this.nextDir = undefined;
			this.moveOneStep();
		}
		else{
			//check if pacman can keep moving
			if(this.canMove(this.dir)){
				this.moveOneStep();
			}
		}	
	}
};

//move one step in the current direction if allowed
Pacman.prototype.moveOneStep = function() {
	var newX =0;
	var newY =0;
	if(!Game.Public.Utils.canMove(this.x, this.y, this.dir)){
		return;
	}
	switch(this.dir){

		case Game.Public.Constants.Direction.UP:
		newY = this.y  - speed;
		if(newY - this.radius - Game.Public.Constants.WALL_WIDTH > 0){
			this.y = newY;
			this.mouthOpen = ! this.mouthOpen;
		}
		break;

		case Game.Public.Constants.Direction.DOWN:
		newY = this.y + speed;
		if(newY + this.radius + Game.Public.Constants.WALL_WIDTH < Game.Public.Constants.CANVAS_HEIGHT) {
			this.y = newY;
			this.mouthOpen = ! this.mouthOpen;

		}
		break;


		case Game.Public.Constants.Direction.LEFT:
		newX = this.x - speed;
		if(newX - this.radius - Game.Public.Constants.WALL_WIDTH > 0 ){
			this.x = newX;
			this.mouthOpen = ! this.mouthOpen;
		}
		break;

		case Game.Public.Constants.Direction.RIGHT:
		newX = this.x + speed;

		if(newX + this.radius + Game.Public.Constants.WALL_WIDTH < Game.Public.Constants.CANVAS_WIDTH){
			this.x = newX;
			this.mouthOpen = ! this.mouthOpen;
		}
		break;
		
		default:
		break;
	}
};





