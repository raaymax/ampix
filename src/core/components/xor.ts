import { Component, ComponentDefinition } from "./component";

export class XorGate extends Component{
	static definition: ComponentDefinition = {
		type: 'xor',
		description: 'XOR Gate - outputs true if exactly one input is true',
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
		const inputs = this.inputs.filter(i => typeof i.powered !== 'undefined');
		console.log(inputs)
		this.output.value = inputs.filter(i => Boolean(i.powered)).length === 1;
		this.emit('change');
	}
}
