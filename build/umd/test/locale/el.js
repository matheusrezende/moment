
;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../../moment')) :
   typeof define === 'function' && define.amd ? define(['../../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';

function each(array, callback) {
    var i;
    for (i = 0; i < array.length; i++) {
        callback(array[i], i, array);
    }
}

function objectKeys(obj) {
    if (Object.keys) {
        return Object.keys(obj);
    } else {
        // IE8
        var res = [], i;
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                res.push(i);
            }
        }
        return res;
    }
}

// Pick the first defined of two or three arguments.

function defineCommonLocaleTests(locale, options) {
    test('lenient day of month ordinal parsing', function (assert) {
        var i, ordinalStr, testMoment;
        for (i = 1; i <= 31; ++i) {
            ordinalStr = moment([2014, 0, i]).format('YYYY MM Do');
            testMoment = moment(ordinalStr, 'YYYY MM Do');
            assert.equal(testMoment.year(), 2014,
                    'lenient day of month ordinal parsing ' + i + ' year check');
            assert.equal(testMoment.month(), 0,
                    'lenient day of month ordinal parsing ' + i + ' month check');
            assert.equal(testMoment.date(), i,
                    'lenient day of month ordinal parsing ' + i + ' date check');
        }
    });

    test('lenient day of month ordinal parsing of number', function (assert) {
        var i, testMoment;
        for (i = 1; i <= 31; ++i) {
            testMoment = moment('2014 01 ' + i, 'YYYY MM Do');
            assert.equal(testMoment.year(), 2014,
                    'lenient day of month ordinal parsing of number ' + i + ' year check');
            assert.equal(testMoment.month(), 0,
                    'lenient day of month ordinal parsing of number ' + i + ' month check');
            assert.equal(testMoment.date(), i,
                    'lenient day of month ordinal parsing of number ' + i + ' date check');
        }
    });

    test('strict day of month ordinal parsing', function (assert) {
        var i, ordinalStr, testMoment;
        for (i = 1; i <= 31; ++i) {
            ordinalStr = moment([2014, 0, i]).format('YYYY MM Do');
            testMoment = moment(ordinalStr, 'YYYY MM Do', true);
            assert.ok(testMoment.isValid(), 'strict day of month ordinal parsing ' + i);
        }
    });

    test('meridiem invariant', function (assert) {
        var h, m, t1, t2;
        for (h = 0; h < 24; ++h) {
            for (m = 0; m < 60; m += 15) {
                t1 = moment.utc([2000, 0, 1, h, m]);
                t2 = moment.utc(t1.format('A h:mm'), 'A h:mm');
                assert.equal(t2.format('HH:mm'), t1.format('HH:mm'),
                        'meridiem at ' + t1.format('HH:mm'));
            }
        }
    });

    test('date format correctness', function (assert) {
        var data, tokens;
        data = moment.localeData()._longDateFormat;
        tokens = objectKeys(data);
        each(tokens, function (srchToken) {
            // Check each format string to make sure it does not contain any
            // tokens that need to be expanded.
            each(tokens, function (baseToken) {
                // strip escaped sequences
                var format = data[baseToken].replace(/(\[[^\]]*\])/g, '');
                assert.equal(false, !!~format.indexOf(srchToken),
                        'contains ' + srchToken + ' in ' + baseToken);
            });
        });
    });

    test('month parsing correctness', function (assert) {
        var i, m;

        if (locale === 'tr') {
            // I can't fix it :(
            expect(0);
            return;
        }
        function tester(format) {
            var r;
            r = moment(m.format(format), format);
            assert.equal(r.month(), m.month(), 'month ' + i + ' fmt ' + format);
            r = moment(m.format(format).toLocaleUpperCase(), format);
            assert.equal(r.month(), m.month(), 'month ' + i + ' fmt ' + format + ' upper');
            r = moment(m.format(format).toLocaleLowerCase(), format);
            assert.equal(r.month(), m.month(), 'month ' + i + ' fmt ' + format + ' lower');

            r = moment(m.format(format), format, true);
            assert.equal(r.month(), m.month(), 'month ' + i + ' fmt ' + format + ' strict');
            r = moment(m.format(format).toLocaleUpperCase(), format, true);
            assert.equal(r.month(), m.month(), 'month ' + i + ' fmt ' + format + ' upper strict');
            r = moment(m.format(format).toLocaleLowerCase(), format, true);
            assert.equal(r.month(), m.month(), 'month ' + i + ' fmt ' + format + ' lower strict');
        }

        for (i = 0; i < 12; ++i) {
            m = moment([2015, i, 15, 18]);
            tester('MMM');
            tester('MMM.');
            tester('MMMM');
            tester('MMMM.');
        }
    });

    test('weekday parsing correctness', function (assert) {
        var i, m;

        if (locale === 'tr' || locale === 'az' || locale === 'ro') {
            // tr, az: There is a lower-case letter (ı), that converted to
            // upper then lower changes to i
            // ro: there is the letter ț which behaves weird under IE8
            expect(0);
            return;
        }
        function tester(format) {
            var r, baseMsg = 'weekday ' + m.weekday() + ' fmt ' + format + ' ' + m.toISOString();
            r = moment(m.format(format), format);
            assert.equal(r.weekday(), m.weekday(), baseMsg);
            r = moment(m.format(format).toLocaleUpperCase(), format);
            assert.equal(r.weekday(), m.weekday(), baseMsg + ' upper');
            r = moment(m.format(format).toLocaleLowerCase(), format);
            assert.equal(r.weekday(), m.weekday(), baseMsg + ' lower');

            r = moment(m.format(format), format, true);
            assert.equal(r.weekday(), m.weekday(), baseMsg + ' strict');
            r = moment(m.format(format).toLocaleUpperCase(), format, true);
            assert.equal(r.weekday(), m.weekday(), baseMsg + ' upper strict');
            r = moment(m.format(format).toLocaleLowerCase(), format, true);
            assert.equal(r.weekday(), m.weekday(), baseMsg + ' lower strict');
        }

        for (i = 0; i < 7; ++i) {
            m = moment.utc([2015, 0, i + 1, 18]);
            tester('dd');
            tester('ddd');
            tester('dddd');
        }
    });

    test('valid localeData', function (assert) {
        assert.equal(moment().localeData().months().length, 12, 'months should return 12 months');
        assert.equal(moment().localeData().monthsShort().length, 12, 'monthsShort should return 12 months');
        assert.equal(moment().localeData().weekdays().length, 7, 'weekdays should return 7 days');
        assert.equal(moment().localeData().weekdaysShort().length, 7, 'weekdaysShort should return 7 days');
        assert.equal(moment().localeData().weekdaysMin().length, 7, 'monthsShort should return 7 days');
    });
}

function setupDeprecationHandler(test, moment$$1, scope) {
    test._expectedDeprecations = null;
    test._observedDeprecations = null;
    test._oldSupress = moment$$1.suppressDeprecationWarnings;
    moment$$1.suppressDeprecationWarnings = true;
    test.expectedDeprecations = function () {
        test._expectedDeprecations = arguments;
        test._observedDeprecations = [];
    };
    moment$$1.deprecationHandler = function (name, msg) {
        var deprecationId = matchedDeprecation(name, msg, test._expectedDeprecations);
        if (deprecationId === -1) {
            throw new Error('Unexpected deprecation thrown name=' +
                    name + ' msg=' + msg);
        }
        test._observedDeprecations[deprecationId] = 1;
    };
}

function teardownDeprecationHandler(test, moment$$1, scope) {
    moment$$1.suppressDeprecationWarnings = test._oldSupress;

    if (test._expectedDeprecations != null) {
        var missedDeprecations = [];
        each(test._expectedDeprecations, function (deprecationPattern, id) {
            if (test._observedDeprecations[id] !== 1) {
                missedDeprecations.push(deprecationPattern);
            }
        });
        if (missedDeprecations.length !== 0) {
            throw new Error('Expected deprecation warnings did not happen: ' +
                    missedDeprecations.join(' '));
        }
    }
}

function matchedDeprecation(name, msg, deprecations) {
    if (deprecations == null) {
        return -1;
    }
    for (var i = 0; i < deprecations.length; ++i) {
        if (name != null && name === deprecations[i]) {
            return i;
        }
        if (msg != null && msg.substring(0, deprecations[i].length) === deprecations[i]) {
            return i;
        }
    }
    return -1;
}

/*global QUnit:false*/

var test = QUnit.test;

var expect = QUnit.expect;



function localeModule (name, lifecycle) {
    QUnit.module('locale:' + name, {
        setup : function () {
            moment.locale(name);
            moment.createFromInputFallback = function (config) {
                throw new Error('input not handled by moment: ' + config._i);
            };
            setupDeprecationHandler(test, moment, 'locale');
            if (lifecycle && lifecycle.setup) {
                lifecycle.setup();
            }
        },
        teardown : function () {
            moment.locale('en');
            teardownDeprecationHandler(test, moment, 'locale');
            if (lifecycle && lifecycle.teardown) {
                lifecycle.teardown();
            }
        }
    });
    defineCommonLocaleTests(name, -1, -1);
}

localeModule('el');

test('parse', function (assert) {
    var i,
        tests = 'Ιανουάριος Ιαν_Φεβρουάριος Φεβ_Μάρτιος Μαρ_Απρίλιος Απρ_Μάιος Μαϊ_Ιούνιος Ιουν_Ιούλιος Ιουλ_Αύγουστος Αυγ_Σεπτέμβριος Σεπ_Οκτώβριος Οκτ_Νοέμβριος Νοε_Δεκέμβριος Δεκ'.split('_');

    function equalTest(input, mmm, i) {
        assert.equal(moment(input, mmm).month(), i, input + ' should be month ' + (i + 1));
    }

    for (i = 0; i < 12; i++) {
        tests[i] = tests[i].split(' ');
        equalTest(tests[i][0], 'MMM', i);
        equalTest(tests[i][1], 'MMM', i);
        equalTest(tests[i][0], 'MMMM', i);
        equalTest(tests[i][1], 'MMMM', i);
        equalTest(tests[i][0].toLocaleLowerCase(), 'MMMM', i);
        equalTest(tests[i][1].toLocaleLowerCase(), 'MMMM', i);
        equalTest(tests[i][0].toLocaleUpperCase(), 'MMMM', i);
        equalTest(tests[i][1].toLocaleUpperCase(), 'MMMM', i);
    }
});

test('parse meridiem', function (assert) {
    var i,
        b = moment(),
        meridiemTests = [
            // h a patterns, expected hours, isValid
            ['10 πμ',   10, true],
            ['10 μμ',   22, true],
            ['10 π.μ.', 10, true],
            ['10 μ.μ.', 22, true],
            ['10 π',    10, true],
            ['10 μ',    22, true],
            ['10 ΠΜ',   10, true],
            ['10 ΜΜ',   22, true],
            ['10 Π.Μ.', 10, true],
            ['10 Μ.Μ.', 22, true],
            ['10 Π',    10, true],
            ['10 Μ',    22, true],
            ['10 am',   10, false],
            ['10 pm',   10, false]
        ],
        parsed;

    // test that a formatted moment including meridiem string can be parsed back to the same moment
    assert.ok(b.isSame(moment(b.format('h:mm:ss a'), 'h:mm:ss a', 'el', true), 'seconds'), b.format('h:mm:ss a') + ' should be equal to ' + moment(b.format('h:mm:ss a'), 'h:mm:ss a', 'el', true).format('h:mm:ss a'));

    // test that a formatted moment having a meridiem string can be parsed with strict flag
    assert.ok(moment(b.format('h:mm:ss a'), 'h:mm:ss a', 'el', true).isValid(), b.format('h:mm:ss a') + ' should be parsed as valid');

    for (i = 0; i < meridiemTests.length; i++) {
        parsed = moment(meridiemTests[i][0], 'h a', 'el', true);
        assert.equal(parsed.isValid(), meridiemTests[i][2], 'validity for ' + meridiemTests[i][0]);
        if (parsed.isValid()) {
            assert.equal(parsed.hours(), meridiemTests[i][1], 'hours for ' + meridiemTests[i][0]);
        }
    }
});

test('format', function (assert) {
    var a = [
            ['dddd, MMMM Do YYYY, h:mm:ss a',      'Κυριακή, Φεβρουάριος 14η 2010, 3:25:50 μμ'],
            ['dddd, D MMMM YYYY, h:mm:ss a',       'Κυριακή, 14 Φεβρουαρίου 2010, 3:25:50 μμ'],
            ['ddd, hA',                            'Κυρ, 3ΜΜ'],
            ['dddd, MMMM YYYY',                    'Κυριακή, Φεβρουάριος 2010'],
            ['M Mo MM MMMM MMM',                   '2 2η 02 Φεβρουάριος Φεβ'],
            ['YYYY YY',                            '2010 10'],
            ['D Do DD',                            '14 14η 14'],
            ['d do dddd ddd dd',                   '0 0η Κυριακή Κυρ Κυ'],
            ['DDD DDDo DDDD',                      '45 45η 045'],
            ['w wo ww',                            '6 6η 06'],
            ['h hh',                               '3 03'],
            ['H HH',                               '15 15'],
            ['m mm',                               '25 25'],
            ['s ss',                               '50 50'],
            ['a A',                                'μμ ΜΜ'],
            ['[the] DDDo [day of the year]',       'the 45η day of the year'],
            ['LTS',                                '3:25:50 ΜΜ'],
            ['L',                                  '14/02/2010'],
            ['LL',                                 '14 Φεβρουαρίου 2010'],
            ['LLL',                                '14 Φεβρουαρίου 2010 3:25 ΜΜ'],
            ['LLLL',                               'Κυριακή, 14 Φεβρουαρίου 2010 3:25 ΜΜ'],
            ['l',                                  '14/2/2010'],
            ['ll',                                 '14 Φεβ 2010'],
            ['lll',                                '14 Φεβ 2010 3:25 ΜΜ'],
            ['llll',                               'Κυρ, 14 Φεβ 2010 3:25 ΜΜ']
        ],
        b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
        i;

    for (i = 0; i < a.length; i++) {
        assert.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
    }
});

test('format ordinal', function (assert) {
    assert.equal(moment([2011, 0, 1]).format('DDDo'), '1η', '1η');
    assert.equal(moment([2011, 0, 2]).format('DDDo'), '2η', '2η');
    assert.equal(moment([2011, 0, 3]).format('DDDo'), '3η', '3η');
    assert.equal(moment([2011, 0, 4]).format('DDDo'), '4η', '4η');
    assert.equal(moment([2011, 0, 5]).format('DDDo'), '5η', '5η');
    assert.equal(moment([2011, 0, 6]).format('DDDo'), '6η', '6η');
    assert.equal(moment([2011, 0, 7]).format('DDDo'), '7η', '7η');
    assert.equal(moment([2011, 0, 8]).format('DDDo'), '8η', '8η');
    assert.equal(moment([2011, 0, 9]).format('DDDo'), '9η', '9η');
    assert.equal(moment([2011, 0, 10]).format('DDDo'), '10η', '10η');

    assert.equal(moment([2011, 0, 11]).format('DDDo'), '11η', '11η');
    assert.equal(moment([2011, 0, 12]).format('DDDo'), '12η', '12η');
    assert.equal(moment([2011, 0, 13]).format('DDDo'), '13η', '13η');
    assert.equal(moment([2011, 0, 14]).format('DDDo'), '14η', '14η');
    assert.equal(moment([2011, 0, 15]).format('DDDo'), '15η', '15η');
    assert.equal(moment([2011, 0, 16]).format('DDDo'), '16η', '16η');
    assert.equal(moment([2011, 0, 17]).format('DDDo'), '17η', '17η');
    assert.equal(moment([2011, 0, 18]).format('DDDo'), '18η', '18η');
    assert.equal(moment([2011, 0, 19]).format('DDDo'), '19η', '19η');
    assert.equal(moment([2011, 0, 20]).format('DDDo'), '20η', '20η');

    assert.equal(moment([2011, 0, 21]).format('DDDo'), '21η', '21η');
    assert.equal(moment([2011, 0, 22]).format('DDDo'), '22η', '22η');
    assert.equal(moment([2011, 0, 23]).format('DDDo'), '23η', '23η');
    assert.equal(moment([2011, 0, 24]).format('DDDo'), '24η', '24η');
    assert.equal(moment([2011, 0, 25]).format('DDDo'), '25η', '25η');
    assert.equal(moment([2011, 0, 26]).format('DDDo'), '26η', '26η');
    assert.equal(moment([2011, 0, 27]).format('DDDo'), '27η', '27η');
    assert.equal(moment([2011, 0, 28]).format('DDDo'), '28η', '28η');
    assert.equal(moment([2011, 0, 29]).format('DDDo'), '29η', '29η');
    assert.equal(moment([2011, 0, 30]).format('DDDo'), '30η', '30η');

    assert.equal(moment([2011, 0, 31]).format('DDDo'), '31η', '31η');
});

test('format month', function (assert) {
    var i,
        expected = 'Ιανουάριος Ιαν_Φεβρουάριος Φεβ_Μάρτιος Μαρ_Απρίλιος Απρ_Μάιος Μαϊ_Ιούνιος Ιουν_Ιούλιος Ιουλ_Αύγουστος Αυγ_Σεπτέμβριος Σεπ_Οκτώβριος Οκτ_Νοέμβριος Νοε_Δεκέμβριος Δεκ'.split('_');

    for (i = 0; i < expected.length; i++) {
        assert.equal(moment([2011, i, 1]).format('MMMM MMM'), expected[i], expected[i]);
    }
});

test('format week', function (assert) {
    var i,
        expected = 'Κυριακή Κυρ Κυ_Δευτέρα Δευ Δε_Τρίτη Τρι Τρ_Τετάρτη Τετ Τε_Πέμπτη Πεμ Πε_Παρασκευή Παρ Πα_Σάββατο Σαβ Σα'.split('_');

    for (i = 0; i < expected.length; i++) {
        assert.equal(moment([2011, 0, 2 + i]).format('dddd ddd dd'), expected[i], expected[i]);
    }
});

test('from', function (assert) {
    var start = moment([2007, 1, 28]);

    assert.equal(start.from(moment([2007, 1, 28]).add({s: 44}), true),  'λίγα δευτερόλεπτα',   '44 seconds = a few seconds');
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 45}), true),  'ένα λεπτό',           '45 seconds = a minute');
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 89}), true),  'ένα λεπτό',           '89 seconds = a minute');
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 90}), true),  '2 λεπτά',             '90 seconds = 2 minutes');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 44}), true),  '44 λεπτά',            '44 minutes = 44 minutes');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 45}), true),  'μία ώρα',             '45 minutes = an hour');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 89}), true),  'μία ώρα',             '89 minutes = an hour');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 90}), true),  '2 ώρες',              '90 minutes = 2 hours');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 5}), true),   '5 ώρες',              '5 hours = 5 hours');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 21}), true),  '21 ώρες',             '21 hours = 21 hours');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 22}), true),  'μία μέρα',            '22 hours = a day');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 35}), true),  'μία μέρα',            '35 hours = a day');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 36}), true),  '2 μέρες',             '36 hours = 2 days');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 1}), true),   'μία μέρα',            '1 day = a day');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 5}), true),   '5 μέρες',             '5 days = 5 days');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 25}), true),  '25 μέρες',            '25 days = 25 days');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 26}), true),  'ένας μήνας',          '26 days = a month');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 30}), true),  'ένας μήνας',          '30 days = a month');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 43}), true),  'ένας μήνας',          '43 days = a month');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 46}), true),  '2 μήνες',             '46 days = 2 months');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 74}), true),  '2 μήνες',             '75 days = 2 months');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 76}), true),  '3 μήνες',             '76 days = 3 months');
    assert.equal(start.from(moment([2007, 1, 28]).add({M: 1}), true),   'ένας μήνας',          '1 month = a month');
    assert.equal(start.from(moment([2007, 1, 28]).add({M: 5}), true),   '5 μήνες',             '5 months = 5 months');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 345}), true), 'ένας χρόνος',         '345 days = a year');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 548}), true), '2 χρόνια',            '548 days = 2 years');
    assert.equal(start.from(moment([2007, 1, 28]).add({y: 1}), true),   'ένας χρόνος',         '1 year = a year');
    assert.equal(start.from(moment([2007, 1, 28]).add({y: 5}), true),   '5 χρόνια',            '5 years = 5 years');
});

test('suffix', function (assert) {
    assert.equal(moment(30000).from(0), 'σε λίγα δευτερόλεπτα',  'prefix');
    assert.equal(moment(0).from(30000), 'λίγα δευτερόλεπτα πριν', 'suffix');
});

test('now from now', function (assert) {
    assert.equal(moment().fromNow(), 'λίγα δευτερόλεπτα πριν',  'now from now should display as in the past');
});

test('fromNow', function (assert) {
    assert.equal(moment().add({s: 30}).fromNow(), 'σε λίγα δευτερόλεπτα', 'in a few seconds');
    assert.equal(moment().add({d: 5}).fromNow(), 'σε 5 μέρες', 'in 5 days');
});

test('calendar day', function (assert) {
    var a = moment().hours(12).minutes(0).seconds(0);

    assert.equal(moment(a).calendar(),                   'Σήμερα στις 12:00 ΜΜ',     'today at the same time');
    assert.equal(moment(a).add({m: 25}).calendar(),      'Σήμερα στις 12:25 ΜΜ',     'Now plus 25 min');
    assert.equal(moment(a).add({h: 1}).calendar(),       'Σήμερα στη 1:00 ΜΜ',      'Now plus 1 hour');
    assert.equal(moment(a).add({d: 1}).calendar(),       'Αύριο στις 12:00 ΜΜ',      'tomorrow at the same time');
    assert.equal(moment(a).subtract({h: 1}).calendar(),  'Σήμερα στις 11:00 ΠΜ',      'Now minus 1 hour');
    assert.equal(moment(a).subtract({d: 1}).calendar(),  'Χθες στις 12:00 ΜΜ',       'yesterday at the same time');
});

test('calendar next week', function (assert) {
    var i, m;
    for (i = 2; i < 7; i++) {
        m = moment().add({d: i});
        assert.equal(m.calendar(),       m.format('dddd [' + (m.hours() % 12 === 1 ? 'στη' : 'στις') + '] LT'),  'Today + ' + i + ' days current time');
        m.hours(0).minutes(0).seconds(0).milliseconds(0);
        assert.equal(m.calendar(),       m.format('dddd [στις] LT'),  'Today + ' + i + ' days beginning of day');
        m.hours(23).minutes(59).seconds(59).milliseconds(999);
        assert.equal(m.calendar(),       m.format('dddd [στις] LT'),  'Today + ' + i + ' days end of day');
    }
});

test('calendar last week', function (assert) {
    var i, m, dayString;
    for (i = 2; i < 7; i++) {
        m = moment().subtract({d: i});
        dayString = m.day() === 6 ? '[το προηγούμενο Σάββατο]' : '[την προηγούμενη] dddd';
        assert.equal(m.calendar(),       m.format(dayString + ' [' + (m.hours() % 12 === 1 ? 'στη' : 'στις') + '] LT'),  'Today - ' + i + ' days current time');
        m.hours(1).minutes(30).seconds(0).milliseconds(0);
        assert.equal(m.calendar(),       m.format(dayString + ' [στη] LT'),  'Today - ' + i + ' days one o clock');
        m.hours(0).minutes(0).seconds(0).milliseconds(0);
        assert.equal(m.calendar(),       m.format(dayString + ' [στις] LT'),  'Today - ' + i + ' days beginning of day');
        m.hours(23).minutes(59).seconds(59).milliseconds(999);
        assert.equal(m.calendar(),       m.format(dayString + ' [στις] LT'),  'Today - ' + i + ' days end of day');
    }
});

test('calendar all else', function (assert) {
    var weeksAgo = moment().subtract({w: 1}),
        weeksFromNow = moment().add({w: 1});

    assert.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  '1 week ago');
    assert.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  'in 1 week');

    weeksAgo = moment().subtract({w: 2});
    weeksFromNow = moment().add({w: 2});

    assert.equal(weeksAgo.calendar(),       weeksAgo.format('L'),  '2 weeks ago');
    assert.equal(weeksFromNow.calendar(),   weeksFromNow.format('L'),  'in 2 weeks');
});

test('weeks year starting sunday format', function (assert) {
    assert.equal(moment([2012, 0,  1]).format('w ww wo'), '52 52 52η', 'Jan  1 2012 should be week 52');
    assert.equal(moment([2012, 0,  7]).format('w ww wo'),   '1 01 1η', 'Jan  7 2012 should be week 1');
    assert.equal(moment([2012, 0,  8]).format('w ww wo'),   '1 01 1η', 'Jan  8 2012 should be week 1');
    assert.equal(moment([2012, 0, 14]).format('w ww wo'),   '2 02 2η', 'Jan 14 2012 should be week 2');
    assert.equal(moment([2012, 0, 15]).format('w ww wo'),   '2 02 2η', 'Jan 15 2012 should be week 2');
});

test('localeData months calls', function (assert) {
    var jan = moment('2012-01-01');
    assert.equal(moment.localeData().months(jan),           'Ιανουάριος', 'should return the nominative month name');
    assert.equal(moment.localeData().months(jan, 'D MMMM'), 'Ιανουαρίου', 'should return the genitive month name');
});

})));
