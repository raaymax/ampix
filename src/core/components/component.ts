import { Pos } from "../../pos";
import { Output } from '../output';
import type { Field } from "../field";
import type { World } from "../world";

export class Component {
	type: string;
	label: string = '';
	priority: number = 10;
	output: Output = new Output();
	powered?: boolean;
	fields: Field[] = [];
	world: World;
	inputs: Field[] = [];
	listeners: Record<string, ((component: Component) => void)[]> = {};
	definition: any;
	error: string | null = null;
	
	static createDefinition = (type:string, ext = {}) => {
		return {
			type,
			power: false,
			merge: true,
			rotations: 1,
			space: [
				0, 0, 0,
				0, 1, 0,
				0, 0, 0
			],
			...ext
		}
	}
	
	getIO = (field: Field) => {
		const definition = this.definition;
		const n = this.world.getNeighbours(field);
		const p = [
			definition.space[1],
			definition.space[5],
			definition.space[7],
			definition.space[3],
		]
		const io = [
			{type: p[(0 + field.rotation) % 4], field: n[0]},
			{type: p[(1 + field.rotation) % 4], field: n[1]},
			{type: p[(2 + field.rotation) % 4], field: n[2]},
			{type: p[(3 + field.rotation) % 4], field: n[3]},
		]
		const inputs = io.filter(e => e.type === 3 || e.type === 4).map(e=>e.field);
		const outputs = io.filter(e => e.type === 2 || e.type === 4).map(e=>e.field);

		return { inputs, outputs	}
	}


	constructor(world: World, public definition) {
		this.type = definition.type;
		this.world = world;
	}

	install(field: Field) {
		const {inputs, outputs} = this.getIO(field);
		outputs.forEach(f => {
			f.addOutputSource(this.output);
		});
		this.inputs.push(...inputs);
		this.fields.push(field);
		field.component = this;
		this.emit('change');
	}

	uninstall(field: Field) {
		const {inputs, outputs} = this.getIO(field);
		this.output.value = false;
		outputs.forEach(f => {
			f.rmOutputSource(this.output);
		});
		inputs.forEach(i => {
			this.inputs.slice(this.inputs.indexOf(i))
		})
		this.fields = this.fields.filter(f => f !== field);
		field.component = null;
		//field.outputSources = field.outputSources.filter(c => c === this)
		this.emit('change');
		field.emit('change');
		if (this.fields.length === 0) {
			this.world.rmCtrl(this);
		}
	}

	rmInput(f: Field) {
		const idx = this.inputs.indexOf(f);
		if(idx !== -1) {
			this.inputs.splice(idx, 1);
		}else{
			throw new Error("trying to remove input that dont exist")
		}
	}


	hasPos(pos: Pos): boolean {
		return this.fields.some(f => f.eq(pos));
	}

	removeFrom(pos: Pos) {
		const f = this.fields.find(f => f.eq(pos));
		if (!f) {
			return false;
		}
		f.component = null;
		f.emit('change');
		this.fields = this.fields.filter(f => !f.eq(pos));
		return this.fields.length === 0;
	}

	interact() {
		console.log('interact', this.type);

	}

	update() {
	}

	safeUpdate(dt) {
		if (this.inputs.length > 0 && this.inputs.map(i=> i.powered).filter(p => typeof p !== 'undefined').length === 0){
			this.error = "error";
			this.emit('change');
			return;
		}
		this.error = null;
		this.update(dt);
	}
	
	on(name: string, fn: (component: Component) => void) {
		this.listeners[name] = this.listeners[name] || [];
		this.listeners[name].push(fn);
	}

	off(name: string, fn: (component: Component) => void) {
		this.listeners[name] = this.listeners[name] || [];
		const idx = this.listeners[name].indexOf(fn);
		if(idx !== -1){
			this.listeners[name].splice(idx,1)
		}else {
			throw new Error('[component] Trying to off event that dont exist')
		}
	}

	emit(name: string) {
		(this.listeners[name] || []).forEach(fn => fn(this));
		if(name === 'change') {
			this.fields.forEach(f => f.emit("change"));
		}
	}
}
