import { makeGetSet } from '../moment/get-set';
import { addFormatToken } from '../format/format';
import {
    addRegexToken,
    match1to2,
    match1to4,
    match1to6,
    match2,
    match4,
    match6,
    matchSigned,
} from '../parse/regex';
import { addParseToken } from '../parse/token';
import { isLeapYear } from '../utilities/is-leap-year';
import { hooks } from '../utilities/hooks';
import { YEAR } from './constants';
import toInt from '../utilities/to-int';
import zeroFill from '../utilities/zero-fill';

// FORMATTING

addFormatToken('Y', 0, 0, function () {
    var y = this.year();
    return y <= 9999 ? zeroFill(y, 4) : '+' + y;
});

addFormatToken(0, ['YY', 2], 0, function () {
    return this.year() % 100;
});

addFormatToken(0, ['YYYY', 4], 0, 'year');
addFormatToken(0, ['YYYYY', 5], 0, 'year');
addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

// PARSING

addRegexToken('Y', matchSigned);
addRegexToken('YY', match1to2, match2);
addRegexToken('YYYY', match1to4, match4);
addRegexToken('YYYYY', match1to6, match6);
addRegexToken('YYYYYY', match1to6, match6);

addParseToken(['YYYYY', 'YYYYYY'], YEAR);
addParseToken('YYYY', function (input, array) {
    array[YEAR] =
        input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
});
addParseToken('YY', function (input, array) {
    array[YEAR] = hooks.parseTwoDigitYear(input);
});
addParseToken('Y', function (input, array) {
    array[YEAR] = parseInt(input, 10);
});

// HELPERS

export function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

export { isLeapYear };

// HOOKS

hooks.parseTwoDigitYear = function (input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
};

// MOMENTS

export var getSetYear = makeGetSet('FullYear', true);

export function getIsLeapYear() {
    return isLeapYear(this.year());
}
