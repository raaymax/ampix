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
		];

		return neighbours
			.map(p => this.getPos(p)?.component) as Component[];
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
		if(type === 'empty'){
			const c = f?.component;
			if(c) {
				c.uninstall(f);
				this.rebuild(c);
			}
			f.rotation = rotation;
			return;
		}
		f.rotation = rotation;
		const def = Components[type].definition;
		const c = f?.component;
		if (c && c.type !== type) {
			c.uninstall(f);
			this.rebuild(c);
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
		if(type === 'tunnel'){
			this.crossMergeLinks(pos);
		}
	}

	crossMergeLinks(pos: Pos) {
		const neighbours = this.getNeighbourComponents(pos).map(c => {
			return c?.type === 'link' ? c : null;
		}) as Component[];
		console.log(neighbours);

		if(neighbours.length < 2)
				return;

		if(neighbours[0] && neighbours[2]){
			const newComponent = new Components.link(this);
			this.ctrls.push(newComponent);
			[neighbours[0], neighbours[2]].forEach(c => {
				const fields = [...c.fields];
				fields.forEach(f => c.uninstall(f));
				fields.forEach(f => newComponent.install(f));
				this.ctrls = this.ctrls.filter(ctrl => ctrl !== c);
			});
		}
		if(neighbours[1] && neighbours[3]){
			const newComponent = new Components.link(this);
			this.ctrls.push(newComponent);
			[neighbours[1], neighbours[3]].forEach(c => {
				const fields = [...c.fields];
				fields.forEach(f => c.uninstall(f));
				fields.forEach(f => newComponent.install(f));
				this.ctrls = this.ctrls.filter(ctrl => ctrl !== c);
			});
		}
	}

	mergeComponents(pos: Pos, type: string, rotation: number = 0) {
		const f = this.getPos(pos);
		if(!f) return;
		const neighbours = this.getNeighbourComponents(pos).filter(Boolean).filter(c => {
			return c.type === type || (type === 'link' && c.type === 'tunnel');
		}).map(c => {
			if (c.type === 'tunnel') {
				const other = this.getPos(c.fields[0].add(c.fields[0].sub(pos)))?.component;
				if (other?.type === 'link') {
					return c;
				}
				return null;
			}
			return c;
		}).filter(Boolean) as Component[];
		console.log(neighbours)

		if(neighbours.length === 1) {
			neighbours[0].install(f);
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

	rebuild(c: Component) {
		const fields = [...c.fields];
		const type = c.type;
		fields.forEach(f => {
			c.uninstall(f);
		});
		fields.forEach(f => {
			this.setPos(f, type, f.rotation);
		});
	}


	tick(dt: number) {
		this.ctrls.forEach(c => c.safeUpdate(dt));
	}

	rmCtrl = (c: Component) => {
		this.ctrls = this.ctrls.filter(ctrl => ctrl !== c);
	}

	clear() {
		this.data.forEach(f => {
			if(f.component) {
				f.component.fields.forEach(f => f?.component?.uninstall(f));
			}
		})
		console.log(this);
	}

}

