import type { World } from "../world";
import { Gate } from "./gate";

export class AndGate extends Gate {
	static definition = Gate.createDefinition('and');
	constructor(world: World) {
		super(world, AndGate.definition);
	}

	update(){
		const inputs = this.inputs.filter(i => typeof i.powered !== 'undefined')
		this.powered = inputs.every(i => i.powered)
		this.emit('change');
		this.emit('output');
	}
}
