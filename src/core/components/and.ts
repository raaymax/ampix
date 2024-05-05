import { Component, ComponentDefinition } from "./component";

export class AndGate extends Component{
	static definition: ComponentDefinition = {
		type: 'and',
		description: 'AND Gate - outputs true if all inputs are true',
		merge: false,
		power: false,
		rotations: 4,
		space: [
			0, 3, 0,
			3, 1, 2,
			0, 3, 0
		],
	};

	update(){
		const inputs = this.inputs.filter(i => typeof i.powered !== 'undefined')
		this.output.value = inputs.every(i => i.powered)
		this.emit('change');
	}
}

