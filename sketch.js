let player, players, obstacles, nodes, lines, goals;

let primary, secondary, bright, startTimer;

let shouldConnectLines = true;

new Q5();

let hintButton = new Sprite(10000, 10000, 100, 50, 'static');
hintButton.text = 'HINT';
let slowmoButton = new Sprite(10000, 10000, 100, 50, 'static');
slowmoButton.text = 'PRACTICE';

function setup() {
	// new Canvas('16:9'); // create the largest 16:9 canvas possible
	new Canvas(1280, 720);
	displayMode('centered');
	// 2560x1440

	world.gravity.y = 10;

	primary = color(200);
	secondary = color(20);

	obstacles = new Group();
	obstacles.collider = 'static';
	obstacles.color = primary;
	obstacles.w = 26;
	obstacles.h = 86;

	goals = new Group();
	goals.collider = 'static';
	goals.color = 'cyan';
	goals.diameter = 20;
	goals.draw = function () {
		shadow('cyan');
		shadowBox(0, 0, this.diameter);
		ellipse(0, 0, this.diameter);
	};

	lines = new Group();
	lines.collider = 'static';
	lines.friction = 0;
	lines.life = 200;
	lines.color = primary;

	nodes = new Group();
	nodes.collider = 'none';
	nodes.diameter = 8;
	nodes.life = 200;
	nodes.color = primary;
	nodes.draw = function () {
		// draw a star
		shadow(primary);
		shadowBox(0, 0, this.diameter);
		ellipse(0, 0, this.diameter);
	};

	players = new Group();
	players.collider = 'static';
	players.diameter = 20;
	players.color = 'white';
	players.draw = function () {
		shadow('white');
		shadowBox(0, 0, this.diameter);
		ellipse(0, 0, this.diameter);
	};

	players.collide(obstacles, resetLevel);

	players.overlap(goals, (player, goal) => {
		goal.remove();
		if (!goals.length) win();
	});

	createLevel();
}

function createLevel() {
	let start;
	goals.coords = [];

	if (level <= 1) {
		start = [600, 200];
		goals.coords.push([700, 600]);
		if (level == 1) {
			new obstacles.Sprite(650, 400);
		}
	} else if (level == 2) {
		start = [400, 250];
		goals.coords.push([850, 300]);
	} else if (level == 3) {
		start = [200, 200];
		goals.coords.push([1050, 500]);
		new obstacles.Sprite(300, 300, 800, 26);
	} else if (level <= 6) {
		start = [200, 150];
		new obstacles.Sprite(640, 200, 26, 600);
		if (level == 4) {
			goals.coords.push([1050, 500]);
		} else if (level == 5) {
			goals.coords.push([1050, 450]);
		} else if (level == 6) {
			goals.coords.push([1050, 400]);
		}
	} else if (level <= 10) {
		start = [400, 100];
		goals.coords.push([900, 600]);
		if (level == 7) {
			new obstacles.Sprite(650, 500, 26, 400);
		} else if (level == 8) {
			new obstacles.Sprite(650, 400, 26, 400);
		} else if (level == 9) {
			new obstacles.Sprite(787, 200, 300, 26);
			new obstacles.Sprite(650, 600, 26, 500);
		} else if (level == 10) {
			new obstacles.Sprite(787, 200, 300, 26);
			new obstacles.Sprite(650, 600, 26, 800);
		}
	} else if (level <= 13) {
		start = [400, 100];
		goals.coords.push([400, 600]);
		goals.coords.push([1100, 360]);

		if (level == 11) {
			new obstacles.Sprite(650, 400, 26, 200);
		} else if (level == 12) {
			new obstacles.Sprite(650, 400, 26, 400);
		} else if (level == 13) {
			new obstacles.Sprite(650, 400, 26, 500);
		}
	} else if (level <= 16) {
		if (level == 14) {
			start = [200, 150];
			goals.coords.push([1050, 500]);
			new obstacles.Sprite(400, 100, 26, 500);
			new obstacles.Sprite(800, 600, 26, 500);
		} else if (level == 15) {
			start = [200, 100];
			goals.coords.push([1050, 600]);
			new obstacles.Sprite(400, 100, 26, 550);
			new obstacles.Sprite(800, 600, 26, 550);
		} else if (level == 16) {
			start = [200, 50];
			goals.coords.push([1050, 700]);
			new obstacles.Sprite(400, 100, 26, 600);
			new obstacles.Sprite(800, 600, 26, 600);
		}
	} else if (level == 17) {
		start = [250, 64];
		new obstacles.Sprite(395, 250, 26, 400);
		new obstacles.Sprite(600, 400, 26, 400);
	}

	players.x = () => start[0];
	players.y = () => start[1];

	resetLevel();
}

let level = 17;

let deaths = -1;
function resetLevel() {
	players.removeAll();
	lines.removeAll();
	nodes.removeAll();
	goals.removeAll();

	player = new players.Sprite();

	for (let coord of goals.coords) {
		new goals.Sprite(coord[0], coord[1]);
	}

	startTimer = 200;
	deaths++;
	background(secondary);
}

function update() {
	if (!slowmoEnabled) background(secondary);
	else background(20, 20);

	if (deaths >= 1) {
		if (level <= 5) hint();
		else slowmo();
	}

	fill(primary);
	stroke(primary);

	startTimer--;

	if (startTimer > 0) {
		player.color = -startTimer + 256;
	} else {
		player.collider = 'dynamic';
	}

	if (player.y - player.h * 2 > height) {
		resetLevel();
	}

	for (let line of lines) {
		line.stroke = color(255, line.life);
	}

	for (let node of nodes) {
		node.fill = color(255, node.life);
		node.stroke = color(200, node.life + 55);
	}

	if (mouse.presses()) {
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
	textSize(128);
	fill(255, 128);
	strokeWeight(0);
	text(level, 0, 108);
	strokeWeight(1);
}

let slowmoEnabled = false;

function slowmo() {
	slowmoButton.x = 1200;
	slowmoButton.y = 700;

	if (slowmoButton.mouse.presses()) {
		if (slowmoEnabled) {
			slowmoButton.text = 'PRACTICE';
			slowmoEnabled = false;
			resetLevel();
		} else {
			slowmoButton.text = 'PRACTICE_OFF';
			slowmoEnabled = true;
		}
	}
	if (slowmoEnabled) world.timeScale = 0.5;
	else world.timeScale = 1;
}

let showHint = false;

function hint() {
	if (!showHint) {
		hintButton.x = 1200;
		hintButton.y = 700;
		if (hintButton.mouse.presses()) {
			showHint = true;
			hintButton.x = 10000;
			hintButton.y = 10000;
		} else return;
	}

	if (level == 0) {
		ctx.setLineDash([5, 15]);
		stroke('lime');
		line(580, 200, 690, 630);
		ctx.setLineDash([]);
	}
	if (level == 1) {
		ctx.setLineDash([5, 15]);
		stroke('lime');
		line(580, 200, 580, 600);
		line(580, 600, 720, 600);
		ctx.setLineDash([]);
	}
	if (level == 2) {
		ctx.setLineDash([5, 15]);
		stroke('lime');
		line(380, 260, 870, 310);
		line(380, 270, 870, 320);
		ctx.setLineDash([]);
	}
	if (level == 3) {
		ctx.setLineDash([5, 15]);
		stroke('lime');
		line(180, 190, 220, 250);
		line(220, 250, 800, 270);
		line(220, 255, 800, 275);
		line(800, 275, 1060, 510);
		ctx.setLineDash([]);
	}
	if (level == 4) {
		ctx.setLineDash([5, 15]);
		stroke('lime');
		line(190, 160, 530, 540);
		line(530, 540, 1060, 510);
		ctx.setLineDash([]);
	}
	if (level == 5) {
		ctx.setLineDash([5, 15]);
		stroke('lime');
		line(560, 570, 720, 570);
		ctx.setLineDash([]);
	}
}

function win() {
	players.removeAll();
	lines.removeAll();
	nodes.removeAll();
	goals.removeAll();
	obstacles.removeAll();
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
