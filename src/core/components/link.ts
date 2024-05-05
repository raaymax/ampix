import { Component, ComponentDefinition } from './component';
import type { Field } from '../field';

export class Link extends Component {
	static definition: ComponentDefinition = {
		type: 'link',
		description: 'Link - a component to connect outputs to inputs',
		power:true,
		merge: true,
		rotations: 1,
		space: [
			0, 0, 0,
			0, 1, 0,
			0, 0, 0
		],
	};

	outputListener = () => {
		const pow = this.fields.reduce<boolean | undefined>((acc, f) => acc || f.output, false);
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
