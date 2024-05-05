import { Component } from './component';
import type { World } from '../world';

export class Buffer extends Component {
	static definition = Component.createDefinition('buffer', {
		description: 'Buffer - a component that outputs the same value as the input',
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
		this.output.value = this.inputs.some(i => i.powered)
		this.emit('change');
	}
}
