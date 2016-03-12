import classifier from '../src/lines-classifier';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

describe.skip('line classifier', function() {
	it('quote signature yandex.ru', () => {
		const sig = '18 декабря 2015 г., 17:39 пользователь Самый Главный <reply.qa+ca831798-0910-4f11-8b49-3f7bf6f6196c@api.synccloud.com> написал:';
        assert(classifier.isQuotationSplitter(sig));
	});

	it('quote signature mail.ru', () => {
		const sig = 'Пятница, 18 декабря 2015, 15:24 UTC от Самый Главный <reply.qa+aeeebe11-c345-423d-8cc7-87398a3cc9b1@api.synccloud.com>:';
		assert(classifier.isQuotationSplitter(sig));
	});

	describe('markers', function() {
		it_marker_test('gmail_english_date');
		it_marker_test('ya_with_signature_top');
	});
});

function it_marker_test(inputFileName, markersFileName) {
	if (!markersFileName) {
		markersFileName = inputFileName;
	}

	it(inputFileName, async () => {
		const textLetter = await plainTextLetterAsync(inputFileName);
		let lines = _.trim(textLetter).split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/).slice(0, 1000);
		const markers = classifier.markLines(lines);
		let i=0;
		for (let line of lines) {
			const m = markers[i];
			lines[i] = m  + ': ' + line;
			i++;
		}
		const text = lines.join('\n');
		expect(text).to.eql(await markersTextLetterAsync(markersFileName));
	});
}

async function plainTextLetterAsync(htmlFileName) {
	return fs.readFileSync(path.join(__dirname, 'letters/text', htmlFileName + '.txt'), 'utf8');
}


async function markersTextLetterAsync(htmlFileName) {
	return fs.readFileSync(path.join(__dirname, 'markers/text', htmlFileName + '.txt'), 'utf8');
}
