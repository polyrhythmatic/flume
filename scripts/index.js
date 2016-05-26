window.onload = function(){
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	context.globalAlpha = 0.3;
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
	switch(color) {
		case "000":
			if(currentMouse !== 0) {
				sampler.triggerRelease(Tone.context.currentTime);
			}
			currentMouse = 0;
			break;
		case "255255255":
			schedulePlay(1);
			break;
		case "2552550":
			schedulePlay(2);
			break;
		case "2550255":
			schedulePlay(3);
			break;
		case "0255255":
			schedulePlay(4);
			break;
		case "25500":
			schedulePlay(5);
			break;
		case "02550":
			schedulePlay(6);
			break;
		case "00255":
			schedulePlay(7);
			break;
		case "130130130":
			schedulePlay(8);
			break;
		case "1301300":
			schedulePlay(9);
			break;
		case "0130130":
			schedulePlay(10);
			break;
		case "1300130":
			schedulePlay(11);
			break;
		case "13000":
			schedulePlay(12);
			break;
		case "00130":
			schedulePlay(13);
			break;
		case "01300":
			schedulePlay(14);
			break;
	}
}

function schedulePlay(num){
	if(currentMouse != num){
		currentMouse = num;
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
	// instrumental.start();
	//instrumental.stop to stop it
});