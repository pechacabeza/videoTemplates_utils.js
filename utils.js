//v 3.2 - 25-02-2015
// eduardo@weborma.com
/*

methods:
EVERY METHOD IS CALLED Statically from within every layer or DOM object (outside the iframe) with the singleton utils.
Like this: utils.theMethod()

SOME METHODS:
==============================
getVars(type) = get search params from the URL of the iframe of the HTML5 layer. Usefull when you setup the params from the setupscript. Example utils.getVars("search")
==============================
allLoaded(fn, n) = checks if all layers are loaded. Each layer after load ("creationComplete on Edge") must run the utils.preloaded() function.

Example: 

layer 1 -> utils.preloaded()
layer 2 -> utils.preloaded()
on layer 3 utils.preloaded() and utils.allLoaded(theFunctiontoRun(), numberoflayer); utils.allLoaded(function(){//dosomthing}, 3);
==============================
getFlashVersion() -> needs swfobject on the load scripts,
==============================
hasLocalStorage(key);
return if the key exists and the respective value.
Example: utils.hasLocalStorage("key")

==============================
loadJSON() Load a JSON object and associate this to utils.data to be a static value.
Example:
utils.loadJSON("filename without extension", function (){//after loading do something});
==============================

call utils.videoelement in case of a video format to have explictily the video element on your hand. 
Events like timeupdate, canplay etc tec where inserted on this video player.
This video player can dispatch events as demand.


*/
var utils = {
    timer: null,
    layersloaded: 0,
    layerstoload: 0,
    overridePlay: false,
    overrideSound: false,
    randomValue: Math.round(Math.random() * 100000000),
    macro: null,
    scroll: {
        oldValue: 0,
        newValue: 0,
        alreadyPlayOnScroll: false
    },
    videoevents: {
        firstquartile: false,
        secondquartile: false,
        thirdquartile: false,
        fourthquartile: false
    },
    controls: {
        play: null,
        sound: null
    },
    videoelement: null,
    videofilename: "",
    videostarted: false,
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
    preloaded: function() {
        screenad.executeScript("if(!window.webolayers){window.webolayers=1}else{window.webolayers+=1}");
    },

    getVars: function(type) {
        var url;
        if (!type) {
            url = window.location.search;
        } else {
            url = window.location[type];
        }
        var values = {};
        var vars = (url.substring(1, url.length)).split("&");
        for (var i = 0; i < vars.length; i++) {
            var tmp = vars[i].split("=");
            values[tmp[0]] = unescape(decodeURI(tmp[1]));
        }
        return values;
    },

    getloadedtotal: function() {
        var total = 0;
        screenad.executeScript("window.webolayers", function(val) {
            if (val) {
                utils.layersloaded = val;
                return val;
            } else {
                return null;
            }
        });

    },
    allLoaded: function(fn, total) {
        utils.layerstoload = total;
        utils.timer = setInterval(function() {
            utils.getloadedtotal();
            if (utils.layersloaded == utils.layerstoload) {
                clearInterval(utils.timer);
                utils.timer = null;
                fn();
            }

        }, 250);
    },
    getBrowser: function() {
        'use strict';
        var _browser;

        var msie = screenad.browser.browser.msie;
        var gecko = screenad.browser.browser.gecko;
        var webkit = screenad.browser.browser.webkit;

        if (msie) {
            _browser = "msie";
        }
        if (gecko) {
            _browser = "gecko";
        }
        if (webkit) {
            _browser = "webkit";
        }

        return _browser;
    },

    getBrowserVersion: function() {
        var ver = screenad.browser.browser.version;
        return ver;
    },

    getOS: function() {
        var OS = "unknown";
        if (screenad.browser.os.ios) OS = "iOS";
        if (screenad.browser.os.android) OS = "Android";
        if (screenad.browser.os.msie) OS = "Windows";
        if (screenad.browser.os.gecko) OS = "Windows";
        if (screenad.browser.os.chrome && !screenad.browser.os.ios && screenad.browser.os.android) OS = "Windows";
        if (screenad.browser.os.webkit && !screenad.browser.os.ios && screenad.browser.os.android) OS = "Apple";
        return OS;

    },
    getDevice: function() {
        var device = "unknown";
        if (screenad.browser.os.ios) {
            if (screenad.browser.os.iphone) device = "iphone";
            if (screenad.browser.os.ipad) device = "ipad";
        } else {
            device = "notIOS";
        }
        return device;
    },

    getFlashVersion: function() {
        var _flashPlayerVersion;
        if (swfobject === undefined || swfobject === null) {
            alert("no swfobject");
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');

            script.type = 'text/javascript';
            script.onreadystatechange = function() {
                if (this.readyState == 'complete')
                    _flashPlayerVersion = swfobject.getFlashPlayerVersion();
            };
            script.src = 'swfobject.js';
            head.appendChild(script);
        } else {

            _flashPlayerVersion = swfobject.getFlashPlayerVersion();
            return _flashPlayerVersion.major;
        }
    },

    hasLocalStorage: function(key, value) {
        var testkey, testvalue;
        if (key && value) {
            testkey = key;
            testvalue = value;
        } else {
            testkey = "webo";
            testvalue = "test";
        }

        try {
            window.localStorage.setItem(testkey, testvalue);
            window.localStorage.removeItem(testkey);
            screenad.event("ls_true");
            return true;
        } catch (e) {
            screenad.event("ls_false");
            return false;
        }
    },

    getKeyValueLocalStorage: function(key) {
        var value = window.localStorage.getItem(key);
        return value;
    },

    setKeyValueLocalStorage: function(key, value) {
        window.localStorage.setItem(key, value);
    },

    insertDivAt: function(_targetid, _placementoptions) {
        if (_placementoptions === undefined) {
            alert("placement options not defined");
            _placementoptions = {
                id: "webo_id",
                css: "width:1px;height:1px;",
                html: "Weborama HTML"
            };

        }

        var exec = "document.getElementById('" + _targetid + "').insertAdjacentHTML('beforeend',\"<div id='" + _placementoptions.id + "' style='" + _placementoptions.css + "'>" + _placementoptions.html + "</div>\")";
        screenad.executeScript(exec);

    },


    getChildrensLengthOf: function(_obj, _tag, _fn) {
        var _val;

        switch (_obj.substring(0, 1)) {
            case "#":
                _obj = _obj.substring(1, _obj.length);
                _val = 'document.getElementById("' + _obj + '").children.length';
                break;
            case ".":
                _obj = _obj.substring(1, _obj.length);
                _val = 'document.getElementsByClassName("' + _obj + '")[0].children.length';
                break;
            default:
                _obj = _obj.substring(0, _obj.length);
                _val = 'document.getElementsByTagsName("' + _obj + '")[0].children.length';
        }
        screenad.executeScript(_val, function(response) {
            if (response != 'null') {
                screenad.executeScript(_val, function(response) {
                    _fn(response)
                });
            } else {
                alert("OBJECT " + _obj + " NOT FOUND.")
            }
        })
    },

    addIdToChildrensByTagName: function(_obj, _tag, _index, _newid, _percentage, _type) {

        var _val;
        if (_percentage) {


            switch (_percentage) {
                case "0":
                    _index = Math.ceil(utils.childrenslength / 2);
                    break;
                case "25":
                    _index = Math.ceil(utils.childrenslength / 4);
                    break;
                case "50":
                    _index = Math.ceil(utils.childrenslength / 2);
                    break;
                case "75":
                    _index = Math.ceil((utils.childrenslength / 2) + (utils.childrenslength / 4));
                    break;
                case "100":
                    _index = Math.ceil(utils.childrenslength);
                    break;
                default:
                    _index = Math.ceil(utils.childrenslength / 2);
            }

        }



        var exec;

        if (_index) {
            if (_type === "id") {

                _val = _obj.substring(0, _obj.length);
                exec = "document.getElementById('" + _val + "').getElementsByTagName('" + _tag + "')[" + _index + "].insertAdjacentHTML('afterend',\"<div id='" + _newid + "'></div>\")";

                screenad.executeScript(exec);

            } else if (_type === "class") {
                _val = _obj.substring(0, _obj.length);
                exec = "document.getElementsByClassName('" + _val + "')[0].getElementsByTagName('" + _tag + "')[" + _index + "].insertAdjacentHTML('afterend',\"<div id='" + _newid + "'></div>\")";

                screenad.executeScript(exec);

            } else if (_type === "body") {
                exec = "document." + _obj + ".getElementsByTagName('" + _tag + "')[" + _index + "].insertAdjacentHTML('afterend',\"<div id='" + _newid + "'></div>\")";
                screenad.executeScript(exec);

            } else if (_type === "tag") {

                exec = "document.getElementsByTagName('" + _tag + "')[" + _index + "].insertAdjacentHTML('afterend',\"<div id='" + _newid + "'></div>\")";
                screenad.executeScript(exec);

            }
        }

    },

    loadScript: function(url) {

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url
        //console.log(script.src)
        document.head.appendChild(script);

    },
    loadJSON: function(file, oncomplete) {
        var data;

        var req = new XMLHttpRequest();
        req.open('GET', file + ".json", true);
        req.onload = function(e) {

            data = JSON.parse(req.responseText);
            oncomplete(data);

        }
        req.onreadystatechange = function(e) {
            if (req.readyState === 4) {
                if (req.status === 200) {} else {
                    alert("jloaderror");
                }
            }
        }
        req.send(null);
    },

    animate: function(_o, _weboramacontainer, _c, _v, _d, _f) {

        //  console.log(_c)
        /*   if ($ !== undefined) {
            $(_o).animate({
                _c: _v
            }, {
                duration: parseInt(_d, 10),
                step: function(now, fx) {
                    if (_weboramacontainer) {
                        console.log(now)
                        utils.push(_weboramacontainer, _c, Math.round(now));
                    }
                },
                complete: _f
            })
        }*/
        var container = utils.removeSelector(_o);
        TweenLite.to(container, _d, {
            'height': _v + 'px',
            onUpdate: function() {
                if (_weboramacontainer) {
                    utils.push(_weboramacontainer, _c, container.style[_c]);
                }
            },
            onComplete: function() {
                if (_f) {
                    _f();
                }
            }
        });
    },
    removeSelector: function(selector) {
        var _val, elem;
        if (selector[0] === "#") {
            _val = selector.substring(1, selector.length);
            elem = document.getElementById(_val);

        } else if (selector[0] === ".") {
            _val = selector.substring(1, selector.length);
            elem = document.getElementsByClass(_val)[0];
        }
        return elem;
    },

    push: function(_o, _c, _v) {
        //console.log(_v)
        var _val;
        var executeString;
        if (_o[0] === "#") {
            _val = _o.substring(1, _o.length);
            executeString = "document.getElementById('" + _val + "').style." + _c + " = '" + _v + "';";

        } else if (_o[0] === ".") {
            _val = _o.substring(1, _o.length);
            executeString = "document.getElementsByClass('" + _val + "')[0].style." + _c + " = '" + _v + "';";
        } else {
            executeString = "document." + _o + ".style." + _c + " = '" + _v + "';";
        }
        // console.log(executeString)
        screenad.executeScript(executeString);
    },

    didScrollChange: function() {

        screenad.executeScript('window.pageYOffset', function(val) {
            //     console.log(val);
            utils.scroll.newValue = val;
        });
        if (utils.scroll.newValue != utils.scroll.oldValue) {
            utils.scroll.oldValue = utils.scroll.newValue;
            return true;
        } else {
            return false;
        }

    },

    togglePlay: function(from) {
        //  console.log('play', from)
        if (utils.videoelement.paused) {
            if (screenad.hasVisibility) {

                if (from == "click") {
                    try {
                        document.getElementById('videoposter').style.display = "none";
                    } catch (e) {}
                }

                if (from == "scroll") {
                    if (!utils.videostarted) {
                        utils.videostarted = true;
                        utils.videoelement.play();
                    } else {
                        //      console.log("do nothing")
                    }
                } else {
                    utils.videoelement.play();
                    utils.controls.play.style.backgroundImage = "url(pause.png)";
                }

            }
        } else {
            utils.videoelement.pause();
            utils.controls.play.style.backgroundImage = "url(play.png)";
        }
    },

    callURL: function(url, macro) {
        if (url !== null) {
            if (!macro && !utils.macro) {
                alert("NO MACRO's defined!");
            }
            if (macro) {
                url = url.replace(macro, utils.randomValue.toString());
            }
            if (url.indexOf(utils.macro) > 1) {
                url = url.replace(utils.macro, utils.randomValue.toString());
            }
            var pixel = new Image();
            pixel.src = url;
        }
    },

    toggleSound: function() {
        utils.overrideSound = true;
        // console.log(utils.videoelement.muted)
        if (utils.videoelement.muted) {
            utils.videoelement.muted = false;
            utils.controls.sound.style.backgroundImage = "url(unmuted.png)";
        } else {
            utils.videoelement.muted = true;
            utils.controls.sound.style.backgroundImage = "url(muted.png)";
        }
    },

    insertVideoAt: function(_target, _options, _oncomplete, _trackers) {
        // console.log("insert video")
        utils.videofilename = _options.file;
        var _controls = true;

        if (screenad.browser.os.android) {
            document.getElementById('videoposter').style.display = "block";
        }

        screenad.event(screenad.deviceType);

        if (!_target) {
            console.log("target of video is undefined");
        }

        if (!_options) {
            console.log("options of video is undefined");
        } else {
            if (!_options.width) _options.width = 600;
            if (!_options.height) _options.height = 400;
            if (!_options.controls) {
                _options.controls = false;
                _controls = false;
            }
            if (_options.controls === "custom") {
                _options.controls = false;
                _controls = "custom";
            }
            if (!_options.loop) _options.loop = false;
            if (!_options.sound) _options.sound = false;
            if (!_options.file) _options.file = "video";
            if (!_options.autoplay) _options.autoplay = false;
            if (!_options.soundonmouseover) _options.soundonmouseover = false;
            if (!_options.videoposter) _options.videoposter = "video_poster.jpg";
        }

        if (screenad.vars.videofile) {
            _options.file = screenad.vars.videofile;
        }

        if (!_oncomplete) {
            console.log("oncomplete of video is undefined");
        }




        var settings = {
            width: _options.width,
            height: _options.height,
            prependTo: document.getElementById(_target),
            controls: _options.controls,
            poster: _options.videoposter,
            loop: _options.loop,
            autoplay: _options.autoplay,
            muted: !_options.sound,
            videoFiles: [{
                'src': _options.file + '.webm',
                'type': 'video/webm'
            }, {
                'src': _options.file + '.ogv',
                'type': 'video/ogg'
            }, {
                'src': _options.file + '.mp4',
                'type': 'video/mp4'
            }]
        };


        // console.log(_options.controls)


        var myVideo = new screenad.lib.Video(settings);
        utils.videoelement = myVideo.getVideoElement();
        utils.videoelement.style.cursor = "pointer";
        utils.videoelement.style.position = "absolute";
        utils.videoelement.style.zIndex = "1000000";
        if (screenad.deviceType == screenad.DEVICE_TABLET || screenad.deviceType == screenad.DEVICE_MOBILE) {
            if (screenad.isIOS) {
                if (!utils.videostarted) {
                    screenad.executeScript('q1bq.getAttribute("id")', function(v) {
                        screenad.executeScript('window.ontouchend=function(e){document.getElementById("' + v.replace('DIV', '').toString() + '").contentWindow.utils.togglePlay("scroll")}');
                    });
                }
            }
        }

        if (_controls === "custom") {

            utils.controls.sound = document.getElementById('soundbutton');
            utils.controls.play = document.getElementById('playbutton');

            utils.controls.play.style.backgroundImage = "url(pause.png)";
            utils.controls.play.style.backgroundPosition = "center center";
            utils.controls.sound.style.backgroundPosition = "center center";
            utils.controls.sound.style.backgroundSize = "contain";
            utils.controls.play.style.backgroundSize = "contain";
            utils.controls.sound.addEventListener("click", function(event) {
                utils.toggleSound();
            });
            utils.controls.play.addEventListener("click", function(event) {
                utils.togglePlay();
            });

            utils.videoelement.addEventListener("click", function() {
                screenad.click("default");
            })
            //  document.getElementById('controls').style.display = "none"
        } else {
            document.getElementById('controls').style.display = "none";
        }


        if (utils.controls.sound) {
            if (_options.sound) {
                utils.controls.sound.style.backgroundImage = "url('unmuted.png')";
            } else {
                utils.controls.sound.style.backgroundImage = "url('muted.png')";
            }
        };


        utils.videoelement.addEventListener("ended", function(e) {
            if (!utils.videoevents.fourthquartile) {
                utils.videoevents.fourthquartile = true;
                //      screenad.event("progress_100_" + utils.videofilename);
            }

            //screenad.event('end_video_on_' + utils.videofilename);
            screenad.event("video_end");
            if (_trackers) {
                utils.callURL(_trackers.videoend);
            }
            if (_oncomplete) {
                _oncomplete();
            }

        });
        utils.videoelement.addEventListener("canplay", function(e) {
            // console.log(e.target.videoduration, "video duration")
        });
        if (!_options.loop) {
            utils.videoelement.addEventListener("timeupdate", function(e) {
                // console.log(utils.videoevents)
                if (playbutton) {
                    playbutton.style.backgroundPosition = "left top";
                }
                //     console.log(utils.videoevents.firstquartile, utils.videoelement.duration)
                if (Math.round(utils.videoelement.duration)) {

                    if (utils.videoelement.currentTime >= utils.videoelement.duration / 4) {
                        if (!utils.videoevents.firstquartile) {
                            utils.videoevents.firstquartile = true;
                            if (_trackers) {
                                utils.callURL(_trackers.firstquartile);
                            }
                            //  screenad.event("progress_25_" + utils.videofilename);

                        }
                    }
                    if (utils.videoelement.currentTime >= utils.videoelement.duration / 2) {

                        if (!utils.videoevents.secondquartile) {
                            utils.videoevents.secondquartile = true;
                            if (_trackers) {
                                utils.callURL(_trackers.secondquartile);
                            }
                            //   screenad.event("progress_50_" + utils.videofilename);
                        }
                    }

                    if (utils.videoelement.currentTime >= (utils.videoelement.duration / 4) + (utils.videoelement.duration / 2)) {

                        if (!utils.videoevents.thirdquartile) {
                            utils.videoevents.thirdquartile = true;
                            if (_trackers) {
                                utils.callURL(_trackers.thirdquartile);
                            }
                            //    screenad.event("progress_75_" + utils.videofilename);
                        }
                    }
                }
            });
        }
        utils.videoelement.addEventListener("volumechange", function(e) {
            if (e.target.muted) {
                if (_trackers) {
                    utils.callURL(_trackers.videomuted);
                }
                screenad.event("mute_on_" + utils.videofilename);
                soundbutton.style.backgroundPosition = "center bottom";
            } else {
                if (_trackers) {

                    utils.callURL(_trackers.videounmuted);
                }
                screenad.event("unmute_on_" + utils.videofilename);
                soundbutton.style.backgroundPosition = "left bottom";
            }
        });

        utils.videoelement.addEventListener("play", function(e) {

            if (!utils.videostarted) {
                //   screenad.event("startvideo_on_" + utils.videofilename);
                screenad.event("video_start");
                if (_trackers) {
                    utils.callURL(_trackers.videostart);
                }
            }

            utils.videostarted = true;
            // screenad.event('play_on_' + utils.videofilename);
            //this line is comented to fix the Video events are being sent twice! screenad.event("video_play");
            if (_trackers) {
                utils.callURL(_trackers.videoplay);
            }
            if (utils.controls.play) {
                utils.controls.play.style.backgroundImage = "url(pause.png)";
            }
        });

        utils.videoelement.addEventListener("pause", function() {
            //    screenad.event('pause_on_' + utils.videofilename);
            if (utils.controls.play) {
                utils.controls.play.style.backgroundImage = "url(play.png)";
            }
            //this line is comented to fix the Video events are being sent twice! screenad.event("video_pause");
            if (_trackers) {
                utils.callURL(_trackers.videopause);
            }

        });
        if (_options.soundonmouseover === true) {
            window.onmouseover = function() {
                if (!utils.overrideSound) {
                    utils.videoelement.muted = false;
                    utils.controls.sound.style.backgroundImage = "url(unmuted.png)";
                }
            };
            window.onmouseout = function() {
                if (!utils.overrideSound) {
                    utils.videoelement.muted = true;
                    utils.controls.sound.style.backgroundImage = "url(muted.png)";
                }
            };
        };
    }
};