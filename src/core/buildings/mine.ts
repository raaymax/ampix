import { Pos } from "../../pos";
import { Thing } from "../things/thing";
import { Component, ComponentDefinition } from "./component";

export class AndGate extends Component{
	static definition: ComponentDefinition = {
		type: 'and',
		description: 'AND Gate - outputs true if all inputs are true',
		merge: false,
		power: false,
		rotations: 4,
		space: [
			0, 3, 0,
			3, 1, 2,
			0, 3, 0
		],
	};

	rotToVec(r: number): Pos {
		switch(r){
			case 0: return Pos.from({x: 1, y: 0});
			case 1: return Pos.from({x: 0, y: 1});
			case 2: return Pos.from({x: -1, y: 0});
			default: return Pos.from({x: 0, y: -1});
		}
	}

	init() {
		setInterval(() => {
			const {outputs} = this.getIO(this.fields[0]);
			if(!outputs[0].thing) {
				const t = new Thing(outputs[0], this.world);
				this.world.addThing(t);
				console.log('new', t)
			}
		}, 1000)
	}

	update(){
		const inputs = this.inputs.filter(i => typeof i.powered !== 'undefined')
		this.output.value = inputs.every(i => i.powered)
		this.emit('change');
	}
}

