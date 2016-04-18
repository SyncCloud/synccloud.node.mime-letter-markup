import {inlineTags} from '../inline-tags';
import {nodeType} from '../node-type';
import {AnchorNode} from '../tree/anchor-node';

export class InlineHandler {
    //noinspection JSMethodCanBeStatic
    filter(node) {
        return node.nodeType === nodeType.ELEMENT_NODE
            && inlineTags.has(node.tagName);
    }

    //noinspection JSMethodCanBeStatic
    handle(parent, node) {
        return new InlineNode({tag: node.tagName, href: node.href});
    }
}
