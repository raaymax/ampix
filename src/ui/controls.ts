
import { Sprite, Graphics, Container, Spritesheet, TextStyle, Text } from "pixi.js";
import { PALETTE } from "./palette";
import { Renderer } from "./renderer";
import { Core } from "../core";

export class Controls {
	logo: Sprite;
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
	tooltipTop = Controls.createTooltip(100);
	tooltipBottom = Controls.createTooltip(520);

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
		this.activeTools = this.core.getAppState();
		this.core.on('toolsChange', (tools: Record<string, boolean>) => {
			new Set([
				...Object.keys(this.activeTools),
				...Object.keys(tools),
			]).forEach(tool => {
				this.buttons[tool].update();
			});
			this.activeTools = tools
		});
		
		this.container.addChild(this.tooltipTop.container);
		this.container.addChild(this.tooltipBottom.container);

		window.addEventListener('resize', () => {
			this.renderActions();
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
			const def = this.core.getDefinition(type as any);
			if (def) {
				this.tooltipBottom.show(def.description);
			} else { 
				this.tooltipTop.show(type);
			}
		});
		container.on('mouseleave', () => {
			this.tooltipBottom.hide();
			this.tooltipTop.hide();
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

	createLogo = () => {
		const container = new Container();
		const logo = new Sprite(this.renderer.logoTexture);
		
		container.addChild(logo);

		return container;
	}

	renderSim = () => {
		this.simContainer.removeChildren();
		[
			this.createLogo(),
			this.createButton("tick"),
			this.createButton("play"),
			this.createButton("pause"),
			this.createButton("stop"),
			null,
			this.createButton("interact"),
			null,
			this.createButton("clear"),
			this.createButton("remove"),
			//this.createButton("label"),
		].forEach((component, idx) => {
			if (!component) return;
			component.position.set(34 * idx, 0);
			this.simContainer.addChild(component);
		});
		this.tooltipTop.container.position.set(21, 55);
		this.simContainer.position.set(20, 10);
		this.simContainer.scale.set(1.3);
	}

	renderActions = () => {
		this.uiContainer.removeChildren();
		[
			this.createButton("buffer"),
			this.createButton("not"),
			this.createButton("or"),
			this.createButton("nor"),
			this.createButton("and"),
			this.createButton("nand"),
			this.createButton("xor"),
			this.createButton("xnor"),
			this.createButton("button"),
			this.createButton("clock"),
			this.createButton("tunnel"),
			this.createButton("link"),
		].forEach((component, idx) => {
			component.position.set(34 * idx, 0);
			this.uiContainer.addChild(component);
		});

		this.tooltipBottom.container.position.set(21, this.renderer.height - 85);
		this.uiContainer.position.set(20, this.renderer.height - 50);
		this.uiContainer.scale.set(1.3);
	}
	
	static createTooltip = (w: number) => {
		const container = new Container();
		const tooltipStyle = new TextStyle({
			fontFamily: 'Arial',
			fontSize: 18,
			fill: PALETTE.tooltip.text,
			//stroke: { color: 'black', width: 1 },
			wordWrap: true,
			wordWrapWidth: w - 20,
		})
		const tooltipText = new Text({text: '', style: tooltipStyle});

		const bg = new Graphics();
		bg.rect(0, 0, w, 32);
		bg.fill(PALETTE.tooltip.background);
		bg.stroke(PALETTE.tooltip.border);
		tooltipText.position.set(10, 7);
		container.addChild(bg);
		container.addChild(tooltipText);
		container.position.set(10, 10);
		container.renderable = false;
	
		return {
			container,
			show: (text: string) => {
				tooltipText.text = text;
				container.renderable = true;
			},
			hide: () => {
				container.renderable = false;
			}
		}
	}
}
