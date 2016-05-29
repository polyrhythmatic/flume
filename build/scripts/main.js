var MOBILE_MAX_WIDTH = 992;
var maskContext;
var mask;
var maskVisible = false;
var animationCanvas;
var animationContext;

var masks = [];
var maskLoader = 0;

var buttonWidth;
var buttonHeight;
var buttonContext;

var lastButtonX;
var lastButtonY;

var inactivityTimeout;
var isInstrumentalPlaying = false;
var trackPlayedOnce = false;


var glowOutlines = [];
var stage = new PIXI.Container();

var glowOutline = function(num){
	this.texture = new PIXI.Texture.fromImage('images/masks/' + (num + 1) + '.png');
	this.sprite = new PIXI.Sprite(this.texture);
	this.sprite.width = animationCanvas.width;
	this.sprite.height = animationCanvas.height;
	this.sprite.alpha = 0;
	stage.addChild(this.sprite);
	this.isFadingIn = false;
	this.isFadingOut = false;
};

glowOutline.prototype.fadeIn = function(){
	this.isFadingIn = true;
	this.isFadingOut = false;
};

glowOutline.prototype.fadeOut = function(){
	this.isFadingOut = true;
	this.isFadingIn = false;
};

window.onload = function(){
	if (window.innerWidth >= MOBILE_MAX_WIDTH) {
			var maskCanvas = document.getElementById('myCanvas');
			animationCanvas = document.getElementById('animationCanvas');

			maskCanvas.width = $("#myCanvas").width();
			maskCanvas.height = $("#myCanvas").width();
			animationCanvas.width = $("#animationCanvas").width();
			animationCanvas.height = $("#animationCanvas").width();
			var renderer = new PIXI.autoDetectRenderer(animationCanvas.width, animationCanvas.height, {
				view: animationCanvas,
				transparent: true
			});

			var fadeInc = 0.1;
			function animate() {
				renderer.render(stage);
				for(var i = 0; i < 14; i ++){
					if(glowOutlines[i].isFadingIn){
						glowOutlines[i].sprite.alpha += fadeInc;
						if(glowOutlines[i].sprite.alpha > 1){
							glowOutlines[i].sprite.alpha = 1;
							glowOutlines[i].isFadingIn = false;
						}
					}
					if(glowOutlines[i].isFadingOut){
						glowOutlines[i].sprite.alpha -= fadeInc;
						if(glowOutlines[i].sprite.alpha < 0){
							glowOutlines[i].sprite.alpha = 0;
							glowOutlines[i].isFadingOut = false;
						}
					}
				}
				requestAnimationFrame(animate);
			}

			for(var i = 0; i < 14; i ++) {
				glowOutlines[i] = new glowOutline(i);
			}
			animate();

			var maskContext = maskCanvas.getContext('2d');
			maskContext.globalAlpha = 0.01;
			var mask = new Image();
			mask.src = "images/mask-update.png";
			mask.onload = function() {
				maskContext.drawImage(mask, 0, 0, maskCanvas.width, maskCanvas.height);
			};

			maskCanvas.onmousemove=function(e){
				handleMouseover(maskContext.getImageData(e.offsetX, e.offsetY, 1, 1).data);
				console.log("this is the current mouse" + currentMouse);
			};

			$(window).keydown(function(e) {
				handleKeydown(e.keyCode);
			});
	}

	var buttonCanvas = document.getElementById("button-canvas");
	buttonCanvas.width = window.innerWidth;
	buttonCanvas.height = window.innerHeight;
	buttonWidth = window.innerWidth/2;
	buttonHeight = window.innerHeight/7;

	buttonContext = buttonCanvas.getContext('2d');

	buttonCanvas.ontouchstart = function(e) {
		console.log(e);
		for (var i = 0; i < e.touches.length; i++) {
			var x = e.touches[i].clientX;
			var y = e.touches[i].clientY;
			handleButtonClick(x, y);
		}
		resetInactivityTimeout();
	};

	buttonCanvas.ontouchmove = function(e) {
		for (var i = 0; i < e.changedTouches.length; i++) {
			var x = e.changedTouches[i].clientX;
			var y = e.changedTouches[i].clientY;
			handleButtonMove(x, y);
		}
		resetInactivityTimeout();
	};

	buttonCanvas.ontouchend = function(e) {
		lastButtonX = -1;
		lastButtonY = -1;
	};

	document.getElementById("content").ontouchstart = function(e) {
		console.log("content touch");
		if (isInstrumentalPlaying) {
			Tone.Transport.pause();
			$(".header__flash-content").text("Start Track");
			isInstrumentalPlaying = false;
		}
		else if (trackPlayedOnce) {
			Tone.Transport.start();
			$(".header__flash-content").text("Stop Track");
			isInstrumentalPlaying = true;
		}
	};

	document.body.ontouchstart = function(e) {
		console.log("document on touch start");
		if (!$(".header").hasClass("hidden") && e.target.id !== "content") {
			$(".header").addClass("hidden");
			$(".playlist").addClass("hidden");
			$(".instrument__buttons").addClass("bring-to-front");

			if (!isInstrumentalPlaying && !trackPlayedOnce) {
				$(".header__flash").removeClass("animate-flicker");
				Tone.Transport.start();
				$(".header__flash-content").text("Stop Track");
				$(".header__flash-content").css("border", "2px solid white");
				isInstrumentalPlaying = true;
				trackPlayedOnce = true;
			}

			resetInactivityTimeout();
		}
	};

	$(".instrument__start-button").click(function() {
		Tone.Transport.start();
		$(this).addClass("hidden");
		$(".instrument__stop-button").removeClass("hidden");
		if (window.innerWidth >= MOBILE_MAX_WIDTH) {
			for (var i = 0; i < 14; i++) {
				setTimeout(function(k) {
					glowOutlines[k].fadeIn();
				}.bind(this, i), 2*i*50);
				setTimeout(function(j) {
					glowOutlines[j].fadeOut();
				}.bind(this, i), 2*(i+1)*50);
			}
			$(".instrument__help-text").removeClass("hidden");
			$(".instrument__help-text").addClass("animate-flicker");
			setTimeout(function() {
				$(".instrument__help-text").removeClass("animate-flicker");
				$(".instrument__help-text").addClass("hidden");
			}, 5000);
		}
	});

	$(".instrument__stop-button").click(function() {
		Tone.Transport.pause();
		$(this).addClass("hidden");
		$(".instrument__play-button").removeClass("hidden");
	});

	$(".instrument__play-button").click(function() {
		Tone.Transport.start();
		$(this).addClass("hidden");
		$(".instrument__stop-button").removeClass("hidden");
	});
};

function handleKeydown(keyCode) {
	switch(keyCode) {
		case 65: //a
			schedulePlay(1);
			glowOutlines[0].fadeIn();
			setTimeout(function() {glowOutlines[0].fadeOut();}, 500);
			break;
		case 83: //s
			schedulePlay(2);
			glowOutlines[1].fadeIn();
			setTimeout(function() {glowOutlines[1].fadeOut();}, 500);
			break;
		case 68: //d
			schedulePlay(3);
			glowOutlines[2].fadeIn();
			setTimeout(function() {glowOutlines[2].fadeOut();}, 500);
			break;
		case 70: //f
			schedulePlay(4);
			glowOutlines[3].fadeIn();
			setTimeout(function() {glowOutlines[3].fadeOut();}, 500);
			break;
		case 71: //g
			schedulePlay(5);
			glowOutlines[4].fadeIn();
			setTimeout(function() {glowOutlines[4].fadeOut();}, 500);
			break;
		case 72: //h
			schedulePlay(6);
			glowOutlines[5].fadeIn();
			setTimeout(function() {glowOutlines[5].fadeOut();}, 500);
			break;
		case 74: //j
			schedulePlay(7);
			glowOutlines[6].fadeIn();
			setTimeout(function() {glowOutlines[6].fadeOut();}, 500);
			break;
		case 75: //k
			schedulePlay(8);
			glowOutlines[7].fadeIn();
			setTimeout(function() {glowOutlines[7].fadeOut();}, 500);
			break;
		case 76: //l
			schedulePlay(9);
			glowOutlines[8].fadeIn();
			setTimeout(function() {glowOutlines[8].fadeOut();}, 500);
			break;
		case 90: //z
			schedulePlay(10);
			glowOutlines[9].fadeIn();
			setTimeout(function() {glowOutlines[9].fadeOut();}, 500);
			break;
		case 88: //x
			schedulePlay(11);
			glowOutlines[10].fadeIn();
			setTimeout(function() {glowOutlines[10].fadeOut();}, 500);
			break;
		case 67: //c
			schedulePlay(12);
			glowOutlines[11].fadeIn();
			setTimeout(function() {glowOutlines[11].fadeOut();}, 500);
			break;
		case 86: //v
			schedulePlay(13);
			glowOutlines[12].fadeIn();
			setTimeout(function() {glowOutlines[12].fadeOut();}, 500);
			break;
		case 66: //b
			schedulePlay(14);
			glowOutlines[13].fadeIn();
			setTimeout(function() {glowOutlines[13].fadeOut();}, 500);
			break;
		default:
			break;
	}
}

function resetInactivityTimeout() {
	clearTimeout(inactivityTimeout);

	inactivityTimeout  = setTimeout(function() {
		$(".header").removeClass("hidden");
		$(".playlist").removeClass("hidden");
		$(".instrument__buttons").removeClass("bring-to-front");
	}, 3000);
}

function handleButtonClick(x, y) {
	console.log(x + ", " + y);
	
	var buttonX = Math.floor(x / buttonWidth);
	var buttonY = Math.floor(y / buttonHeight);

	lastButtonX = buttonX;
	lastButtonY = buttonY;	
	drawButton(buttonX, buttonY);
	playVocalSound(buttonX, buttonY);
}

function handleButtonMove(x, y) {
	var buttonX = Math.floor(x / buttonWidth);
	var buttonY = Math.floor(y / buttonHeight);

	if (buttonX !== lastButtonX || buttonY !== lastButtonY) {
		lastButtonX = buttonX;
		lastButtonY = buttonY;	

		drawButton(buttonX, buttonY);
		playVocalSound(buttonX, buttonY);
	}
}

function drawButton(buttonX, buttonY) {
	buttonContext.fillStyle = 'rgba(255, 255, 255, 0.3)';
	buttonContext.fillRect(buttonX*buttonWidth, buttonY*buttonHeight, buttonWidth, buttonHeight);
	setTimeout(function() {
		buttonContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
	}, 100);
}

function playVocalSound(buttonX, buttonY) {
	if (buttonX === 0) {
		switch(buttonY) {
			case 0:
				schedulePlay(1);
				break;
			case 1:
				schedulePlay(4);
				break;
			case 2:
				schedulePlay(5);
				break;
			case 3:
				schedulePlay(8);
				break;
			case 4:
				schedulePlay(9);
				break;
			case 5:
				schedulePlay(12);
				break;
			case 6:
				schedulePlay(13);
				break;
		}
	}
	else {
		switch(buttonY) {
			case 0:
				schedulePlay(2);
				break;
			case 1:
				schedulePlay(3);
				break;
			case 2:
				schedulePlay(6);
				break;
			case 3:
				schedulePlay(7);
				break;
			case 4:
				schedulePlay(10);
				break;
			case 5:
				schedulePlay(11);
				break;
			case 6:
				schedulePlay(14);
				break;
		}
	}
}

var currentMouse = 0;

function handleMouseover(color){
	color = color[0].toString() + color[1].toString() + color[2].toString();
	console.log(color);
	switch(color) {
		case "000":
			if(currentMouse !== 0) {
				for(var i = 0; i < 14; i ++){
					glowOutlines[i].fadeOut();
				}
				sampler.triggerRelease(Tone.context.currentTime);
			}
			currentMouse = 0;
			break;
		case "255255255":
			schedulePlay(1);
			currentMouse = 1;
			break;
		case "2552550":
			schedulePlay(2);
			currentMouse = 2;
			break;
		case "2550255":
			schedulePlay(3);
			currentMouse = 3;
			break;
		case "0255255":
			schedulePlay(4);
			currentMouse = 4;
			break;
		case "25500":
			schedulePlay(5);
			currentMouse = 5;
			break;
		case "02550":
			schedulePlay(6);
			currentMouse = 6;
			break;
		case "00255":
			schedulePlay(7);
			currentMouse = 7;
			break;
		case "858585":
			schedulePlay(8);
			currentMouse = 8;
			break;
		case "85850":
			schedulePlay(9);
			currentMouse = 9;
			break;
		case "08585":
			schedulePlay(10);
			currentMouse = 10;
			break;
		case "85085":
			schedulePlay(11);
			currentMouse = 11;
			break;
		case "8500":
			schedulePlay(12);
			currentMouse = 12;
			break;
		case "0085":
			schedulePlay(13);
			currentMouse = 13;
			break;
		case "0850":
			schedulePlay(14);
			currentMouse = 14;
			break;
	}
}

function schedulePlay(num){
	if(currentMouse !== 0 && currentMouse !== null){
		for(var i = 0; i < 14; i ++){
			if(i != (num - 1)) glowOutlines[i].fadeOut();
		}
		glowOutlines[num - 1].fadeIn();
	}
	if(currentMouse != num){
		var nextNote = Math.floor(Tone.context.currentTime / 0.125);
		nextNote = nextNote * 0.125 + 0.125;
		sampler.triggerRelease(nextNote);
		sampler.triggerAttack("A." + num, nextNote);
	}
}

var sampler = new Tone.Sampler({
	A : {
		1 : "sounds/vocals/1.mp3",
		2 : "sounds/vocals/2.mp3",
		3 : "sounds/vocals/3.mp3",
		4 : "sounds/vocals/4.mp3",
		5 : "sounds/vocals/5.mp3",
		6 : "sounds/vocals/6.mp3",
		7 : "sounds/vocals/7.mp3",
		8 : "sounds/vocals/8.mp3",
		9 : "sounds/vocals/9.mp3",
		10 : "sounds/vocals/10.mp3",
		11 : "sounds/vocals/11.mp3",
		12 : "sounds/vocals/12.mp3",
		13 : "sounds/vocals/13.mp3",
		14 : "sounds/vocals/14.mp3"
	}
}).toMaster();

var instrumental = new Tone.Player({
	"url" : "sounds/instrumental.mp3",
});//.toMaster();

var click = new Tone.SimpleSynth({
	envelope: {
		decay: 0.01,
		release: 0,
		sustain: 0
	}
}).toMaster();

var loop = new Tone.Loop(function(time){
	// click.triggerAttackRelease("C4", time);
}, "4n").start(0);

var buffers = [];
var instrumentals = [];
for(var i = 0; i < 39; i ++){
	instrumentals[i] = new Tone.Player().toMaster();
	buffers[i] = new Tone.Buffer();
}

var bufferNums = [];
for(var i = 0; i < 38; i ++){
	bufferNums[i] = i + 1;
}

function loadInstrumentals(){
	async.eachSeries(bufferNums, function(bufferNum, cb){
		buffers[bufferNum].load("sounds/instrumentals/instrumental_" + bufferNum + ".mp3", function(){
			instrumentals[bufferNum].buffer = buffers[bufferNum].get();
			var timeStart = (bufferNum * 3) + ":0:0";
			Tone.Transport.schedule(function(){
				instrumentals[bufferNum].start(timeStart);
			}, timeStart);
			// instrumentals[bufferNum].sync(timeStart);
			console.log("loaded " + bufferNum);
			cb();
		}, function(err){

		});
	});
}

function stopAllInstrumentals(){
	for(var i = 0; i < instrumentals.length; i ++){
		instrumentals[i].stop();
	}
}

buffers[0] = new Tone.Buffer("sounds/instrumentals/instrumental_0.mp3", function(){
	instrumentals[0].buffer = buffers[0].get();
	instrumentals[0].sync(0);
});

var instLoad = false;
Tone.Buffer.on("load", function(){
	if(!instLoad){
		loadInstrumentals();
		$(".loader").addClass("hidden");
		instLoad = true;
	}
});