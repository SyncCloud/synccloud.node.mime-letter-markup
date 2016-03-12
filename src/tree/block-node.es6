import _ from 'lodash';
import {Node} from './node';

export class BlockNode extends Node {
    isBlock() {
        return true;
    }

    constructor({tag, prefix, affix} = {}) {
        super({prefix, affix});
        this.tag = tag;
    }

    simplify() {
        const {ParagraphNode} = require('./paragraph-node');

        const {nodes, isParagraph} = this._simplify();
        const args = {tag: this.tag, prefix: this.prefix, affix: this.affix};
        const result = isParagraph ? new ParagraphNode(args) : new BlockNode(args);
        result.children = nodes;
        return result;
    }
}
