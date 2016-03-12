import _ from 'lodash';
import {Node} from './node';

export class TextNode extends Node {
    get text() {
        return this._text;
    }

    constructor(text, {tag, prefix, affix} = {}) {
        super({prefix, affix});
        this._text = text;
        this.tag = tag;
    }

    simplify() {
        return this;
    }

    empty() {
        return _.trim(this.text).length === 0;
    }
}
