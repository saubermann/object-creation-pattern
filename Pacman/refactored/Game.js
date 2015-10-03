//////////////////////////////////////////////////////
// Group members: Zi Wang (ziw), Bingying Xia(bxia) //
//////////////////////////////////////////////////////
Game.Public = {}

Game.Public.Constants = {
    CANVAS_WIDTH: 510,
    CANVAS_HEIGHT: 510,
    // game grid
    GRID_WIDTH: 30,
    GRID_HEIGHT: 30,
    WALL_WIDTH: 3,
    // start location of pacman
    pacmanStartLoc: [4,9],
    // colors for UI & Pacman
    Color: {
        RED: "red",
        PINK: "#ff9cce",
        CYAN: "#00ffde",
        ORANGE: "#ffb847",
        WEAK: "#0031ff",
        BLINKING: "white",
        BG: "black",
        BORDER: "blue",
        BEAN: "white",
        PACMAN: "yellow"
    },
    // size of sprites
    Radius: {
        NORMAL_BEAN: 2,
        POWER_BEAN: 5,
        PACMAN: 9,
        GHOST: 9
    },
    // directions
    Direction: {
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4
    }
}

Game.Public.Utils = {
    getRowIndex: function(yCord) {
        if(yCord === undefined){
            return -1;//err
        }
        return parseInt(yCord/Game.Public.Constants.GRID_HEIGHT);
    },
    getColIndex: function(xCord) {
        if(xCord === undefined){
            return -1;//err
        }
        return parseInt(xCord/Game.Public.Constants.GRID_WIDTH);
    },
    onGridCenter: function(x,y) {
        return this.xOnGridCenter(y) && this.yOnGridCenter(x);
    },
    xOnGridCenter: function(y) {
        return ((y - Game.Public.Constants.GRID_WIDTH/2) % Game.Public.Constants.GRID_WIDTH) === 0;
    },
    yOnGridCenter: function(x) {
        return ((x - Game.Public.Constants.GRID_HEIGHT/2) % Game.Public.Constants.GRID_HEIGHT) === 0;
    },
    //see if sprite can move one more step at the given (x,y) facing the given direction
    canMove: function(x,y,dir) {
        if(!this.onGridCenter(x,y)){
            return true;
        }
        var canMove = false;
        var currGrid = maze[this.getRowIndex(y)][this.getColIndex(x)];
        var gridType = currGrid.gridType;
        switch(dir){
            case Game.Public.Constants.Direction.UP:
                if(gridType != LEFT_TOP && gridType != RIGHT_TOP && gridType != TOP_BOTTOM
                    && gridType != TOP_ONLY && gridType!= LEFT_TOP_RIGHT
                    && gridType != TOP_RIGHT_BOTTOM && gridType!= BOTTOM_LEFT_TOP){
                    canMove = true;
                }
                break;

            case Game.Public.Constants.Direction.DOWN:
                if(gridType != LEFT_BOTTOM && gridType != TOP_BOTTOM && gridType != RIGHT_BOTTOM
                    && gridType != BOTTOM_ONLY && gridType!= RIGHT_BOTTOM_LEFT
                    && gridType != BOTTOM_LEFT_TOP && gridType!= TOP_RIGHT_BOTTOM){
                    canMove = true;
                }
                break;

            case Game.Public.Constants.Direction.LEFT:
                if(gridType != LEFT_BOTTOM && gridType != LEFT_TOP && gridType != LEFT_ONLY
                    && gridType != LEFT_RIGHT && gridType!= LEFT_TOP_RIGHT
                    && gridType != BOTTOM_LEFT_TOP && gridType!= RIGHT_BOTTOM_LEFT){
                    canMove = true;
                }
                break;

            case Game.Public.Constants.Direction.RIGHT:
                if(gridType != RIGHT_BOTTOM && gridType != RIGHT_TOP && gridType != RIGHT_ONLY
                    && gridType != LEFT_RIGHT && gridType!= RIGHT_BOTTOM_LEFT
                    && gridType != TOP_RIGHT_BOTTOM && gridType != LEFT_TOP_RIGHT){
                    canMove = true;
                }
                break;
            default:
                break;


        }
        return canMove;
    },
    //get opposite direction
    oppositeDir: function(dir) {
        switch(dir){
            case Game.Public.Constants.Direction.UP:
                return Game.Public.Constants.Direction.DOWN;
                break;

            case Game.Public.Constants.Direction.DOWN:
                return Game.Public.Constants.Direction.UP;
                break;

            case Game.Public.Constants.Direction.LEFT:
                return Game.Public.Constants.Direction.RIGHT;
                break;

            case Game.Public.Constants.Direction.RIGHT:
                return Game.Public.Constants.Direction.LEFT;
                break;

            default:
                return -1;//err
        }
    }
}

//spirtes instances
var Character = {
    welcomePacman: "",
    welcomeBlinky: "",
    welcomeInky: "",
    mrPacman: "",
    blinky: "",
    inky: "",
    pinky: "",
    clyde: "",
    ghosts: ""
}


function Game(canvasID){
    var canvasID = canvasID,
        canvas = document.getElementById(canvasID),
        ctx = canvas.getContext("2d"),
        //show welcome screen
        welcomeScreen = function(){
            gameOn = false;
            gamePaused = false;
            // welcome text
            ctx.fillStyle = "white";
            ctx.font = "80px monospace";
            ctx.textAlign = "center";
            ctx.fillText("PACMAN", Game.Public.Constants.CANVAS_WIDTH/2, 170);
            ctx.font = "20px monospace";
            ctx.fillText("Press s to start", Game.Public.Constants.CANVAS_WIDTH/2, 220);
            ctx.font = "14px monospace";
            ctx.fillText("DEVELOPED BY: ZI WANG, BINGYING XIA", Game.Public.Constants.CANVAS_WIDTH/2 , Game.Public.Constants.CANVAS_HEIGHT/20*19);

            Character.welcomePacman = new Pacman(ctx, Game.Public.Constants.CANVAS_WIDTH/5, Game.Public.Constants.CANVAS_HEIGHT/3*2, Game.Public.Constants.Direction.RIGHT);
            Character.welcomePacman.radius = 30;
            Character.welcomePacman.draw();

            Character.welcomeBlinky = new Ghost(ctx, Game.Public.Constants.CANVAS_WIDTH/5*3.3, Game.Public.Constants.CANVAS_HEIGHT/3*2, Game.Public.Constants.Color.RED, Game.Public.Constants.Direction.LEFT);
            Character.welcomeBlinky.radius = 30;
            Character.welcomeBlinky.draw();

            Character.welcomeInky = new Ghost(ctx, Game.Public.Constants.CANVAS_WIDTH/5*4, Game.Public.Constants.CANVAS_HEIGHT/3*2, Game.Public.Constants.Color.CYAN, Game.Public.Constants.Direction.RIGHT);
            Character.welcomeInky.radius = 30;
            Character.welcomeInky.draw();
            intervalId = setInterval(updateWelcomeScreen, timerDelay*2);
        },
        initFields = function(){
            // body...
            for (var i=6; i<10; i++){
                ghostHouse[ghostHouseIndex]=[i,9];
                ghostHouseIndex++;
            }
            //fill up staticGrids[]
            for (var i=0; i<2; i++){
                for (var j=8; j<17; j++){
                    staticGrids[staticGridsIndex]=[i,j];
                    staticGridsIndex++;
                }
            }
            for (var i=9; i<17; i++){
                for (var j=0; j<4; j++){
                    staticGrids[staticGridsIndex]=[i,j];
                    staticGridsIndex++;
                }
            }
            for (var i=2; i<6; i++){
                for (var j=14; j<17; j++){
                    staticGrids[staticGridsIndex]=[i,j];
                    staticGridsIndex++;
                }
            }
            //fill up noBean[]
            for(var i=0; i<2; i++){
                for(var j=8; j<17; j++){
                    noBean[noBeanIndex]=[i,j];
                    noBeanIndex++;
                }
            }
            for(var i=2; i<6; i++){
                for(var j=14; j<17; j++){
                    noBean[noBeanIndex]=[i,j];
                    noBeanIndex++;
                }
            }
            for(var i=9; i<17; i++){
                for(var j=0; j<4; j++){
                    noBean[noBeanIndex]=[i,j];
                    noBeanIndex++;
                }
            }
            for (var i=1; i<6; i++){
                noBean[noBeanIndex]=[i,2];
                noBeanIndex++;
            }
            for(var i=1; i<4; i+=2){
                for(var j=4; j<7; j++){
                    noBean[noBeanIndex]=[i,j];
                    noBeanIndex++;
                }
            }
            for (var j=8; j<13; j++){
                noBean[noBeanIndex]=[3,j];
                noBeanIndex++;
            }
            for (var j=1; j<7; j++){
                noBean[noBeanIndex]=[7,j];
                noBeanIndex++;
            }
            for (var i=5; i<10; i++){
                for(var j=8; j<11; j++){
                    noBean[noBeanIndex]=[i,j];
                    noBeanIndex++;
                }
            }
            for (var j=12; j<16; j++){
                noBean[noBeanIndex]=[7,j];
                noBeanIndex++;
            }
            for (var j=12; j<16; j++){
                noBean[noBeanIndex]=[9,j];
                noBeanIndex++;
            }
            for(var i=11; i<16; i+=2){
                for(var j=5; j<8; j++){
                    noBean[noBeanIndex]=[i,j];
                    noBeanIndex++;
                }
            }
            for(var i=11; i<16; i+=2){
                for(var j=9; j<12; j++){
                    noBean[noBeanIndex]=[i,j];
                    noBeanIndex++;
                }
            }
            for(var j=13; j<16; j++){
                noBean[noBeanIndex]=[11, j];
                noBeanIndex++;
            }
            for(var i=12; i<16; i++){
                noBean[noBeanIndex]=[i, 15];
                noBeanIndex++;
            }
            for(var i=13; i<17; i++){
                noBean[noBeanIndex]=[i, 13];
                noBeanIndex++;
            }
        },
        initCanvas = function (width, height){
            if(width===undefined || !(width instanceof Number)){
                width = Game.Public.Constants.CANVAS_WIDTH;
            }
            if(height===undefined || !(height instanceof Number)){
                height = Game.Public.Constants.CANVAS_HEIGHT;
            }

            ctx.fillStyle = "black";
            ctx.fillRect(0,0,Game.Public.Constants.CANVAS_WIDTH,Game.Public.Constants.CANVAS_HEIGHT);
        },
        //listen to keyDown event
        onKeyDown = function  (event) {
            var keycode = event.keyCode;
            var pauseCode = 81; //q to pause
            var continueCode = 69; //e to resume
            var restartCode = 82; //r to restart
            var godModeCode = 71; //g to enter god mode

            // wasd
            var wCode = 87;
            var aCode = 65;
            var sCode = 83;
            var dCode = 68;
            //arrow keys
            var leftCode = 37;
            var upCode = 38;
            var rightCode = 39;
            var downCode = 40;

            //start game
            if(!gameOn){
                if(keycode === sCode){
                    clearInterval(intervalId);
                    gameOn = true;
                    gamePaused = false;
                    initMaze();
                    run();
                    return;
                }
                else if(keycode === godModeCode){
                    clearInterval(intervalId);
                    ghosts = [];
                    gameOn = true;
                    gamePaused = false;
                    initMaze();
                    run(true);
                    return;
                }
            }
            else{
                //pause game
                if(keycode === pauseCode && !gamePaused){
                    clearInterval(intervalId);
                    gamePaused = true;
                    return;
                }

                //resume game
                if(keycode === continueCode && gamePaused){
                    intervalId = setInterval(updateCanvas, timerDelay);
                    gamePaused = false;
                    return;
                }

                //restart game
                if( keycode === restartCode && restartTimer > 0) {
                    //can't restart game if a game was just refreshed.
                    restartTimer = 0;
                    clearInterval(intervalId);
                    gameOn = true;
                    gamePaused = false;
                    score = 0;
                    life = MAX_LIFE;
                    beansLeft = MAX_BEANS;
                    initMaze();
                    run();
                }

                //4-way controls
                switch(keycode){
                    case upCode:
                    case wCode:
                        Character.mrPacman.nextDir = Character.mrPacman.dir=== Game.Public.Constants.Direction.UP ? undefined: Game.Public.Constants.Direction.UP;
                        break;

                    case rightCode:
                    case dCode:
                        Character.mrPacman.nextDir = Character.mrPacman.dir=== Game.Public.Constants.Direction.RIGHT? undefined : Game.Public.Constants.Direction.RIGHT;
                        break;

                    case leftCode:
                    case aCode:
                        Character.mrPacman.nextDir = Character.mrPacman.dir === Game.Public.Constants.Direction.LEFT? undefined : Game.Public.Constants.Direction.LEFT;
                        break;

                    case downCode:
                    case sCode:
                        Character.mrPacman.nextDir = Character.mrPacman.dir === Game.Public.Constants.Direction.DOWN? undefined : Game.Public.Constants.Direction.DOWN;
                        break;

                    default:
                        break;

                }
            }
        },
        //run the Game. Create mrPacman and 4 ghosts. Reset their positions.
         run = function(isGodMode) {
            showScore();

             Character.mrPacman = new Pacman(ctx, Game.Public.Constants.pacmanStartLoc[1]*Game.Public.Constants.GRID_WIDTH + Game.Public.Constants.GRID_WIDTH/2, Game.Public.Constants.pacmanStartLoc[0]*Game.Public.Constants.GRID_HEIGHT + Game.Public.Constants.GRID_HEIGHT/2, Game.Public.Constants.Direction.RIGHT);
            if(isGodMode===undefined || !isGodMode){
                Character.blinky = new Ghost(ctx, 0,0, Game.Public.Constants.Color.RED, Game.Public.Constants.Direction.DOWN);
                Character.inky = new Ghost(ctx, 0,0, Game.Public.Constants.Color.CYAN, Game.Public.Constants.Direction.DOWN);
                Character.pinky = new Ghost(ctx, 0,0, Game.Public.Constants.Color.PINK, Game.Public.Constants.Direction.DOWN);
                Character.clyde = new Ghost(ctx, 0,0, Game.Public.Constants.Color.ORANGE, Game.Public.Constants.Direction.DOWN);

                Character.blinky.toGhostHouse();
                Character.inky.toGhostHouse();
                Character.pinky.toGhostHouse();
                Character.clyde.toGhostHouse();

                ghosts = [Character.blinky, Character.inky, Character.pinky, Character.clyde];


                Character.inky.draw();
                Character.blinky.draw();
                Character.pinky.draw();
                Character.clyde.draw();
            }
            else{
                ghosts = [];
            }
            showLives();
            printInstruction();

            Character.mrPacman.draw();
            countDown();
         },
         // draw maze, print instruction on lower-left corner, show lives on top-right corner
         initMaze = function(){
            for(var i=0; i<maze.length; i++){
                var oneRow = new Array(Game.Public.Constants.CANVAS_WIDTH/Game.Public.Constants.GRID_WIDTH);
                maze[i] = oneRow;
            }

            // draw maze with full beans
            for( var row = 0; row < Game.Public.Constants.CANVAS_HEIGHT/Game.Public.Constants.GRID_HEIGHT; row++){
                for(var col = 0; col < Game.Public.Constants.CANVAS_WIDTH/Game.Public.Constants.GRID_WIDTH; col++){
                    var beanType = NORMAL_BEAN;
                    var newGrid = new Grid(ctx, col*Game.Public.Constants.GRID_WIDTH,row*Game.Public.Constants.GRID_HEIGHT , mazeContent[row][col],beanType);

                    maze[row][col] = newGrid;
                    newGrid.draw();
                }
            }

            //overwrite beans that shouldn't ecist
            for(var i=0; i<noBean.length; i++){
                var x = noBean[i][0];
                var y = noBean[i][1];
                maze[x][y].beanType = undefined;
                maze[x][y].draw();
            }

            // draw power beans
            for(var i=0; i<powerBeans.length;i++){
                var x = powerBeans[i][0];
                var y = powerBeans[i][1];
                maze[x][y].beanType = POWER_BEAN;
                maze[x][y].draw();
            }
         },
        /*====================Util Methods================*/
        sleep = function(ms)
        {
            var dt = new Date();
            dt.setTime(dt.getTime() + ms);
            while (new Date().getTime() < dt.getTime());
        },
        fixGrids = function(x, y) {
            var row = Game.Public.Utils.getRowIndex(y);
            var col = Game.Public.Utils.getColIndex(x);

            if(Game.Public.Utils.xOnGridCenter(y)){
                maze[row][col].draw();
                if(col+1 < maze.length && !staticArrayContains([row, col+1])){
                    maze[row][col+1].draw();
                }
                if(col-1 >= 0 && !staticArrayContains([row, col-1])){
                    maze[row][col-1].draw();
                }
            }
            else if(Game.Public.Utils.yOnGridCenter(x)){
                maze[row][col].draw();
                if(row+1 < maze.length  && !staticArrayContains([row+1, col])){
                    maze[row+1][col].draw();
                }
                if(row-1 >=0 && !staticArrayContains([row-1,col]) ){
                    maze[row-1][col].draw();
                }
            }
        },
        staticArrayContains = function(cord) {
            var x = cord[0];
            var y = cord[1];
            for(var i=0; i< staticGrids.length; i++ ){
                if(x=== staticGrids[i][0] &&
                    y=== staticGrids[i][1]){
                    return true;
                }
            }
            return false;
        },
        ghostHouseContains = function(cord) {
            var x = cord[0];
            var y = cord[1];
            for(var i=0; i< ghostHouse.length; i++ ){
                if(x=== ghostHouse[i][0] &&
                    y=== ghostHouse[i][1]){
                    return true;
                }
            }
            return false;
        },
        /*=================END Util Methods================*/

        /*=================UI Update Methods===============*/
        // draw instructions
        printInstruction = function() {
            ctx.fillStyle = "white";
            ctx.font="12px monospace";
            ctx.textAlign = "left";

            var txt = "WELCOME TO \nPACMAN 15-237!\n\n\nArrow keys or\nWASD to move\n\nQ to pause\nE to resume\nR to restart";
            var x = 12;
            var y = Game.Public.Constants.CANVAS_HEIGHT-200;
            var lineheight = 15;
            var lines = txt.split('\n');

            for (var i = 0; i<lines.length; i++)
                ctx.fillText(lines[i], x, y + (i*lineheight) );

            if (ghosts.length === 0){
                ctx.fillStyle = "black";
                ctx.fillRect(x, Game.Public.Constants.CANVAS_WIDTH-40, 70, 30);
                ctx.fillStyle = "red";
                ctx.font = "16px monospace";
                ctx.textAlign = "left";
                ctx.fillText("GOD MODE", x, Game.Public.Constants.CANVAS_WIDTH-20);
            }
        },

        //draw lives on top-right corner
        showLives = function(){
            ctx.fillStyle="black";
            ctx.fillRect(Game.Public.Constants.CANVAS_WIDTH-80, 10, 70, 30);
            for(var i=0; i<life-1; i++){
                lives[i] = new Pacman(ctx, Game.Public.Constants.CANVAS_WIDTH-50+25*i, 30, Game.Public.Constants.Direction.RIGHT);
                lives[i].draw();
            }
        },
        //welcome screen animation
        updateWelcomeScreen = function() {
            ctx.fillStyle = "black";
            ctx.fillRect(0, Game.Public.Constants.CANVAS_HEIGHT/2, Game.Public.Constants.CANVAS_WIDTH,140);
            Character.welcomePacman.mouthOpen = !Character.welcomePacman.mouthOpen;
            Character.welcomeBlinky.isMoving = !Character.welcomeBlinky.isMoving;
            Character.welcomeInky.isMoving = !Character.welcomeInky.isMoving;
            Character.welcomePacman.draw();
            Character.welcomeInky.draw();
            Character.welcomeBlinky.draw();
        },
        //show || update score
        showScore = function(){
            ctx.fillStyle="black";
            ctx.fillRect(Game.Public.Constants.CANVAS_WIDTH-250, 10, 190, 40);
            ctx.fillStyle = "white";
            ctx.font = "24px monospace";
            ctx.textAlign = "left";
            ctx.fillText("score: " + parseInt(score), Game.Public.Constants.CANVAS_WIDTH-250, 37);
        }
        //show win message
        winMessage = function(){
            //draw popup
            ctx.fillStyle = "black";
            ctx.strokeStyle = "green";
            ctx.lineWidth=5;
            ctx.fillRect(Game.Public.Constants.CANVAS_WIDTH/2-150, Game.Public.Constants.CANVAS_HEIGHT/2-40, 300, 100);
            ctx.strokeRect(Game.Public.Constants.CANVAS_WIDTH/2-150, Game.Public.Constants.CANVAS_HEIGHT/2-40, 300, 100);

            //write message
            ctx.textAlign="center";
            ctx.fillStyle = "white";
            ctx.font = "16px monospace";
            ctx.fillText("Congratulations, you won!", Game.Public.Constants.CANVAS_HEIGHT/2, Game.Public.Constants.CANVAS_HEIGHT/2+6);
            ctx.font = "12px monospace";
            ctx.fillText("press R to play again", Game.Public.Constants.CANVAS_HEIGHT/2, Game.Public.Constants.CANVAS_HEIGHT/2+28);
        },
        //show lose message
        loseMessage = function(){
            //draw popup
            ctx.fillStyle = "black";
            ctx.strokeStyle = "red";
            ctx.lineWidth=5;
            ctx.fillRect(Game.Public.Constants.CANVAS_WIDTH/2-100, Game.Public.Constants.CANVAS_HEIGHT/2-40, 200, 100);
            ctx.strokeRect(Game.Public.Constants.CANVAS_WIDTH/2-100, Game.Public.Constants.CANVAS_HEIGHT/2-40, 200, 100);

            //write message
            ctx.textAlign="center";
            ctx.fillStyle = "red";
            ctx.font = "26px monospace";
            ctx.fillText("GAME OVER", Game.Public.Constants.CANVAS_HEIGHT/2, Game.Public.Constants.CANVAS_HEIGHT/2+7);
            ctx.font = "12px monospace";
            ctx.fillText("press R to play again", Game.Public.Constants.CANVAS_HEIGHT/2, Game.Public.Constants.CANVAS_HEIGHT/2+28);
        },
        //update canvas for each frame.
        updateCanvas = function() {
            restartTimer++;
            if (gameOver()===true){
                life--;
                // mrPacman.dieAnimation();
                showLives();
                if (life>0){
                    sleep(500);
                    clearInterval(intervalId);
                    fixGrids(Character.mrPacman.x, Character.mrPacman.y);
                    for(var i=0; i<ghosts.length; i++){
                        fixGrids(ghosts[i].x, ghosts[i].y);
                    }
                    run();
                }
                else {
                    clearInterval(intervalId);
                    sleep(500);
                    loseMessage();
                }

            }
            else if (pacmanWon()===true){
                clearInterval(intervalId);
                sleep(500);
                winMessage();
            }
            else{
                if(weakCounter>0 && weakCounter<2000/timerDelay){
                    for(var i=0; i<ghosts.length; i++){
                        ghosts[i].isBlinking = !ghosts[i].isBlinking;
                    }
                }
                if(weakCounter>0){
                    weakCounter--;
                }
                if(weakCounter===0){
                    for(var i=0; i<ghosts.length; i++){
                        ghosts[i].isDead = false;
                        ghosts[i].isWeak = false;
                        ghosts[i.isBlinking] = false;
                        weakBonus= 200;
                    }
                }

                eatBean();
                eatGhost();
                Character.mrPacman.move();

                for(var i=0; i<ghosts.length; i++){
                    if(ghosts[i].isDead === false){
                        ghosts[i].move();
                    }
                }

                fixGrids(Character.mrPacman.x, Character.mrPacman.y);
                for(var i=0; i<ghosts.length; i++){
                    fixGrids(ghosts[i].x, ghosts[i].y);
                }

                Character.mrPacman.draw();
                for(var i=0; i<ghosts.length; i++){
                    ghosts[i].draw();
                }
            }
        },
        //try to eat a bean
        eatBean = function() {
            if(Game.Public.Utils.onGridCenter(Character.mrPacman.x, Character.mrPacman.y)){
                if(maze[Character.mrPacman.getRow()][Character.mrPacman.getCol()].beanType===NORMAL_BEAN){
                    score+= parseInt(10);
                    showScore();
                    beansLeft--;
                }
                else if (maze[Character.mrPacman.getRow()][Character.mrPacman.getCol()].beanType===POWER_BEAN){
                    score+=parseInt(50);
                    showScore();
                    beansLeft--;

                    //ghosts enter weak mode
                    for(var i=0; i<ghosts.length; i++){
                        ghosts[i].isWeak=true;
                    }
                    weakCounter=WEAK_DURATION;
                }
                maze[Character.mrPacman.getRow()][Character.mrPacman.getCol()].beanType=undefined;
                maze[Character.mrPacman.getRow()][Character.mrPacman.getCol()].draw();
            }
        },
        //try to eat a weak ghost
        eatGhost = function() {
            for(var i=0; i<ghosts.length; i++){
                if(Math.abs(Character.mrPacman.x-ghosts[i].x)<=5 && Math.abs(Character.mrPacman.y-ghosts[i].y)<=5
                    && ghosts[i].isWeak && !ghosts[i].isDead){
                    score += parseInt( weakBonus);
                    weakBonus *=2;
                    showScore();
                    ghosts[i].isDead = true;
                    ghosts[i].toGhostHouse();
                }
            }
        },
        gameOver = function(){
            for(var i=0; i<ghosts.length; i++){
                if(Math.abs(Character.mrPacman.x-ghosts[i].x)<=5 && Math.abs(Character.mrPacman.y-ghosts[i].y)<=5
                    && !ghosts[i].isWeak){
                    return true;
                }
            }
            return false;
        },
        pacmanWon = function(){
            return beansLeft === 0;
        },

        //Show a count down each time the game starts
        countDown = function() {
            ctx.fillStyle = "black";
            ctx.fillRect(Game.Public.Constants.CANVAS_HEIGHT-85, 70, 80,80);
            ctx.fillStyle = "red";
            ctx.font = "50px monospace";
            ctx.textAlign = "center";
            ctx.fillText("3",Game.Public.Constants.CANVAS_HEIGHT-43, 130);
            setTimeout(function () {
                ctx.fillStyle = "black";
                ctx.fillRect(Game.Public.Constants.CANVAS_HEIGHT-85, 70, 80,80);
                ctx.fillStyle = "orange";
                ctx.fillText("2",Game.Public.Constants.CANVAS_HEIGHT-43, 130);
                setTimeout(function  () {
                    ctx.fillStyle = "black";
                    ctx.fillRect(Game.Public.Constants.CANVAS_HEIGHT-85, 70, 80,80);
                    ctx.fillStyle = "yellow";
                    ctx.fillText("1",Game.Public.Constants.CANVAS_HEIGHT-43, 130);
                    setTimeout(function  () {
                        ctx.fillStyle = "black";
                        ctx.fillRect(Game.Public.Constants.CANVAS_HEIGHT-85, 70, 80,80);
                        ctx.fillStyle = "green";
                        ctx.textAlign = "center";
                        ctx.fillText("GO",Game.Public.Constants.CANVAS_HEIGHT-43, 130);
                        setTimeout(function  () {
                            intervalId = setInterval(updateCanvas, timerDelay);
                        },500);
                    }, 1000);
                }, 1000);
            }, 1000);
        }
        /*==================END UI Update Methods================*/

    initFields();
    initCanvas(Game.Public.Constants.CANVAS_WIDTH, Game.Public.Constants.CANVAS_HEIGHT);
    canvas.addEventListener('keydown', onKeyDown, false);
    canvas.setAttribute('tabindex','0');
    canvas.focus();
    welcomeScreen();
}

// game parameters
var intervalId;
var restartTimer = 0;
var timerDelay = 80;
var speed = 5;
var score = 0;
var lives = [];
var MAX_LIFE = 3;
var life = MAX_LIFE;
var weakBonus = 200;
var MAX_BEANS = 136;
var beansLeft = MAX_BEANS;
var weakCounter;
var WEAK_DURATION = 10000/timerDelay;


//bean cases
var NORMAL_BEAN = 1
var POWER_BEAN = 2;

//game state and map
var gameOn = false;
var gamePaused = false;
var maze = new Array(Game.Public.Constants.CANVAS_HEIGHT/Game.Public.Constants.GRID_HEIGHT);
var mazeContent = [
//row1
[LEFT_TOP, TOP_BOTTOM, TOP_BOTTOM, TOP_ONLY, TOP_BOTTOM,
 TOP_BOTTOM, TOP_BOTTOM, RIGHT_TOP, LEFT_TOP, TOP_ONLY,
 TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY, TOP_ONLY,
 TOP_ONLY, RIGHT_TOP],
//row2
[LEFT_RIGHT, BOTTOM_LEFT_TOP, RIGHT_TOP, LEFT_RIGHT, LEFT_TOP,
 TOP_BOTTOM, TOP_RIGHT_BOTTOM, LEFT_RIGHT, LEFT_BOTTOM, BOTTOM_ONLY,
 BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, BOTTOM_ONLY, EMPTY_GRID,
 EMPTY_GRID, RIGHT_ONLY],
//row3
[LEFT_BOTTOM, RIGHT_TOP, LEFT_RIGHT, LEFT_RIGHT, LEFT_RIGHT,
 BOTTOM_LEFT_TOP, TOP_BOTTOM, EMPTY_GRID, TOP_BOTTOM, TOP_BOTTOM,
 TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, RIGHT_TOP, LEFT_ONLY, 
 EMPTY_GRID, RIGHT_ONLY],
//row4
[CLOSED_GRID, LEFT_RIGHT, LEFT_RIGHT, LEFT_RIGHT, LEFT_BOTTOM, 
 TOP_BOTTOM, RIGHT_TOP, LEFT_RIGHT, BOTTOM_LEFT_TOP, TOP_BOTTOM,
 TOP_BOTTOM, TOP_BOTTOM, TOP_RIGHT_BOTTOM, LEFT_RIGHT, LEFT_ONLY,
 EMPTY_GRID, RIGHT_ONLY],
//row5
[LEFT_TOP, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_BOTTOM, TOP_ONLY, 
 TOP_RIGHT_BOTTOM, LEFT_RIGHT, LEFT_ONLY, TOP_BOTTOM, TOP_BOTTOM,
 TOP_BOTTOM, TOP_ONLY, TOP_BOTTOM, RIGHT_BOTTOM, LEFT_ONLY,
 EMPTY_GRID, RIGHT_ONLY],
//row6
[LEFT_RIGHT, BOTTOM_LEFT_TOP, BOTTOM_ONLY, TOP_RIGHT_BOTTOM, LEFT_RIGHT,
 BOTTOM_LEFT_TOP, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_TOP, TOP_BOTTOM,
 RIGHT_TOP, LEFT_RIGHT, BOTTOM_LEFT_TOP, TOP_BOTTOM, BOTTOM_ONLY, 
 BOTTOM_ONLY, RIGHT_BOTTOM],
//row7
[LEFT_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, BOTTOM_ONLY, 
 TOP_BOTTOM, TOP_BOTTOM, RIGHT_ONLY, LEFT_RIGHT, LEFT_TOP_RIGHT, 
 LEFT_RIGHT, LEFT_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM,
 TOP_BOTTOM, RIGHT_TOP],
//row8
[LEFT_RIGHT, BOTTOM_LEFT_TOP, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM,
 TOP_BOTTOM, TOP_RIGHT_BOTTOM, LEFT_RIGHT, LEFT_RIGHT, LEFT_RIGHT, 
 LEFT_RIGHT, LEFT_RIGHT, BOTTOM_LEFT_TOP, TOP_BOTTOM, TOP_BOTTOM,
 TOP_RIGHT_BOTTOM, LEFT_RIGHT],
//row9
[LEFT_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, TOP_ONLY,
 TOP_BOTTOM, TOP_BOTTOM, RIGHT_ONLY, LEFT_RIGHT, LEFT_RIGHT, 
 LEFT_RIGHT, LEFT_ONLY, TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM,
 TOP_BOTTOM, RIGHT_ONLY],
//row10
[LEFT_TOP, TOP_ONLY, TOP_ONLY, RIGHT_TOP, LEFT_RIGHT, 
 BOTTOM_LEFT_TOP, TOP_RIGHT_BOTTOM, LEFT_RIGHT, RIGHT_BOTTOM_LEFT, LEFT_RIGHT,
 RIGHT_BOTTOM_LEFT, LEFT_RIGHT, BOTTOM_LEFT_TOP, TOP_BOTTOM, TOP_BOTTOM,
 TOP_RIGHT_BOTTOM, LEFT_RIGHT],
//row11
[LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_ONLY,
 TOP_BOTTOM, TOP_BOTTOM, BOTTOM_ONLY, TOP_ONLY, BOTTOM_ONLY, 
 TOP_BOTTOM, BOTTOM_ONLY, TOP_ONLY, TOP_BOTTOM, TOP_BOTTOM,
 TOP_BOTTOM, RIGHT_ONLY],
//row12
[LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, 
 BOTTOM_LEFT_TOP, TOP_BOTTOM, RIGHT_TOP, LEFT_RIGHT, BOTTOM_LEFT_TOP,
 TOP_BOTTOM, RIGHT_TOP, LEFT_RIGHT, BOTTOM_LEFT_TOP, TOP_BOTTOM,
 RIGHT_TOP, LEFT_RIGHT],
//row13
[LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_ONLY,
 TOP_BOTTOM, TOP_RIGHT_BOTTOM, LEFT_RIGHT, LEFT_ONLY, TOP_BOTTOM,
 TOP_RIGHT_BOTTOM, LEFT_RIGHT, LEFT_ONLY, TOP_BOTTOM, RIGHT_TOP,
 LEFT_RIGHT, LEFT_RIGHT],
//row14
[LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, 
 LEFT_TOP, TOP_BOTTOM, RIGHT_BOTTOM, LEFT_RIGHT, BOTTOM_LEFT_TOP,
 TOP_BOTTOM, RIGHT_ONLY, LEFT_RIGHT, LEFT_TOP_RIGHT, LEFT_RIGHT, 
 LEFT_RIGHT, LEFT_RIGHT],
//row15
[LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT, 
 LEFT_RIGHT, BOTTOM_LEFT_TOP, TOP_BOTTOM, EMPTY_GRID, TOP_BOTTOM,
 TOP_RIGHT_BOTTOM, LEFT_RIGHT, LEFT_RIGHT, LEFT_RIGHT, LEFT_RIGHT,
 LEFT_RIGHT, LEFT_RIGHT],
//row16
[LEFT_ONLY, EMPTY_GRID, EMPTY_GRID, RIGHT_ONLY, LEFT_RIGHT,
 LEFT_BOTTOM, TOP_BOTTOM, TOP_RIGHT_BOTTOM, LEFT_RIGHT, BOTTOM_LEFT_TOP,
 TOP_BOTTOM, RIGHT_BOTTOM, LEFT_RIGHT, LEFT_RIGHT, LEFT_RIGHT,
 RIGHT_BOTTOM_LEFT, LEFT_RIGHT],
//row17
[LEFT_BOTTOM, BOTTOM_ONLY, BOTTOM_ONLY, RIGHT_BOTTOM, LEFT_BOTTOM,
 TOP_BOTTOM, TOP_BOTTOM, TOP_BOTTOM, BOTTOM_ONLY, TOP_BOTTOM, 
 TOP_BOTTOM, TOP_BOTTOM, RIGHT_BOTTOM, RIGHT_BOTTOM_LEFT, LEFT_BOTTOM,
 TOP_BOTTOM, RIGHT_BOTTOM]
];

// grids that don't redraw
var staticGrids = [];
var staticGridsIndex = 0;




// grids with no beans
var noBean = [Game.Public.Constants.pacmanStartLoc,[5,12],[5,13],[5,3],[9,5],[9,6],[1,1],[5,1],[3,0],[2,4],[4,6],[5,6],[5,5],[12,7],[14,5],[12,11],[14,11]];
var noBeanIndex=noBean.length;


// power beans in maze
var powerBeans = [[0,0], [2,13], [16,4], [16,16], [2,5], [14,10]];


// ghost house
var ghostHouse = [];
var ghostHouseIndex = 0;
/*======================END GLOBAL VARs====================*/

/*-----------GAME START-----------*/
new Game("myCanvas");