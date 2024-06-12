import { Pos } from '../pos';
import Components, { Component } from './components';
import { Emitter } from './emitter';
import { Output } from './output';

export class Field extends Pos {
	thing: Thing | null;
	component: Component | null = null;
	emitter = new Emitter<Field>();
	outputSources: Output[] = [];
	rotation: number = 0;


	constructor(x: number, y: number) {
		super(x, y);
	}

	addDataSource(c: Output) {
		this.outputSources.push(c);
		c.on('change', this.emitPowered);
	}

	rmDataSource(c: Output) {
		const idx = this.outputSources.indexOf(c);
		if (idx !== -1) {
			this.outputSources.splice(idx,1)
		}else {
			throw new Error('Trying to remove output source that dont exist')
		}
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

	on = this.emitter.on;
	off = this.emitter.off;
	emit = (name: string ) => this.emitter.emit(name, this);
}
