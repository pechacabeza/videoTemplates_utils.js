var utils = {
    timer: null,
    layersloaded: 0,
    layerstoload: 0,
    overridePlay: !1,
    overrideSound: !1,
    randomValue: Math.round(1e8 * Math.random()),
    macro: null,
    scroll: {
        oldValue: 0,
        newValue: 0,
        alreadyPlayOnScroll: !1
    },

    videoevents: {
        firstquartile: !1,
        secondquartile: !1,
        thirdquartile: !1,
        fourthquartile: !1
    },
    controls: {
        play: null,
        sound: null
    },
    videoelement: null,
    videofilename: "",
    videostarted: !1,
    events: {
        TARGETS_LENGTH: "TARGET_LENGTH",
        VIDEO_LOADED: "video_loaded",
        VIDEO_END: "video_end",
        VIDEO_ERROR: "video_error"
    },
    childrenslength: null,
    IE: "msie",
    WK: "webkit",
    GK: "gecko",
    preloaded: function () {
        screenad.executeScript("if(!window.webolayers){window.webolayers=1}else{window.webolayers+=1}")
    },
    getVars: function (e) {
        var t;
        t = e ? window.location[e] : window.location.search;
        for (var n = {}, o = t.substring(1, t.length).split("&"), l = 0; l < o.length; l++) {
            var s = o[l].split("=");
            n[s[0]] = unescape(decodeURI(s[1]))
        }
        return n
    },
    getloadedtotal: function () {
        screenad.executeScript("window.webolayers", function (e) {
            return e ? (utils.layersloaded = e, e) : null
        })
    },
    allLoaded: function (e, t) {
        utils.layerstoload = t, utils.timer = setInterval(function () {
            utils.getloadedtotal(), utils.layersloaded == utils.layerstoload && (clearInterval(utils.timer), utils.timer = null, e())
        }, 250)
    },
    getBrowser: function () {
        "use strict";
        var e, t = screenad.browser.browser.msie,
            n = screenad.browser.browser.gecko,
            o = screenad.browser.browser.webkit;
        return t && (e = "msie"), n && (e = "gecko"), o && (e = "webkit"), e
    },
    getBrowserVersion: function () {
        var e = screenad.browser.browser.version;
        return e
    },
    getOS: function () {
        var e = "unknown";
        return screenad.browser.os.ios && (e = "iOS"), screenad.browser.os.android && (e = "Android"), screenad.browser.os.msie && (e = "Windows"), screenad.browser.os.gecko && (e = "Windows"), screenad.browser.os.chrome && !screenad.browser.os.ios && screenad.browser.os.android && (e = "Windows"), screenad.browser.os.webkit && !screenad.browser.os.ios && screenad.browser.os.android && (e = "Apple"), e
    },
    getDevice: function () {
        var e = "unknown";
        return screenad.browser.os.ios ? (screenad.browser.os.iphone && (e = "iphone"), screenad.browser.os.ipad && (e = "ipad")) : e = "notIOS", e
    },
    getFlashVersion: function () {
        var e;
        if (void 0 !== swfobject && null !== swfobject) return e = swfobject.getFlashPlayerVersion(), e.major;
        alert("no swfobject");
        var t = document.getElementsByTagName("head")[0],
            n = document.createElement("script");
        n.type = "text/javascript", n.onreadystatechange = function () {
            "complete" == this.readyState && (e = swfobject.getFlashPlayerVersion())
        }, n.src = "swfobject.js", t.appendChild(n)
    },
    hasLocalStorage: function (e, t) {
        var n, o;
        e && t ? (n = e, o = t) : (n = "webo", o = "test");
        try {
            return window.localStorage.setItem(n, o), window.localStorage.removeItem(n), screenad.event("ls_true"), !0
        } catch (l) {
            return screenad.event("ls_false"), !1
        }
    },
    getKeyValueLocalStorage: function (e) {
        var t = window.localStorage.getItem(e);
        return t
    },
    setKeyValueLocalStorage: function (e, t) {
        window.localStorage.setItem(e, t)
    },
    insertDivAt: function (e, t) {
        void 0 === t && (alert("placement options not defined"), t = {
            id: "webo_id",
            css: "width:1px;height:1px;",
            html: "Weborama HTML"
        });
        var n = "document.getElementById('" + e + "').insertAdjacentHTML('beforeend',\"<div id='" + t.id + "' style='" + t.css + "'>" + t.html + '</div>")';
        screenad.executeScript(n)
    },
    getChildrensLengthOf: function (e, t, n) {
        var o;
        switch (e.substring(0, 1)) {
            case "#":
                e = e.substring(1, e.length), o = 'document.getElementById("' + e + '").children.length';
                break;
            case ".":
                e = e.substring(1, e.length), o = 'document.getElementsByClassName("' + e + '")[0].children.length';
                break;
            default:
                e = e.substring(0, e.length), o = 'document.getElementsByTagsName("' + e + '")[0].children.length'
        }
        screenad.executeScript(o, function (t) {
            "null" != t ? screenad.executeScript(o, function (e) {
                n(e)
            }) : alert("OBJECT " + e + " NOT FOUND.")
        })
    },
    addIdToChildrensByTagName: function (e, t, n, o, l, s) {
        var i;
        if (l) switch (l) {
            case "0":
                n = Math.ceil(utils.childrenslength / 2);
                break;
            case "25":
                n = Math.ceil(utils.childrenslength / 4);
                break;
            case "50":
                n = Math.ceil(utils.childrenslength / 2);
                break;
            case "75":
                n = Math.ceil(utils.childrenslength / 2 + utils.childrenslength / 4);
                break;
            case "100":
                n = Math.ceil(utils.childrenslength);
                break;
            default:
                n = Math.ceil(utils.childrenslength / 2)
        }
        var r;
        n && ("id" === s ? (i = e.substring(0, e.length), r = "document.getElementById('" + i + "').getElementsByTagName('" + t + "')[" + n + "].insertAdjacentHTML('afterend',\"<div id='" + o + "'></div>\")", screenad.executeScript(r)) : "class" === s ? (i = e.substring(0, e.length), r = "document.getElementsByClassName('" + i + "')[0].getElementsByTagName('" + t + "')[" + n + "].insertAdjacentHTML('afterend',\"<div id='" + o + "'></div>\")", screenad.executeScript(r)) : "body" === s ? (r = "document." + e + ".getElementsByTagName('" + t + "')[" + n + "].insertAdjacentHTML('afterend',\"<div id='" + o + "'></div>\")", screenad.executeScript(r)) : "tag" === s && (r = "document.getElementsByTagName('" + t + "')[" + n + "].insertAdjacentHTML('afterend',\"<div id='" + o + "'></div>\")", screenad.executeScript(r)))
    },
    loadScript: function (e) {
        var t = document.createElement("script");
        t.type = "text/javascript", t.src = e, document.head.appendChild(t)
    },
    loadJSON: function (e, t) {
        var n, o = new XMLHttpRequest;
        o.open("GET", e + ".json", !0), o.onload = function (e) {
            n = JSON.parse(o.responseText), t(n)
        }, o.onreadystatechange = function (e) {
            4 === o.readyState && (200 === o.status || alert("jloaderror"))
        }, o.send(null)
    },
    animate: function (e, t, n, o, l, s) {
        var i = utils.removeSelector(e);
        TweenLite.to(i, l, {
            height: o + "px",
            onUpdate: function () {
                t && utils.push(t, n, i.style[n])
            },
            onComplete: function () {
                s && s()
            }
        })
    },
    removeSelector: function (e) {
        var t, n;
        return "#" === e[0] ? (t = e.substring(1, e.length), n = document.getElementById(t)) : "." === e[0] && (t = e.substring(1, e.length), n = document.getElementsByClass(t)[0]), n
    },
    push: function (e, t, n) {
        var o, l;
        "#" === e[0] ? (o = e.substring(1, e.length), l = "document.getElementById('" + o + "').style." + t + " = '" + n + "';") : "." === e[0] ? (o = e.substring(1, e.length), l = "document.getElementsByClass('" + o + "')[0].style." + t + " = '" + n + "';") : l = "document." + e + ".style." + t + " = '" + n + "';", screenad.executeScript(l)
    },
    didScrollChange: function () {
        return screenad.executeScript("window.pageYOffset", function (e) {
            utils.scroll.newValue = e
        }), utils.scroll.newValue != utils.scroll.oldValue ? (utils.scroll.oldValue = utils.scroll.newValue, !0) : !1
    },
    togglePlay: function (e) {
        if (utils.videoelement.paused) {
            if (screenad.hasVisibility) {
                if ("click" == e) try {
                    document.getElementById("videoposter").style.display = "none"
                } catch (t) {}
                "scroll" == e ? utils.videostarted || (utils.videostarted = !0, utils.videoelement.play()) : (utils.videoelement.play(), utils.controls.play.style.backgroundImage = "url(pause.png)")
            }
        } else utils.videoelement.pause(), utils.controls.play.style.backgroundImage = "url(play.png)"
    },
    callURL: function (e, t) {
        if (null !== e) {
            t || utils.macro || alert("NO MACRO's defined!"), t && (e = e.replace(t, utils.randomValue.toString())), e.indexOf(utils.macro) > 1 && (e = e.replace(utils.macro, utils.randomValue.toString()));
            var n = new Image;
            n.src = e
        }
    },
    toggleSound: function () {
        utils.overrideSound = !0, utils.videoelement.muted ? (utils.videoelement.muted = !1, utils.controls.sound.style.backgroundImage = "url(unmuted.png)") : (utils.videoelement.muted = !0, utils.controls.sound.style.backgroundImage = "url(muted.png)")
    },
    insertVideoAt: function (e, t, n, o) {
        utils.videofilename = t.file;
        var l = !0;
        screenad.event(screenad.deviceType), e || console.log("target of video is undefined"), t ? (t.width || (t.width = 600), t.height || (t.height = 400), t.controls || (t.controls = !1, l = !1), "custom" === t.controls && (t.controls = !1, l = "custom"), t.loop || (t.loop = !1), t.sound || (t.sound = !1), t.file || (t.file = "video"), t.autoplay || (t.autoplay = !1), t.soundonmouseover || (t.soundonmouseover = !1), t.videoposter || (t.videoposter = "video_poster.jpg")) : console.log("options of video is undefined"), screenad.vars.videofile && (t.file = screenad.vars.videofile), n || console.log("oncomplete of video is undefined");
        var s = {
                width: t.width,
                height: t.height,
                prependTo: document.getElementById(e),
                controls: t.controls,
                poster: t.videoposter,
                loop: t.loop,
                autoplay: t.autoplay,
                muted: !t.sound,
                videoFiles: [{
                    src: t.file + ".ogv",
                    type: "video/ogg"
                }, {
                    src: t.file + ".mp4",
                    type: "video/mp4"
                }]
            },
            i = new screenad.lib.Video(s);
        utils.videoelement = i.getVideoElement(), utils.videoelement.style.cursor = "pointer", utils.videoelement.style.position = "absolute", utils.videoelement.style.zIndex = "1000000", (screenad.deviceType == screenad.DEVICE_TABLET || screenad.deviceType == screenad.DEVICE_MOBILE) && screenad.isIOS && (utils.videostarted || screenad.executeScript('q1bq.getAttribute("id")', function (e) {
            screenad.executeScript('window.ontouchend=function(e){document.getElementById("' + e.replace("DIV", "").toString() + '").contentWindow.utils.togglePlay("scroll")}')
        })), "custom" === l ? (utils.controls.sound = document.getElementById("soundbutton"), utils.controls.play = document.getElementById("playbutton"), utils.controls.play.style.backgroundImage = "url(pause.png)", utils.controls.play.style.backgroundPosition = "center center", utils.controls.sound.style.backgroundPosition = "center center", utils.controls.sound.style.backgroundSize = "contain", utils.controls.play.style.backgroundSize = "contain", utils.controls.sound.addEventListener("click", function (e) {
            utils.toggleSound()
        }), utils.controls.play.addEventListener("click", function (e) {
            utils.togglePlay()
        }), utils.videoelement.addEventListener("click", function () {
            screenad.click("default")
        })) : document.getElementById("controls").style.display = "none", utils.controls.sound && (utils.controls.sound.style.backgroundImage = t.sound ? "url('unmuted.png')" : "url('muted.png')"), utils.videoelement.addEventListener("ended", function (e) {
            utils.videoevents.fourthquartile || (utils.videoevents.fourthquartile = !0), screenad.event("video_end"), o && utils.callURL(o.videoend), n && n()
        }), utils.videoelement.addEventListener("canplay", function (e) {}), t.loop || utils.videoelement.addEventListener("timeupdate", function (e) {
            playbutton && (playbutton.style.backgroundPosition = "left top"), Math.round(utils.videoelement.duration) && (utils.videoelement.currentTime >= utils.videoelement.duration / 4 && (utils.videoevents.firstquartile || (utils.videoevents.firstquartile = !0, o && utils.callURL(o.firstquartile))), utils.videoelement.currentTime >= utils.videoelement.duration / 2 && (utils.videoevents.secondquartile || (utils.videoevents.secondquartile = !0, o && utils.callURL(o.secondquartile))), utils.videoelement.currentTime >= utils.videoelement.duration / 4 + utils.videoelement.duration / 2 && (utils.videoevents.thirdquartile || (utils.videoevents.thirdquartile = !0, o && utils.callURL(o.thirdquartile))))
        }), utils.videoelement.addEventListener("volumechange", function (e) {
            e.target.muted ? (o && utils.callURL(o.videomuted), screenad.event("mute_on_" + utils.videofilename), soundbutton.style.backgroundPosition = "center bottom") : (o && utils.callURL(o.videounmuted), screenad.event("unmute_on_" + utils.videofilename), soundbutton.style.backgroundPosition = "left bottom")
        }), utils.videoelement.addEventListener("play", function (e) {
            utils.videostarted || (screenad.event("video_start"), o && utils.callURL(o.videostart)), utils.videostarted = !0, o && utils.callURL(o.videoplay), utils.controls.play && (utils.controls.play.style.backgroundImage = "url(pause.png)")
        }), utils.videoelement.addEventListener("pause", function () {
            utils.controls.play && (utils.controls.play.style.backgroundImage = "url(play.png)"), o && utils.callURL(o.videopause)
        }), t.soundonmouseover === !0 && (window.onmouseover = function () {
            utils.overrideSound || (utils.videoelement.muted = !1, utils.controls.sound.style.backgroundImage = "url(unmuted.png)")
        }, window.onmouseout = function () {
            utils.overrideSound || (utils.videoelement.muted = !0, utils.controls.sound.style.backgroundImage = "url(muted.png)")
        })
    }
};
