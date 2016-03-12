import _ from 'lodash';
import {escape} from '../escape';

export class Node {
    //noinspection JSMethodCanBeStatic
    get isParagraph() {
        return false;
    }

    //noinspection JSMethodCanBeStatic
    get isBlock() {
        return false;
    }

    get text() {
        return (this.prefix || '') + this.children.map((x) => x.text).join('') + (this.affix || '');
    }

    constructor({prefix, affix}) {
        this.children = [];
        this.prefix = prefix;
        this.affix = affix;
    }

    empty() {
        return this.children.length === 0;
    }

    _simplify() {
        const {TextNode} = require('./text-node');

        const nodes = [];
        let isBlock = false;
        let isParagraph = false;
        for (let each of this.children) {
            const node = each.simplify();
            if (!node.empty()) {
                if (isParagraph) {
                    nodes.push(new TextNode(`${escape.lf}${escape.lf}`));
                }
                else if (isBlock) {
                    nodes.push(new TextNode(escape.lf));
                }
                isBlock = node.isBlock;
                isParagraph = node.isParagraph;
                nodes.push(node);
            }
        }
        return {nodes, isBlock, isParagraph};
    }
}
