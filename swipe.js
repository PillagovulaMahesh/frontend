/* Touch swipe */
(function(d) {
    var m = "left"
      , l = "right"
      , c = "up"
      , s = "down"
      , b = "in"
      , t = "out"
      , j = "none"
      , o = "auto"
      , i = "swipe"
      , p = "pinch"
      , u = "tap"
      , x = "horizontal"
      , q = "vertical"
      , g = "all"
      , e = "start"
      , h = "move"
      , f = "end"
      , n = "cancel"
      , a = "ontouchstart"in window
      , v = "TouchSwipe";
    var k = {
        fingers: 1,
        threshold: 75,
        cancelThreshold: 25,
        pinchThreshold: 20,
        maxTimeThreshold: null,
        fingerReleaseThreshold: 250,
        swipe: null,
        swipeLeft: null,
        swipeRight: null,
        swipeUp: null,
        swipeDown: null,
        swipeStatus: null,
        pinchIn: null,
        pinchOut: null,
        pinchStatus: null,
        click: null,
        tap: null,
        triggerOnTouchEnd: true,
        triggerOnTouchLeave: false,
        allowPageScroll: "auto",
        fallbackToMouseEvents: true,
        excludedElements: "button, input, select, textarea, a, .noSwipe"
    };
    d.fn.swipe = function(A) {
        var z = d(this)
          , y = z.data(v);
        if (y && typeof A === "string") {
            if (y[A]) {
                return y[A].apply(this, Array.prototype.slice.call(arguments, 1))
            } else {
                d.error("Method " + A + " does not exist on jQuery.swipe")
            }
        } else {
            if (!y && (typeof A === "object" || !A)) {
                return r.apply(this, arguments)
            }
        }
        return z
    }
    ;
    d.fn.swipe.defaults = k;
    d.fn.swipe.phases = {
        PHASE_START: e,
        PHASE_MOVE: h,
        PHASE_END: f,
        PHASE_CANCEL: n
    };
    d.fn.swipe.directions = {
        LEFT: m,
        RIGHT: l,
        UP: c,
        DOWN: s,
        IN: b,
        OUT: t
    };
    d.fn.swipe.pageScroll = {
        NONE: j,
        HORIZONTAL: x,
        VERTICAL: q,
        AUTO: o
    };
    d.fn.swipe.fingers = {
        ONE: 1,
        TWO: 2,
        THREE: 3,
        ALL: g
    };
    function r(y) {
        if (y && (y.allowPageScroll === undefined && (y.swipe !== undefined || y.swipeStatus !== undefined))) {
            y.allowPageScroll = j
        }
        if (y.click !== undefined && y.tap === undefined) {
            y.tap = y.click
        }
        if (!y) {
            y = {}
        }
        y = d.extend({}, d.fn.swipe.defaults, y);
        return this.each(function() {
            var A = d(this);
            var z = A.data(v);
            if (!z) {
                z = new w(this,y);
                A.data(v, z)
            }
        })
    }
    function w(S, ag) {
        var aJ = (a || !ag.fallbackToMouseEvents)
          , az = aJ ? "touchstart" : "mousedown"
          , U = aJ ? "touchmove" : "mousemove"
          , av = aJ ? "touchend" : "mouseup"
          , D = aJ ? null : "mouseleave"
          , R = "touchcancel";
        var ad = 0
          , N = null
          , ah = 0
          , aF = 0
          , A = 0
          , aj = 1
          , aA = 0
          , aN = 0
          , Z = null;
        var H = d(S);
        var O = "start";
        var aI = 0;
        var ai = null;
        var I = 0
          , Y = 0
          , aD = 0
          , aP = 0;
        try {
            H.bind(az, at);
            H.bind(R, L)
        } catch (aG) {
            d.error("events not supported " + az + "," + R + " on jQuery.swipe")
        }
        this.enable = function() {
            H.bind(az, at);
            H.bind(R, L);
            return H
        }
        ;
        this.disable = function() {
            Q();
            return H
        }
        ;
        this.destroy = function() {
            Q();
            H.data(v, null);
            return H
        }
        ;
        this.option = function(aR, aQ) {
            if (ag[aR] !== undefined) {
                if (aQ === undefined) {
                    return ag[aR]
                } else {
                    ag[aR] = aQ
                }
            } else {
                d.error("Option " + aR + " does not exist on jQuery.swipe.options")
            }
        }
        ;
        function at(aS) {
            if (X()) {
                return
            }
            if (d(aS.target).closest(ag.excludedElements, H).length > 0) {
                return
            }
            var aT = aS.originalEvent ? aS.originalEvent : aS;
            var aR, aQ = a ? aT.touches[0] : aT;
            O = e;
            if (a) {
                aI = aT.touches.length
            } else {
                aS.preventDefault()
            }
            ad = 0;
            N = null;
            aN = null;
            ah = 0;
            aF = 0;
            A = 0;
            aj = 1;
            aA = 0;
            ai = T();
            Z = aE();
            z();
            if (!a || (aI === ag.fingers || ag.fingers === g) || ap()) {
                aO(0, aQ);
                I = B();
                if (aI == 2) {
                    aO(1, aT.touches[1]);
                    aF = A = aa(ai[0].start, ai[1].start)
                }
                if (ag.swipeStatus || ag.pinchStatus) {
                    aR = aH(aT, O)
                }
            } else {
                aR = false
            }
            if (aR === false) {
                O = n;
                aH(aT, O);
                return aR
            } else {
                ak(true)
            }
        }
        function P(aT) {
            var aW = aT.originalEvent ? aT.originalEvent : aT;
            if (O === f || O === n || af()) {
                return
            }
            var aS, aR = a ? aW.touches[0] : aW;
            var aU = V(aR);
            Y = B();
            if (a) {
                aI = aW.touches.length
            }
            O = h;
            if (aI == 2) {
                if (aF == 0) {
                    aO(1, aW.touches[1]);
                    aF = A = aa(ai[0].start, ai[1].start)
                } else {
                    V(aW.touches[1]);
                    A = aa(ai[0].end, ai[1].end);
                    aN = ao(ai[0].end, ai[1].end)
                }
                aj = y(aF, A);
                aA = Math.abs(aF - A)
            }
            if ((aI === ag.fingers || ag.fingers === g) || !a || ap()) {
                N = ar(aU.start, aU.end);
                C(aT, N);
                ad = G(aU.start, aU.end);
                ah = K();
                aK(N, ad);
                if (ag.swipeStatus || ag.pinchStatus) {
                    aS = aH(aW, O)
                }
                if (!ag.triggerOnTouchEnd || ag.triggerOnTouchLeave) {
                    var aQ = true;
                    if (ag.triggerOnTouchLeave) {
                        var aV = au(this);
                        aQ = aC(aU.end, aV)
                    }
                    if (!ag.triggerOnTouchEnd && aQ) {
                        O = aM(h)
                    } else {
                        if (ag.triggerOnTouchLeave && !aQ) {
                            O = aM(f)
                        }
                    }
                    if (O == n || O == f) {
                        aH(aW, O)
                    }
                }
            } else {
                O = n;
                aH(aW, O)
            }
            if (aS === false) {
                O = n;
                aH(aW, O)
            }
        }
        function ab(aS) {
            var aU = aS.originalEvent;
            if (a) {
                if (aU.touches.length > 0) {
                    aw();
                    return true
                }
            }
            if (af()) {
                aI = aP
            }
            aS.preventDefault();
            Y = B();
            if (ag.triggerOnTouchEnd || (ag.triggerOnTouchEnd == false && O === h)) {
                O = f;
                var aR = ((aI === ag.fingers || ag.fingers === g) || !a);
                var aQ = ai[0].end.x !== 0;
                var aT = aR && aQ && (an() || aB());
                if (aT) {
                    aH(aU, O)
                } else {
                    O = n;
                    aH(aU, O)
                }
            } else {
                if (!ag.triggerOnTouchEnd && ay()) {
                    O = f;
                    am(aU, O, u)
                } else {
                    if (O === h) {
                        O = n;
                        aH(aU, O)
                    }
                }
            }
            ak(false)
        }
        function L() {
            aI = 0;
            Y = 0;
            I = 0;
            aF = 0;
            A = 0;
            aj = 1;
            z();
            ak(false)
        }
        function W(aQ) {
            var aR = aQ.originalEvent;
            if (ag.triggerOnTouchLeave) {
                O = aM(f);
                aH(aR, O)
            }
        }
        function Q() {
            H.unbind(az, at);
            H.unbind(R, L);
            H.unbind(U, P);
            H.unbind(av, ab);
            if (D) {
                H.unbind(D, W)
            }
            ak(false)
        }
        function aM(aT) {
            var aS = aT;
            var aR = aq();
            var aQ = ae();
            if (!aR) {
                aS = n
            } else {
                if (aQ && aT == h && (!ag.triggerOnTouchEnd || ag.triggerOnTouchLeave)) {
                    aS = f
                } else {
                    if (!aQ && aT == f && ag.triggerOnTouchLeave) {
                        aS = n
                    }
                }
            }
            return aS
        }
        function aH(aS, aQ) {
            var aR = undefined;
            if (ac()) {
                aR = am(aS, aQ, i)
            }
            if (ap() && aR !== false) {
                aR = am(aS, aQ, p)
            }
            if (ay() && aR !== false) {
                aR = am(aS, aQ, u)
            }
            if (aQ === n) {
                L(aS)
            }
            if (aQ === f) {
                if (a) {
                    if (aS.touches.length == 0) {
                        L(aS)
                    }
                } else {
                    L(aS)
                }
            }
            return aR
        }
        function am(aT, aQ, aS) {
            var aR = undefined;
            if (aS == i) {
                H.trigger("swipeStatus", [aQ, N || null, ad || 0, ah || 0, aI]);
                if (ag.swipeStatus) {
                    aR = ag.swipeStatus.call(H, aT, aQ, N || null, ad || 0, ah || 0, aI);
                    if (aR === false) {
                        return false
                    }
                }
                if (aQ == f && aB()) {
                    H.trigger("swipe", [N, ad, ah, aI]);
                    if (ag.swipe) {
                        aR = ag.swipe.call(H, aT, N, ad, ah, aI);
                        if (aR === false) {
                            return false
                        }
                    }
                    switch (N) {
                    case m:
                        H.trigger("swipeLeft", [N, ad, ah, aI]);
                        if (ag.swipeLeft) {
                            aR = ag.swipeLeft.call(H, aT, N, ad, ah, aI)
                        }
                        break;
                    case l:
                        H.trigger("swipeRight", [N, ad, ah, aI]);
                        if (ag.swipeRight) {
                            aR = ag.swipeRight.call(H, aT, N, ad, ah, aI)
                        }
                        break;
                    case c:
                        H.trigger("swipeUp", [N, ad, ah, aI]);
                        if (ag.swipeUp) {
                            aR = ag.swipeUp.call(H, aT, N, ad, ah, aI)
                        }
                        break;
                    case s:
                        H.trigger("swipeDown", [N, ad, ah, aI]);
                        if (ag.swipeDown) {
                            aR = ag.swipeDown.call(H, aT, N, ad, ah, aI)
                        }
                        break
                    }
                }
            }
            if (aS == p) {
                H.trigger("pinchStatus", [aQ, aN || null, aA || 0, ah || 0, aI, aj]);
                if (ag.pinchStatus) {
                    aR = ag.pinchStatus.call(H, aT, aQ, aN || null, aA || 0, ah || 0, aI, aj);
                    if (aR === false) {
                        return false
                    }
                }
                if (aQ == f && an()) {
                    switch (aN) {
                    case b:
                        H.trigger("pinchIn", [aN || null, aA || 0, ah || 0, aI, aj]);
                        if (ag.pinchIn) {
                            aR = ag.pinchIn.call(H, aT, aN || null, aA || 0, ah || 0, aI, aj)
                        }
                        break;
                    case t:
                        H.trigger("pinchOut", [aN || null, aA || 0, ah || 0, aI, aj]);
                        if (ag.pinchOut) {
                            aR = ag.pinchOut.call(H, aT, aN || null, aA || 0, ah || 0, aI, aj)
                        }
                        break
                    }
                }
            }
            if (aS == u) {
                if (aQ === n || aQ === f) {
                    if ((aI === 1 || !a) && (isNaN(ad) || ad === 0)) {
                        H.trigger("tap", [aT.target]);
                        if (ag.tap) {
                            aR = ag.tap.call(H, aT, aT.target)
                        }
                    }
                }
            }
            return aR
        }
        function ae() {
            var aQ = true;
            if (ag.threshold !== null) {
                aQ = ad >= ag.threshold
            }
            if (aQ && ag.cancelThreshold !== null) {
                aQ = (M(N) - ad) < ag.cancelThreshold
            }
            return aQ
        }
        function al() {
            if (ag.pinchThreshold !== null) {
                return aA >= ag.pinchThreshold
            }
            return true
        }
        function aq() {
            var aQ;
            if (ag.maxTimeThreshold) {
                if (ah >= ag.maxTimeThreshold) {
                    aQ = false
                } else {
                    aQ = true
                }
            } else {
                aQ = true
            }
            return aQ
        }
        function C(aQ, aR) {
            if (ag.allowPageScroll === j || ap()) {
                aQ.preventDefault()
            } else {
                var aS = ag.allowPageScroll === o;
                switch (aR) {
                case m:
                    if ((ag.swipeLeft && aS) || (!aS && ag.allowPageScroll != x)) {
                        aQ.preventDefault()
                    }
                    break;
                case l:
                    if ((ag.swipeRight && aS) || (!aS && ag.allowPageScroll != x)) {
                        aQ.preventDefault()
                    }
                    break;
                case c:
                    if ((ag.swipeUp && aS) || (!aS && ag.allowPageScroll != q)) {
                        aQ.preventDefault()
                    }
                    break;
                case s:
                    if ((ag.swipeDown && aS) || (!aS && ag.allowPageScroll != q)) {
                        aQ.preventDefault()
                    }
                    break
                }
            }
        }
        function an() {
            return al()
        }
        function ap() {
            return !!(ag.pinchStatus || ag.pinchIn || ag.pinchOut)
        }
        function ax() {
            return !!(an() && ap())
        }
        function aB() {
            var aQ = aq();
            var aS = ae();
            var aR = aS && aQ;
            return aR
        }
        function ac() {
            return !!(ag.swipe || ag.swipeStatus || ag.swipeLeft || ag.swipeRight || ag.swipeUp || ag.swipeDown)
        }
        function E() {
            return !!(aB() && ac())
        }
        function ay() {
            return !!(ag.tap)
        }
        function aw() {
            aD = B();
            aP = event.touches.length + 1
        }
        function z() {
            aD = 0;
            aP = 0
        }
        function af() {
            var aQ = false;
            if (aD) {
                var aR = B() - aD;
                if (aR <= ag.fingerReleaseThreshold) {
                    aQ = true
                }
            }
            return aQ
        }
        function X() {
            return !!(H.data(v + "_intouch") === true)
        }
        function ak(aQ) {
            if (aQ === true) {
                H.bind(U, P);
                H.bind(av, ab);
                if (D) {
                    H.bind(D, W)
                }
            } else {
                H.unbind(U, P, false);
                H.unbind(av, ab, false);
                if (D) {
                    H.unbind(D, W, false)
                }
            }
            H.data(v + "_intouch", aQ === true)
        }
        function aO(aR, aQ) {
            var aS = aQ.identifier !== undefined ? aQ.identifier : 0;
            ai[aR].identifier = aS;
            ai[aR].start.x = ai[aR].end.x = aQ.pageX || aQ.clientX;
            ai[aR].start.y = ai[aR].end.y = aQ.pageY || aQ.clientY;
            return ai[aR]
        }
        function V(aQ) {
            var aS = aQ.identifier !== undefined ? aQ.identifier : 0;
            var aR = J(aS);
            aR.end.x = aQ.pageX || aQ.clientX;
            aR.end.y = aQ.pageY || aQ.clientY;
            return aR
        }
        function J(aR) {
            for (var aQ = 0; aQ < ai.length; aQ++) {
                if (ai[aQ].identifier == aR) {
                    return ai[aQ]
                }
            }
        }
        function T() {
            var aQ = [];
            for (var aR = 0; aR <= 5; aR++) {
                aQ.push({
                    start: {
                        x: 0,
                        y: 0
                    },
                    end: {
                        x: 0,
                        y: 0
                    },
                    identifier: 0
                })
            }
            return aQ
        }
        function aK(aQ, aR) {
            aR = Math.max(aR, M(aQ));
            Z[aQ].distance = aR
        }
        function M(aQ) {
            return Z[aQ].distance
        }
        function aE() {
            var aQ = {};
            aQ[m] = aL(m);
            aQ[l] = aL(l);
            aQ[c] = aL(c);
            aQ[s] = aL(s);
            return aQ
        }
        function aL(aQ) {
            return {
                direction: aQ,
                distance: 0
            }
        }
        function K() {
            return Y - I
        }
        function aa(aT, aS) {
            var aR = Math.abs(aT.x - aS.x);
            var aQ = Math.abs(aT.y - aS.y);
            return Math.round(Math.sqrt(aR * aR + aQ * aQ))
        }
        function y(aQ, aR) {
            var aS = (aR / aQ) * 1;
            return aS.toFixed(2)
        }
        function ao() {
            if (aj < 1) {
                return t
            } else {
                return b
            }
        }
        function G(aR, aQ) {
            return Math.round(Math.sqrt(Math.pow(aQ.x - aR.x, 2) + Math.pow(aQ.y - aR.y, 2)))
        }
        function F(aT, aR) {
            var aQ = aT.x - aR.x;
            var aV = aR.y - aT.y;
            var aS = Math.atan2(aV, aQ);
            var aU = Math.round(aS * 180 / Math.PI);
            if (aU < 0) {
                aU = 360 - Math.abs(aU)
            }
            return aU
        }
        function ar(aR, aQ) {
            var aS = F(aR, aQ);
            if ((aS <= 45) && (aS >= 0)) {
                return m
            } else {
                if ((aS <= 360) && (aS >= 315)) {
                    return m
                } else {
                    if ((aS >= 135) && (aS <= 225)) {
                        return l
                    } else {
                        if ((aS > 45) && (aS < 135)) {
                            return s
                        } else {
                            return c
                        }
                    }
                }
            }
        }
        function B() {
            var aQ = new Date();
            return aQ.getTime()
        }
        function au(aQ) {
            aQ = d(aQ);
            var aS = aQ.offset();
            var aR = {
                left: aS.left,
                right: aS.left + aQ.outerWidth(),
                top: aS.top,
                bottom: aS.top + aQ.outerHeight()
            };
            return aR
        }
        function aC(aQ, aR) {
            return (aQ.x > aR.left && aQ.x < aR.right && aQ.y > aR.top && aQ.y < aR.bottom)
        }
    }
}
)(jQuery);
