PlayState = {};

PlayState.preload = function () {
	this.game.load.image('player', 'assets/ball.png');
	this.game.load.image('pipeUp', 'assets/pipeup.png');
	this.game.load.image('pipeDown', 'assets/pipedown.png');
	this.game.load.image('background', 'assets/sky.png');
}

PlayState.create = function () {
	
	var restartGame = function(){
		this.game.state.start('main');
	}


    this.background = this.game.add.sprite(0, 0,'background');
    this.player = this.game.add.sprite(50, 225,'player');
    this.game.physics.setBoundsToWorld();
    this.player.events.onOutOfBounds.add(restartGame, this);

	

    this.background.height = this.game.height;
    this.background.width = this.game.width;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);


    this.game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 2000;

    this.keys = this.game.input.keyboard.addKeys({
        space: Phaser.KeyCode.SPACEBAR
    });

    this.keys.space.onDown.add(function () {
        this.player.body.velocity.y = -600;
    }, this);

	this.pipesUp = this.game.add.group(); 
	this.pipesDown = this.game.add.group(); 

	this.score = 0;
    this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });   

	var addPipe =  (function(x, y) {
	    var pipeUp = this.game.add.sprite(500, -50, 'pipeUp');
	    var pipeDown = this.game.add.sprite(500, 300, 'pipeDown');
		pipeUp.height = 200;
	    pipeDown.height = 200;
	    
	    this.pipesUp.add(pipeUp);
	    this.pipesDown.add(pipeDown);

	    this.game.physics.arcade.enable(pipeUp);
	    this.game.physics.arcade.enable(pipeDown);

	    
	    pipeUp.body.velocity.x = -600; 
	    pipeDown.body.velocity.x = -600; 

	    
	    pipeUp.checkWorldBounds = true;
	    pipeUp.outOfBoundsKill = true;
	    pipeDown.checkWorldBounds = true;
	    pipeDown.outOfBoundsKill = true;

	    this.labelScore.text = this.score++;
	}).bind(this);

    this.timer = this.game.time.events.loop(1000, addPipe, this); 
    addPipe();
    
};

PlayState.update = function () {
	var restartGame = function(){
		this.game.state.start('main');
	}

	this.game.physics.arcade.overlap(this.pipesUp, this.player, restartGame.bind(this));
    this.game.physics.arcade.overlap(this.pipesDown, this.player, restartGame.bind(this));
};

window.onload = function () {
    var game = new Phaser.Game(500, 500, Phaser.AUTO, 'game', PlayState);
    game.state.add("main", PlayState); 
    game.state.start("main");
};