import {escape} from '../escape';
import {Node} from './node';
import {TextNode} from './text-node';

export class InlineNode extends Node {
    constructor({tag, prefix, affix} = {}) {
        super({prefix, affix});
        this.tag = tag;
    }

    simplify() {
        const {BlockNode} = require('./block-node');
        const {ParagraphNode} = require('./paragraph-node');

        const {nodes, isBlock, isParagraph} = this._simplify();
        const args = {tag: this.tag, prefix: this.prefix, affix: this.affix};
        const result = isParagraph ? new ParagraphNode(args) :
            (isBlock ? new BlockNode(args) : new InlineNode(args));
        result.children = nodes;
        return result;
    }
}
