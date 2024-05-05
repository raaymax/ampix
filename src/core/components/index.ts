import { Link } from './link';
import { Button } from './button';
import { Buffer } from './buffer';
import { Not } from './not';
import { AndGate } from './and';
import { OrGate } from './or';
import { NandGate } from './nand';
import { NorGate } from './nor';
import { XorGate } from './xor';
import { XnorGate } from './xnor';
import { Tunnel } from './tunnel';
import { Clock } from './clock';

export * from './component';

export default {
	link: Link,
	not: Not,
	button: Button,
	buffer: Buffer,
	and: AndGate,
	or: OrGate,
	nand: NandGate,
	nor: NorGate,
	xor: XorGate,
	xnor: XnorGate,
	tunnel: Tunnel,
	clock: Clock
};
