import {escape} from '../escape';
import {Node} from './node';

export class ParagraphNode extends Node {
    isParagraph() {
        return true;
    }

    isBlock() {
        return true;
    }

    constructor({tag, prefix, affix} = {}) {
        super({prefix, affix});
        this.tag = tag;
    }

    simplify() {
        const {nodes} = this._simplify();
        const args = {tag: this.tag, prefix: this.prefix, affix: this.affix};
        const result = new ParagraphNode(args);
        result.children = nodes;
        return result;
    }

    empty() {
        return false;
    }
}
