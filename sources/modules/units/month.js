import { get } from '../moment/get-set';
import hasOwnProp from '../utilities/has-own-prop';
import { addFormatToken } from '../format/format';
import {
    addRegexToken,
    match1to2,
    match2,
    matchWord,
    regexEscape,
    match1to2NoLeadingZero,
} from '../parse/regex';
import { addParseToken } from '../parse/token';
import { hooks } from '../utilities/hooks';
import { MONTH } from './constants';
import toInt from '../utilities/to-int';
import isArray from '../utilities/is-array';
import isNumber from '../utilities/is-number';
import mod from '../utilities/mod';
import indexOf from '../utilities/index-of';
import { createUTC } from '../create/utc';
import getParsingFlags from '../create/parsing-flags';
import { isLeapYear } from '../utilities/is-leap-year';

export function daysInMonth(year, month) {
    if (isNaN(year) || isNaN(month)) {
        return NaN;
    }
    var modMonth = mod(month, 12);
    year += (month - modMonth) / 12;
    return modMonth === 1
        ? isLeapYear(year)
            ? 29
            : 28
        : 31 - ((modMonth % 7) % 2);
}

// FORMATTING

addFormatToken('M', ['MM', 2], 'Mo', function () {
    return this.month() + 1;
});

addFormatToken('MMM', 0, 0, function (format) {
    return this.localeData().monthsShort(this, format);
});

addFormatToken('MMMM', 0, 0, function (format) {
    return this.localeData().months(this, format);
});

// PARSING

addRegexToken('M', match1to2, match1to2NoLeadingZero);
addRegexToken('MM', match1to2, match2);
addRegexToken('MMM', function (isStrict, locale) {
    return locale.monthsShortRegex(isStrict);
});
addRegexToken('MMMM', function (isStrict, locale) {
    return locale.monthsRegex(isStrict);
});

addParseToken(['M', 'MM'], function (input, array) {
    array[MONTH] = toInt(input) - 1;
});

addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
    var month = config._locale.monthsParse(input, token, config._strict);
    // if we didn't find a month name, mark the date as invalid.
    if (month != null) {
        array[MONTH] = month;
    } else {
        getParsingFlags(config).invalidMonth = input;
    }
});

// LOCALES

var defaultLocaleMonths =
        'January_February_March_April_May_June_July_August_September_October_November_December'.split(
            '_'
        ),
    defaultLocaleMonthsShort =
        'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
    defaultMonthsShortRegex = matchWord,
    defaultMonthsRegex = matchWord;

export { defaultLocaleMonths, defaultLocaleMonthsShort };

export function localeMonths(m, format) {
    if (!m) {
        return isArray(this._months)
            ? this._months
            : this._months['standalone'];
    }
    return isArray(this._months)
        ? this._months[m.month()]
        : this._months[
              (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
                  ? 'format'
                  : 'standalone'
          ][m.month()];
}

export function localeMonthsShort(m, format) {
    if (!m) {
        return isArray(this._monthsShort)
            ? this._monthsShort
            : this._monthsShort['standalone'];
    }
    return isArray(this._monthsShort)
        ? this._monthsShort[m.month()]
        : this._monthsShort[
              MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
          ][m.month()];
}

function handleStrictParse(monthName, format, strict) {
    var i,
        ii,
        mom,
        llc = monthName.toLocaleLowerCase();
    if (!this._monthsParse) {
        // this is not used
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
        for (i = 0; i < 12; ++i) {
            mom = createUTC([2000, i]);
            this._shortMonthsParse[i] = this.monthsShort(
                mom,
                ''
            ).toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'MMM') {
            ii = indexOf.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'MMM') {
            ii = indexOf.call(this._shortMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf.call(this._longMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

export function localeMonthsParse(monthName, format, strict) {
    var i, mom, regex;

    if (this._monthsParseExact) {
        return handleStrictParse.call(this, monthName, format, strict);
    }

    if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
    }

    // TODO: add sorting
    // Sorting makes sure if one month (or abbr) is a prefix of another
    // see sorting in computeMonthsParse
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp(
                '^' + this.months(mom, '').replace('.', '') + '$',
                'i'
            );
            this._shortMonthsParse[i] = new RegExp(
                '^' + this.monthsShort(mom, '').replace('.', '') + '$',
                'i'
            );
        }
        if (!strict && !this._monthsParse[i]) {
            regex =
                '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (
            strict &&
            format === 'MMMM' &&
            this._longMonthsParse[i].test(monthName)
        ) {
            return i;
        } else if (
            strict &&
            format === 'MMM' &&
            this._shortMonthsParse[i].test(monthName)
        ) {
            return i;
        } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
        }
    }
}

// MOMENTS

export function setMonth(mom, value) {
    if (!mom.isValid()) {
        // No op
        return mom;
    }

    if (typeof value === 'string') {
        if (/^\d+$/.test(value)) {
            value = toInt(value);
        } else {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (!isNumber(value)) {
                return mom;
            }
        }
    }

    var month = value,
        date = mom.date();

    date = date < 29 ? date : Math.min(date, daysInMonth(mom.year(), month));
    void (mom._isUTC
        ? mom._d.setUTCMonth(month, date)
        : mom._d.setMonth(month, date));
    return mom;
}

export function getSetMonth(value) {
    if (value != null) {
        setMonth(this, value);
        hooks.updateOffset(this, true);
        return this;
    } else {
        return get(this, 'Month');
    }
}

export function getDaysInMonth() {
    return daysInMonth(this.year(), this.month());
}

export function monthsShortRegex(isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsShortStrictRegex;
        } else {
            return this._monthsShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsShortRegex')) {
            this._monthsShortRegex = defaultMonthsShortRegex;
        }
        return this._monthsShortStrictRegex && isStrict
            ? this._monthsShortStrictRegex
            : this._monthsShortRegex;
    }
}

export function monthsRegex(isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsStrictRegex;
        } else {
            return this._monthsRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsRegex')) {
            this._monthsRegex = defaultMonthsRegex;
        }
        return this._monthsStrictRegex && isStrict
            ? this._monthsStrictRegex
            : this._monthsRegex;
    }
}

function computeMonthsParse() {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var shortPieces = [],
        longPieces = [],
        mixedPieces = [],
        i,
        mom,
        shortP,
        longP;
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        shortP = regexEscape(this.monthsShort(mom, ''));
        longP = regexEscape(this.months(mom, ''));
        shortPieces.push(shortP);
        longPieces.push(longP);
        mixedPieces.push(longP);
        mixedPieces.push(shortP);
    }
    // Sorting makes sure if one month (or abbr) is a prefix of another it
    // will match the longer piece.
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);

    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._monthsShortRegex = this._monthsRegex;
    this._monthsStrictRegex = new RegExp(
        '^(' + longPieces.join('|') + ')',
        'i'
    );
    this._monthsShortStrictRegex = new RegExp(
        '^(' + shortPieces.join('|') + ')',
        'i'
    );
}
