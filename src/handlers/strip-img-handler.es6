import {nodeType} from '../node-type';

export class StripImgHandler {
    //noinspection JSMethodCanBeStatic
    filter(node) {
        return node.nodeType === nodeType.ELEMENT_NODE
            && node.tagName === 'IMG';
    }

    //noinspection JSMethodCanBeStatic
    handle() {
        return null;
    }
}
