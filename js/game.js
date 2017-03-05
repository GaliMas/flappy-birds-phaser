PlayState = {
	game:null,
	background: null,
	player: null,
	keys: null,
	pipesUp: null,
	pipesDown: null,
	labelScore: null,

	preload : function () {
		this.game.load.image('player', 'assets/ball.png');
		this.game.load.image('pipeUp', 'assets/pipeup.png');
		this.game.load.image('pipeDown', 'assets/pipedown.png');
		this.game.load.image('background', 'assets/sky.png');
	},

	create : function () {
		this.isGameOver = false;
	 	this.background = this.game.add.sprite(0, 0,'background');
	    this.player = this.game.add.sprite(50, 50,'player');

	    this.background.height = this.game.height;
	    this.background.width = this.game.width;

	    this.game.physics.startSystem(Phaser.Physics.ARCADE);


	    this.game.physics.arcade.enable(this.player);
	    this.player.body.gravity.y = 2000;
		
	    this.game.physics.setBoundsToWorld();
        this.player.checkWorldBounds = true;
        this.player.events.onOutOfBounds.add(this.gameOver.bind(this), this);

	    this.keys = this.game.input.keyboard.addKeys({
	        space: Phaser.KeyCode.SPACEBAR
	    });

    	this.game.input.onDown.add(function () {
	        this.player.body.velocity.y = -600;
	        if(this.isGameOver){
	        	this.restartGame();
	        }
	    }, this);

	    this.keys.space.onDown.add(function () {
	        this.player.body.velocity.y = -600;
	        if(this.isGameOver){
	        	this.restartGame();
	        }
	    }, this);

		this.pipesUp = this.game.add.group(); 
		this.pipesDown = this.game.add.group(); 

		this.initScore();

    this.timer = this.game.time.events.loop(1000, this.addPipes, this); 
	},

	update : function () {
		this.game.physics.arcade.overlap(this.pipesUp, this.player, this.gameOver.bind(this));
  	this.game.physics.arcade.overlap(this.pipesDown, this.player, this.gameOver.bind(this));
	},

	initScore(){
		this.score = 0;
    this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });   
	},

	restartGame : function(){
  	this.game.state.start('main');
  	this.labelGameOver = undefined;
		this.labelRestart = undefined;
		this.isGameOver = false;
		this.game.paused = false;
	},
	
	gameOver: function(){
		this.labelGameOver = this.game.add.text(400, 200, "Game Over", { font: "30px Arial", fill: "#D7DF01" });   
		this.labelRestart = this.game.add.text(350, 240, "Touch screen to play again", { font: "30px Arial", fill: "#D7DF01" });   
		this.isGameOver = true;
		this.game.paused = true;
	},

	addPipes : function(x) {
		if(!this.isGameOver){
			this.addPipe(x || 1000, -50, 'pipeUp', this.pipesUp);
			this.addPipe(x || 1000, 300, 'pipeDown', this.pipesDown);
			this.labelScore.text = this.score++;
		}
	},

	addPipe : function(x, y, pipeType, pipeGroup) {
	    var pipe = this.game.add.sprite(x, y, pipeType);
	    this.game.physics.arcade.enable(pipe);

		pipe.height = 200;
	    pipe.body.velocity.x = -600; 
	    pipe.checkWorldBounds = true;
	    pipe.outOfBoundsKill = true;

	    pipeGroup.add(pipe);
	}
};

window.onload = function () {
    var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'game', PlayState);
    game.state.add("main", PlayState); 
    game.state.start("main");
};