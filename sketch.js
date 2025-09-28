let q = await Q5.WebGPU();
let shouldConnectLines = true;

let startGame = false;

let time = 0;

loadFont('/space_age.ttf');

let hintButton = new Sprite(10000, 10000, 100, 50, 'static');
hintButton.text = 'HINT';
hintButton.textSize = 24;
hintButton.fill = '#4170b8';
let slowmoButton = new Sprite(10000, 10000, 200, 50, 'static');
slowmoButton.text = 'PRACTICE';
slowmoButton.fill = '#4170b8';
slowmoButton.textSize = 24;
let titleButton = new Sprite(10000, 100000, 130, 50, 'static');
titleButton.text = 'Click to Play!';
titleButton.textFill = 'cyan';
titleButton.fill = '#1b3dc4';

// new Canvas('16:9'); // create the largest 16:9 canvas possible
new Canvas(1280, 720);
displayMode(CENTER);
// 2560x1440

world.gravity.y = 10;

let primary = color(0.7);
let secondary = color(0.1);

let platforms = new Group();
platforms.physics = KIN;
platforms.color = color('#00ff26');
platforms.vel.y = -1;
platforms.w = 40;
platforms.h = 20;

let obstacles = new Group();
obstacles.physics = STATIC;
obstacles.color = primary;
obstacles.w = 26;
obstacles.h = 86;

let goals = new Group();
goals.physics = STATIC;
goals.diameter = 26;
goals.draw = function () {
	//shadow('cyan');
	//shadowBox(0, 0, this.diameter);

	//noShadow();

	for (let i = 0; i < 60; i++) {
		fill(0, i * 4, i * 5, i * 5);
		for (let j = 0; j < 3; j++) {
			let a = frameCount + i * 2 + j * 120;
			let size = 13;
			circle(cos(a) * size, sin(a) * size, 2);
		}
	}

	// shadow('cyan');
	// shadowBox(0, 0, this.diameter);
	fill(0, 0, 0, 255);
	circle(0, 0, this.diameter);
};

let lines = new Group();
lines.physics = STATIC;
lines.friction = 0;
lines.life = 200;
lines.color = primary;

let nodes = new Group();
nodes.physics = NONE;
nodes.diameter = 8;
nodes.life = 200;
nodes.color = primary;
nodes.draw = function () {
	// draw a star
	// shadow(primary);
	// shadowBox(0, 0, this.diameter);
	ellipse(0, 0, this.diameter);
};

let players = new Group();
players.physics = 'static';
players.diameter = 20;
players.color = 'white';
players.draw = function () {
	// shadow('white');
	// shadowBox(0, 0, this.diameter);
	ellipse(0, 0, this.diameter);
};

players.collide(obstacles, resetLevel);

players.overlap(goals, (player, goal) => {
	goal.remove();
	if (!goals.length) win();
});

//createLevel();
let titleScreen = true;

let player;

function title() {
	fill('cyan');
	// shadow('black');
	// shadowBox(0, 0, 20);
	textSize(70);
	textAlign(CENTER, MIDDLE);
	text('Draw The Line', 0, -100);
	text('By: Ben', 0, 0);
	titleButton.x = 0;
	titleButton.y = 100;
	if (titleButton.mouse.presses()) {
		createLevel();
		titleScreen = false;
		titleButton.remove();
		startGame = true;
		textAlign(LEFT);
	}
}

function createLevel() {
	let start;
	goals.coords = [];

	if (level <= 1) {
		start = [-40, -160];
		goals.coords.push([60, 240]);
		if (level == 1) {
			new obstacles.Sprite(10, 40);
		}
	} else if (level == 2) {
		start = [-240, -110];
		goals.coords.push([210, -60]);
	} else if (level == 3) {
		start = [-440, -160];
		goals.coords.push([410, 140]);
		new obstacles.Sprite(-340, -60, 800, 26);
	} else if (level <= 6) {
		start = [-440, -210];
		new obstacles.Sprite(0, -160, 26, 600);
		if (level == 4) {
			goals.coords.push([410, 140]);
		} else if (level == 5) {
			goals.coords.push([410, 90]);
		} else if (level == 6) {
			goals.coords.push([410, 40]);
		}
	} else if (level <= 10) {
		start = [-240, -260];
		goals.coords.push([260, 240]);
		if (level == 7) {
			new obstacles.Sprite(10, 140, 26, 400);
		} else if (level == 8) {
			new obstacles.Sprite(10, 40, 26, 400);
		} else if (level == 9) {
			new obstacles.Sprite(147, -160, 300, 26);
			new obstacles.Sprite(10, 240, 26, 500);
		} else if (level == 10) {
			new obstacles.Sprite(147, -160, 300, 26);
			new obstacles.Sprite(10, 240, 26, 800);
		}
	} else if (level <= 13) {
		start = [-240, -260];
		goals.coords.push([-240, 240]);
		goals.coords.push([460, 0]);

		if (level == 11) {
			new obstacles.Sprite(10, 40, 26, 200);
		} else if (level == 12) {
			new obstacles.Sprite(10, 40, 26, 400);
		} else if (level == 13) {
			new obstacles.Sprite(10, 40, 26, 500);
		}
	} else if (level <= 16) {
		if (level == 14) {
			start = [-440, -210];
			goals.coords.push([410, 140]);
			new obstacles.Sprite(-240, -260, 26, 500);
			new obstacles.Sprite(160, 240, 26, 500);
		} else if (level == 15) {
			start = [-440, -260];
			goals.coords.push([410, 240]);
			new obstacles.Sprite(-240, -260, 26, 550);
			new obstacles.Sprite(160, 240, 26, 550);
		} else if (level == 16) {
			start = [-440, -310];
			goals.coords.push([410, 340]);
			new obstacles.Sprite(-240, -260, 26, 600);
			new obstacles.Sprite(160, 240, 26, 600);
		}
	} else if (level <= 18) {
		start = [-390, -296];
		new obstacles.Sprite(-245, -160, 26, 600);
		new obstacles.Sprite(160, 140, 26, 600);
		let plat0 = new platforms.Sprite(-390, 40, 200, 26);
		plat0.rotation = -10;
		new platforms.Sprite(-40, 740, 200, 26).rotation = 10;
		goals.coords.push([410, 240]);
		if (level == 18) {
			plat0.vel.y = 1;
			plat0.y = -370;
		}
	} else if (level == 19) {
		start = [-390, -310];
		goals.coords.push([410, 240]);
		for (let i = 0; i < 20; i++) {
			for (let j = 0; j < 11; j++) {
				let stagger = 0;
				if (i % 2 == 1) stagger = 40;
				new platforms.Sprite(i * 80 - 640, j * 80 + stagger - 360);
			}
		}
	}

	for (let plat of platforms) {
		plat.initY = plat.y;
		plat.initX = plat.x;
	}

	players.x = () => start[0];
	players.y = () => start[1];

	resetLevel();
}

let level = 12;

let deaths = -1;
let startTimer = 0;
function resetLevel() {
	players.removeAll();
	lines.removeAll();
	nodes.removeAll();
	goals.removeAll();

	player = new players.Sprite();

	for (let coord of goals.coords) {
		new goals.Sprite(coord[0], coord[1]);
	}

	for (let plat of platforms) {
		plat.y = plat.initY;
		plat.x = plat.initX;
	}

	startTimer = 200;
	deaths++;
	background(secondary);
}
let t = 0;
q.update = function () {
	let bg = color(secondary);

	if (level > 4 && level <= 8) {
		bg = color('#1c3026');
	} else if (level > 8 && level <= 12) {
		bg = color('#945050');
	} else if (level > 12 && level <= 16) {
		bg = color('#98339850');
	}
	if (slowmoEnabled) bg.alpha = 0.1;

	background(bg);

	//camera.x = 640;
	//camera.y = 320;
	camera.on();

	log(camera.x, camera.y);

	// const gradient = ctx.createLinearGradient(0, 0, width, height);
	// gradient.addColorStop(0, '#464646'); // Start color
	// gradient.addColorStop((cos(frameCount * 0.1) + 1) / 2, '#1c1c1c');
	// gradient.addColorStop(1, '#2e2e2e'); // End color

	// const gradient2 = ctx.createLinearGradient(width, 0, 0, height);
	// gradient2.addColorStop(0, '#46464662'); // Start color
	// gradient2.addColorStop((cos(frameCount * 0.1) + 1) / 2, '#1c1c1c6e');
	// gradient2.addColorStop(1, '#2e2e2e52'); // End color

	// const gradient3 = ctx.createRadialGradient(0, 0, 1, 0, 0, width);
	// gradient3.addColorStop(0, '#46464635'); // Start color
	// gradient3.addColorStop((cos(frameCount * 0.1) + 1) / 2, '#1c1c1c5b');
	// gradient3.addColorStop(1, '#2e2e2e33'); // End color

	// // Use the gradient to fill a rectangle
	// ctx.fillStyle = gradient;
	// ctx.fillRect(0, 0, width, height);
	// ctx.fillStyle = gradient2;
	// ctx.fillRect(0, 0, width, height);
	// ctx.fillStyle = gradient3;
	// ctx.fillRect(0, 0, width, height);

	t += 0.2;

	if (level <= 4) {
		for (let i = 0; i < 20; i++) {
			fill((50 + i) / 256, (50 + i) / 256, (100 + i) / 256, (30 + i) / 256);
			strokeWeight(4);
			stroke(0.2, 0.2, 0.5, 0.5);
			ellipse(cos(t + i * 10) * 700, sin(t + i * 20) * 400, 140, 150);
		}
	} else if (level > 4 && level <= 8) {
		for (let i = 0; i < 40; i++) {
			fill((70 + i) / 256, (35 + i) / 256, (150 + i) / 256, (30 + i) / 256);
			strokeWeight(4);
			stroke(0.2, 0.2, 0.5, 0.5);
			square(cos(t + i * 10) * 700, sin(t + i * 30) * 400, 140, 150);
			fill((90 + i) / 256, (200 + i) / 256, (50 + i) / 256, (70 + i) / 256);
			line(cos(t + i * 10) * 700, sin(t + i * 30) * 400, 140, 150);
			ellipse(cos(t + i * 10) * 700, sin(t + i * 30) * 400, 140, 150);
		}
	} else if (level > 8 && level <= 12) {
		for (let i = 0; i < 70; i++) {
			fill(
				(30 + i * 1.3) / 256,
				(noise(frameCount * 0.01, i) * 100 + i * 1.2) / 256,
				(45 + i * 1.5) / 256,
				(30 * i) / 256
			);
			strokeWeight(4);
			stroke(0.2, 0.2, 0.5, 0.5);
			ellipse(
				cos(t + i * 20) * 700,
				sin(t + i * 30) * 400,
				noise(frameCount * 0.01, i) * 200,
				noise(frameCount * 0.01, i) * 150
			);
		}
		// let n = noise(frameCount * 0.004) * 500;
		// fill('#ab4949');
		// strokeWeight(0);
		// arc(n, n, 60, 60, sin(t * 30) * 20 + 20, cos(t * 30) * 20 - 20);
	} else if (level > 12 && level <= 16) {
		for (let i = 0; i < 100; i++) {
			let nx = noise(frameCount * 0.004 + i * 50) * 2300 - 1150;
			let ny = noise(frameCount * 0.004 + 1000 + i * 50) * 2300 - 1150;
			fill('#00ff4050');
			strokeWeight(10);
			stroke('#00ff4070');
			ellipse(nx, ny, 60, 40);
		}
		for (let i = 0; i < 100; i++) {
			let nx = noise(frameCount * 0.004 + i * 70) * 2300 - 1150;
			let ny = noise(frameCount * 0.004 + 1000 + i * 70) * 2300 - 1150;
			fill('#d76d6d50');
			strokeWeight(10);
			stroke('#e3c79470');
			ellipse(nx, ny, 60, 40);
		}
	}

	// 		let x = cos(t * cos(t * 3) + i * 20) * 400;
	// 		let y = sin(t * cos(t * 3) + i * 30) * 500;
	// 		fill('#fbff00');
	// 		strokeWeight(0);
	// 		arc(x, y, 60, 60, sin(t * 30) * 20 + 20, cos(t * 30) * 20 - 20);
	// 	}
	// 	player.color = color('#877538');
	// 	obstacles.color = 'blue';
	if (titleScreen) {
		title();

		return;
	}

	if (deaths >= 1) {
		if (level <= 5) hint();
		else slowmo();
	}

	fill(primary);
	stroke(primary);
	if (!startGame) {
		return;
	}
	startTimer--;

	if (startTimer > 0) {
		player.color = -startTimer + 256;
	} else {
		player.physics = 'dynamic';
	}

	if (player.y - player.h * 2 > halfHeight || player.y + player.h * 2 < -halfHeight) {
		resetLevel();
	}

	for (let line of lines) {
		line.stroke = color(1, line.life / 256);
		line.strokeWeight = (line.life / 256) * 4;
	}

	for (let node of nodes) {
		node.fill = color(1, node.life / 256);
		node.stroke = color(0.8, (node.life + 55) / 256);
	}

	if (mouse.presses() && !hintButton.mouse.pressing() && !slowmoButton.mouse.pressing()) {
		let lastNode;
		if (nodes.length) lastNode = nodes[nodes.length - 1];
		if (!nodes.length || !(lastNode.x == mouse.x && lastNode.y == mouse.y)) {
			new nodes.Sprite(mouse.x, mouse.y);
			if (nodes.length > 1 && shouldConnectLines) {
				let coords = [
					[mouse.x, mouse.y],
					[lastNode.x, lastNode.y]
				];
				new lines.Sprite(coords);
			}
			shouldConnectLines = true;
		}
	}
	if (mouse.presses('right')) {
		shouldConnectLines = false;
	}
	if (kb.presses(' ')) {
		lines.removeAll();
		nodes.removeAll();
	}
	if (kb.presses('enter')) {
		win();
	}

	for (let plat of platforms) {
		if (plat.y < -440) {
			plat.y = 440;
		}
	}
	textSize(128);
	fill(255, 128);
	strokeWeight(0);
	text(level, -590, -240);
	strokeWeight(1);
};

let slowmoEnabled = false;

function slowmo() {
	slowmoButton.x = 540;
	slowmoButton.y = 330;

	if (slowmoButton.mouse.presses()) {
		resetLevel();
		if (slowmoEnabled) {
			slowmoButton.text = 'PRACTICE';
			slowmoEnabled = false;
		} else {
			slowmoButton.text = 'PRACTICE_OFF';
			slowmoEnabled = true;
		}
	}
	if (slowmoEnabled) world.timeScale = 0.5;
	else world.timeScale = 1;
}

let showHint = false;
let art = 0;
function hint() {
	if (!showHint) {
		hintButton.x = 580;
		hintButton.y = 330;
		if (hintButton.mouse.presses()) {
			showHint = true;
			hintButton.x = 10000;
			hintButton.y = 10000;
		} else return;
	}

	translate(-640, -360);

	if (level == 0) {
		stroke('lime');
		line(580, 200, 690, 630);
	}
	if (level == 1) {
		stroke('lime');
		line(580, 200, 580, 600);
		line(580, 600, 720, 600);
	}
	if (level == 2) {
		stroke('lime');
		line(380, 260, 870, 310);
		line(380, 270, 870, 320);
	}
	if (level == 3) {
		stroke('lime');
		line(180, 190, 220, 250);
		line(220, 250, 800, 270);
		line(220, 255, 800, 275);
		line(800, 275, 1060, 510);
	}
	if (level == 4) {
		stroke('lime');
		line(190, 160, 530, 540);
		line(530, 540, 1060, 510);
	}
	if (level == 5) {
		stroke('lime');
		line(560, 570, 720, 570);
	}
	translate(640, 360);
}

function win() {
	players.removeAll();
	lines.removeAll();
	nodes.removeAll();
	goals.removeAll();
	obstacles.removeAll();
	platforms.removeAll();
	hintButton.x = 10000;
	if (slowmoEnabled) {
		resetLevel();
		level--;
	}
	level++;
	createLevel();
	showHint = false;
	slowmoEnabled = false;
	slowmoButton.text = 'PRACTICE';
}
