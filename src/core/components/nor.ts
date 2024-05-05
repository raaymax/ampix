import type { World } from "../world";
import { Gate } from "./gate";

export class NorGate extends Gate {
	static definition = Gate.createDefinition('nor', {
		description: 'NOR Gate - outputs true if all inputs are false',
	});
	constructor(world: World) {
		super(world, NorGate.definition);
	}

	update(){
		const inputs = this.inputs.filter(i => typeof i.powered !== 'undefined')
		this.output.value = !inputs.some(i => i.powered)
		this.emit('change');
	}
}
