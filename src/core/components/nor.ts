import { Component, ComponentDefinition } from "./component";

export class NorGate extends Component{
	static definition: ComponentDefinition = {
		description: 'NOR Gate - outputs true if all inputs are false',
		type: 'nor',
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
		this.output.value = !inputs.some(i => i.powered)
		this.emit('change');
	}
}
