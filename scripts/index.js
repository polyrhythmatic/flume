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

window.onload = function(){
	var maskCanvas = document.getElementById('myCanvas');
	animationCanvas = document.getElementById('animationCanvas');
	animationContext = animationCanvas.getContext('2d');
	animationContext.shadowBlur = 10;
	animationContext.shadowColor = "yellow";

	var maskContext = maskCanvas.getContext('2d');
	maskContext.globalAlpha = 0.01;
	var mask = new Image();
	mask.src = "images/mask.png";
	mask.onload = function() {
		maskContext.drawImage(mask, 0, 0, 720, 720);
	};

	for(var i = 0; i < 14; i ++){
		masks[i] = new Image();
		masks[i].src = "images/masks/" + (i + 1) + ".png";
		masks[i].onload = function(){
			maskLoader ++;
			if(maskLoader == 14){
				console.log("all masks loaded");
			}
		};
	}

	maskCanvas.onmousemove=function(e){
		handleMouseover(maskContext.getImageData(e.offsetX, e.offsetY, 1, 1).data);
	};

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
	};

	buttonCanvas.ontouchmove = function(e) {
		for (var i = 0; i < e.changedTouches.length; i++) {
			var x = e.changedTouches[i].clientX;
			var y = e.changedTouches[i].clientY;
			handleButtonMove(x, y);
			resetInactivityTimeout();
		}
	};

	buttonCanvas.ontouchend = function(e) {
		lastButtonX = -1;
		lastButtonY = -1;
	};

	document.getElementById("content").ontouchstart = function(e) {
		console.log("content touch");
		if (isInstrumentalPlaying) {
			instrumental.stop();
			$(".header__flash-content").text("Turn up speakers and tap screen to begin");
			isInstrumentalPlaying = false;
		}
	}

	document.body.ontouchstart = function(e) {
		console.log("document on touch start");
		if (!$(".header").hasClass("hidden") && e.target.id !== "content") {
			$(".header").addClass("hidden");
			$(".playlist").addClass("hidden");
			$(".instrument__buttons").addClass("bring-to-front");

			if (!isInstrumentalPlaying) {
				$(".header__flash").removeClass("animate-flicker");
				instrumental.start();
				$(".header__flash-content").text("Stop Track");
				isInstrumentalPlaying = true;
			}

			resetInactivityTimeout();
		}
	}

	// $(".header__flash-content").click(function(e) {
	// 	if (isInstrumentalPlaying) {
	// 		e.stopPropogation();
	// 		instrumental.stop();
	// 		$(".header__flash-content").text("Turn up speakers and tap screen to begin");
	// 		isInstrumentalPlaying = false;
	// 	}
	// });
};

function resetInactivityTimeout() {
	clearTimeout(inactivityTimeout);

	inactivityTimeout  = setTimeout(function() {
		$(".header").removeClass("hidden");
		$(".playlist").removeClass("hidden");
		$(".instrument__buttons").removeClass("bring-to-front");
	}, 7000);
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

// window.onclick = function() {
// 	if (!maskVisible) {
// 		context.globalAlpha = 0.1;
// 		context.drawImage(img, 0, 0, 720, 720);
// 		maskVisible = true;
// 	}
// 	else {
// 		maskVisible = false;
// 		context.clearRect(0, 0, 720, 720);
// 		context.globalAlpha = 0.003;
// 		context.drawImage(img, 0, 0, 720, 720);
// 	}
// }

var currentMouse = 0;

function handleMouseover(color){
	color = color[0].toString() + color[1].toString() + color[2].toString();
	switch(color) {
		case "000":
			if(currentMouse !== 0) {
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
	// animationContext.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
	// animationContext.drawImage(masks[num], 0, 0, 720, 720);
	if(currentMouse != num){
		var nextNote = Math.floor(Tone.context.currentTime / 0.125);
		nextNote = nextNote * 0.125 + 0.125;
		console.log(Tone.Transport.toSeconds(nextNote + "n"));
		sampler.triggerRelease(nextNote);
		sampler.triggerAttack("A." + num, nextNote);
	}
}

var sampler = new Tone.Sampler({
	A : {
		1 : "sounds/vocals/1.wav",
		2 : "sounds/vocals/2.wav",
		3 : "sounds/vocals/3.wav",
		4 : "sounds/vocals/4.wav",
		5 : "sounds/vocals/5.wav",
		6 : "sounds/vocals/6.wav",
		7 : "sounds/vocals/7.wav",
		8 : "sounds/vocals/8.wav",
		9 : "sounds/vocals/9.wav",
		10 : "sounds/vocals/10.wav",
		11 : "sounds/vocals/11.wav",
		12 : "sounds/vocals/12.wav",
		13 : "sounds/vocals/13.wav",
		14 : "sounds/vocals/14.wav"
	}
}).toMaster();

var instrumental = new Tone.Player({
	"url" : "sounds/instrumental.wav",
}).toMaster();

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

Tone.Buffer.on("load", function(){
	//move these two guys into a button
	Tone.Transport.start();
	instrumental.start();
	//instrumental.stop to stop it
});