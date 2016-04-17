import {nodeType} from '../node-type';

export class StripStyleHandler {
    //noinspection JSMethodCanBeStatic
    filter(node) {
        return node.nodeType === nodeType.ELEMENT_NODE
            && node.tagName === 'STYLE';
    }

    //noinspection JSMethodCanBeStatic
    handle() {
        return null;
    }
}
