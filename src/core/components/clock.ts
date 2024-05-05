import { Component } from './component';
import type { World } from '../world';
import type { Field } from '../field';

export class Clock extends Component {

	static definition = Component.createDefinition('clock', {
		description: 'Clock - a component that toggles on and off every second',
		power:true,
		space: [
			0, 2, 0,
			2, 1, 2,
			0, 2, 0
		],
	});

	time = 0;

	constructor(world: World) {
		super(world, Clock.definition);
	}

	update(dt) {
		this.time += dt;
		if(this.time >= 1000){
			this.time = 0;
			this.powered = !this.powered;
			this.output.value = this.powered;
			this.emit('change');
		}
		
	}
}
