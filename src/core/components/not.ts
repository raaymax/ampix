import { Component } from './component';
import type { World } from '../world';

export class Not extends Component {
	static definition = Component.createDefinition('not', {
		description: 'Not - a component that outputs the opposite of the input',
		rotations: 4,
		space: [
			0, 0, 0,
			3, 1, 2,
			0, 0, 0
		],
	});

	constructor(world: World) {
		super(world, Not.definition);
	}

	update(){
		this.output.value = !this.inputs.some(i => i.powered)
		this.emit('change');
	}
}
