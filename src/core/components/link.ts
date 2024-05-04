import { Component } from './component';
import type { World } from '../world';
import type { Field } from '../field';

export class Link extends Component {
	static definition = Component.createDefinition('link');

	constructor(world: World) {
		super(world, Link.definition);
	}

	outputListener = () => {
		const pow = this.fields.reduce((acc, f) => acc || f.output, false);
		if(this.powered !== pow) {
			this.powered = pow;
			this.emit('change');
			this.emit('power')
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
