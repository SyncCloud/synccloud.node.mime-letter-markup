import {escape} from '../escape';
import {nodeType} from '../node-type';
import {TextNode} from '../tree/text-node';

export class BrHandler {
    //noinspection JSMethodCanBeStatic
    filter(node) {
        return node.nodeType === nodeType.ELEMENT_NODE
            && node.tagName === 'BR';
    }

    //noinspection JSMethodCanBeStatic
    handle(parent, node) {
        return new TextNode(escape.lf, {tag: node.tagName});
    }
}
