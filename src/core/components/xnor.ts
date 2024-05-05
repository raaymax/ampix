import { Component, ComponentDefinition } from "./component";

export class XnorGate extends Component{
	static definition: ComponentDefinition = {
		type: 'xnor',
		description: 'XNOR Gate - outputs true if all inputs are the same',
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
		this.output.value= inputs.filter(i => Boolean(i.powered)).length !== 1;
		this.emit('change');
	}
}
