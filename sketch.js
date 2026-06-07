// new Canvas('16:9'); // create the largest 16:9 canvas possible
const S = 0.5;
await Canvas(1280 * S, 720 * S);
displayMode(MAXED, PIXELATED);
// 2560x1440

let shouldConnectLines = true;
let startGame = false;
let time = 0;
let levelFrameCount = 0;
let playerPositions = [];
let playerOrigin;
let titleScreen = true;
let endScreen = false;
let player;
let level = 1;
let deaths = -1;
let levelTimer = 0;
let t = 0;
let showHint = false;
let art = 0;
let slowmoEnabled = false;

loadFont('ui/space_age.ttf');

let ui = new Group();
ui.anis.frameDelay = 16;
ui.addAnis(await load('ui/buttons.png'), {
	button0: { width: 128, height: 48, frames: 3 },
	button1: { y: 48, width: 64, height: 32, frames: 3 }
});

let titleButton = new ui.Sprite(0, height / 2 - 40, 'static');
titleButton.changeAni('button0');
titleButton.ani.offset.y = 4;
titleButton.text = 'Play';
titleButton.textSize = 35;
titleButton.textFill = 'cyan';
titleButton.fill = '#1b3dc4';

let hintButton = new ui.Sprite(10000, 10000, 53, 23, 'static');
hintButton.changeAni('button1');
hintButton.text = 'HINT';
hintButton.textSize = 14;
hintButton.overlap(allSprites);

let slowmoButton = new ui.Sprite(10000, 10000, 53, 23, 'static');
slowmoButton.changeAni('button1');
slowmoButton.text = 'PRACTICE';
slowmoButton.fill = '#4170b8';
slowmoButton.textSize = 24 * S;

let cosmicSound = loadSound('sound/CosmicClone.ogg');
cosmicSound.volume = 0.2;

let hitSounds = [];
for (let i = 0; i < 5; i++) {
	let hitSound = loadSound('sound/hit' + i + '.ogg');
	hitSound.volume = 0.2;
	hitSounds.push(hitSound);
}

let fallSounds = [];
for (let i = 0; i < 5; i++) {
	let fallSound = loadSound('sound/Fall' + i + '.ogg');
	fallSound.volume = 0.1;
	fallSounds.push(fallSound);
}

let goalCollectSound = loadSound('sound/Goal0.ogg');
goalCollectSound.volume = 0.2;

let goalSound = loadSound('sound/Goal1.ogg');
goalSound.volume = 0.2;

world.gravity.y = 10 * S;

let primary = color(0.7);

let spells = new Group();
spells.anis.w = 64;
spells.anis.h = 64;
spells.addAnis('spells/spells0.png', {
	spell0: { row: 0, frames: 17 },
	spell1: { row: 1, frames: 15 },
	spell2: { row: 2, frames: 18 }
});
spells.addAnis('spells/spells1.png', {
	spell3: { row: 0, frames: 7 },
	spell4: { row: 1, frames: 7 },
	spell5: { row: 2, frames: 8 },
	spell6: { row: 3, frames: 9 },
	spell7: { row: 4, frames: 9 },
	spell8: { row: 5, frames: 9 },
	spell9: { row: 6, frames: 9 },
	spell10: { row: 7, frames: 10 },
	spell11: { row: 8, frames: 11 }
});
spells.addAnis('spells/spells2.png', {
	spell12: { row: 0, frames: 11 }
});
spells.addAnis('spells/spells3.png', {
	spell13: { row: 0, frames: 12, width: 48, height: 48 },
	spell14: { row: 1, frames: 12, width: 48, height: 48 },
	spell15: { row: 2, frames: 15, width: 48, height: 48 },
	spell16: { row: 3, frames: 15, width: 48, height: 48 },
	spell17: { row: 4, frames: 15, width: 48, height: 48 },
	spell18: { row: 5, frames: 15, width: 48, height: 48 },
	spell19: { row: 6, frames: 12, width: 48, height: 48 },
	spell20: { row: 7, frames: 11, width: 48, height: 48 },
	spell21: { row: 8, frames: 12, width: 48, height: 48 }
});

let effects = new Group();
effects.anis.w = 96;
effects.anis.h = 96;
effects.physics = NONE;
effects.addAnis('fx/GoalEffect.png', {
	warp2: { row: 0, frames: 10 }
});

let platforms = new Group();
platforms.physics = KIN;
platforms.color = color('#00ff26');
platforms.vel.y = -1 * S;
platforms.w = 40 * S;
platforms.h = 20 * S;

let obstacles = new Group();
obstacles.physics = STATIC;
obstacles.color = primary;
obstacles.w = 16 * S;
obstacles.h = 64 * S;
obstacles.addAnis('objects/smallObstacle.png', {
	middle: { row: 1, width: 16, height: 64, frames: 8 },
	end: { row: 7, width: 24, height: 64, frames: 8 }
});
obstacles.draw = function () {
	pushMatrix();
	let length;
	if (this.w < this.h) {
		rotate(90);
		length = this.h;
	} else {
		length = this.w;
	}

	let amount = length / 16;

	let mid = (amount - 1) / 2;

	let curFrame = obstacles.anis.middle.frame;

	for (let i = -mid; i <= mid; i++) {
		obstacles.anis.middle.frame = curFrame;
		animation(obstacles.anis.middle, 16 * i + 4, 0);
	}

	let curEndFrame = obstacles.anis.end.frame;
	animation(obstacles.anis.end, -16 * (mid + 1) + 4, 0);
	translate(16 * (mid + 1) - 4, 0);
	rotate(180);
	obstacles.anis.end.frame = curEndFrame;
	animation(obstacles.anis.end, 0, 0);

	if (frameCount % 4 == 0) {
		obstacles.anis.middle.nextFrame();
		obstacles.anis.end.nextFrame();
	}

	popMatrix();
};

let goals = new Group();
goals.physics = STATIC;
goals.diameter = 16 * S;
goals.layer = 1;
goals.addAni('objects/Goal.png', {
	width: 48,
	height: 48,
	frames: 40
});

let lines = new Group();
lines.physics = STATIC;
lines.friction = 0;
lines.life = 200;
lines.color = primary;

let nodes = new Group();
nodes.physics = NONE;
nodes.diameter = 8 * S;
nodes.life = 200;
nodes.color = primary;
nodes.draw = function () {
	ellipse(0, 0, this.diameter);
};

let players = new Group();
players.physics = 'static';
players.diameter = 24 * S;
players.layer = 2;
players.addAni('objects/Player.png', {
	width: 24,
	height: 24,
	frames: 24
});

let cosmicClones = new Group();
cosmicClones.physics = KINEMATIC;
cosmicClones.diameter = 20 * S;
cosmicClones.color = '#ce0df5ff';

players.collide(obstacles, lose);
players.collide(cosmicClones, () => {
	cosmicSound.play();
	resetLevel();
});
players.overlap(goals, async (player, goal) => {
	new effects.Sprite(goal.x, goal.y);
	if (goals.length > 0) {
		goalCollectSound.play();
	} else {
		goalSound.play();
	}
	await delay(500);
	effects.deleteAll();
	goal.delete();
	if (!goals.length) win();
});

function lose() {
	hitSounds[floor(random(hitSounds.length))].play();
	resetLevel();
}

function title() {
	fill('cyan');
	textSize(71);
	textAlign(CENTER, MIDDLE);
	text('Draw', 0, -160);
	text('The', 0, -80);
	text('Line', 0, 0);

	textSize(35);
	text('By: Ben', 0, 60);
	if (titleButton.mouse.presses()) {
		createLevel();
		titleScreen = false;
		titleButton.delete();
		startGame = true;
		textAlign(LEFT);
	}
}

function createLevel() {
	goals.coords = [];

	if (level <= 1) {
		playerOrigin = [-40, -160];
		goals.coords.push([60, 240]);
		if (level == 1) {
			new obstacles.Sprite(10 * S, 40 * S, 26 * S, 86 * S);
		}
	} else if (level == 2) {
		playerOrigin = [-240, -110];
		goals.coords.push([210, -60]);
	} else if (level == 3) {
		playerOrigin = [-440, -160];
		goals.coords.push([410, 140]);
		new obstacles.Sprite(-340 * S, -60 * S, 800 * S, 26 * S);
	} else if (level <= 6) {
		playerOrigin = [-440, -210];
		new obstacles.Sprite(0 * S, -160 * S, 26 * S, 600 * S);
		if (level == 4) {
			goals.coords.push([410, 140]);
		} else if (level == 5) {
			goals.coords.push([410, 90]);
		} else if (level == 6) {
			goals.coords.push([410, 40]);
		}
	} else if (level <= 10) {
		playerOrigin = [-240, -260];
		goals.coords.push([260, 240]);
		if (level == 7) {
			new obstacles.Sprite(10 * S, 140 * S, 26 * S, 400 * S);
		} else if (level == 8) {
			new obstacles.Sprite(10 * S, 40 * S, 26 * S, 400 * S);
		} else if (level == 9) {
			new obstacles.Sprite(147 * S, -160 * S, 300 * S, 26 * S);
			new obstacles.Sprite(10 * S, 240 * S, 26 * S, 500 * S);
		} else if (level == 10) {
			new obstacles.Sprite(225 * S, -160 * S, 300 * S, 26 * S);
			new obstacles.Sprite(10 * S, 240 * S, 26 * S, 800 * S);
		}
	} else if (level <= 13) {
		playerOrigin = [-240, -260];
		goals.coords.push([-240, 240]);
		goals.coords.push([460, 0]);

		if (level == 11) {
			new obstacles.Sprite(10 * S, 40 * S, 26 * S, 200 * S);
		} else if (level == 12) {
			new obstacles.Sprite(10 * S, 40 * S, 26 * S, 400 * S);
		} else if (level == 13) {
			new obstacles.Sprite(10 * S, 40 * S, 26 * S, 500 * S);
		}
	} else if (level <= 16) {
		if (level == 14) {
			playerOrigin = [-440, -210];
			goals.coords.push([410, 140]);
			new obstacles.Sprite(-240 * S, -260 * S, 26 * S, 500 * S);
			new obstacles.Sprite(160 * S, 240 * S, 26 * S, 500 * S);
		} else if (level == 15) {
			playerOrigin = [-440, -260];
			goals.coords.push([410, 240]);
			new obstacles.Sprite(-240 * S, -260 * S, 26 * S, 550 * S);
			new obstacles.Sprite(160 * S, 240 * S, 26 * S, 550 * S);
		} else if (level == 16) {
			playerOrigin = [-440, -310];
			goals.coords.push([380, 310]);
			new obstacles.Sprite(-240 * S, -260 * S, 26 * S, 600 * S);
			new obstacles.Sprite(160 * S, 240 * S, 26 * S, 600 * S);
		}
	} else if (level <= 18) {
		playerOrigin = [-390, -296];
		new obstacles.Sprite(-245 * S, -160 * S, 26 * S, 600 * S);
		new obstacles.Sprite(160 * S, 140 * S, 26 * S, 600 * S);
		let plat0 = new platforms.Sprite(-390 * S, 40 * S, 200 * S, 26 * S);
		plat0.rotation = -10;
		new platforms.Sprite(-40 * S, 740 * S, 200 * S, 26 * S).rotation = 10;
		goals.coords.push([410, 240]);
		if (level == 18) {
			plat0.vel.y = 1 * S;
			plat0.y = -370 * S;
		}
	} else if (level == 19) {
		playerOrigin = [-390, -310];
		goals.coords.push([410, 240]);
		for (let i = 0; i < 20; i++) {
			for (let j = 0; j < 11; j++) {
				let stagger = 0;
				if (i % 2 == 1) stagger = 40;
				new platforms.Sprite((i * 80 - 640) * S, (j * 80 + stagger - 360) * S);
			}
		}
	} else if (level == 20) {
		playerOrigin = [-390, -310];
		goals.physics = KINEMATIC;
		goals.coords.push([0, 0]);
	}

	for (let plat of platforms) {
		plat.initY = plat.y;
		plat.initX = plat.x;
	}

	players.x = () => playerOrigin[0] * S;
	players.y = () => playerOrigin[1] * S;

	resetLevel();
}

function resetLevel() {
	players.deleteAll();
	lines.deleteAll();
	nodes.deleteAll();
	goals.deleteAll();
	levelFrameCount = 0;
	player = new players.Sprite();
	playerPositions = [];
	cosmicClones.deleteAll();

	for (let coord of goals.coords) {
		new goals.Sprite(coord[0] * S, coord[1] * S);
	}

	for (let plat of platforms) {
		plat.y = plat.initY;
		plat.x = plat.initX;
	}

	levelTimer = 0;
	deaths++;
}

Q5.update = function () {
	let bg0, bg1, bg2, bg3;

	if (level <= 4) {
		bg0 = color('#980000');
		bg1 = color('#e17272');
		bg2 = color('#ffbaba');
		bg3 = color('#b8180f50');
	} else if (level > 4 && level <= 8) {
		bg0 = color('#1c3026');
		bg1 = color('#27d444');
		bg2 = color('#698473');
		bg3 = color('#4ffc5d50');
	} else if (level > 8 && level <= 12) {
		bg0 = color('#ffbb00');
		bg1 = color('#ffec18');
		bg2 = color('#f0e747');
		bg3 = color('#ffdb2850');
	} else if (level > 12 && level <= 16) {
		bg0 = color('#472b4750');
		bg1 = color('#d85dd2');
		bg2 = color('#c88eba');
		bg3 = color('#fc595050');
	} else if (level > 16) {
		bg0 = color('#1b3dc450');
		bg1 = color('#4170b8');
		bg2 = color('#1b3dc4');
		bg3 = color('#4170b850');
	}
	if (slowmoEnabled) bg0.alpha = 0.1;

	beginShape();
	fill(bg0);
	vertex(-halfWidth, -halfHeight);
	fill(bg1);
	vertex(halfWidth, -halfHeight);
	fill(bg2);
	vertex(halfWidth, halfHeight);
	fill(bg3);
	vertex(-halfWidth, halfHeight);
	endShape(CLOSE);

	camera.on();

	log(camera.x, camera.y);

	t += 0.2;
	push();
	opacity(0.5);
	let ani = spells.anis['spell' + (level % 22)];
	let curFrame;
	if (level <= 4) {
		curFrame = floor(t) % ani.length;
		for (let i = 0; i < 60; i++) {
			if (level == 1) tint(i / 60, 1, i / 60);
			else if (level == 4) tint(i / 60, i / 60, 1);
			else tint(i / 60 + 0.5, 1, i / 60 + 0.5);

			ani.frame = (curFrame + i) % ani.length;
			animation(ani, cos(t + i * 10) * 350, sin(t + i * 20) * 200);
		}
	} else if (level > 4 && level <= 8) {
		curFrame = floor(t) % ani.length;
		for (let i = 0; i < 40; i++) {
			ani.frame = (curFrame + i) % ani.length;
			animation(ani, cos(t + i * 10) * 700, sin(t + i * 30) * 400);
			strokeWeight(4);
			stroke(0.2, 0.2, 0.5, 0.5);
			line(cos(t + i * 10) * 700, sin(t + i * 30) * 400, 140, 150);
		}
	} else if (level > 8 && level <= 12) {
		ani.frameDelay = 300;
		for (let i = 0; i < 70; i++) {
			translate(cos(t + i * 20) * 400, sin(t + i * 30) * 200);
			scale(noise(frameCount * 0.01, i) * 3, noise(frameCount * 0.01, i) * 3);
			animation(ani, 0, 0);
			resetMatrix();
		}
	} else if (level > 12 && level <= 16) {
		ani.frameDelay = 650;
		for (let i = 0; i < 100; i++) {
			let nx = noise(frameCount * 0.004 + i * 50) * 2300 - 1150;
			let ny = noise(frameCount * 0.004 + 1000 + i * 50) * 2300 - 1150;
			fill('#00ff4050');
			strokeWeight(10);
			stroke('#00ff4070');
			animation(ani, nx, ny);
		}
	} else if (level > 16 && level <= 20) {
		levelFrameCount++;
		if (levelFrameCount > 180) {
			playerPositions.push([player.x, player.y]);

			if ((levelFrameCount - 60) % 120 == 0) {
				new cosmicClones.Sprite();
			}

			for (let i = 0; i < cosmicClones.length; i++) {
				let clone = cosmicClones[i];
				let idx = levelFrameCount - 300 - i * 120;
				log(idx);
				clone.x = playerPositions[idx][0];
				clone.y = playerPositions[idx][1];
			}
		}
	}
	opacity(1);
	pop();
	if (titleScreen) {
		title();

		return;
	}
	if (endScreen) {
		fill(255);
		textSize(32);
		text('Congratulations!\nYou beat the game!', -200, 0);
		players.deleteAll();
		return;
	}

	if (level <= 5) {
		if (deaths >= 1) hint();
	} else {
		if (deaths >= 5) slowmo();
	}

	fill(primary);
	stroke(primary);
	if (!startGame) {
		return;
	}
	levelTimer++;

	if (levelTimer < 200) {
		player.opacity = levelTimer / 200;
	} else {
		player.physics = 'dynamic';
	}

	if (player.y - player.h * 2 > halfHeight || player.y + player.h * 2 < -halfHeight) {
		fallSounds[Math.floor(random(fallSounds.length))].play();
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
		lines.deleteAll();
		nodes.deleteAll();
	}
	if (kb.presses('enter')) {
		win();
	}

	for (let plat of platforms) {
		if (plat.y < -220) {
			plat.y = 220;
		}
	}

	if (level == 20) {
		for (let goal of goals) {
			goal.moveTowards(player.x + (100 - levelTimer / 20), 100, 0.1);
		}
	}

	if (level > 20) {
		endScreen = true;
	}

	textSize(128 * S);
	fill(255, 128);
	strokeWeight(0);
	text(level, -590 * S, -240 * S);
	strokeWeight(1);
};

function slowmo() {
	slowmoButton.x = 540 * S;
	slowmoButton.y = 330 * S;

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

function hint() {
	if (!showHint) {
		hintButton.x = 580 * S;
		hintButton.y = 330 * S;
		if (hintButton.mouse.presses()) {
			showHint = true;
			hintButton.x = 10000 * S;
			hintButton.y = 10000 * S;
		} else return;
	}

	scale(0.5);

	if (level == 0) {
		stroke('lime');
		line(-60, -160, 50, 270);
	}
	if (level == 1) {
		stroke('lime');
		line(-60, -160, -60, 240);
		line(-60, 240, 80, 240);
	}
	if (level == 2) {
		stroke('lime');
		line(-260, -100, 230, -50);
		line(-260, -90, 230, -40);
	}
	if (level == 3) {
		stroke('lime');
		line(-460, -170, -420, -110);
		line(-420, -110, 160, -90);
		line(-420, -105, 160, -85);
		line(160, -85, 420, 150);
	}
	if (level == 4) {
		stroke('lime');
		line(-450, -200, -110, 180);
		line(-110, 180, 420, 150);
	}
	if (level == 5) {
		stroke('lime');
		line(-80, 210, 80, 210);
	}
	scale(2);
}

function win() {
	players.deleteAll();
	lines.deleteAll();
	nodes.deleteAll();
	goals.deleteAll();
	obstacles.deleteAll();
	platforms.deleteAll();
	hintButton.x = 10000 * S;
	if (slowmoEnabled) {
		resetLevel();
		level--;
	}
	level++;
	deaths = 0;
	createLevel();
	showHint = false;
	slowmoEnabled = false;
	slowmoButton.text = 'PRACTICE';
}
