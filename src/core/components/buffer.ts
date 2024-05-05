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

	update(){
		this.output.value = this.inputs.some(i => i.powered)
		this.emit('change');
	}
}
