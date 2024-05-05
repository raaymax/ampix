import { Component } from './component';
import type { World } from '../world';
import type { Field } from '../field';

export class Button extends Component {

	static definition = Component.createDefinition('button', {
		description: 'Button - a component that can be toggled on and off',
		power:true,
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
		this.output.value = this.powered;
		this.emit('change');
	}
}
