import _ from 'lodash';

const SPLITTER_MAX_LINES = 4;

const RE_FWD = /^[-]+\s*Forwarded message\s*[-]+/i;

const START_OF_ON_LINE = [
    // English
    'On',
    // French
    'Le',
    // Polish
    'W dniu',
    // Dutch
    'Op',
    // German
    'Am',
    // Swedish, Danish
    'Den',
].join('|');

const END_OF_SMB_LINE = [
    // English
    'wrote', 'sent',
    // French
    // 'a écrit',
    // Polish
    'napisał',
    // Dutch
    'schreef', 'verzond', 'geschreven',
    // German
    'schrieb',
    // Norwegian, Swedish
    'skrev',
    // Russian
    'написал', "отправил"
].join('|');

// 2015-12-18 18:06 GMT+03:00 Somebody <reply.qa+ca831798-0910-4f11-8b49-3f7bf6f6196c@api.synccloud.com> wrote:
const RE_ON_DATE_SMB_WROTE = new RegExp(
    `^[-]*[>]?\\s?(?:${START_OF_ON_LINE})\\s.*(?:${END_OF_SMB_LINE}):?[-]*$`,
    "i"
);


// Special case for languages where text is translated like this: 'on {date} wrote {somebody}:'
/*
 RE_ON_DATE_WROTE_SMB = re.compile(
 u'(-*[>]?[ ]?({0})[ ].*(.*\n){{0,2}}.*({1})[ ]*.*:)'.format(
 # Beginning of the line
 u'|'.join((
 'Op',
 #German
 'Am'
 )),
 # Ending of the line
 u'|'.join((
 # Dutch
 'schreef','verzond','geschreven',
 # German
 'schrieb'
 ))
 )
 */

// {ISO 8601}<...>{EMAIL}:" - GMail format, example:
// 2015-12-07 19:55 GMT+03:00 Test Testov <reply+c689c755-8597-4278-84ee-fa7d2b360184@synccloud.com>:
const RE_GMAIL_ISO_DATE_SMB = /^[\-]*[>]?\s?(((19)|(20))\d\d\-((0[1-9])|(1[0-2]))\-(([0-2][0-9])|(3[0-1])))(\s.+)?\s\S+@\S{1,32}\.\S{1,32}(\W|$)/i;

const RUS_MONTHS = [
    'дек(абря|\.)?',
    'янв(аря|\.)?',
    'фев(раля|\.)?',
    'мар(та|\.)?',
    'апр(еля|\.)?',
    'мая',
    'июн(я|\.)?',
    'июл(я|\.)?',
    'авг(уста|\.)?',
    'сен(тября|\.)?',
    'окт(ября|\.)?',
    'ноя(бря|\.|б)?'
].join('|');

// yandex: 18 декабря 2015 г., 17:44 пользователь Самый Главный <reply.qa+ca831798-0910-4f11-8b49-3f7bf6f6196c@api.synccloud.com> написал:
// 15:01, 21 декабря 2015 г., Georgi Gasparyan <reply+8fe8ff7f-a02c-4afb-87bd-c83835fe8a32@synccloud.com>:
// mail.ru: Пятница, 18 декабря 2015, 15:24 UTC от Самый Главный <reply.qa+aeeebe11-c345-423d-8cc7-87398a3cc9b1@api.synccloud.com>:
const RE_RUS_DATE_SMB_WRITE = new RegExp(
    `^(([0-2][0-9])|(3[0-1]))\\s(${RUS_MONTHS})\\s(?:((19)|(20))\\d\\d)(г\.)?[\\s,].*(?:написал|отправил)?:?$`,
    "i");

const RE_DATE_SMB_COLON = /^\S{3,10}, \d\d? \S{3,10} 20\d\d,? \d\d?:\d\d(:\d\d)? ( \S+){3,6}@\S+:$/;

const RE_PHONE_SIGNATURE = new RegExp(
    "^" +
    "(?:" +
        // original talon lib
    "sent\\sfrom\\smy[\\s,!\\w]*" +
    "|" +
    "sent[ ]from[ ]Mailbox[ ]for[ ]iPhone.*" +
    "|" +
    "sent[ ]from[ ]Yandex.Mail[ ]for[ ]mobile.*" +
    "|" +
    "sent[ ]from[ ]Yahoo Mail[ ]on[ ].*" +
    "|" +
    "Отправлено\\s+из\\s+мобильной\\s+Яндекс\\.Почты.*" +
    "|" +
    "Отправлено\\s+из\\s+Outlook Mobile.*" +
    "|" +
    "Отправлено\\s+с\\s+iPhone" +
    "|" +
    "Sent\\s+from\\s+Outlook Mobile.*" +
    "|" +
    "sent[ ]([\\S]*[ ])?from[ ]my[ ]BlackBerry.*" +
    "|" +
    "Enviado[ ]desde[ ]mi[ ]([\\S]+[ ]){0,2}BlackBerry.*" +
        // added French support
    "|" +
    "envoyé\\sdepuis.*" +
    ")" +
    "$",
    "i"
);

const ORIGINAL_MESSAGES = [
    // English
    'Original Message', 'Reply Message',
    // German
    'Ursprüngliche Nachricht', 'Antwort Nachricht',
    // Danish
    'Oprindelig meddelelse',
    // Russian
    'Оригинальное сообщение'
].join('|');

const RE_ORIGINAL_MESSAGE = new RegExp(
    `\\s*[-]+\\s*(${ORIGINAL_MESSAGES})\\s*[-]+`,
    'i'
);

const FROM_WORDS = ['From', 'Van', 'De', 'Von', 'Fra', 'Från', 'От'];
const FROM_OR_DATE = [
    FROM_WORDS,
    'Date', 'Sent', 'Datum', 'Envoyé', 'Skickat', 'Sendt', 'Отправлено'
].join('|');

/*
 ________________________________
 > From: reply.qa+395fce42-7b0f-4c88-b3b7-f591f75453f6@api.synccloud.com
 > To: i.zuev@live.ru
 */
const RE_FROM_COLON_OR_DATE_COLON = new RegExp(
    `^[_]+([\\r]?\\n)?\\s*(:?(>\\s+)?${FROM_OR_DATE})[\\s]?:[\\s].*`,
    'i'
);

/*
 ________________________________
 > From: reply.qa+395fce42-7b0f-4c88-b3b7-f591f75453f6@api.synccloud.com
 > To: i.zuev@live.ru
 > Date: Fri, 18 Dec 2015 15:54:46 +0000
 > Subject: ТЕст [SyncCloud T#4828]
 */

const LIVE_RU_UNDERLINE = /^[_]{32}$/;

const SUBJECT_COLON = ['Subject:', 'Тема:'].join('|');

/*
 From: Самый Главный [mailto:reply.qa+529dd743-396d-40e0-941d-5c8a5bd47a5b@api.synccloud.com]
 Sent: Friday, December 18, 2015 7:27 PM
 To: Самый Главный
 Subject: outlook [SyncCloud T#4831]
*/
const RE_OUTLOOK_WITHOUT_UNDERLINE = new RegExp(`^(?:${FROM_WORDS.join('|')})[\\s]?:[\\s].*([\\r]?\\n)(?:subject:)\\s\S.*$`, 'i');
const RE_OUTLOOK_WITHOUT_UNDERLINE_FIRSTLINE = new RegExp(`^(?:${FROM_WORDS.join('|')})[\\s]*:[\\s]+.*[\\[<].*@\\S+[\\]>]$`, 'i');
const QUOT_PATTERN = /^>+\s?/;
const NO_QUOT_LINE = /^[^>].*[\S].*/;


const RE_DATE_PERSON_COLON = /^.*(\d+\/\d+\/\d+|\d+\.\d+\.\d+).*@\S+:$/i;
// 15:01, December 21, 2015, Georgi Gasparyan <reply+8fe8ff7f-a02c-4afb-87bd-c83835fe8a32@synccloud.com>:
const RE_DATE_TIME_DATE_YEAR_SMB_COLON = /^.*\d\d:\d\d.{1,20}\d\d.{1,20}\d\d\d\d.*<.*@\S+>(?:\S+)?:$/i;

const SPLITTER_PATTERNS = [
    RE_ORIGINAL_MESSAGE,
    RE_DATE_PERSON_COLON,
    RE_DATE_TIME_DATE_YEAR_SMB_COLON,
    RE_ON_DATE_SMB_WROTE,
    RE_GMAIL_ISO_DATE_SMB,
    RE_RUS_DATE_SMB_WRITE,
    RE_DATE_SMB_COLON,
    RE_FROM_COLON_OR_DATE_COLON,
    RE_PHONE_SIGNATURE,
    LIVE_RU_UNDERLINE,
    RE_OUTLOOK_WITHOUT_UNDERLINE_FIRSTLINE
];

function isQuotationSplitter(line, nextLines) {
    for (let re of SPLITTER_PATTERNS) {
        if (re.test(line)) {
            return true;
        }
        if (re.test([line].concat(nextLines).join('\r\n'))) {
            return true;
        }
    }
    return false;
}

// strip everyting after "-- " or "--" line (common signature)
const RE_COMMON_SIGNATURE_SPLITTER = /^[\-]{2,}\s*$/;

const SIGNATURE_PHRASES = [
    'С уважением',
    'С наилучшими пожеланиями',
    "BR",
    'With Best regards',
    'Sincerely',
    'Regards',
    'Kind regards',
    'Best regards',
    'Yours sincerely'
].join('|');

const RE_COMMON_SIGNATURE_PHRASE = new RegExp(
    `^(?:${SIGNATURE_PHRASES}),\\s?$`,
    'i'
);

const SIGNATURE_PATTERS = [
    RE_COMMON_SIGNATURE_SPLITTER,
    RE_COMMON_SIGNATURE_PHRASE
];

function isUserSignature(line) {
    for (let re of SIGNATURE_PATTERS) {
        if (re.test(line)) {
            return true;
        }
    }
    return false;
}

/*
     Mark message lines with markers to distinguish quotation lines.

     Markers:
     * e - empty line
     * m - line that starts with quotation marker '>'
     * s - splitter line
     * u - user signature
     * t - presumably lines from the last message in the conversation

     >>> mark_message_lines(['answer', 'From: foo@bar.com', '', '> question'])
     'tsem'
 */

function markLines(lines) {
    let markers = '';

    let i = 0;
    const length = lines.length;

    while (i < length) {
        let inc = 1;
        const l = lines[i];
        //console.log(`#index: ${i}`);
        const line = _.trim(l);
        if (!_.trim(line)) {
            markers+='e';
        } else if (QUOT_PATTERN.test(line)) {
            markers+= 'm';
        } else if (RE_FWD.test(line)) {
            markers+='f';
        } else if (isUserSignature(line)) {
            markers+='u';
        } else {
            let match = isQuotationSplitter(line);
            //console.log(`line:\n${line}\n${JSON.stringify(match, null, 4)}`);
            if (match) {
                markers+='s';
            } else {
                // lookahead for multiline splitters
                //for(let j = 2; j <= SPLITTER_MAX_LINES; j++) {
                //    console.log(i,j);
                //    console.log(JSON.stringify(lines.slice(i, i + j).join('\r\n')));
                //    match = isQuotationSplitter(lines.slice(i, i + j).join('\r\n'));
                //    console.log(match);
                //    if (match) {
                //        _.times(j, () => {
                //            markers+='s';
                //        });
                //        inc = j;
                //        break;
                //    }
                //}

                //if (!match) {
                    markers += 't';
                //}
            }
        }
        //console.log('markers: ', markers);
        i+=inc;
    }

    //console.log(markers);

    return markers;
}

/*
 Run regexes against message's marked lines to strip quotations.
 Return only last message lines.
 >>> mark_message_lines(['Hello', 'From: foo@bar.com', '', '> Hi', 'tsem'])
 ['Hello']
 Also returns return_flags.
 return_flags = [were_lines_deleted, first_deleted_line,
 last_deleted_line]
 */
function processMarkedLines(lines, markers) {
    return lines.splice(0, markers.match(/([te]*)/)[1].length);

    //// if there are no splitter there should be no markers
    //if (markers.indexOf('s') == -1) {
    //    markers.replace('m', 't');
    //}
    //
    //if (markers)

}

export default {
    isQuotationSplitter,
    isUserSignature,
    markLines,
    processMarkedLines
}

