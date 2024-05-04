import type { World } from "../world";
import { Gate } from "./gate";

export class XorGate extends Gate {
	static definition = Gate.createDefinition('xor');
	constructor(world: World) {
		super(world, XorGate.definition);
	}

	update(){
		const inputs = this.inputs.filter(i => typeof i.powered !== 'undefined');
		console.log(inputs)
		this.powered = inputs.filter(i => Boolean(i.powered)).length === 1;
		this.emit('change');
		this.emit('output');
	}
}
