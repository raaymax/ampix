import { Component } from './component';
import type { World } from '../world';
import type { Field } from '../field';

export class Tunnel extends Component {
	static definition = Component.createDefinition('tunnel', {
		merge: false,
		rotations: 1,
		space: [
			0, 4, 0,
			4, 1, 4,
			0, 4, 0,
		],
	});

	constructor(world: World) {
		super(world, Tunnel.definition);
	}

	outputListener = () => {
		const pow = this.inputs
		if(this.powered !== pow) {
			this.powered = pow;
			this.emit('change');
		}
	}

	install(field: Field) {
		field.on('field:power', this.outputListener);
		super.install(field);
	}

	uninstall(field: Field) {
		field.off('field:power', this.outputListener)
		super.uninstall(field);
	}
}
