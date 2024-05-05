import { Application, Assets, Graphics, Container, Spritesheet, Sprite } from "pixi.js";
import { PALETTE } from "./palette";
import { Pos } from "../pos";
import { Rect } from "../rect";
import { Core } from "../core";

export class Renderer {
  app = new Application();
  background = new Graphics();
	bgContainer = new Container();
  graphics = new Graphics();
  worldContainer = new Container();
	sheet?: Spritesheet;
	rendererSymbol = Symbol('renderer');
	listeners: Record<string, (() => void)[]> = {};
	
	constructor(private core: Core) {
	}

	get width() {
		return this.app.renderer.width;
	}

	get height() {
		return this.app.renderer.height;
	}

	get offsetX() {
		return this.worldContainer.x % this.size;
	}

	get offsetY() {
		return this.worldContainer.y % this.size;
	}

	get size() {
		return 32 * this.worldContainer.scale.x;
	}
	addChild = (child: Container) => {
		this.app.stage.addChild(child);
	}

	async init() {
		await this.app.init({
			background: PALETTE.void,
			resizeTo: window,
			eventFeatures: {
				move: true,
				globalMove: false,
				click: true,
				wheel: true,
			}
		});
		this.sheet = await Assets.load("/Logics/Logics.json");

		document.body.appendChild(this.app.canvas);

		this.worldContainer.scale.set(1);

		this.app.stage.addChild(this.background);
		this.app.stage.addChild(this.bgContainer);
		this.app.stage.addChild(this.graphics);
		this.app.stage.addChild(this.worldContainer);


		this.redrawBackground();

		this.app.ticker.add((time) => {
			this.core.emit('tick', time);
		});

		this.background.interactive = true;

		this.app.renderer.view.canvas.addEventListener('wheel', this.onMouseWheel);

		document.body.addEventListener("wheel", (event) => {
			event.preventDefault()
			event.stopPropagation()
		}, {passive: false});

		window.addEventListener('resize', () => {
			this.redrawBackground();
		});
	}
	onMouseWheel = (event: WheelEvent) => {
		const dx = event.deltaX;
		const dy = event.deltaY;
		if (event.shiftKey) {
			if(this.worldContainer.scale.x + dy * 0.001 < 0.5) return;
			if(this.worldContainer.scale.x + dy * 0.001 > 10) return;
			this.worldContainer.scale.set(this.worldContainer.scale.x + dy * 0.001);
			this.redrawBackground();
			this.emit('zoom');
		} else {
			this.worldContainer.x -= dx;
			this.worldContainer.y -= dy;
			this.redrawBackground()
			this.emit('move');
		}
	}

	isWorldSpace = (pos: Pos) => {
		return pos.x >= 0 && pos.y >= 0 && pos.x < 100 && pos.y < 100;
	}

	screenToWorldPos = (screenPos: Pos) => {
		const size = 32 * this.worldContainer.scale.x;
		const pos = Pos.from({
			x: Math.floor(((screenPos.x + 0.1) - this.worldContainer.x) / size),
			y: Math.floor(((screenPos.y + 0.1) - this.worldContainer.y) / size),
		});
		return pos;
	}

	worldToScreenPos = (pos: Pos) => {
		const size = 32 * this.worldContainer.scale.x;
		return Pos.from({
			x: pos.x * size + this.worldContainer.x,
			y: pos.y * size + this.worldContainer.y,
		})
	}

	isScreenPosVisible = (screenPos: Pos) => {
		return screenPos.x >= 0 
			&& screenPos.y >= 0 
			&& screenPos.x < this.app.renderer.width 
			&& screenPos.y < this.app.renderer.height;
	}


	redrawBackground = () => {
		this.graphics.clear();

		const screenRect = Rect.from(
			Pos.from({x: 0, y: 0}),
			Pos.from({x: this.app.renderer.width, y: this.app.renderer.height})
		);

		const worldRect = Rect.from(
			this.worldToScreenPos(Pos.from({x: 0, y: 0})),
			this.worldToScreenPos(Pos.from({x: 100, y: 100}))
		);

		const worldContainerSpace = Rect.intersection(screenRect, worldRect);

		if (worldContainerSpace) {
			this.background.clear();
			this.background.rect(worldContainerSpace?.x, worldContainerSpace?.y, worldContainerSpace?.width, worldContainerSpace?.height);
			this.background.fill(PALETTE.background);
		}
	}
	on(name: string, fn: () => void) {
		this.listeners[name] = this.listeners[name] || [];
		this.listeners[name].push(fn);
	}

	off(name: string, fn: () => void) {
		this.listeners[name] = this.listeners[name] || [];
		this.listeners[name] = this.listeners[name].filter(f => f !== fn);
	}

	emit(name: string) {
		(this.listeners[name] || []).forEach(fn => fn());
	}
}

