import { Component, ComponentDefinition } from './component';

export class Tunnel extends Component {
	static definition: ComponentDefinition = {
		type: 'tunnel',
		description: 'Tunnel - cross the wires through the tunnel',
		merge: false,
		power: false,
		rotations: 1,
		space: [
			0, 0, 0,
			0, 1, 0,
			0, 0, 0,
		],
	};
}
