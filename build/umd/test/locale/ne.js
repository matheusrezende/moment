
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

localeModule('ne');

test('parse', function (assert) {
    var tests = 'जनवरी जन._फेब्रुवरी फेब्रु._मार्च मार्च_अप्रिल अप्रि._मई मई_जुन जुन_जुलाई जुलाई._अगष्ट अग._सेप्टेम्बर सेप्ट._अक्टोबर अक्टो._नोभेम्बर नोभे._डिसेम्बर डिसे.'.split('_'), i;
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

test('format', function (assert) {
    var a = [
            ['dddd, Do MMMM YYYY, aको h:mm:ss बजे',      'आइतबार, १४ फेब्रुवरी २०१०, दिउँसोको ३:२५:५० बजे'],
            ['ddd, aको h बजे',                                                'आइत., दिउँसोको ३ बजे'],
            ['M Mo MM MMMM MMM',                   '२ २ ०२ फेब्रुवरी फेब्रु.'],
            ['YYYY YY',                            '२०१० १०'],
            ['D Do DD',                            '१४ १४ १४'],
            ['d do dddd ddd dd',                   '० ० आइतबार आइत. आ.'],
            ['DDD DDDo DDDD',                      '४५ ४५ ०४५'],
            ['w wo ww',                            '८ ८ ०८'],
            ['h hh',                               '३ ०३'],
            ['H HH',                               '१५ १५'],
            ['m mm',                               '२५ २५'],
            ['s ss',                               '५० ५०'],
            ['a A',                                'दिउँसो दिउँसो'],
            ['LTS',                                'दिउँसोको ३:२५:५० बजे'],
            ['L',                                  '१४/०२/२०१०'],
            ['LL',                                 '१४ फेब्रुवरी २०१०'],
            ['LLL',                                '१४ फेब्रुवरी २०१०, दिउँसोको ३:२५ बजे'],
            ['LLLL',                               'आइतबार, १४ फेब्रुवरी २०१०, दिउँसोको ३:२५ बजे'],
            ['l',                                  '१४/२/२०१०'],
            ['ll',                                 '१४ फेब्रु. २०१०'],
            ['lll',                                '१४ फेब्रु. २०१०, दिउँसोको ३:२५ बजे'],
            ['llll',                               'आइत., १४ फेब्रु. २०१०, दिउँसोको ३:२५ बजे']
        ],
        b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
        i;
    for (i = 0; i < a.length; i++) {
        assert.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
    }
});

test('format ordinal', function (assert) {
    assert.equal(moment([2011, 0, 1]).format('DDDo'), '१', '१');
    assert.equal(moment([2011, 0, 2]).format('DDDo'), '२', '२');
    assert.equal(moment([2011, 0, 3]).format('DDDo'), '३', '३');
    assert.equal(moment([2011, 0, 4]).format('DDDo'), '४', '४');
    assert.equal(moment([2011, 0, 5]).format('DDDo'), '५', '५');
    assert.equal(moment([2011, 0, 6]).format('DDDo'), '६', '६');
    assert.equal(moment([2011, 0, 7]).format('DDDo'), '७', '७');
    assert.equal(moment([2011, 0, 8]).format('DDDo'), '८', '८');
    assert.equal(moment([2011, 0, 9]).format('DDDo'), '९', '९');
    assert.equal(moment([2011, 0, 10]).format('DDDo'), '१०', '१०');

    assert.equal(moment([2011, 0, 11]).format('DDDo'), '११', '११');
    assert.equal(moment([2011, 0, 12]).format('DDDo'), '१२', '१२');
    assert.equal(moment([2011, 0, 13]).format('DDDo'), '१३', '१३');
    assert.equal(moment([2011, 0, 14]).format('DDDo'), '१४', '१४');
    assert.equal(moment([2011, 0, 15]).format('DDDo'), '१५', '१५');
    assert.equal(moment([2011, 0, 16]).format('DDDo'), '१६', '१६');
    assert.equal(moment([2011, 0, 17]).format('DDDo'), '१७', '१७');
    assert.equal(moment([2011, 0, 18]).format('DDDo'), '१८', '१८');
    assert.equal(moment([2011, 0, 19]).format('DDDo'), '१९', '१९');
    assert.equal(moment([2011, 0, 20]).format('DDDo'), '२०', '२०');

    assert.equal(moment([2011, 0, 21]).format('DDDo'), '२१', '२१');
    assert.equal(moment([2011, 0, 22]).format('DDDo'), '२२', '२२');
    assert.equal(moment([2011, 0, 23]).format('DDDo'), '२३', '२३');
    assert.equal(moment([2011, 0, 24]).format('DDDo'), '२४', '२४');
    assert.equal(moment([2011, 0, 25]).format('DDDo'), '२५', '२५');
    assert.equal(moment([2011, 0, 26]).format('DDDo'), '२६', '२६');
    assert.equal(moment([2011, 0, 27]).format('DDDo'), '२७', '२७');
    assert.equal(moment([2011, 0, 28]).format('DDDo'), '२८', '२८');
    assert.equal(moment([2011, 0, 29]).format('DDDo'), '२९', '२९');
    assert.equal(moment([2011, 0, 30]).format('DDDo'), '३०', '३०');

    assert.equal(moment([2011, 0, 31]).format('DDDo'), '३१', '३१');
});

test('format month', function (assert) {
    var expected = 'जनवरी जन._फेब्रुवरी फेब्रु._मार्च मार्च_अप्रिल अप्रि._मई मई_जुन जुन_जुलाई जुलाई._अगष्ट अग._सेप्टेम्बर सेप्ट._अक्टोबर अक्टो._नोभेम्बर नोभे._डिसेम्बर डिसे.'.split('_'), i;
    for (i = 0; i < expected.length; i++) {
        assert.equal(moment([2011, i, 1]).format('MMMM MMM'), expected[i], expected[i]);
    }
});

test('format week', function (assert) {
    var expected = 'आइतबार आइत. आ._सोमबार सोम. सो._मङ्गलबार मङ्गल. मं._बुधबार बुध. बु._बिहिबार बिहि. बि._शुक्रबार शुक्र. शु._शनिबार शनि. श.'.split('_'), i;
    for (i = 0; i < expected.length; i++) {
        assert.equal(moment([2011, 0, 2 + i]).format('dddd ddd dd'), expected[i], expected[i]);
    }
});

test('from', function (assert) {
    var start = moment([2007, 1, 28]);
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 44}), true),  'केही क्षण', '44 seconds = a few seconds');
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 45}), true),  'एक मिनेट',      '45 seconds = a minute');
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 89}), true),  'एक मिनेट',      '89 seconds = a minute');
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 90}), true),  '२ मिनेट',     '90 seconds = 2 minutes');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 44}), true),  '४४ मिनेट',    '44 minutes = 44 minutes');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 45}), true),  'एक घण्टा',       '45 minutes = an hour');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 89}), true),  'एक घण्टा',       '89 minutes = an hour');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 90}), true),  '२ घण्टा',       '90 minutes = 2 hours');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 5}), true),   '५ घण्टा',       '5 hours = 5 hours');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 21}), true),  '२१ घण्टा',      '21 hours = 21 hours');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 22}), true),  'एक दिन',         '22 hours = a day');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 35}), true),  'एक दिन',         '35 hours = a day');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 36}), true),  '२ दिन',        '36 hours = 2 days');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 1}), true),   'एक दिन',         '1 day = a day');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 5}), true),   '५ दिन',        '5 days = 5 days');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 25}), true),  '२५ दिन',       '25 days = 25 days');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 26}), true),  'एक महिना',       '26 days = a month');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 30}), true),  'एक महिना',       '30 days = a month');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 43}), true),  'एक महिना',       '43 days = a month');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 46}), true),  '२ महिना',      '46 days = 2 months');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 74}), true),  '२ महिना',      '75 days = 2 months');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 76}), true),  '३ महिना',      '76 days = 3 months');
    assert.equal(start.from(moment([2007, 1, 28]).add({M: 1}), true),   'एक महिना',       '1 month = a month');
    assert.equal(start.from(moment([2007, 1, 28]).add({M: 5}), true),   '५ महिना',      '5 months = 5 months');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 345}), true), 'एक बर्ष',        '345 days = a year');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 548}), true), '२ बर्ष',       '548 days = 2 years');
    assert.equal(start.from(moment([2007, 1, 28]).add({y: 1}), true),   'एक बर्ष',        '1 year = a year');
    assert.equal(start.from(moment([2007, 1, 28]).add({y: 5}), true),   '५ बर्ष',       '5 years = 5 years');
});

test('suffix', function (assert) {
    assert.equal(moment(30000).from(0), 'केही क्षणमा',  'prefix');
    assert.equal(moment(0).from(30000), 'केही क्षण अगाडि', 'suffix');
});

test('now from now', function (assert) {
    assert.equal(moment().fromNow(), 'केही क्षण अगाडि',  'now from now should display as in the past');
});

test('fromNow', function (assert) {
    assert.equal(moment().add({s: 30}).fromNow(), 'केही क्षणमा', 'केही क्षणमा');
    assert.equal(moment().add({d: 5}).fromNow(), '५ दिनमा', '५ दिनमा');
});

test('calendar day', function (assert) {
    var a = moment().hours(12).minutes(0).seconds(0);

    assert.equal(moment(a).calendar(),                   'आज दिउँसोको १२:०० बजे',    'today at the same time');
    assert.equal(moment(a).add({m: 25}).calendar(),      'आज दिउँसोको १२:२५ बजे',    'Now plus 25 min');
    assert.equal(moment(a).add({h: 1}).calendar(),       'आज दिउँसोको १:०० बजे',     'Now plus 1 hour');
    assert.equal(moment(a).add({d: 1}).calendar(),       'भोलि दिउँसोको १२:०० बजे',  'tomorrow at the same time');
    assert.equal(moment(a).subtract({h: 1}).calendar(),  'आज बिहानको ११:०० बजे',     'Now minus 1 hour');
    assert.equal(moment(a).subtract({d: 1}).calendar(),  'हिजो दिउँसोको १२:०० बजे',  'yesterday at the same time');
});

test('calendar next week', function (assert) {
    var i, m;
    for (i = 2; i < 7; i++) {
        m = moment().add({d: i});
        assert.equal(m.calendar(),       m.format('[आउँदो] dddd[,] LT'),  'Today + ' + i + ' days current time');
        m.hours(0).minutes(0).seconds(0).milliseconds(0);
        assert.equal(m.calendar(),       m.format('[आउँदो] dddd[,] LT'),  'Today + ' + i + ' days beginning of day');
        m.hours(23).minutes(59).seconds(59).milliseconds(999);
        assert.equal(m.calendar(),       m.format('[आउँदो] dddd[,] LT'),  'Today + ' + i + ' days end of day');
    }
});

test('calendar last week', function (assert) {
    var i, m;
    for (i = 2; i < 7; i++) {
        m = moment().subtract({d: i});
        assert.equal(m.calendar(),       m.format('[गएको] dddd[,] LT'),  'Today - ' + i + ' days current time');
        m.hours(0).minutes(0).seconds(0).milliseconds(0);
        assert.equal(m.calendar(),       m.format('[गएको] dddd[,] LT'),  'Today - ' + i + ' days beginning of day');
        m.hours(23).minutes(59).seconds(59).milliseconds(999);
        assert.equal(m.calendar(),       m.format('[गएको] dddd[,] LT'),  'Today - ' + i + ' days end of day');
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

test('meridiem', function (assert) {
    assert.equal(moment([2011, 2, 23,  2, 30]).format('a'), 'राति', 'before dawn');
    assert.equal(moment([2011, 2, 23,  9, 30]).format('a'), 'बिहान', 'morning');
    assert.equal(moment([2011, 2, 23, 14, 30]).format('a'), 'दिउँसो', 'during day');
    assert.equal(moment([2011, 2, 23, 17, 30]).format('a'), 'साँझ', 'evening');
    assert.equal(moment([2011, 2, 23, 19, 30]).format('a'), 'साँझ', 'late evening');
    assert.equal(moment([2011, 2, 23, 21, 20]).format('a'), 'राति', 'night');

    assert.equal(moment([2011, 2, 23,  2, 30]).format('A'), 'राति', 'before dawn');
    assert.equal(moment([2011, 2, 23,  9, 30]).format('A'), 'बिहान', 'morning');
    assert.equal(moment([2011, 2, 23, 14, 30]).format('A'), 'दिउँसो', 'during day');
    assert.equal(moment([2011, 2, 23, 17, 30]).format('A'), 'साँझ', 'evening');
    assert.equal(moment([2011, 2, 23, 19, 30]).format('A'), 'साँझ', 'late evening');
    assert.equal(moment([2011, 2, 23, 21, 20]).format('A'), 'राति', 'night');
});

test('weeks year starting sunday formatted', function (assert) {
    assert.equal(moment([2011, 11, 26]).format('w ww wo'), '५३ ५३ ५३', 'Dec 26 2011 should be week 53');
    assert.equal(moment([2012,  0,  1]).format('w ww wo'), '१ ०१ १', 'Jan  1 2012 should be week 1');
    assert.equal(moment([2012,  0,  2]).format('w ww wo'), '१ ०१ १', 'Jan  2 2012 should be week 1');
    assert.equal(moment([2012,  0,  8]).format('w ww wo'), '२ ०२ २', 'Jan  8 2012 should be week 2');
    assert.equal(moment([2012,  0,  9]).format('w ww wo'), '२ ०२ २', 'Jan  9 2012 should be week 2');
});

})));
