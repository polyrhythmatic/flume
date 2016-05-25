window.onload = function(){
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	// context.setAlpha(0.003);
	context.globalAlpha = 0.003;
	var img = new Image();
	img.src = "images/mask.png";
	img.onload = function() {
		context.drawImage(img, 0, 0, 720, 720);
	};

	canvas.onmousemove=function(e){
		handleMouseover(context.getImageData(e.offsetX, e.offsetY, 1, 1).data);
	};
};

var currentMouse = 0;

function handleMouseover(color){
	color = color[0].toString() + color[1].toString() + color[2].toString();
	console.log(color);
	switch(color) {
		case "000":
			currentMouse = 0;
			break;
		case "255255255":
			schedulePlay(1);
			break;
		case "25500":
			schedulePlay(2);
			break;
		case "00255":
			schedulePlay(3);
			break;
		case "02550":
			schedulePlay(4);
			break;
		case "2552550":
			schedulePlay(5);
			break;
		case "2550255":
			schedulePlay(6);
			break;
		case "0255255":
			schedulePlay(7);
			break;
		case "2552550":
			schedulePlay(8);
			break;
	}
}

function schedulePlay(num){
	if(currentMouse != num){
		currentMouse = num;
		var nextNote = Math.floor(Tone.context.currentTime / 0.25);
		sampler.triggerAttack("A." + num, nextNote.toString() + "n");
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
	"autostart" : true 
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
	console.log("loaded");
	Tone.Transport.start();
});