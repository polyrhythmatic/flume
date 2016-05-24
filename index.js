window.onload = function(){
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	context.setAlpha(0.003);
	var img = new Image();
	img.src = "mask.png";
	context.drawImage(img, 0, 0, 800, 800);

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
			// currentMouse = 1;
			schedulePlay(1);
			break;
		case "25500":
			// currentMouse = 2;
			schedulePlay(2);
			break;
		case "00255":
			// currentMouse = 3;
			schedulePlay(3);
			break;
		case "02550":
			// currentMouse = 4;
			schedulePlay(4);
			break;
		case "2552550":
			// currentMouse = 5;
			schedulePlay(5);
			break;
		case "2550255":
			// currentMouse = 6;
			schedulePlay(6);
			break;
		case "0255255":
			// currentMouse = 7;
			schedulePlay(7);
			break;
		case "2552550":
			// currentMouse = 8;
			schedulePlay(8);
			break;
	}
}

function schedulePlay(num){
	if(currentMouse != num){
		currentMouse = num;
		console.log("here");
		sampler.triggerAttack("A." + num, Tone.context.currentTime);
	}
}

var sampler = new Tone.Sampler({
	A : {
		1 : "vocals/1.wav",
		2 : "vocals/2.wav",
		3 : "vocals/3.wav",
		4 : "vocals/4.wav",
		5 : "vocals/5.wav",
		6 : "vocals/6.wav",
		7 : "vocals/7.wav",
		8 : "vocals/8.wav",
		9 : "vocals/9.wav",
		10 : "vocals/10.wav",
		11 : "vocals/11.wav",
		12 : "vocals/12.wav",
		13 : "vocals/13.wav",
		14 : "vocals/14.wav"
	}
}).toMaster();

var instrumental = new Tone.Player({
	"url" : "instrumental.wav",
	"autostart" : true 
}).toMaster();

Tone.Buffer.on("load", function(){
	// sampler.triggerAttack("A.1", Tone.context.currentTime);
});