import { Pos } from '../pos';
import { Component } from './components/component';

const idGenerator = function*() {
	let id = 0;
	while (true) {
		yield id++;
	}
}

const getNextId = idGenerator();

export class Field extends Pos {
	id: number;
	label: string;
	component: Component | null = null;
	listeners: Record<string, ((field: Field) => void)[]> = {};
	outputSources: Component[] = [];
	rotation: number = 0;

	constructor(x: number, y: number) {
		super(x, y);
		this.id = getNextId.next().value;
		this.label = '';
	}

	addOutputSource(c: Component) {
		this.outputSources.push(c);
		c.on('output', this.emitPowered);
	}

	rmOutputSource(c: Component) {
		const idx = this.outputSources.indexOf(c);
		if (idx !== -1) {
			this.outputSources.splice(idx,1)
		}else {
			throw new Error('Trying to remove output source that dont exist')
		}
		console.log()
		c.off('output', this.emitPowered);
	}

	emitPowered = () => {
		this.emit('field:power');
	}

	get type() {
		return this.component?.type ?? 'empty';
	}

	get output() {
		return this.outputSources.reduce((acc, c) => acc || c.powered, false);
	}

	get powered() {
		return this.component?.powered;
	}

	on(name: string, fn: (field: Field) => void) {
		this.listeners[name] = this.listeners[name] || [];
		this.listeners[name].push(fn);
	}

	off(name: string, fn: (field: Field) => void) {
		this.listeners[name] = this.listeners[name] || [];
		this.listeners[name] = this.listeners[name].filter(f => f !== fn);
	}

	emit(name: string) {
		(this.listeners[name] || []).forEach(fn => fn(this));
	}
}
