import { Component, ComponentDefinition } from './component';

export class Button extends Component {
	static definition: ComponentDefinition = {
		type: 'button',
		description: 'Button - a component that can be toggled on and off',
		merge: true,
		power:true,
		rotations: 1,
		space: [
			0, 2, 0,
			2, 1, 2,
			0, 2, 0
		],
	};

	interact() {
		this.powered = !this.powered;
		this.output.value = this.powered;
		this.emit('change');
	}
}
