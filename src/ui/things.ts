import type { Renderer } from './renderer';
import type { Core } from '../core';
import { Container, Graphics, Spritesheet } from 'pixi.js';
import { Thing } from '../core/things/thing';

export class Things{
	rendererSymbol = Symbol('renderer');
	sheet?: Spritesheet;
	mapContainer = new Container();

	constructor(public renderer: Renderer, public core: Core) {
		this.sheet = renderer.sheet;
		this.renderer.addChild(this.mapContainer);
		this.renderer.on('zoom', this.render);
		this.renderer.on('move', this.render);
		this.core.world.emitter.on('thing', this.render);
		this.render();
	}

	getRenderer = (t: Thing) => {
		if ((t as any)[this.rendererSymbol]) {
			return (t as any)[this.rendererSymbol];
		}
		const container = new Container();
		const background = new Graphics();
		background.circle(16,16,12);
		background.fill('#000');
		container.addChild(background);
		this.mapContainer.addChild(container);
		(t as any)[this.rendererSymbol] = {background, container};
		t.on('change', () => {
			const sp = this.renderer.worldToScreenPos(t.pos);
			container.position.x = sp.x
			container.position.y = sp.y
		})
		return (t as any)[this.rendererSymbol];
	}
	render = () => {
		this.core.world.things.forEach(t => {
			const r = this.getRenderer(t);
			const sp = this.renderer.worldToScreenPos(t.pos);
			r.container.position.x = sp.x
			r.container.position.y = sp.y
		})
	}
}
