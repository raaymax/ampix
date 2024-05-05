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

	update(){
		this.output.value = !this.inputs.some(i => i.powered)
		this.emit('change');
	}
}
