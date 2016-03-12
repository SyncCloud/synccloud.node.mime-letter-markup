import {Markup, HtmlConverter} from '../src';
import fs from 'fs';
import path from 'path';

describe('mail parsing', function () {
    describe('plain text', function() {

        describe('Yandex', function() {
            it_parse_plain_text('ya_without_signature', 'Hello Igor!');
            it_parse_plain_text('ya_with_signature_bottom', 'Hello Igor!');
            it_parse_plain_text('ya_with_signature_top', 'Hello Igor!');
            it_parse_plain_text('ya_mobile_signature_top_ru', 'Hello Igor!');
            it_parse_plain_text('ya_mobile_signature_bottom_ru', 'Hello Igor!');
            it_parse_plain_text('ya_mobile_signature_bottom_en', 'Hello Igor!');
        });

        describe('Google', function() {
            it_parse_plain_text('gmail_without_signature', 'Hello Igor!');
            it_parse_plain_text('gmail_with_signature_bottom', 'Hello Igor!');
            it_parse_plain_text('gmail_with_signature_top', 'Hello Igor!');
            it_parse_plain_text('gmail_with_illegal_signature_top', 'Hello Igor!\n\nПодпись такая подпись\n+79879798787');
            it_parse_plain_text('gmail_english_date', 'Hello Igor!');
            it_parse_plain_text('gmail_english_date_on_wrote', 'Hello Igor!');
            it_parse_plain_text('gmail_english_date_with_signature_bottom', 'Hello Igor!');
            it_parse_plain_text('gmail_english_date_with_signature_top', 'Hello Igor!');
            it_parse_plain_text('gmail_mobile_ru', 'Hello Igor!');
            it_parse_plain_text('gmail_mobile_en', 'Hello Igor!');
        });


        describe('Mail.ru', function() {
            it_parse_plain_text('mailru_without_signature', 'Hello Igor!');
            it_parse_plain_text('mailru_with_signature_top', 'Hello Igor!');
            it_parse_plain_text('mailru_english_date_with_signature_buttom_en', 'Hello Igor!');
            it_parse_plain_text('mailru_english_date_with_signature_top_en', 'Hello Igor!');
            it_parse_plain_text('mailru_mobile_en', 'Hello Igor!');
            it_parse_plain_text('mailru_mobile_ru', 'Hello Igor!');

        });

        describe('Microsoft – live.ru', function() {
            it_parse_plain_text('liveru_without_signature', 'Hello Igor!');
            it_parse_plain_text('liveru_without_signature_en', 'Hello Igor!');
        });

        describe('Yahoo', function() {
            it_parse_plain_text('yahoo_without_signature', 'Hello Igor!');
            it_parse_plain_text('yahoo_with_signature_top', 'Hello Igor!');
            it_parse_plain_text('yahoo_mobile_with_signature_en', 'Hello Igor!');
            it_parse_plain_text('yahoo_mobile_without_signature_en', 'Hello Igor!');
        });

        describe('Outlook', function() {
            it_parse_plain_text('outlook_from_multiline_ru', 'Hello Igor!');
            it_parse_plain_text('outlook_without_signature', 'Hello Igor!');
            it_parse_plain_text('outlook_with_signature', 'Hello Igor!');
            it_parse_plain_text('outlook_mobile_en', 'Hello Igor!');
            it_parse_plain_text('outlook_mobile_ru', 'Hello Igor!');
        });

        describe('Aolmail', function() {
            it_parse_plain_text('aolmail_without_signature', 'Hello Igor!');
            it_parse_plain_text('aolmail_with_signature', 'Hello Igor!');
            it_parse_plain_text('aolmail_mobile', 'Hello Igor!');
        });

        describe('Zoho', function() {
            it_parse_plain_text('zoho_without_signature', 'Hello Igor!');
            it_parse_plain_text('zoho_with_signature', 'Hello Igor!');
            it_parse_plain_text('zoho_mobile', 'Hello Igor!');
        });

        describe('The Bat', function() {
            it_parse_plain_text('bat_with_signature', 'Hello Igor!');
        });

        describe('Sent from', function () {
            it_parse_plain_text('sent_from_iphone_ru', 'Hello Igor!');
        });

        describe('Signatures RU', function() {
            it_parse_plain_text('signature_ru_s_uvajeniem', 'Hello Igor!');
            it_parse_plain_text('signature_crazy-fridman', 'Георгий, добрый день!\nБольшое спасибо!');
            it_parse_plain_text('signature_ru_multiline_s_uvazeniem', 'Hello Igor!');
        });

        it_parse_plain_text('should_keep_linebreaks', 'first line\n\n\nsecond one');

    });

    describe.skip('html', function() {
        it_parse_html('simple', '1\n2');
        it_parse_html('crazy_fridman', "TODO:");
    });

});


/*
    Test runners
*/

function it_parse_plain_text(fileName, result) {
    it(fileName, async () => {
        const text = await plainTextLetterAsync(fileName);
        const markup = Markup.fromPlain(text);
        const parsed = markup.stripMailSignature();

        expect(parsed).to.have.property('plain', result);
    });
}

function it_parse_html(fileName, result) {
    it(fileName, async () => {
        const html = await htmlLetterAsync(fileName);
        const htmlConverter = new HtmlConverter();

        const parsed =
            (await htmlConverter.parseAsync(html))
                .stripMailSignature().extractMarkers('task');

        expect(parsed).to.have.property('plain', result);
    });
}

/*
    HELPERS
*/

async function htmlLetterAsync(htmlFileName) {
    return fs.readFileSync(path.join(__dirname, 'letters/html', htmlFileName + '.html'), 'utf8');
}

async function plainTextLetterAsync(htmlFileName) {
    return fs.readFileSync(path.join(__dirname, 'letters/text', htmlFileName + '.txt'), 'utf8');
}
