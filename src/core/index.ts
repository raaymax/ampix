import { Pos } from "../pos";
import { World } from "./world";
import Components, { ComponentDefinition } from "./components";

export type { ComponentDefinition } from './components';

export type AppState = Record<keyof typeof Components | string, boolean>;

export type ComponentType = keyof typeof Components;

export class Core {
	state: AppState;
	listeners: Record<string, ((s: AppState) => void)[]> = {};
	world = new World(100, 100);

	constructor() {
		this.state = {interact: true, play: true};
		this.on('tick', (t) => {
			if (this.state.play && !this.state.pause){
				this.world.tick(t.deltaMS)
			}
		})
	}

	getAppState() {
		return this.state;
	}

	on(event: string, callback: (s?: any) => void) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback);
	}

	emit(event: string, arg?: any) {
		if (this.listeners[event]) {
			this.listeners[event].forEach(callback => callback(arg));
		}
	}

	set(newState: AppState) {
		this.state = newState;
		this.emit('change');
	}

	isToolActive(tool: string): boolean {
		return this.state[tool];
	}
	getCurrentDefinition(): ComponentDefinition | null{
		const component = this.getComponent();
		if (!component) {
			return null;
		}
		return this.getDefinition(component);
	}

	getDefinition(type: keyof typeof Components): ComponentDefinition {
		return Components[type]?.definition;
	}

	selectTool(tool: string) {
		console.log('selectTool', tool)
		const tools = {} as Record<string, boolean>;
		switch (tool) {
			case 'play':
				Object.assign(tools, this.state);
				tools.play = true;
				tools.pause = false;
				break;
			case 'pause':
				Object.assign(tools, this.state);
				if (tools.play) {
				tools.pause = !this.state.pause;
				}else{ 
					tools.pause = false;
				}
				break;
			case 'stop':
				Object.assign(tools, this.state);
				tools.play = false;
				tools.pause = false;
				break;
			case 'tick':
				Object.assign(tools, this.state);
				tools.play = false;
				tools.pause = false;
				this.world.tick(0);
				break;
			case 'clear':
				Object.assign(tools, this.state);
				this.world.clear();
				break;
			case 'remove':
				Object.assign(tools, {
					play: Boolean(this.state.play),
					pause: Boolean(this.state.pause),
					remove: !this.state.remove,
					interact: this.state.remove  
				});
				break;

			default:
				Object.assign(tools, {
					play: Boolean(this.state.play),
					pause: Boolean(this.state.pause),
					[tool]: true
				});
				break;
		}
		this.set({ ...tools });
		this.emit('toolsChange', this.state);
	}

	getComponent(): keyof typeof Components | undefined {
		return Object.keys(this.state)
			.find(key => this.state[key] && Object.keys(Components).includes(key)) as keyof typeof Components | undefined;
	}

	positionClicked(pos: Pos, rotation: number = 0) {
		if(this.isToolActive('interact')) {
			console.log('interact', pos, this.world.getPos(pos));
			this.world.getPos(pos)?.component?.interact();
		}
		if(this.isToolActive('remove')) {
			this.world.setPos(pos, 'empty', 0)
		}

		const component = this.getComponent();
		if(component) {
			this.world.setPos(pos, component, rotation);
		}
		//console.log('positionClicked', component, pos);
	}
}
