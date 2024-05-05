import { Component } from './component';
import type { World } from '../world';
import type { Field } from '../field';
import { Output } from '../output';

export class Tunnel extends Component {
	static definition = Component.createDefinition('tunnel', {
		description: 'Tunnel - cross the wires through the tunnel',
		merge: false,
		rotations: 1,
		space: [
			0, 0, 0,
			0, 1, 0,
			0, 0, 0,
		],
	});


	constructor(world: World) {
		super(world, Tunnel.definition);
	}
}
