import _ from 'lodash';
import classifier from './lines-classifier';

const MAX_LETTER_LINES = 1000;

export class Markup {
    static fromPlain(text) {
        return new Markup(text, {source: text, plain: text});
    }

    get code() {
        return this._code;
    }

    get source() {
        return this._source;
    }

    get plain() {
        return this._plain || (
            this._plain = ((markup = '') => {
                const chars = [];
                for (let i = 0, ii = markup.length; i < ii; ++i) {
                    let char = markup[i];
                    if (char === escape.begin) {
                        do {
                            char = markup[++i];
                        }
                        while (char !== escape.end);
                    }
                    else {
                        chars.push(char);
                    }
                }
                return _.trim(chars.join(''));
            })(this.code));
    }

    get markers() {
        return this._markers;
    }

    constructor(code = '', {source, plain, markers} = {}) {
        this._code = code;
        this._source = source;
        this._plain = plain;
        this._markers = markers || {};
    }

    extractMarkers(markers) {
        if (markers === 'task') {
            markers = new Set(['expiresAt', 'executor']);
        }
        else if (markers === 'reply') {
            markers = new Set(['expiresAt', 'executor', 'state']);
        }
        else {
            markers = new Set(markers || []);
        }

        const extracted = {};

        const lines = _.trim(this.plain)
            .split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/)
            .filter((line) => {
                const upper = line.toUpperCase();
                if (markers.has('expiresAt')) {
                    if (upper.indexOf('#DEADLINEMM-DD-YY') === 0) {
                        extracted.expiresAt = line.substr('#DEADLINEMM-DD-YY'.length).trim();
                        return false;
                    }
                }
                if (markers.has('executor')) {
                    if (upper.indexOf('#ASSIGN') === 0) {
                        extracted.executor = line.substr('#ASSIGN'.length).trim();
                        return false;
                    }
                }
                if (markers.has('state')) {
                    if (upper.indexOf('#REOPEN') === 0) {
                        extracted.state = 'opened';
                        return false;
                    }
                    if (upper.indexOf('#WORK') === 0) {
                        extracted.state = 'inWork';
                        return false;
                    }
                    if (upper.indexOf('#DONE') === 0) {
                        extracted.state = 'completed';
                        return false;
                    }
                    if (upper.indexOf('#ARCHIVE') === 0) {
                        extracted.state = 'closed';
                        return false;
                    }
                    if (upper.indexOf('#ARCHIVED') === 0) {
                        extracted.state = 'closed';
                        return false;
                    }
                }
                return true;
            });

        const text = lines.join('\n');
        return new Markup(text, {
            plain: text,
            source: this.source,
            markers: extracted
        });
    }

    stripMailSignature() {
        const msg = this.plain;
        const delimeter = getDelimiter(msg);
        let lines = _.trim(msg).split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/).slice(0, MAX_LETTER_LINES);
        const markers = classifier.markLines(lines);
        lines = classifier.processMarkedLines(lines, markers);
        const text = _.trim(lines.join('\n'));
        return new Markup(text, {
            plain: text,
            source: this.source,
            markers: this.markers
        });
    }
}

function getDelimiter(msgBody) {
    var delimiter = /\r?\n/.exec(msgBody);
    if (delimiter) {
        return delimiter[0];
    } else {
        return "\n";
    }
}
