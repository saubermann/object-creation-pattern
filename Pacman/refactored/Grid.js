//////////////////////////////////////////////////////
// Group members: Zi Wang (ziw), Bingying Xia(bxia) //
//////////////////////////////////////////////////////


var id = -1;

//wall cases
var CROSS_RD = -1;//no wall
var LEFT_ONLY = 0;
var TOP_ONLY = 1;
var RIGHT_ONLY = 2;
var BOTTOM_ONLY = 3;

var LEFT_RIGHT = 4;
var LEFT_TOP = 5;
var LEFT_BOTTOM = 6;

var RIGHT_TOP = 7;
var RIGHT_BOTTOM = 8;
var TOP_BOTTOM = 9;

var BOTTOM_LEFT_TOP = 10;
var LEFT_TOP_RIGHT = 11;
var TOP_RIGHT_BOTTOM = 12;
var RIGHT_BOTTOM_LEFT = 13;

var EMPTY_GRID = 14;
var CLOSED_GRID = 15;



function Grid (ctx, xCord, yCord, gridType, beanType) {
    this.ctx = ctx;
	this.x = xCord;
	this.y = yCord;
	this.gridType = gridType===undefined? EMPTY_GRID : gridType;
	this.beanType = beanType;
}

Grid.prototype.getRow = function() {
	return Game.Public.Utils.getRowIndex(this.y);
};

Grid.prototype.getCol = function() {
	return Game.Public.Utils.getColIndex(this.x);
};

Grid.prototype.hasBean = true;


Grid.prototype.toString = function() {
	return "Grid ("+this.x+","+this.y+") - Grid Type: " + this.gridType;
};



Grid.prototype.draw = function() {
	this.ctx.fillStyle = Game.Public.Constants.Color.BG;
	this.ctx.fillRect(this.x, this.y, Game.Public.Constants.GRID_WIDTH, Game.Public.Constants.GRID_HEIGHT);
	var gridType = this.gridType	;
	if(gridType === undefined || gridType === EMPTY_GRID){
		this.drawBean();
		return;
	}

	switch(gridType){

		case LEFT_ONLY:
		this.addLeftEdge();
		break;

		case RIGHT_ONLY:
		this.addRightEdge();
		break;

		case TOP_ONLY:
		this.addTopEdge();
		break;

		case BOTTOM_ONLY:
		this.addBottomEdge();
		break;

		case LEFT_RIGHT:
		this.addLeftEdge().addRightEdge();
		break;

		case LEFT_TOP:
		this.addLeftEdge().addTopEdge();
		break;

		case LEFT_BOTTOM:
		this.addLeftEdge().addBottomEdge();
		break;

		case RIGHT_TOP:
		this.addRightEdge().addTopEdge();
		break;

		case RIGHT_BOTTOM:
		this.addRightEdge().addBottomEdge();
		break;

		case TOP_BOTTOM:
		this.addTopEdge().addBottomEdge();
		break;

		case CROSS_RD:
		this.makeCrossRoad();
		break;

		case LEFT_TOP_RIGHT:
		this.addLeftEdge().addTopEdge().addRightEdge();
		break;

		case TOP_RIGHT_BOTTOM:
		this.addTopEdge().addRightEdge().addBottomEdge();
		break;

		case RIGHT_BOTTOM_LEFT:
		this.addRightEdge().addBottomEdge().addLeftEdge();
		break;

		case BOTTOM_LEFT_TOP:
		this.addBottomEdge().addLeftEdge().addTopEdge();
		break;

		case CLOSED_GRID:
		this.addLeftEdge().addTopEdge().addBottomEdge().addRightEdge();
		break;

		default:
		break;
	}
	this.drawBean();	
};

Grid.prototype.addLeftEdge = function() {
	this.ctx.fillStyle = Game.Public.Constants.Color.BORDER;
	this.ctx.fillRect(this.x, this.y, Game.Public.Constants.WALL_WIDTH, Game.Public.Constants.GRID_HEIGHT);
	return this;
};

Grid.prototype.addRightEdge = function() {
	this.ctx.fillStyle = Game.Public.Constants.Color.BORDER;
	this.ctx.fillRect(this.x+Game.Public.Constants.GRID_WIDTH - Game.Public.Constants.WALL_WIDTH , this.y, Game.Public.Constants.WALL_WIDTH , Game.Public.Constants.GRID_HEIGHT);
	return this;
};

Grid.prototype.addTopEdge = function() {
	this.ctx.fillStyle = Game.Public.Constants.Color.BORDER;
	this.ctx.fillRect(this.x, this.y, Game.Public.Constants.GRID_WIDTH, Game.Public.Constants.WALL_WIDTH);
	return this;
};

Grid.prototype.addBottomEdge = function() {
	this.ctx.fillStyle = Game.Public.Constants.Color.BORDER;
	this.ctx.fillRect(this.x, this.y + Game.Public.Constants.GRID_HEIGHT - Game.Public.Constants.WALL_WIDTH, Game.Public.Constants.GRID_WIDTH, Game.Public.Constants.WALL_WIDTH);
	return this;
};

Grid.prototype.makeCrossRoad = function() {
	this.ctx.fillStyle = Game.Public.Constants.Color.BORDER;
	this.ctx.fillRect(this.x, this.y, Game.Public.Constants.WALL_WIDTH, Game.Public.Constants.WALL_WIDTH);
	this.ctx.fillRect(this.x + Game.Public.Constants.GRID_WIDTH - Game.Public.Constants.WALL_WIDTH, this.y, Game.Public.Constants.WALL_WIDTH, Game.Public.Constants.WALL_WIDTH);
	this.ctx.fillRect(this.x, this.y + Game.Public.Constants.GRID_HEIGHT - Game.Public.Constants.WALL_WIDTH, Game.Public.Constants.WALL_WIDTH, Game.Public.Constants.WALL_WIDTH);
	this.ctx.fillRect(this.x + Game.Public.Constants.GRID_WIDTH - Game.Public.Constants.WALL_WIDTH, this.y + Game.Public.Constants.GRID_HEIGHT - Game.Public.Constants.WALL_WIDTH, Game.Public.Constants.WALL_WIDTH, Game.Public.Constants.WALL_WIDTH);
	return this;
};


//draw a bean at the center of this grid
Grid.prototype.drawBean = function() {
	var beanType = this.beanType;
	var centerX = this.x + Game.Public.Constants.GRID_WIDTH/2;
	var centerY = this.y + Game.Public.Constants.GRID_HEIGHT/2;

	this.ctx.fillStyle = Game.Public.Constants.Color.BEAN;
	if(beanType === undefined){
		return;
	}

	if(beanType === NORMAL_BEAN){
		circle(this.ctx, centerX, centerY, Game.Public.Constants.Radius.NORMAL_BEAN);
	}
	else if(beanType === POWER_BEAN){
		circle(this.ctx, centerX, centerY, Game.Public.Constants.Radius.POWER_BEAN);
	}
	else{
		//unkwon bean type
		return;
	}

};

//draw a circle
circle = function(ctx, cx, cy, radius) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);
    ctx.fill();
};