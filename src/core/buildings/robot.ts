import { Pos } from '../../pos';
import { Field } from '../field';
import { Component, ComponentDefinition } from './component';

export class Not extends Component {
	static definition: ComponentDefinition = {
		type: 'not',
		description: 'Not - a component that outputs the opposite of the input',
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
			case 0: return Pos.from({x: 2, y: 0});
			case 1: return Pos.from({x: 0, y: 2});
			case 2: return Pos.from({x: -2, y: 0});
			default: return Pos.from({x: 0, y: -2});
		}
	}
	
	install(f: Field) {
		super.install(f);
		const {inputs} = this.getIO(f)
		inputs.forEach(i => {
			i.on('addedThing', () => {
				i.thing?.move(this.rotToVec(f.rotation));
			})
			i.thing?.move(this.rotToVec(f.rotation));
		})
	}

	update(){
		this.output.value = !this.inputs.some(i => i.powered)
		this.emit('change');
	}
}
