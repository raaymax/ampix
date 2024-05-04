import { Component } from './component';
import type { World } from '../world';
import type { Field } from '../field';

export class Gate extends Component {
	static createDefinition = (type: string, ext = {}) => Component.createDefinition(type, {
		merge: false,
		rotations: 4,
		space: [
			0, 3, 0,
			3, 1, 2,
			0, 3, 0
		],
		...ext,
	});
}
