bbcdotcom.objects('bbcdotcom.adverts', 'create');
bbcdotcom.adverts.adSuites = (function () {

    var suites = {
        '970x250' : {
            dfppId: 185036058,
            adUnit: 'preview',
            uid: '5d453f2d6551484b782064357a',
            slots: {
                leaderboard: [[970,250]],
                mpu: []
            }
        },
        large : {
            dfppId: 114180258,
            adUnit: 'preview',
            uid: '224f514079694b3d567a747a22',
            slots: {
                leaderboard: [[970,250]]
            }
        },
        big : {
            dfppId: 185036058,
            adUnit: 'preview',
            uid: '5d453f2d6551484b782064357a',
            slots: {
                leaderboard: [[970,250]],
                mpu: [[300,600]]
            }
        },
        standard : {
            dfppId: 193669458,
            adUnit: 'preview',
            uid: '3171676f4450464e3d5a3b4746',
            slots: {
                leaderboard: [[728,90]],
                mpu: [[300,250]]
            }
        },
        opaque : {
            dfppId: 193669458,
            adUnit: 'preview',
            uid: '3171676f4450464e3d5a3b4746',
            slots: {
                leaderboard: [[728,90]],
                mpu: [[300,250]]
            }
        },
        interstitial : {
            dfppId: 193674858,
            adUnit: 'preview',
            uid: '3f784566412e58404762524028',
            slots: {
                interstitial: [[1,1]],
                leaderboard: [[728,90]],
                mpu: [[300,250]]
            }
        },
        "int-uni-iframe" : {
            dfppId: 200145378,
            adUnit: 'preview',
            uid: '2b614a6426584d2e767e7a2967',
            slots: {
                interstitial: [[1,1]],
                leaderboard: [[728,90]],
                mpu: [[300,250]]
            }
        },
        "int-uni-image" : {
            dfppId: 200147178,
            adUnit: 'preview',
            uid: '2b5e292758336b7b662b346122',
            slots: {
                interstitial: [[1,1]],
                leaderboard: [[728,90]],
                mpu: [[300,250]]
            }
        },
        empty : {
            dfppId: 114180258,
            adUnit: 'preview',
            uid: '537034287a7as704b51655e3227'
        },
        none : {
            dfppId: 114180258,
            adUnit: 'preview',
            uid: '537034287a7as704b51655e3227'
        },
        noad : {
            dfppId: 114180258,
            adUnit: 'preview',
            uid: '537034287a7as704b51655e3227'
        }
    };

    return {
        init: function (windowLocationHref) {
            var suite;
            if (/[\\?&]ads=([^&#]*)/.test(windowLocationHref)) {
                if ('undefined' !== typeof(suites[RegExp.$1])) {
                    suite = suites[RegExp.$1];
                    if (bbcdotcom.objects('uid', suite)) {
                        bbcdotcom.adverts.adUnit.setUid(suite.uid);
                    }
                    if (bbcdotcom.objects('adUnit', suite)) {
                        bbcdotcom.adverts.adUnit.setAdUnit(suite.adUnit);
                    }
                    if (bbcdotcom.objects('slots', suite)) {
                        bbcdotcom.adverts.layout.overrideGroupSizes(suite.slots);
                    }
                }
            }
        }
    };

}());
