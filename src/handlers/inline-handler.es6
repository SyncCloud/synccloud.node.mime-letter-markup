import {inlineTags} from '../inline-tags';
import {nodeType} from '../node-type';
import {InlineNode} from '../tree/inline-node';

export class InlineHandler {
    //noinspection JSMethodCanBeStatic
    filter(node) {
        return node.nodeType === nodeType.ELEMENT_NODE
            && inlineTags.has(node.tagName);
    }

    //noinspection JSMethodCanBeStatic
    handle(parent, node) {
        return new InlineNode({tag: node.tagName});
    }
}
