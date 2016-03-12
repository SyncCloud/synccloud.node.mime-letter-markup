import {nodeType} from '../node-type';
import {BlockNode} from '../tree/block-node';

export class BlockHandler {
    //noinspection JSMethodCanBeStatic
    filter(node) {
        return node.nodeType === nodeType.ELEMENT_NODE;
    }

    //noinspection JSMethodCanBeStatic
    handle(parent, node) {
        return new BlockNode({tag: node.tagName});
    }
}
