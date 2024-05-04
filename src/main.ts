import "./style.css";
import { Renderer } from "./ui/renderer";
import { Controls	} from "./ui/controls";
import { Cursor } from "./ui/cursor";
import { Map } from "./ui/map";
import { Core } from "./core";

(async () => {
	const core = new Core();
	const renderer = new Renderer(core);
	await renderer.init();
	new Map(renderer, core);
	const cursor = new Cursor(renderer, core);
	cursor.init();
	const controls = new Controls(renderer, core);
	controls.init();
})();


