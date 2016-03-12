import {nodeType} from '../node-type';
import {ParagraphNode} from '../tree/paragraph-node';

export class ParagraphHandler {
    //noinspection JSMethodCanBeStatic
    filter(node) {
        return node.nodeType === nodeType.ELEMENT_NODE
            && node.tagName === 'P';
    }

    //noinspection JSMethodCanBeStatic
    handle(parent, node) {
        return new ParagraphNode({tag: node.tagName});
    }
}
