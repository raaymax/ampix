import { Component } from './component';
import type { World } from '../world';
import type { Field } from '../field';

export class Link extends Component {
	static definition = Component.createDefinition('link', {
		description: 'Link - a component to connect outputs to inputs',
		power:true,
	});

	constructor(world: World) {
		super(world, Link.definition);
	}

	outputListener = () => {
		const pow = this.fields.reduce((acc, f) => acc || f.output, false);
		if(this.powered !== pow) {
			this.powered = pow;
			this.emit('change');
		}
	}

	install(field: Field) {
		super.install(field);
		field.on('field:power', this.outputListener);
		this.outputListener();
	}

	uninstall(field: Field) {
		field.off('field:power', this.outputListener)
		super.uninstall(field);
	}
}
