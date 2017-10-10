
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

localeModule('ko');

test('parse', function (assert) {
    var tests = '1월 1월_2월 2월_3월 3월_4월 4월_5월 5월_6월 6월_7월 7월_8월 8월_9월 9월_10월 10월_11월 11월_12월 12월'.split('_'), i;
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
    var elements = [{
        expression : '1981년 9월 8일 오후 2시 30분',
        inputFormat : 'YYYY[년] M[월] D[일] A h[시] m[분]',
        outputFormat : 'A',
        expected : '오후'
    }, {
        expression : '1981년 9월 8일 오전 2시 30분',
        inputFormat : 'YYYY[년] M[월] D[일] A h[시] m[분]',
        outputFormat : 'A h시',
        expected : '오전 2시'
    }, {
        expression : '14시 30분',
        inputFormat : 'H[시] m[분]',
        outputFormat : 'A',
        expected : '오후'
    }, {
        expression : '오후 4시',
        inputFormat : 'A h[시]',
        outputFormat : 'H',
        expected : '16'
    }], i, l, it, actual;

    for (i = 0, l = elements.length; i < l; ++i) {
        it = elements[i];
        actual = moment(it.expression, it.inputFormat).format(it.outputFormat);

        assert.equal(
            actual,
            it.expected,
            '\'' + it.outputFormat + '\' of \'' + it.expression + '\' must be \'' + it.expected + '\' but was \'' + actual + '\'.'
        );
    }
});

test('format', function (assert) {
    var a = [
            ['YYYY년 MMMM Do dddd a h:mm:ss',      '2010년 2월 14일 일요일 오후 3:25:50'],
            ['ddd A h',                            '일 오후 3'],
            ['M Mo MM MMMM MMM',                   '2 2월 02 2월 2월'],
            ['YYYY YY',                            '2010 10'],
            ['D Do DD',                            '14 14일 14'],
            ['d do dddd ddd dd',                   '0 0일 일요일 일 일'],
            ['DDD DDDo DDDD',                      '45 45일 045'],
            ['w wo ww',                            '8 8주 08'],
            ['h hh',                               '3 03'],
            ['H HH',                               '15 15'],
            ['m mm',                               '25 25'],
            ['s ss',                               '50 50'],
            ['a A',                                '오후 오후'],
            ['일년 중 DDDo째 되는 날',                 '일년 중 45일째 되는 날'],
            ['LTS',                                '오후 3:25:50'],
            ['L',                                  '2010.02.14'],
            ['LL',                                 '2010년 2월 14일'],
            ['LLL',                                '2010년 2월 14일 오후 3:25'],
            ['LLLL',                               '2010년 2월 14일 일요일 오후 3:25'],
            ['l',                                  '2010.02.14'],
            ['ll',                                 '2010년 2월 14일'],
            ['lll',                                '2010년 2월 14일 오후 3:25'],
            ['llll',                               '2010년 2월 14일 일요일 오후 3:25']
        ],
        b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
        i;
    for (i = 0; i < a.length; i++) {
        assert.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
    }
});

test('format ordinal', function (assert) {
    assert.equal(moment([2011, 0, 1]).format('DDDo'), '1일', '1일');
    assert.equal(moment([2011, 0, 2]).format('DDDo'), '2일', '2일');
    assert.equal(moment([2011, 0, 3]).format('DDDo'), '3일', '3일');
    assert.equal(moment([2011, 0, 4]).format('DDDo'), '4일', '4일');
    assert.equal(moment([2011, 0, 5]).format('DDDo'), '5일', '5일');
    assert.equal(moment([2011, 0, 6]).format('DDDo'), '6일', '6일');
    assert.equal(moment([2011, 0, 7]).format('DDDo'), '7일', '7일');
    assert.equal(moment([2011, 0, 8]).format('DDDo'), '8일', '8일');
    assert.equal(moment([2011, 0, 9]).format('DDDo'), '9일', '9일');
    assert.equal(moment([2011, 0, 10]).format('DDDo'), '10일', '10일');

    assert.equal(moment([2011, 0, 11]).format('DDDo'), '11일', '11일');
    assert.equal(moment([2011, 0, 12]).format('DDDo'), '12일', '12일');
    assert.equal(moment([2011, 0, 13]).format('DDDo'), '13일', '13일');
    assert.equal(moment([2011, 0, 14]).format('DDDo'), '14일', '14일');
    assert.equal(moment([2011, 0, 15]).format('DDDo'), '15일', '15일');
    assert.equal(moment([2011, 0, 16]).format('DDDo'), '16일', '16일');
    assert.equal(moment([2011, 0, 17]).format('DDDo'), '17일', '17일');
    assert.equal(moment([2011, 0, 18]).format('DDDo'), '18일', '18일');
    assert.equal(moment([2011, 0, 19]).format('DDDo'), '19일', '19일');
    assert.equal(moment([2011, 0, 20]).format('DDDo'), '20일', '20일');

    assert.equal(moment([2011, 0, 21]).format('DDDo'), '21일', '21일');
    assert.equal(moment([2011, 0, 22]).format('DDDo'), '22일', '22일');
    assert.equal(moment([2011, 0, 23]).format('DDDo'), '23일', '23일');
    assert.equal(moment([2011, 0, 24]).format('DDDo'), '24일', '24일');
    assert.equal(moment([2011, 0, 25]).format('DDDo'), '25일', '25일');
    assert.equal(moment([2011, 0, 26]).format('DDDo'), '26일', '26일');
    assert.equal(moment([2011, 0, 27]).format('DDDo'), '27일', '27일');
    assert.equal(moment([2011, 0, 28]).format('DDDo'), '28일', '28일');
    assert.equal(moment([2011, 0, 29]).format('DDDo'), '29일', '29일');
    assert.equal(moment([2011, 0, 30]).format('DDDo'), '30일', '30일');

    assert.equal(moment([2011, 0, 31]).format('DDDo'), '31일', '31일');
});

test('format month', function (assert) {
    var expected = '1월 1월_2월 2월_3월 3월_4월 4월_5월 5월_6월 6월_7월 7월_8월 8월_9월 9월_10월 10월_11월 11월_12월 12월'.split('_'), i;
    for (i = 0; i < expected.length; i++) {
        assert.equal(moment([2011, i, 1]).format('MMMM MMM'), expected[i], expected[i]);
    }
});

test('format week', function (assert) {
    var expected = '일요일 일 일_월요일 월 월_화요일 화 화_수요일 수 수_목요일 목 목_금요일 금 금_토요일 토 토'.split('_'), i;
    for (i = 0; i < expected.length; i++) {
        assert.equal(moment([2011, 0, 2 + i]).format('dddd ddd dd'), expected[i], expected[i]);
    }
});

test('from', function (assert) {
    var start = moment([2007, 1, 28]);
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 44}), true),  '몇 초', '44초 = 몇 초');
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 45}), true),  '1분',      '45초 = 1분');
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 89}), true),  '1분',      '89초 = 1분');
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 90}), true),  '2분',     '90초 = 2분');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 44}), true),  '44분',    '44분 = 44분');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 45}), true),  '한 시간',       '45분 = 한 시간');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 89}), true),  '한 시간',       '89분 = 한 시간');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 90}), true),  '2시간',       '90분 = 2시간');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 5}), true),   '5시간',       '5시간 = 5시간');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 21}), true),  '21시간',      '21시간 = 21시간');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 22}), true),  '하루',         '22시간 = 하루');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 35}), true),  '하루',         '35시간 = 하루');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 36}), true),  '2일',        '36시간 = 2일');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 1}), true),   '하루',         '하루 = 하루');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 5}), true),   '5일',        '5일 = 5일');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 25}), true),  '25일',       '25일 = 25일');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 26}), true),  '한 달',       '26일 = 한 달');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 30}), true),  '한 달',       '30일 = 한 달');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 43}), true),  '한 달',       '45일 = 한 달');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 46}), true),  '2달',      '46일 = 2달');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 74}), true),  '2달',      '75일 = 2달');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 76}), true),  '3달',      '76일 = 3달');
    assert.equal(start.from(moment([2007, 1, 28]).add({M: 1}), true),   '한 달',       '1달 = 한 달');
    assert.equal(start.from(moment([2007, 1, 28]).add({M: 5}), true),   '5달',      '5달 = 5달');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 345}), true), '일 년',        '345일 = 일 년');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 548}), true), '2년',       '548일 = 2년');
    assert.equal(start.from(moment([2007, 1, 28]).add({y: 1}), true),   '일 년',        '일 년 = 일 년');
    assert.equal(start.from(moment([2007, 1, 28]).add({y: 5}), true),   '5년',       '5년 = 5년');
});

test('suffix', function (assert) {
    assert.equal(moment(30000).from(0), '몇 초 후',  'prefix');
    assert.equal(moment(0).from(30000), '몇 초 전', 'suffix');
});

test('now from now', function (assert) {
    assert.equal(moment().fromNow(), '몇 초 전',  'now from now should display as in the past');
});

test('fromNow', function (assert) {
    assert.equal(moment().add({s: 30}).fromNow(), '몇 초 후', 'in a few seconds');
    assert.equal(moment().add({d: 5}).fromNow(), '5일 후', 'in 5 days');
});

test('calendar day', function (assert) {
    var a = moment().hours(12).minutes(0).seconds(0);

    assert.equal(moment(a).calendar(),                   '오늘 오후 12:00', 'today at the same time');
    assert.equal(moment(a).add({m: 25}).calendar(),      '오늘 오후 12:25', 'Now plus 25 min');
    assert.equal(moment(a).add({h: 1}).calendar(),       '오늘 오후 1:00',  'Now plus 1 hour');
    assert.equal(moment(a).add({d: 1}).calendar(),       '내일 오후 12:00', 'tomorrow at the same time');
    assert.equal(moment(a).subtract({h: 1}).calendar(),  '오늘 오전 11:00', 'Now minus 1 hour');
    assert.equal(moment(a).subtract({d: 1}).calendar(),  '어제 오후 12:00', 'yesterday at the same time');
});

test('calendar next week', function (assert) {
    var i, m;
    for (i = 2; i < 7; i++) {
        m = moment().add({d: i});
        assert.equal(m.calendar(),       m.format('dddd LT'),  'Today + ' + i + ' days current time');
        m.hours(0).minutes(0).seconds(0).milliseconds(0);
        assert.equal(m.calendar(),       m.format('dddd LT'),  'Today + ' + i + ' days beginning of day');
        m.hours(23).minutes(59).seconds(59).milliseconds(999);
        assert.equal(m.calendar(),       m.format('dddd LT'),  'Today + ' + i + ' days end of day');
    }
});

test('calendar last week', function (assert) {
    var i, m;
    for (i = 2; i < 7; i++) {
        m = moment().subtract({d: i});
        assert.equal(m.calendar(),       m.format('지난주 dddd LT'),  'Today - ' + i + ' days current time');
        m.hours(0).minutes(0).seconds(0).milliseconds(0);
        assert.equal(m.calendar(),       m.format('지난주 dddd LT'),  'Today - ' + i + ' days beginning of day');
        m.hours(23).minutes(59).seconds(59).milliseconds(999);
        assert.equal(m.calendar(),       m.format('지난주 dddd LT'),  'Today - ' + i + ' days end of day');
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
    assert.equal(moment([2012, 0,  1]).format('w ww wo'), '1 01 1주', 'Jan  1 2012 should be week 1');
    assert.equal(moment([2012, 0,  7]).format('w ww wo'), '1 01 1주', 'Jan  7 2012 should be week 1');
    assert.equal(moment([2012, 0,  8]).format('w ww wo'), '2 02 2주', 'Jan  8 2012 should be week 2');
    assert.equal(moment([2012, 0, 14]).format('w ww wo'), '2 02 2주', 'Jan 14 2012 should be week 2');
    assert.equal(moment([2012, 0, 15]).format('w ww wo'), '3 03 3주', 'Jan 15 2012 should be week 3');
});

})));
