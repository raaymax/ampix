import type { World } from "../world";
import { Gate } from "./gate";

export class XnorGate extends Gate {
	static definition = Gate.createDefinition('xnor');
	constructor(world: World) {
		super(world, XnorGate.definition);
	}

	update(){
		const inputs = this.inputs.filter(i => typeof i.powered !== 'undefined')
		this.powered = inputs.filter(i => Boolean(i.powered)).length !== 1;
		this.emit('change');
		this.emit('output');
	}
}
