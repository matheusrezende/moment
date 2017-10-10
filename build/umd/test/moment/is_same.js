
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

// Pick the first defined of two or three arguments.

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



function module$1 (name, lifecycle) {
    QUnit.module(name, {
        setup : function () {
            moment.locale('en');
            moment.createFromInputFallback = function (config) {
                throw new Error('input not handled by moment: ' + config._i);
            };
            setupDeprecationHandler(test, moment, 'core');
            if (lifecycle && lifecycle.setup) {
                lifecycle.setup();
            }
        },
        teardown : function () {
            teardownDeprecationHandler(test, moment, 'core');
            if (lifecycle && lifecycle.teardown) {
                lifecycle.teardown();
            }
        }
    });
}

module$1('is same');

test('is same without units', function (assert) {
    var m = moment(new Date(2011, 3, 2, 3, 4, 5, 10)), mCopy = moment(m);
    assert.equal(m.isSame(moment(new Date(2012, 3, 2, 3, 5, 5, 10))), false, 'year is later');
    assert.equal(m.isSame(moment(new Date(2010, 3, 2, 3, 3, 5, 10))), false, 'year is earlier');
    assert.equal(m.isSame(moment(new Date(2011, 4, 2, 3, 4, 5, 10))), false, 'month is later');
    assert.equal(m.isSame(moment(new Date(2011, 2, 2, 3, 4, 5, 10))), false, 'month is earlier');
    assert.equal(m.isSame(moment(new Date(2011, 3, 3, 3, 4, 5, 10))), false, 'day is later');
    assert.equal(m.isSame(moment(new Date(2011, 3, 1, 3, 4, 5, 10))), false, 'day is earlier');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 4, 4, 5, 10))), false, 'hour is later');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 2, 4, 5, 10))), false, 'hour is earlier');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 3, 5, 5, 10))), false, 'minute is later');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 3, 3, 5, 10))), false, 'minute is earlier');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 3, 4, 6, 10))), false, 'second is later');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 3, 4, 4, 11))), false, 'second is earlier');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 3, 4, 5, 10))), true, 'millisecond match');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 3, 4, 5, 11))), false, 'millisecond is later');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 3, 4, 5, 9))), false, 'millisecond is earlier');
    assert.equal(m.isSame(m), true, 'moments are the same as themselves');
    assert.equal(+m, +mCopy, 'isSame second should not change moment');
});

test('is same year', function (assert) {
    var m = moment(new Date(2011, 1, 2, 3, 4, 5, 6)), mCopy = moment(m);
    assert.equal(m.isSame(moment(new Date(2011, 5, 6, 7, 8, 9, 10)), 'year'), true, 'year match');
    assert.equal(m.isSame(moment(new Date(2011, 5, 6, 7, 8, 9, 10)), 'years'), true, 'plural should work');
    assert.equal(m.isSame(moment(new Date(2012, 5, 6, 7, 8, 9, 10)), 'year'), false, 'year mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 0, 1, 0, 0, 0, 0)), 'year'), true, 'exact start of year');
    assert.equal(m.isSame(moment(new Date(2011, 11, 31, 23, 59, 59, 999)), 'year'), true, 'exact end of year');
    assert.equal(m.isSame(moment(new Date(2012, 0, 1, 0, 0, 0, 0)), 'year'), false, 'start of next year');
    assert.equal(m.isSame(moment(new Date(2010, 11, 31, 23, 59, 59, 999)), 'year'), false, 'end of previous year');
    assert.equal(m.isSame(m, 'year'), true, 'same moments are in the same year');
    assert.equal(+m, +mCopy, 'isSame year should not change moment');
});

test('is same month', function (assert) {
    var m = moment(new Date(2011, 2, 3, 4, 5, 6, 7)), mCopy = moment(m);
    assert.equal(m.isSame(moment(new Date(2011, 2, 6, 7, 8, 9, 10)), 'month'), true, 'month match');
    assert.equal(m.isSame(moment(new Date(2011, 2, 6, 7, 8, 9, 10)), 'months'), true, 'plural should work');
    assert.equal(m.isSame(moment(new Date(2012, 2, 6, 7, 8, 9, 10)), 'month'), false, 'year mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 5, 6, 7, 8, 9, 10)), 'month'), false, 'month mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 2, 1, 0, 0, 0, 0)), 'month'), true, 'exact start of month');
    assert.equal(m.isSame(moment(new Date(2011, 2, 31, 23, 59, 59, 999)), 'month'), true, 'exact end of month');
    assert.equal(m.isSame(moment(new Date(2011, 3, 1, 0, 0, 0, 0)), 'month'), false, 'start of next month');
    assert.equal(m.isSame(moment(new Date(2011, 1, 27, 23, 59, 59, 999)), 'month'), false, 'end of previous month');
    assert.equal(m.isSame(m, 'month'), true, 'same moments are in the same month');
    assert.equal(+m, +mCopy, 'isSame month should not change moment');
});

test('is same day', function (assert) {
    var m = moment(new Date(2011, 1, 2, 3, 4, 5, 6)), mCopy = moment(m);
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 7, 8, 9, 10)), 'day'), true, 'day match');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 7, 8, 9, 10)), 'days'), true, 'plural should work');
    assert.equal(m.isSame(moment(new Date(2012, 1, 2, 7, 8, 9, 10)), 'day'), false, 'year mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 2, 2, 7, 8, 9, 10)), 'day'), false, 'month mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 1, 3, 7, 8, 9, 10)), 'day'), false, 'day mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 0, 0, 0, 0)), 'day'), true, 'exact start of day');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 23, 59, 59, 999)), 'day'), true, 'exact end of day');
    assert.equal(m.isSame(moment(new Date(2011, 1, 3, 0, 0, 0, 0)), 'day'), false, 'start of next day');
    assert.equal(m.isSame(moment(new Date(2011, 1, 1, 23, 59, 59, 999)), 'day'), false, 'end of previous day');
    assert.equal(m.isSame(m, 'day'), true, 'same moments are in the same day');
    assert.equal(+m, +mCopy, 'isSame day should not change moment');
});

test('is same hour', function (assert) {
    var m = moment(new Date(2011, 1, 2, 3, 4, 5, 6)), mCopy = moment(m);
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 8, 9, 10)), 'hour'), true, 'hour match');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 8, 9, 10)), 'hours'), true, 'plural should work');
    assert.equal(m.isSame(moment(new Date(2012, 1, 2, 3, 8, 9, 10)), 'hour'), false, 'year mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 2, 2, 3, 8, 9, 10)), 'hour'), false, 'month mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 1, 3, 3, 8, 9, 10)), 'hour'), false, 'day mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 4, 8, 9, 10)), 'hour'), false, 'hour mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 0, 0, 0)), 'hour'), true, 'exact start of hour');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 59, 59, 999)), 'hour'), true, 'exact end of hour');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 4, 0, 0, 0)), 'hour'), false, 'start of next hour');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 2, 59, 59, 999)), 'hour'), false, 'end of previous hour');
    assert.equal(m.isSame(m, 'hour'), true, 'same moments are in the same hour');
    assert.equal(+m, +mCopy, 'isSame hour should not change moment');
});

test('is same minute', function (assert) {
    var m = moment(new Date(2011, 1, 2, 3, 4, 5, 6)), mCopy = moment(m);
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 4, 9, 10)), 'minute'), true, 'minute match');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 4, 9, 10)), 'minutes'), true, 'plural should work');
    assert.equal(m.isSame(moment(new Date(2012, 1, 2, 3, 4, 9, 10)), 'minute'), false, 'year mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 2, 2, 3, 4, 9, 10)), 'minute'), false, 'month mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 1, 3, 3, 4, 9, 10)), 'minute'), false, 'day mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 4, 4, 9, 10)), 'minute'), false, 'hour mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 5, 9, 10)), 'minute'), false, 'minute mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 4, 0, 0)), 'minute'), true, 'exact start of minute');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 4, 59, 999)), 'minute'), true, 'exact end of minute');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 5, 0, 0)), 'minute'), false, 'start of next minute');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 3, 59, 999)), 'minute'), false, 'end of previous minute');
    assert.equal(m.isSame(m, 'minute'), true, 'same moments are in the same minute');
    assert.equal(+m, +mCopy, 'isSame minute should not change moment');
});

test('is same second', function (assert) {
    var m = moment(new Date(2011, 1, 2, 3, 4, 5, 6)), mCopy = moment(m);
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 4, 5, 10)), 'second'), true, 'second match');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 4, 5, 10)), 'seconds'), true, 'plural should work');
    assert.equal(m.isSame(moment(new Date(2012, 1, 2, 3, 4, 5, 10)), 'second'), false, 'year mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 2, 2, 3, 4, 5, 10)), 'second'), false, 'month mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 1, 3, 3, 4, 5, 10)), 'second'), false, 'day mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 4, 4, 5, 10)), 'second'), false, 'hour mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 5, 5, 10)), 'second'), false, 'minute mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 4, 6, 10)), 'second'), false, 'second mismatch');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 4, 5, 0)), 'second'), true, 'exact start of second');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 4, 5, 999)), 'second'), true, 'exact end of second');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 4, 6, 0)), 'second'), false, 'start of next second');
    assert.equal(m.isSame(moment(new Date(2011, 1, 2, 3, 4, 4, 999)), 'second'), false, 'end of previous second');
    assert.equal(m.isSame(m, 'second'), true, 'same moments are in the same second');
    assert.equal(+m, +mCopy, 'isSame second should not change moment');
});

test('is same millisecond', function (assert) {
    var m = moment(new Date(2011, 3, 2, 3, 4, 5, 10)), mCopy = moment(m);
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 3, 4, 5, 10)), 'millisecond'), true, 'millisecond match');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 3, 4, 5, 10)), 'milliseconds'), true, 'plural should work');
    assert.equal(m.isSame(moment(new Date(2012, 3, 2, 3, 4, 5, 10)), 'millisecond'), false, 'year is later');
    assert.equal(m.isSame(moment(new Date(2010, 3, 2, 3, 4, 5, 10)), 'millisecond'), false, 'year is earlier');
    assert.equal(m.isSame(moment(new Date(2011, 4, 2, 3, 4, 5, 10)), 'millisecond'), false, 'month is later');
    assert.equal(m.isSame(moment(new Date(2011, 2, 2, 3, 4, 5, 10)), 'millisecond'), false, 'month is earlier');
    assert.equal(m.isSame(moment(new Date(2011, 3, 3, 3, 4, 5, 10)), 'millisecond'), false, 'day is later');
    assert.equal(m.isSame(moment(new Date(2011, 3, 1, 1, 4, 5, 10)), 'millisecond'), false, 'day is earlier');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 4, 4, 5, 10)), 'millisecond'), false, 'hour is later');
    assert.equal(m.isSame(moment(new Date(2011, 3, 1, 4, 1, 5, 10)), 'millisecond'), false, 'hour is earlier');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 3, 5, 5, 10)), 'millisecond'), false, 'minute is later');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 3, 3, 5, 10)), 'millisecond'), false, 'minute is earlier');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 3, 4, 6, 10)), 'millisecond'), false, 'second is later');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 3, 4, 4, 5)), 'millisecond'), false, 'second is earlier');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 3, 4, 6, 11)), 'millisecond'), false, 'millisecond is later');
    assert.equal(m.isSame(moment(new Date(2011, 3, 2, 3, 4, 4, 9)), 'millisecond'), false, 'millisecond is earlier');
    assert.equal(m.isSame(m, 'millisecond'), true, 'same moments are in the same millisecond');
    assert.equal(+m, +mCopy, 'isSame millisecond should not change moment');
});

test('is same with utc offset moments', function (assert) {
    assert.ok(moment.parseZone('2013-02-01T00:00:00-05:00').isSame(moment('2013-02-01'), 'year'), 'zoned vs local moment');
    assert.ok(moment('2013-02-01').isSame(moment('2013-02-01').utcOffset('-05:00'), 'year'), 'local vs zoned moment');
    assert.ok(moment.parseZone('2013-02-01T00:00:00-05:00').isSame(moment.parseZone('2013-02-01T00:00:00-06:30'), 'year'),
            'zoned vs (differently) zoned moment');
});

test('is same with invalid moments', function (assert) {
    assert.equal(moment.invalid().isSame(moment.invalid()), false, 'invalid moments are not considered equal');
});

})));
