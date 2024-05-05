import type { Renderer } from './renderer';
import type { Core } from '../core';
import { Pos } from '../pos';
import { Container, Graphics, Sprite, Spritesheet } from 'pixi.js';
import { PALETTE } from './palette';
import { Field } from '../core/field';

export class Map {
	rendererSymbol = Symbol('renderer');
	sheet?: Spritesheet;
	mapContainer = new Container();

	constructor(public renderer: Renderer, public core: Core) {
		this.sheet = renderer.sheet;
		this.renderer.addChild(this.mapContainer);
		this.renderer.on('zoom', this.renderMap);
		this.renderer.on('move', this.renderMap);
		this.renderMap();
		window.addEventListener('resize', () => {
			this.renderMap();
		});
	}

	renderMap = () => {
		const { size, offsetX, offsetY } = this.renderer;
		const countX = this.renderer.width / size + 2
		const countY = this.renderer.height / size + 2
		this.core.world.forEach((field) => {
			const r = this.getRenderer(field);
			if(r) {
				r.container.renderable = false;
			}
		});
		for (let y = 0; y < countY; y++) {
			for (let x = 0; x < countX; x++) {
				const screenPos = Pos.from({
					x: size * x + offsetX-size,
					y: size * y + offsetY-size,
				});
				const worldPos = this.renderer.screenToWorldPos(screenPos);
				const f = this.core.world.getPos(worldPos);
				if(f) {
					this.update(f);
				}
			}
		}
	}

	getRenderer = (f: Field) => {
		if ((f as any)[this.rendererSymbol]) {
			return (f as any)[this.rendererSymbol];
		}
		const container = new Container();
		const background = new Graphics();
		const sprite = null;
		const error = null;
		container.addChild(background);
		this.mapContainer.addChild(container);
		(f as any)[this.rendererSymbol] = {background, sprite, container, error};
		f.on('change', this.update);
		return (f as any)[this.rendererSymbol];
	}


	update = (f: Field) => {
		if(!f) return;
		const {size, offsetX, offsetY} = this.renderer;
		const screenPos = this.renderer.worldToScreenPos(f);
		const r = this.getRenderer(f);
		if(r.sprite) {
			r.container.removeChild(r.sprite);
			r.sprite.destroy()
		}
		if(r.error) {
			r.container.removeChild(r.error);
			r.error.destroy()
		}
		const sprite = new Sprite(this.sheet?.textures[f.type + ".png"]);
		sprite.x = screenPos.x + size / 2;
		sprite.y = screenPos.y + size / 2;
		sprite.scale.set(size / 32);
		sprite.anchor.set(0.5);
		sprite.rotation = f.rotation * Math.PI / 2;
		if(f.component?.error){
			const esprite = new Sprite(this.sheet?.textures["alert.png"]);
			esprite.x = screenPos.x + size / 2;
			esprite.y = screenPos.y + size / 2;
			esprite.scale.set(size / 32);
			esprite.anchor.set(0.5);
			esprite.rotation = f.rotation * Math.PI / 2;
			r.error = esprite
			r.container.addChild(esprite)
		}
		r.sprite = sprite;
		r.container.addChild(sprite);
		r.container.renderable = true;
		r.background.clear();
		r.background.rect(screenPos.x, screenPos.y, size, size);
		if(!f.component) {
			r.background.fill(PALETTE.background);
		} else {
			r.background.fill(PALETTE.component[f.type])
			if(this.core.getDefinition(f.type).power) {
				r.background.alpha = f?.component?.powered ? 1.0 : 0.5;
			}else{
				r.background.alpha = 1.0;
			}
		}
		r.background.stroke(0x000000);
	}
}
