
import { Sprite, Graphics, Container, Spritesheet } from "pixi.js";
import { PALETTE } from "./palette";
import { Renderer } from "./renderer";
import { Core } from "../core";

export class Controls {
	container = new Container();
	uiContainer = new Container();
	simContainer = new Container();
	sheet?: Spritesheet;
	buttons: Record<string, {
		container: Container,
		sprite: Sprite,
		background: Graphics,
		square: Sprite,
		update: () => void,
	}> = {};
	activeTools: Record<string, boolean> = {};

	constructor(private renderer: Renderer, private core: Core) {
		this.sheet = renderer.sheet;
	}

	updateToolState(tool: string, active: boolean) {
		this.buttons[tool].background.clear();
		this.buttons[tool].background.rect(0, 0, 32, 32);
		this.buttons[tool].background.fill(active ? PALETTE.uiButton.active : PALETTE.uiButton.normal);
	}

	init() {
		this.renderActions();
		this.renderSim();
		this.container.addChild(this.uiContainer);
		this.container.addChild(this.simContainer);
		this.renderer.addChild(this.container);
		this.activeTools = this.core.getAppState().activeTools;
		this.core.on('toolsChange', (tools: Record<string, boolean>) => {
			new Set([
				...Object.keys(this.activeTools),
				...Object.keys(tools),
			]).forEach(tool => {
				this.buttons[tool].update();
			});
			this.activeTools = tools
		});
	}

	createButton = (type: string) => {
		const background = new Graphics();
		const container = new Container();
		const square = new Sprite(this.sheet?.textures["square.png"]);
		const sprite = new Sprite(this.sheet?.textures[type + ".png"]);
		background.rect(0, 0, 32, 32);
		background.fill(this.core.isToolActive(type)  ? PALETTE.uiButton.active : PALETTE.uiButton.normal);
		container.addChild(background);
		container.addChild(sprite);
		container.addChild(square);

		container.interactive = true;
		container.on('click', () => {
			this.core.selectTool(type);
		});

		const drawBackground = (bg: string = 'normal') => {
			background.clear();
			background.rect(0, 0, 32, 32);
			switch (bg) {
				case 'hover':
					background.fill(PALETTE.uiButton.hover);
					break;
				default:
					background.fill(this.core.isToolActive(type) ? PALETTE.uiButton.active : PALETTE.uiButton.normal);
					break;
			}
		}


		container.on('mouseenter', () => {
			drawBackground('hover');
		});
		container.on('mouseleave', () => {
			drawBackground();
		});
		this.buttons[type] = {
			container,
			sprite,
			background,
			square,
			update: () => drawBackground(),
		};
		return container;
	}

	renderSim = () => {
		this.simContainer.removeChildren();
		[
			this.createButton("tick"),
			this.createButton("play"),
			this.createButton("pause"),
			this.createButton("stop"),
			this.createButton("clear"),
			this.createButton("remove"),
			this.createButton("label"),
			this.createButton("interact"),
		].forEach((component, idx) => {
			component.position.set(34 * idx, 0);
			this.simContainer.addChild(component);
		});
		this.simContainer.position.set(20, 10);
		this.simContainer.scale.set(1.3);
	}

	renderActions = () => {
		this.uiContainer.removeChildren();
		[
			this.createButton("or"),
			this.createButton("and"),
			this.createButton("not"),
			this.createButton("nand"),
			this.createButton("nor"),
			this.createButton("xor"),
			this.createButton("xnor"),
			this.createButton("input"),
			this.createButton("output"),
			this.createButton("button"),
			this.createButton("clock"),
			this.createButton("tunnel"),
			this.createButton("link"),
			this.createButton("buffer"),
		].forEach((component, idx) => {
			component.position.set(34 * idx, 0);
			this.uiContainer.addChild(component);
		});

		this.uiContainer.position.set(20, this.renderer.height - 50);
		this.uiContainer.scale.set(1.3);
	}

}
