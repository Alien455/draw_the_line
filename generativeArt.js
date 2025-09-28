let time = 0;
let art = 4;

function draw() {
	translate(width * 0.5, height * 0.5);

	if (art == 4) strokeWeight(random(5, 10));
	else strokeWeight(5);

	if (art == 4 || art == 8 || art == 9) {
		stroke(random(100, 255), random(100, 255), random(100, 255));
	} else if (art == 3) {
		stroke(random(0, 255), random(0, 255), 20);
	} else if (art == 6) {
		stroke('g');
	} else {
		stroke('w');
	}

	if (art == 3 || art == 6) {
		background(80, 0, 0, 10);
	} else if (art == 5 || art == 7) {
		background(0, 0, 80, 50);
	} else if (art == 9) {
		background(0, 0, 0, 10);
	}

	let amount = 10;
	if (art == 4) amount = 1000;

	for (let i = 0; i < amount; i++) {
		if (art < 5) {
			point(eqx(time), eqy(time));
		} else {
			line(eqx(time), eqy(time), eqx2(time), eqy2(time));
		}
		time += 0.1;
	}

	if (kb.presses('left')) {
		background(0);
		art--;
		if (art < 0) art = 9;
	}
	if (kb.presses('right')) {
		background(0);
		art++;
		if (art > 9) art = 0;
	}
}

function eqx(t) {
	if (art == 0) return cos(t * random(1, 5)) * 300 + cos(t) * 200;
	if (art == 1) return cos(t * 999699902) * 42;
	if (art == 2) return cos(t * 8077) * 300 + cos(t) * 200;
	if (art == 3) return cos(t * mouse.x) * 200;
	if (art == 4) return cos(t) * random(0, 50) + cos(t * 2.67) * 500;
	if (art == 5) return cos(t) * 500 + cos(t * 4) * 200;
	if (art == 6) return cos(t * mouse.x) + cos(t * 6);
	if (art == 7) return cos(t * 50) * 55 + cos(t * 99) * 300;
	if (art == 8) return cos(t) * 500 + cos(t * 30) * 500;
	if (art == 9) return cos(t * random(0, 500)) * sin(t) * 500;
}

function eqy(t) {
	if (art == 0 || art == 1) return sin(t) * 200;
	if (art == 2) return sin(t) * 300;
	if (art == 3) return sin(t) * mouse.y;
	if (art == 4) return sin(t) * 500;
	if (art == 5) return sin(t) * 200;
	if (art == 6) return sin(t * mouse.y) * 500;
	if (art == 7) return sin(t * 50) * 340;
	if (art == 8) return sin(t) * 500;
	if (art == 9) return sin(t * 500) * sin(t) * 500 + sin(t) * 1000 + 500;
}

function eqx2(t) {
	if (art == 5) return cos(t) * 500;
	if (art == 6) return cos(t) * 420;
	if (art == 7) return cos(t) * 1;
	if (art == 8) return cos(t) * 500;
	if (art == 9) return 0;
}

function eqy2(t) {
	if (art == 5) return sin(t) * 500;
	if (art == 6) return sin(t * mouse.y) * 50;
	if (art == 7) return sin(t) * 500;
	if (art == 8) return sin(t) * 500;
	if (art == 9) return sin(t) * 1000 + 500;
}
