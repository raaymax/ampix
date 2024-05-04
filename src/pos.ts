
export class Pos{
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	static from(pos: {x: number, y: number}): Pos {
		return new Pos(pos.x, pos.y);
	}

	eq(p2: Pos): boolean {
		return this.x === p2.x && this.y === p2.y;
	}

	add(p2: Pos): Pos {
		return new Pos(this.x + p2.x, this.y + p2.y);
	}

	sub(p2: Pos): Pos {
		return new Pos(this.x - p2.x, this.y - p2.y);
	}

	mul(p: number): Pos {
		return new Pos(this.x * p, this.y * p);
	}

	div(p: number): Pos {
		return new Pos(this.x / p, this.y / p);
	}

	up(): Pos {
		return new Pos(this.x, this.y - 1);
	}

	down(): Pos {
		return new Pos(this.x, this.y + 1);
	}

	left(): Pos {
		return new Pos(this.x - 1, this.y);
	}

	right(): Pos {
		return new Pos(this.x + 1, this.y);
	}
}

