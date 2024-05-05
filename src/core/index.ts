import { Pos } from "../pos";
import { World } from "./world";
import Components from "./components";

export type AppState = {
	running: boolean;
	paused: boolean;
	activeTools: Record<string, boolean>;
};

export class Core {
	state: AppState;
	listeners: Record<string, ((s: AppState) => void)[]> = {};
	world = new World(100, 100);

	constructor() {
		this.state = {
			running: false,
			paused: false,
			activeTools: {interact: true, play: true}
		};
		this.on('tick', (t) => {
			if (this.state.activeTools.play && !this.state.activeTools.pause){
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

	set(newState: Partial<AppState>) {
		this.state = {
			...this.state,
			...newState,
		};
		this.emit('change');
	}

	isToolActive(tool: string) {
		return this.state.activeTools[tool];
	}
	getCurrentDefinition() {
		const component = this.getComponent();
		if (!component) {
			return null;
		}
		return this.getDefinition(component);
	}

	getDefinition(type: string) {
		return Components[type]?.definition;
	}

	selectTool(tool: string) {
		console.log('selectTool', tool)
		const tools = {} as Record<string, boolean>;
		switch (tool) {
			case 'play':
				Object.assign(tools, this.state.activeTools);
				tools.play = true;
				tools.pause = false;
				break;
			case 'pause':
				Object.assign(tools, this.state.activeTools);
				if (tools.play) {
				tools.pause = !this.state.activeTools.pause;
				}else{ 
					tools.pause = false;
				}
				break;
			case 'stop':
				Object.assign(tools, this.state.activeTools);
				tools.play = false;
				tools.pause = false;
				break;
			case 'tick':
				Object.assign(tools, this.state.activeTools);
				tools.play = false;
				tools.pause = false;
				this.world.tick();
				break;
			case 'clear':
				Object.assign(tools, this.state.activeTools);
				this.world.clear();
				break;
			default:
				Object.assign(tools, {
					play: Boolean(this.state.activeTools.play),
					pause: Boolean(this.state.activeTools.pause),
					[tool]: true
				});
				break;
		}
		this.set({ activeTools: tools });
		this.emit('toolsChange', this.state.activeTools);
	}

	getComponent() {
		return Object.keys(this.state.activeTools)
			.find(key => this.state.activeTools[key] && Object.keys(Components).includes(key));
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
