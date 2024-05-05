import type { World } from "../world";
import { Gate } from "./gate";

export class NandGate extends Gate {
	static definition = Gate.createDefinition('nand', {
		description: 'NAND Gate - outputs true if all inputs are false',
	});
	constructor(world: World) {
		super(world, NandGate.definition);
	}

	update(){
		const inputs = this.inputs.filter(i => typeof i.powered !== 'undefined')
		this.output.value = !inputs.every(i => i.powered)
		this.emit('change');
	}
}
