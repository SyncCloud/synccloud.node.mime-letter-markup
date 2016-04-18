import _ from 'lodash';
import jsdom from 'jsdom';
import {Deferred} from '@synccloud/utils';
import {escape} from './escape';
import {Markup} from './markup';
import {AnchorHandler, BlockHandler, BrHandler, InlineHandler, ParagraphHandler, StripHeadHandler,
        StripImgHandler, StripScriptHandler, StripStyleHandler, StrongHandler, TextHandler} from './handlers';

const despaceRx = /\s+/g;
const descapeWsRx = new RegExp(escToRx(escape.ws), 'g');
const descapeLfRx = new RegExp(escToRx(escape.lf), 'g');

function descape(markup) {
    return markup.replace(descapeWsRx, ' ').replace(descapeLfRx, '\n');
}

function escToRx(esc) {
    return '\\u' + _.padLeft(esc.charCodeAt(0), 4, '0');
}

export default class HtmlConverter {
    get options() {
        const options = _.merge({}, this._options);
        options.handlers = defaultArray(
            [], options.handlers, [
                new TextHandler(),
                new StripHeadHandler(),
                new StripImgHandler(),
                new StripScriptHandler(),
                new StripStyleHandler(),
                new BrHandler(),
                new AnchorHandler(),
                new ParagraphHandler(),
                new InlineHandler(),
                new BlockHandler()
            ]);
        return options;
    }

    constructor(options) {
        this._options = options;
    }

    parseAsync(html) {
        return new Promise((resolve, reject) => {
            try {
                jsdom.env(
                    html.replace(/&nbsp;/g, escape.ws),
                    (err, window) => {
                        try {
                            if (err) {
                                return reject(err);
                            }

                            const options = this.options;
                            const document = window.document;
                            const body = document.body;
                            const node = recurse(body).simplify();

                            const code = descape(node.text.replace(despaceRx, ' ')) || '';

                            //noinspection UnnecessaryLocalVariableJS
                            const markup = new Markup(code, {source: html});

                            return resolve(markup);

                            function recurse(node, parent) {
                                for (let handler of options.handlers) {
                                    if (handler.filter(node)) {
                                        const result = handler.handle(parent, node);
                                        if (result) {
                                            for (let child of node.childNodes) {
                                                const res = recurse(child, result);
                                                res && result.children.push(res);
                                            }
                                        }
                                        return result;
                                    }
                                }
                            }
                        }
                        catch (exc) {
                            reject(exc);
                        }
                    });
            }
            catch (exc) {
                reject(exc);
            }
        });
    }
}

function defaultArray(target, ...defaults) {
    for (let each of defaults) {
        if (each && typeof (each[Symbol.iterator]) === 'function') {
            for (let item of each) {
                target.push(item);
            }
        }
    }
    return target;
}
