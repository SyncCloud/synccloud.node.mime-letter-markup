import {nodeType} from '../node-type';

export class StripScriptHandler {
    //noinspection JSMethodCanBeStatic
    filter(node) {
        return node.nodeType === nodeType.ELEMENT_NODE
            && node.tagName === 'SCRIPT';
    }

    //noinspection JSMethodCanBeStatic
    handle() {
        return null;
    }
}
