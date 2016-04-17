import {nodeType} from '../node-type';

export class StripHeadHandler {
    //noinspection JSMethodCanBeStatic
    filter(node) {
        return node.nodeType === nodeType.ELEMENT_NODE
            && node.tagName === 'HEAD';
    }

    //noinspection JSMethodCanBeStatic
    handle() {
        return null;
    }
}
