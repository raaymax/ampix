import { Component, ComponentDefinition } from "./component";

export class OrGate extends Component {
	static definition: ComponentDefinition = {
		type: 'or',
		description: 'OR Gate - outputs true if any input is true',
		power: false,
		merge: false,
		rotations: 4,
		space: [
			0, 3, 0,
			3, 1, 2,
			0, 3, 0
		],
	};

	update(){
		const inputs = this.inputs.filter(i => typeof i.powered !== 'undefined')
		this.output.value = inputs.some(i => i.powered)
		this.emit('change');
	}
}
