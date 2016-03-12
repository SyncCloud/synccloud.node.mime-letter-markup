import {nodeType} from '../node-type';
import {TextNode} from '../tree/text-node';

export class StripBlockquoteHandler {
    //noinspection JSMethodCanBeStatic
    filter(node) {
        return node.nodeType === nodeType.ELEMENT_NODE
            && node.tagName === 'BLOCKQUOTE';
    }

    //noinspection JSMethodCanBeStatic
    handle() {
        return null;
    }
}
