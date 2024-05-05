import { Graphics, Container, Spritesheet, Sprite } from "pixi.js";
import { PALETTE } from "./palette";
import { Core } from "../core";
import { Renderer } from "./renderer";
import { Pos } from "../pos";
import { ComponentDefinition } from "../core";

export class Cursor {
  cursor = new Graphics();
	sprite: Sprite | null = null;
	cursorContainer = new Container();
	sheet?: Spritesheet;
	definition: ComponentDefinition | undefined | null;
	rotation = 0;
	tool = '';
	mousePos: Pos = Pos.from({x: 0, y: 0});

	
	constructor(private renderer: Renderer, private core: Core) {
		this.sheet = renderer.sheet;
		this.definition = core.getCurrentDefinition();
	}

	async init() {
		this.cursor.alpha = PALETTE.cursor.alpha;
		this.cursorContainer.addChild(this.cursor);
		this.renderer.addChild(this.cursorContainer);
		this.renderer.app.renderer.view.canvas.addEventListener?.('mousemove', (ev: Event) => {
			const event: MouseEvent = ev as MouseEvent;
			this.mousePos = Pos.from({x: event.offsetX, y: event.offsetY});
			this.redrawCursor()
		});
		this.core.on('toolsChange', () => {
			this.definition = this.core.getCurrentDefinition();
			if(!this.definition) return;
			this.rotation = this.rotation % this.definition.rotations;
			this.redrawCursor();
		});
		let pointerDown = false;
		this.renderer.background.on('pointerdown', (event) => {
			const pos = this.renderer.screenToWorldPos(Pos.from(event.screen));
			if (this.renderer.isWorldSpace(pos)) {
				this.core.positionClicked(pos, this.rotation);
			}
			pointerDown = !this.core.isToolActive('interact');
		});
		this.renderer.background.on('pointermove', (event) => {
			if(pointerDown) {
				const pos = this.renderer.screenToWorldPos(Pos.from(event.screen));
				if (this.renderer.isWorldSpace(pos)) {
					this.core.positionClicked(pos, this.rotation);
				}
			}
		});
		this.renderer.background.on('pointerup', () => {
			pointerDown = false;
		});
		document.body.addEventListener('keydown', (event) => {
			if (this.definition && event.key === 'r') {
				this.rotation = (this.rotation + 1) % this.definition.rotations;
				this.redrawCursor();
			}
		});
	}

	redrawCursor = () => {
		if (!this.definition) {

			if(this.sprite) {
				this.cursorContainer.removeChild(this.sprite);
				this.sprite.destroy();
			}
			this.cursor.clear();
			return;
		}
		const { size, offsetX, offsetY } = this.renderer;

		const cursorX = Math.floor((this.mousePos.x - offsetX) / size);
		const cursorY = Math.floor((this.mousePos.y - offsetY) / size);

		if(this.sprite) {
			this.cursorContainer.removeChild(this.sprite);
			this.sprite.destroy();
		}
		this.sprite = new Sprite(this.sheet?.textures[this.definition.type+ ".png"]);
		this.sprite.x = size * cursorX + offsetX + size / 2;
		this.sprite.y = size * cursorY + offsetY + size / 2;
		this.sprite.scale.set(size / 32);
		this.sprite.anchor.set(0.5);
		this.sprite.rotation = this.rotation * Math.PI / 2;
		this.cursorContainer.addChild(this.sprite);

		this.cursor.clear();

		let rot = [...this.definition.space];
		for (let i = 0; i < this.rotation; i++) {
			rot = [
				rot[6], rot[3], rot[0],
				rot[7], rot[4], rot[1],
				rot[8], rot[5], rot[2],
			];
		}

		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 3; x++) {
				this.cursor.rect(
					size * (cursorX + (x-1)) + offsetX,
					size * (cursorY + (y-1)) + offsetY,
					size, size
				);
	

				switch (rot[y * 3 + x]) {
					case 0:
						break;
					case 1:
						this.cursor.fill(PALETTE.cursor.component);
						break;
					case 2:
						this.cursor.fill(PALETTE.cursor.output);
						break;
					case 3:
						this.cursor.fill(PALETTE.cursor.input);
						break;
				}

				this.cursor.stroke(0x000);
			}
		}
	}
}

