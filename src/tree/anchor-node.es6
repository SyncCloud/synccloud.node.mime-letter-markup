import {InlineNode} from './inline-node';
import {TextNode} from './text-node';

export class AnchorNode extends InlineNode {
    constructor({tag, prefix, affix, href} = {}) {
        super({tag, prefix, affix});
        this.href = href;
    }

    simplify() {
        const result = super.simplify();
        if (this.href) {
            result.children.splice(0, 0, ['[']);
            result.children.push('](');
            result.children.push(this.href);
            result.children.push(')');
        }
        return result;
    }
}
