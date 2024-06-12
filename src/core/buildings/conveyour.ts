import { Pos } from '../../pos';
import { Field } from '../field';
import { Component, ComponentDefinition } from './component';

export class Buffer extends Component {
	static definition: ComponentDefinition = {
		type: 'buffer',
		description: 'Buffer - a component that outputs the same value as the input',
		power: false,
		merge: false,
		rotations: 4,
		space: [
			0, 0, 0,
			3, 1, 2,
			0, 0, 0
		],
	};

	rotToVec(r: number): Pos {
		switch(r){
			case 0: return Pos.from({x: 1, y: 0});
			case 1: return Pos.from({x: 0, y: 1});
			case 2: return Pos.from({x: -1, y: 0});
			default: return Pos.from({x: 0, y: -1});
		}
	}

	install(f: Field) {
		super.install(f);
		f.on('addedThing', () => {
			setTimeout(() => {
				f.thing?.move(this.rotToVec(f.rotation));
			}, 1)
		})
		f.thing?.move(this.rotToVec(f.rotation));
	}

	update(){
		this.output.value = this.inputs.some(i => i.powered)
		this.emit('change');
	}
}
