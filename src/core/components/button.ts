import { Component } from './component';
import type { World } from '../world';
import type { Field } from '../field';

export class Button extends Component {

	static definition = Component.createDefinition('button', {
		space: [
			0, 2, 0,
			2, 1, 2,
			0, 2, 0
		],
	});

	constructor(world: World) {
		super(world, Button.definition);
	}

	interact() {
		this.powered = !this.powered;
		this.emit('change');
		this.emit('output');
	}
}
