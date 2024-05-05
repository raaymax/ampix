import { Component, ComponentDefinition } from './component';

export class Clock extends Component {
	static definition: ComponentDefinition = {
		type: 'clock',
		description: 'Clock - a component that toggles on and off every second',
		power:true,
		merge: false,
		rotations: 1,
		space: [
			0, 2, 0,
			2, 1, 2,
			0, 2, 0
		],
	};

	time = 0;

	update(dt: number) {
		this.time += dt;
		if(this.time >= 1000){
			this.time = 0;
			this.powered = !this.powered;
			this.output.value = this.powered;
			this.emit('change');
		}
		
	}
}
