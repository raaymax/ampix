import { Component } from "./components/component";
import { Pos } from "../pos";
import Components from "./components";
import { Field } from "./field";

export class World {
	ctrls: Component[] = [];
	data: Field[];

	constructor(public width: number, public height: number) {
		this.data = Array(width * height).fill(null)
			.map((_, idx) => new Field(idx % width, Math.floor(idx / width)));
	}

	isPosValid(pos: Pos): boolean {
		return pos.x >= 0 && pos.y >= 0 && pos.x < this.width && pos.y < this.height;
	}

	getNeighbours(pos: Pos): Field[] {
		return [
			new Pos(pos.x, pos.y + 1),
			new Pos(pos.x + 1, pos.y),
			new Pos(pos.x, pos.y - 1),
			new Pos(pos.x - 1, pos.y),
		].map(p => this.getPos(p)) as Field[];
	}

	getNeighbourComponents(pos: Pos): Component[] {
		const neighbours = [
			new Pos(pos.x - 1, pos.y),
			new Pos(pos.x, pos.y - 1),
			new Pos(pos.x + 1, pos.y),
			new Pos(pos.x, pos.y + 1),
		].filter(p => this.isPosValid(p));

		return neighbours
			.map(p => this.ctrls.find(c => c.hasPos(p)))
			.filter(c => typeof c !== 'undefined') as Component[];
	}

	forEach(callback: (field: Field, pos: Pos) => void) {
		this.data.forEach((field, i) => {
			const pos = new Pos(i % this.width, Math.floor(i / this.width));
			callback(field, pos);
		});
	}

	getPos(pos: Pos): Field | null {
		if (!this.isPosValid(pos)){
			return null;
		}
		return this.data[pos.y * this.width + pos.x];
	}

	setPos(pos: Pos, type: string, rotation: number = 0) {

		const f = this.getPos(pos);
		if (!f) {
			return;
		}
		f.rotation = rotation;
		if(type === 'empty'){
			const c = f?.component;
			if(c) c.uninstall(f);
			return;
		}
		const def = Components[type].definition;
		const c = f?.component;
		if (c && c.type !== type) {
			c.uninstall(f);
			if (def.merge) {
				this.mergeComponents(pos, type, rotation);
			} else {
				this.single(pos, type, rotation);
			}
		} else if (c && c.type === type) {
			if (def.merge) {
				c.install(f);
			} else {
				this.single(pos, type, rotation);
			}
		} else {
			if (def.merge) {
				this.mergeComponents(pos, type, rotation);
			}else {
				this.single(pos, type, rotation);
			}
		}
	}

	single(pos: Pos, type: string, rotation: number = 0) {
		const f = this.getPos(pos);
		const newComponent = new Components[type](this);
		newComponent.install(f, rotation);
		this.ctrls.push(newComponent);
	}

	mergeComponents(pos: Pos, type: string, rotation: number = 0) {
		const f = this.getPos(pos);
		if(!f) return;
		const neighbours = this.getNeighbourComponents(pos).filter(c => c.type === type);
		if(neighbours.length === 1) {
			neighbours[0].install(f, rotation);
		}
		if(neighbours.length === 0) {
			const newComponent = new Components[type](this);
			newComponent.install(f, rotation);
			this.ctrls.push(newComponent);
		}
		
		if(neighbours.length > 1) {
			const newComponent = new Components[type](this);
			newComponent.install(f);
			this.ctrls.push(newComponent);
			neighbours.forEach(c => {
				const fields = [...c.fields];
				fields.forEach(f => c.uninstall(f));
				fields.forEach(f => newComponent.install(f, f.rotation));
				this.ctrls = this.ctrls.filter(ctrl => ctrl !== c);
			});
		}
	}

	tick() {
		this.ctrls.forEach(c => c.safeUpdate());
	}

	rmCtrl = (c: Component) => {
		this.ctrls = this.ctrls.filter(ctrl => ctrl !== c);
	}

}

