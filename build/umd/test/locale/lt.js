
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

localeModule('lt');

test('parse', function (assert) {
    var tests = 'sausis sau_vasaris vas_kovas kov_balandis bal_gegužė geg_birželis bir_liepa lie_rugpjūtis rgp_rugsėjis rgs_spalis spa_lapkritis lap_gruodis grd'.split('_'), i;
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
            ['dddd, Do MMMM YYYY, h:mm:ss a',      'sekmadienis, 14-oji vasario 2010, 3:25:50 pm'],
            ['ddd, hA',                            'Sek, 3PM'],
            ['M Mo MM MMMM MMM',                   '2 2-oji 02 vasaris vas'],
            ['YYYY YY',                            '2010 10'],
            ['D Do DD',                            '14 14-oji 14'],
            ['d do dddd ddd dd',                   '0 0-oji sekmadienis Sek S'],
            ['DDD DDDo DDDD',                      '45 45-oji 045'],
            ['w wo ww',                            '6 6-oji 06'],
            ['h hh',                               '3 03'],
            ['H HH',                               '15 15'],
            ['m mm',                               '25 25'],
            ['s ss',                               '50 50'],
            ['a A',                                'pm PM'],
            ['DDDo [metų diena]',                  '45-oji metų diena'],
            ['LTS',                                '15:25:50'],
            ['L',                                  '2010-02-14'],
            ['LL',                                 '2010 m. vasario 14 d.'],
            ['LLL',                                '2010 m. vasario 14 d., 15:25 val.'],
            ['LLLL',                               '2010 m. vasario 14 d., sekmadienis, 15:25 val.'],
            ['l',                                  '2010-02-14'],
            ['ll',                                 '2010 m. vasario 14 d.'],
            ['lll',                                '2010 m. vasario 14 d., 15:25 val.'],
            ['llll',                               '2010 m. vasario 14 d., Sek, 15:25 val.']
        ],
        b = moment(new Date(2010, 1, 14, 15, 25, 50, 125)),
        i;
    for (i = 0; i < a.length; i++) {
        assert.equal(b.format(a[i][0]), a[i][1], a[i][0] + ' ---> ' + a[i][1]);
    }
});

test('format ordinal', function (assert) {
    assert.equal(moment([2011, 0, 1]).format('DDDo'), '1-oji', '1-oji');
    assert.equal(moment([2011, 0, 2]).format('DDDo'), '2-oji', '2-oji');
    assert.equal(moment([2011, 0, 3]).format('DDDo'), '3-oji', '3-oji');
    assert.equal(moment([2011, 0, 4]).format('DDDo'), '4-oji', '4-oji');
    assert.equal(moment([2011, 0, 5]).format('DDDo'), '5-oji', '5-oji');
    assert.equal(moment([2011, 0, 6]).format('DDDo'), '6-oji', '6-oji');
    assert.equal(moment([2011, 0, 7]).format('DDDo'), '7-oji', '7-oji');
    assert.equal(moment([2011, 0, 8]).format('DDDo'), '8-oji', '8-oji');
    assert.equal(moment([2011, 0, 9]).format('DDDo'), '9-oji', '9-oji');
    assert.equal(moment([2011, 0, 10]).format('DDDo'), '10-oji', '10-oji');

    assert.equal(moment([2011, 0, 11]).format('DDDo'), '11-oji', '11-oji');
    assert.equal(moment([2011, 0, 12]).format('DDDo'), '12-oji', '12-oji');
    assert.equal(moment([2011, 0, 13]).format('DDDo'), '13-oji', '13-oji');
    assert.equal(moment([2011, 0, 14]).format('DDDo'), '14-oji', '14-oji');
    assert.equal(moment([2011, 0, 15]).format('DDDo'), '15-oji', '15-oji');
    assert.equal(moment([2011, 0, 16]).format('DDDo'), '16-oji', '16-oji');
    assert.equal(moment([2011, 0, 17]).format('DDDo'), '17-oji', '17-oji');
    assert.equal(moment([2011, 0, 18]).format('DDDo'), '18-oji', '18-oji');
    assert.equal(moment([2011, 0, 19]).format('DDDo'), '19-oji', '19-oji');
    assert.equal(moment([2011, 0, 20]).format('DDDo'), '20-oji', '20-oji');

    assert.equal(moment([2011, 0, 21]).format('DDDo'), '21-oji', '21-oji');
    assert.equal(moment([2011, 0, 22]).format('DDDo'), '22-oji', '22-oji');
    assert.equal(moment([2011, 0, 23]).format('DDDo'), '23-oji', '23-oji');
    assert.equal(moment([2011, 0, 24]).format('DDDo'), '24-oji', '24-oji');
    assert.equal(moment([2011, 0, 25]).format('DDDo'), '25-oji', '25-oji');
    assert.equal(moment([2011, 0, 26]).format('DDDo'), '26-oji', '26-oji');
    assert.equal(moment([2011, 0, 27]).format('DDDo'), '27-oji', '27-oji');
    assert.equal(moment([2011, 0, 28]).format('DDDo'), '28-oji', '28-oji');
    assert.equal(moment([2011, 0, 29]).format('DDDo'), '29-oji', '29-oji');
    assert.equal(moment([2011, 0, 30]).format('DDDo'), '30-oji', '30-oji');

    assert.equal(moment([2011, 0, 31]).format('DDDo'), '31-oji', '31-oji');
});

test('format month', function (assert) {
    var expected = 'sausis sau_vasaris vas_kovas kov_balandis bal_gegužė geg_birželis bir_liepa lie_rugpjūtis rgp_rugsėjis rgs_spalis spa_lapkritis lap_gruodis grd'.split('_'), i;
    for (i = 0; i < expected.length; i++) {
        assert.equal(moment([2011, i, 1]).format('MMMM MMM'), expected[i], expected[i]);
    }
});

test('format week', function (assert) {
    var expected = 'sekmadienis Sek S_pirmadienis Pir P_antradienis Ant A_trečiadienis Tre T_ketvirtadienis Ket K_penktadienis Pen Pn_šeštadienis Šeš Š'.split('_'), i;
    for (i = 0; i < expected.length; i++) {
        assert.equal(moment([2011, 0, 2 + i]).format('dddd ddd dd'), expected[i], expected[i]);
    }
});

test('format week on US calendar', function (assert) {
    // Tests, whether the weekday names are correct, even if the week does not start on Monday
    moment.updateLocale('lt', {week: {dow: 0, doy: 6}});
    var expected = 'sekmadienis Sek S_pirmadienis Pir P_antradienis Ant A_trečiadienis Tre T_ketvirtadienis Ket K_penktadienis Pen Pn_šeštadienis Šeš Š'.split('_'), i;
    for (i = 0; i < expected.length; i++) {
        assert.equal(moment([2011, 0, 2 + i]).format('dddd ddd dd'), expected[i], expected[i]);
    }
    moment.updateLocale('lt', null);
});

test('from', function (assert) {
    var start = moment([2007, 1, 28]);
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 44}), true),  'kelios sekundės', '44 seconds = seconds');
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 45}), true),  'minutė',          '45 seconds = a minute');
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 89}), true),  'minutė',          '89 seconds = a minute');
    assert.equal(start.from(moment([2007, 1, 28]).add({s: 90}), true),  '2 minutės',       '90 seconds = 2 minutes');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 10}), true),  '10 minučių',       '10 minutes = 10 minutes');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 11}), true),  '11 minučių',       '11 minutes = 11 minutes');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 19}), true),  '19 minučių',       '19 minutes = 19 minutes');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 20}), true),  '20 minučių',       '20 minutes = 20 minutes');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 44}), true),  '44 minutės',      '44 minutes = 44 minutes');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 45}), true),  'valanda',         '45 minutes = an hour');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 89}), true),  'valanda',         '89 minutes = an hour');
    assert.equal(start.from(moment([2007, 1, 28]).add({m: 90}), true),  '2 valandos',      '90 minutes = 2 hours');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 5}), true),   '5 valandos',      '5 hours = 5 hours');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 10}), true),  '10 valandų',      '10 hours = 10 hours');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 21}), true),  '21 valandos',     '21 hours = 21 hours');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 22}), true),  'diena',           '22 hours = a day');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 35}), true),  'diena',           '35 hours = a day');
    assert.equal(start.from(moment([2007, 1, 28]).add({h: 36}), true),  '2 dienos',        '36 hours = 2 days');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 1}), true),   'diena',           '1 day = a day');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 5}), true),   '5 dienos',        '5 days = 5 days');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 10}), true),  '10 dienų',        '10 days = 10 days');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 25}), true),  '25 dienos',       '25 days = 25 days');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 26}), true),  'mėnuo',           '26 days = a month');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 30}), true),  'mėnuo',           '30 days = a month');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 43}), true),  'mėnuo',           '43 days = a month');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 46}), true),  '2 mėnesiai',      '46 days = 2 months');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 74}), true),  '2 mėnesiai',      '75 days = 2 months');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 76}), true),  '3 mėnesiai',      '76 days = 3 months');
    assert.equal(start.from(moment([2007, 1, 28]).add({M: 1}), true),   'mėnuo',           '1 month = a month');
    assert.equal(start.from(moment([2007, 1, 28]).add({M: 5}), true),   '5 mėnesiai',      '5 months = 5 months');
    assert.equal(start.from(moment([2007, 1, 28]).add({M: 10}), true),  '10 mėnesių',      '10 months = 10 months');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 345}), true), 'metai',           '345 days = a year');
    assert.equal(start.from(moment([2007, 1, 28]).add({d: 548}), true), '2 metai',         '548 days = 2 years');
    assert.equal(start.from(moment([2007, 1, 28]).add({y: 1}), true),   'metai',           '1 year = a year');
    assert.equal(start.from(moment([2007, 1, 28]).add({y: 5}), true),   '5 metai',         '5 years = 5 years');
});

test('suffix', function (assert) {
    assert.equal(moment(30000).from(0), 'po kelių sekundžių',  'prefix');
    assert.equal(moment(0).from(30000), 'prieš kelias sekundes', 'suffix');
});

test('now from now', function (assert) {
    assert.equal(moment().fromNow(), 'prieš kelias sekundes',  'now from now should display as in the past');
});

test('fromNow', function (assert) {
    assert.equal(moment().add({s: 30}).fromNow(), 'po kelių sekundžių', 'in seconds');
    assert.equal(moment().add({d: 5}).fromNow(), 'po 5 dienų', 'in 5 days');
});

test('calendar day', function (assert) {
    var a = moment().hours(12).minutes(0).seconds(0);

    assert.equal(moment(a).calendar(),                   'Šiandien 12:00',  'today at the same time');
    assert.equal(moment(a).add({m: 25}).calendar(),      'Šiandien 12:25',  'Now plus 25 min');
    assert.equal(moment(a).add({h: 1}).calendar(),       'Šiandien 13:00',  'Now plus 1 hour');
    assert.equal(moment(a).add({d: 1}).calendar(),       'Rytoj 12:00',     'tomorrow at the same time');
    assert.equal(moment(a).subtract({h: 1}).calendar(),  'Šiandien 11:00',  'Now minus 1 hour');
    assert.equal(moment(a).subtract({d: 1}).calendar(),  'Vakar 12:00',     'yesterday at the same time');
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
        assert.equal(m.calendar(),       m.format('[Praėjusį] dddd LT'),  'Today - ' + i + ' days current time');
        m.hours(0).minutes(0).seconds(0).milliseconds(0);
        assert.equal(m.calendar(),       m.format('[Praėjusį] dddd LT'),  'Today - ' + i + ' days beginning of day');
        m.hours(23).minutes(59).seconds(59).milliseconds(999);
        assert.equal(m.calendar(),       m.format('[Praėjusį] dddd LT'),  'Today - ' + i + ' days end of day');
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

test('weeks year starting sunday formatted', function (assert) {
    assert.equal(moment([2012, 0,  1]).format('w ww wo'), '52 52 52-oji', 'Jan  1 2012 should be week 52');
    assert.equal(moment([2012, 0,  2]).format('w ww wo'),  '1 01 1-oji', 'Jan  2 2012 should be week 1');
    assert.equal(moment([2012, 0,  8]).format('w ww wo'),  '1 01 1-oji', 'Jan  8 2012 should be week 1');
    assert.equal(moment([2012, 0,  9]).format('w ww wo'),  '2 02 2-oji', 'Jan  9 2012 should be week 2');
    assert.equal(moment([2012, 0, 15]).format('w ww wo'),  '2 02 2-oji', 'Jan 15 2012 should be week 2');
});

test('month cases', function (assert) {
    assert.equal(moment([2015, 4, 1]).format('LL'), '2015 m. gegužės 1 d.', 'uses format instead of standalone form');
});

})));
