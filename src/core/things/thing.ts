import { Pos } from "../../pos";
import {Emitter} from '../emitter';
import type { World } from "../world";

function *move(from: Pos, to: Pos, time: number): Generator<Pos> {
	const startTime = Date.now();
	let t = 0
	while (t <= 1) {
		const dt = Date.now() - startTime;
		t = dt/time;
		if(t >= 1){
			return to;
		}
		yield from.add(to.sub(from).mul(t));
	}
}

export class Thing extends Emitter<any> {
	status = 'idle';
	pos: Pos;
	lastPos: Pos;
	act: Generator<Pos> | null = null;
	
	constructor(pos: Pos, public world: World){
		super();
		this.pos = pos;
		this.lastPos = pos;
		this.field?.addThing(this);
	}

	move(tp: Pos, time = 100){
		if(this.act) return;
		if(this.world.getPos(this.worldPos.add(tp))?.thing) return;
		this.field?.rmThing(this);
		this.act = move(this.pos, this.worldPos.add(tp), time);
	}

	get lastField() {
		return this.world.getPos(this.lastPos);
	}
	get field() {
		return this.world.getPos(this.worldPos);
	}

	get worldPos() {
		return this.pos.round();
	}

	update(){
		if(this.act){
			const a = this.act.next();

			this.pos = a.value;
			this.emit('change', {});

			if(!this.worldPos.eq(this.lastPos)){
				this.lastField.thing = null;
				this.lastField.emit('thing:leave')
				this.field.thing = this;
				this.field.emit('thing:enter')
				this.lastPos = this.pos.round()
			}

			if(a.done){
				this.act = null;
				this.world.getPos(this.pos.round())?.addThing(this);
				return;
			}
		}
	}
}
