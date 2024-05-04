import { Pos } from './pos';

export class Rect {
	startPos: Pos;
	endPos: Pos;

	constructor(startPos: Pos, endPos: Pos) {
		this.startPos = startPos;
		this.endPos = endPos;
	}

	static from(startPos: Pos, endPos: Pos): Rect {
		return new Rect(startPos, endPos);
	}

	get x(): number {
		return Math.min(this.startPos.x, this.endPos.x);
	}

	get y(): number {
		return Math.min(this.startPos.y, this.endPos.y);
	}

	get width(): number {
		return Math.abs(this.startPos.x - this.endPos.x);
	}

	get height(): number {
		return Math.abs(this.startPos.y - this.endPos.y);
	}

	static intersection(r1: Rect, r2: Rect): Rect | null {
		const x = Math.max(r1.x, r2.x);
		const y = Math.max(r1.y, r2.y);
		const width = Math.min(r1.x + r1.width, r2.x + r2.width) - x;
		const height = Math.min(r1.y + r1.height, r2.y + r2.height) - y;
		if (width <= 0 || height <= 0) {
			return null;
		}
		return new Rect(Pos.from({x, y}), Pos.from({x: x + width, y: y + height}));
	}
}

