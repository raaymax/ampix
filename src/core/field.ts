import { Pos } from '../pos';
import Components, { Component } from './components';
import { Output } from './output';

export class Field extends Pos {
	component: Component | null = null;
	listeners: Record<string, ((field: Field) => void)[]> = {};
	outputSources: Output[] = [];
	rotation: number = 0;

	constructor(x: number, y: number) {
		super(x, y);
	}

	addOutputSource(c: Output) {
		this.outputSources.push(c);
		c.on('change', this.emitPowered);
	}

	rmOutputSource(c: Output) {
		const idx = this.outputSources.indexOf(c);
		if (idx !== -1) {
			this.outputSources.splice(idx,1)
		}else {
			throw new Error('Trying to remove output source that dont exist')
		}
		console.log()
		c.off('change', this.emitPowered);
	}

	emitPowered = () => {
		this.emit('field:power');
	}

	get type(): keyof typeof Components | 'empty'{
		return (this.component?.type ?? 'empty') as keyof typeof Components | 'empty';
	}

	get output() {
		return this.outputSources.reduce<boolean | undefined>((acc, c: Output) => acc || c.value, false);
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
