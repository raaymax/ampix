import { Component } from './component';
import type { World } from '../world';

export class Buffer extends Component {
	static definition = Component.createDefinition('buffer', {
		rotations: 4,
		space: [
			0, 0, 0,
			3, 1, 2,
			0, 0, 0
		],
	});

	constructor(world: World) {
		super(world, Buffer.definition);
	}

	update(){
		this.emit('output');
		this.powered = this.inputs.some(i => i.powered)
		this.emit('change');
	}
}
