import type { World } from "../world";
import { Gate } from "./gate";

export class OrGate extends Gate {
	static definition = Gate.createDefinition('or');
	constructor(world: World) {
		super(world, OrGate.definition);
	}

	update(){
		const inputs = this.inputs.filter(i => typeof i.powered !== 'undefined')
		this.powered = inputs.some(i => i.powered)
		this.emit('change');
		this.emit('output');
	}
}
