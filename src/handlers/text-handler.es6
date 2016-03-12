import {nodeType} from '../node-type';
import {TextNode} from '../tree/text-node';

export class TextHandler {
    //noinspection JSMethodCanBeStatic
    filter(node) {
        return node.nodeType === nodeType.TEXT_NODE;
    }

    //noinspection JSMethodCanBeStatic
    handle(parent, node) {
        return new TextNode(node.nodeValue);
    }
}
