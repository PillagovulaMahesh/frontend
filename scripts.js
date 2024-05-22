var sbi_js_exists = void 0 !== sbi_js_exists;
sbi_js_exists || (!function(e) {
    function i() {
        this.feeds = {},
        this.options = sb_instagram_js_options
    }
    function s(e, i, s) {
        this.el = e,
        this.index = i,
        this.settings = s,
        this.minImageWidth = 0,
        this.imageResolution = 150,
        this.resizedImages = {},
        this.needsResizing = [],
        this.outOfPages = !1,
        this.page = 1,
        this.isInitialized = !1
    }
    function t(i, s) {
        e.ajax({
            url: sbiajaxurl,
            type: "post",
            data: i,
            success: s
        })
    }
    i.prototype = {
        createPage: function(i, s) {
            void 0 !== sb_instagram_js_options.ajax_url && void 0 === window.sbiajaxurl && (window.sbiajaxurl = sb_instagram_js_options.ajax_url),
            (void 0 === window.sbiajaxurl || -1 === window.sbiajaxurl.indexOf(window.location.hostname)) && (window.sbiajaxurl = location.protocol + "//" + window.location.hostname + "/wp-admin/admin-ajax.php"),
            e("#sbi-builder-app").length && void 0 === window.sbiresizedImages && e(".sbi_resized_image_data").length && void 0 !== e(".sbi_resized_image_data").attr("data-resized") && 0 === e(".sbi_resized_image_data").attr("data-resized").indexOf('{"') && (window.sbiresizedImages = JSON.parse(e(".sbi_resized_image_data").attr("data-resized")),
            e(".sbi_resized_image_data").remove()),
            e(".sbi_no_js_error_message").remove(),
            e(".sbi_no_js").removeClass("sbi_no_js"),
            i(s)
        },
        createFeeds: function(i) {
            i.whenFeedsCreated(e(".sbi").each(function(i) {
                e(this).attr("data-sbi-index", i + 1);
                var a = e(this)
                  , n = void 0 !== a.attr("data-sbi-flags") ? a.attr("data-sbi-flags").split(",") : []
                  , o = void 0 !== a.attr("data-options") ? JSON.parse(a.attr("data-options")) : {};
                n.indexOf("testAjax") > -1 && (window.sbi.triggeredTest = !0,
                t({
                    action: "sbi_on_ajax_test_trigger"
                }, function(e) {
                    console.log("did test")
                }));
                var r, d, l, c = {
                    cols: a.attr("data-cols"),
                    colsmobile: void 0 !== a.attr("data-colsmobile") && "same" !== a.attr("data-colsmobile") ? a.attr("data-colsmobile") : a.attr("data-cols"),
                    colstablet: void 0 !== a.attr("data-colstablet") && "same" !== a.attr("data-colstablet") ? a.attr("data-colstablet") : a.attr("data-cols"),
                    num: a.attr("data-num"),
                    imgRes: a.attr("data-res"),
                    feedID: a.attr("data-feedid"),
                    postID: void 0 !== a.attr("data-postid") ? a.attr("data-postid") : "unknown",
                    shortCodeAtts: a.attr("data-shortcode-atts"),
                    resizingEnabled: -1 === n.indexOf("resizeDisable"),
                    imageLoadEnabled: -1 === n.indexOf("imageLoadDisable"),
                    debugEnabled: n.indexOf("debug") > -1,
                    favorLocal: n.indexOf("favorLocal") > -1,
                    ajaxPostLoad: n.indexOf("ajaxPostLoad") > -1,
                    gdpr: n.indexOf("gdpr") > -1,
                    overrideBlockCDN: n.indexOf("overrideBlockCDN") > -1,
                    consentGiven: !1,
                    locator: n.indexOf("locator") > -1,
                    autoMinRes: 1,
                    general: o
                };
                window.sbi.feeds[i] = (r = this,
                d = i,
                l = c,
                new s(r,d,l)),
                window.sbi.feeds[i].setResizedImages(),
                window.sbi.feeds[i].init();
                var h = jQuery.Event("sbiafterfeedcreate");
                h.feed = window.sbi.feeds[i],
                jQuery(window).trigger(h)
            }))
        },
        afterFeedsCreated: function() {
            e(".sb_instagram_header").each(function() {
                var i = e(this);
                i.find(".sbi_header_link").on("mouseenter mouseleave", function(e) {
                    switch (e.type) {
                    case "mouseenter":
                        i.find(".sbi_header_img_hover").addClass("sbi_fade_in");
                        break;
                    case "mouseleave":
                        i.find(".sbi_header_img_hover").removeClass("sbi_fade_in")
                    }
                })
            })
        },
        encodeHTML: function(e) {
            if (void 0 === e)
                return "";
            var i = e.replace(/(>)/g, "&gt;")
              , i = i.replace(/(<)/g, "&lt;");
            return (i = i.replace(/(&lt;br\/&gt;)/g, "<br>")).replace(/(&lt;br&gt;)/g, "<br>")
        },
        urlDetect: function(e) {
            return e.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
        }
    },
    s.prototype = {
        init: function() {
            var i, s = this;
            s.settings.consentGiven = s.checkConsent(),
            e(this.el).find(".sbi_photo").parent("p").length && e(this.el).addClass("sbi_no_autop"),
            e(this.el).find("#sbi_mod_error").length && e(this.el).prepend(e(this.el).find("#sbi_mod_error")),
            this.settings.ajaxPostLoad ? this.getNewPostSet() : this.afterInitialImagesLoaded();
            var t = (i = 0,
            function(e, s) {
                clearTimeout(i),
                i = setTimeout(e, s)
            }
            );
            jQuery(window).on("resize", function() {
                t(function() {
                    s.afterResize()
                }, 500)
            }),
            e(this.el).find(".sbi_item").each(function() {
                s.lazyLoadCheck(e(this))
            })
        },
        initLayout: function() {},
        afterInitialImagesLoaded: function() {
            this.initLayout(),
            this.loadMoreButtonInit(),
            this.hideExtraImagesForWidth(),
            this.beforeNewImagesRevealed(),
            this.revealNewImages(),
            this.afterNewImagesRevealed()
        },
        afterResize: function() {
            this.setImageHeight(),
            this.setImageResolution(),
            this.maybeRaiseImageResolution(),
            this.setImageSizeClass()
        },
        afterLoadMoreClicked: function(e) {
            e.find(".sbi_loader").removeClass("sbi_hidden"),
            e.find(".sbi_btn_text").addClass("sbi_hidden"),
            e.closest(".sbi").find(".sbi_num_diff_hide").addClass("sbi_transition").removeClass("sbi_num_diff_hide")
        },
        afterNewImagesLoaded: function() {
            var i = e(this.el)
              , s = this;
            this.beforeNewImagesRevealed(),
            this.revealNewImages(),
            this.afterNewImagesRevealed(),
            setTimeout(function() {
                i.find(".sbi_loader").addClass("sbi_hidden"),
                i.find(".sbi_btn_text").removeClass("sbi_hidden"),
                s.maybeRaiseImageResolution()
            }, 500)
        },
        beforeNewImagesRevealed: function() {
            this.setImageHeight(),
            this.maybeRaiseImageResolution(!0),
            this.setImageSizeClass()
        },
        revealNewImages: function() {
            var i = e(this.el);
            i.find(".sbi-screenreader").each(function() {
                e(this).find("img").remove()
            }),
            "function" == typeof sbi_custom_js && setTimeout(function() {
                sbi_custom_js()
            }, 100),
            i.find(".sbi_item").each(function(e) {
                jQuery(this).find(".sbi_photo").on("mouseenter mouseleave", function(e) {
                    switch (e.type) {
                    case "mouseenter":
                        jQuery(this).fadeTo(200, .85);
                        break;
                    case "mouseleave":
                        jQuery(this).stop().fadeTo(500, 1)
                    }
                })
            }),
            setTimeout(function() {
                jQuery("#sbi_images .sbi_item.sbi_new").removeClass("sbi_new");
                var e = 10;
                i.find(".sbi_transition").each(function() {
                    var i = jQuery(this);
                    setTimeout(function() {
                        i.removeClass("sbi_transition")
                    }, e),
                    e += 10
                })
            }, 500)
        },
        lazyLoadCheck: function(i) {
            if (i.find(".sbi_photo").length && !i.closest(".sbi").hasClass("sbi-no-ll-check")) {
                var s = this.getImageUrls(i)
                  , t = void 0 !== s[640] ? s[640] : i.find(".sbi_photo").attr("data-full-res");
                !(!this.settings.consentGiven && t.indexOf("scontent") > -1) && i.find(".sbi_photo img").each(function() {
                    t && void 0 !== e(this).attr("data-src") && e(this).attr("data-src", t),
                    t && void 0 !== e(this).attr("data-orig-src") && e(this).attr("data-orig-src", t),
                    e(this).on("load", function() {
                        !e(this).hasClass("sbi-replaced") && e(this).attr("src").indexOf("placeholder") > -1 && (e(this).addClass("sbi-replaced"),
                        t && (e(this).attr("src", t),
                        e(this).closest(".sbi_imgLiquid_bgSize").length && e(this).closest(".sbi_imgLiquid_bgSize").css("background-image", "url(" + t + ")")))
                    })
                })
            }
        },
        afterNewImagesRevealed: function() {
            this.listenForVisibilityChange(),
            this.sendNeedsResizingToServer(),
            this.settings.imageLoadEnabled || e(".sbi_no_resraise").removeClass("sbi_no_resraise");
            var i = e.Event("sbiafterimagesloaded");
            i.el = e(this.el),
            e(window).trigger(i)
        },
        setResizedImages: function() {
            e(this.el).find(".sbi_resized_image_data").length && void 0 !== e(this.el).find(".sbi_resized_image_data").attr("data-resized") && 0 === e(this.el).find(".sbi_resized_image_data").attr("data-resized").indexOf('{"') ? (this.resizedImages = JSON.parse(e(this.el).find(".sbi_resized_image_data").attr("data-resized")),
            e(this.el).find(".sbi_resized_image_data").remove()) : void 0 !== window.sbiresizedImages && (this.resizedImages = window.sbiresizedImages)
        },
        sendNeedsResizingToServer: function() {
            var i = this
              , s = e(this.el);
            if (i.needsResizing.length > 0 && i.settings.resizingEnabled) {
                var a = e(this.el).find(".sbi_item").length
                  , n = void 0 !== i.settings.general.cache_all && i.settings.general.cache_all
                  , o = "";
                if (void 0 !== s.attr("data-locatornonce") && (o = s.attr("data-locatornonce")),
                e("#sbi-builder-app").length) {
                    if (void 0 !== window.sbiresizeTriggered && window.sbiresizeTriggered)
                        return;
                    window.sbiresizeTriggered = !0
                }
                var r = {
                    action: "sbi_resized_images_submit",
                    needs_resizing: i.needsResizing,
                    offset: a,
                    feed_id: i.settings.feedID,
                    atts: i.settings.shortCodeAtts,
                    location: i.locationGuess(),
                    post_id: i.settings.postID,
                    cache_all: n,
                    locator_nonce: o
                }
                  , d = function(s) {
                    var t = s;
                    for (var a in "object" != typeof s && 0 === s.trim().indexOf("{") && (t = JSON.parse(s.trim())),
                    i.settings.debugEnabled && console.log(t),
                    t)
                        t.hasOwnProperty(a) && (i.resizedImages[a] = t[a]);
                    i.maybeRaiseImageResolution(),
                    setTimeout(function() {
                        i.afterResize()
                    }, 500),
                    e("#sbi-builder-app").length && (window.sbiresizeTriggered = !1)
                };
                t(r, d)
            } else if (i.settings.locator) {
                var o = "";
                void 0 !== s.attr("data-locatornonce") && (o = s.attr("data-locatornonce"));
                var r = {
                    action: "sbi_do_locator",
                    feed_id: i.settings.feedID,
                    atts: i.settings.shortCodeAtts,
                    location: i.locationGuess(),
                    post_id: i.settings.postID,
                    locator_nonce: o
                }
                  , d = function(e) {};
                t(r, d)
            }
        },
        loadMoreButtonInit: function() {
            var i = e(this.el)
              , s = this;
            i.find("#sbi_load .sbi_load_btn").off().on("click", function() {
                s.afterLoadMoreClicked(jQuery(this)),
                s.getNewPostSet()
            })
        },
        getNewPostSet: function() {
            var i = e(this.el)
              , s = this;
            s.page++;
            var a, n = "";
            void 0 !== i.attr("data-locatornonce") && (n = i.attr("data-locatornonce")),
            t({
                action: "sbi_load_more_clicked",
                offset: i.find(".sbi_item").length,
                page: s.page,
                feed_id: s.settings.feedID,
                atts: s.settings.shortCodeAtts,
                location: s.locationGuess(),
                post_id: s.settings.postID,
                current_resolution: s.imageResolution,
                locator_nonce: n
            }, function(t) {
                var a = t;
                "object" != typeof t && 0 === t.trim().indexOf("{") && (a = JSON.parse(t.trim())),
                s.settings.debugEnabled && console.log(a),
                s.appendNewPosts(a.html),
                s.addResizedImages(a.resizedImages),
                s.settings.ajaxPostLoad ? (s.settings.ajaxPostLoad = !1,
                s.afterInitialImagesLoaded()) : s.afterNewImagesLoaded(),
                a.feedStatus.shouldPaginate ? s.outOfPages = !1 : (s.outOfPages = !0,
                i.find(".sbi_load_btn").hide()),
                e(".sbi_no_js").removeClass("sbi_no_js")
            })
        },
        appendNewPosts: function(i) {
            var s = e(this.el);
            s.find("#sbi_images .sbi_item").length ? s.find("#sbi_images .sbi_item").last().after(i) : s.find("#sbi_images").append(i)
        },
        addResizedImages: function(e) {
            for (var i in e)
                this.resizedImages[i] = e[i]
        },
        setImageHeight: function() {
            var i = e(this.el)
              , s = i.find(".sbi_photo").eq(0).innerWidth()
              , t = this.getColumnCount()
              , a = i.find("#sbi_images").innerWidth() - i.find("#sbi_images").width()
              , n = a / 2;
            sbi_photo_width_manual = i.find("#sbi_images").width() / t - a,
            i.find(".sbi_photo").css("height", s),
            i.find(".sbi-owl-nav").length && setTimeout(function() {
                var e = 2;
                i.find(".sbi_owl2row-item").length && (e = 1);
                var s = i.find(".sbi_photo").eq(0).innerWidth() / e;
                s += parseInt(n) * (2 + (2 - e)),
                i.find(".sbi-owl-nav div").css("top", s)
            }, 100)
        },
        maybeRaiseSingleImageResolution: function(i, s, t) {
            var a = this
              , n = a.getImageUrls(i)
              , o = i.find(".sbi_photo img").attr("src")
              , r = 150
              , d = i.find("img").get(0)
              , l = o === window.sbi.options.placeholder ? 1 : d.naturalWidth / d.naturalHeight
              , t = void 0 !== t && t;
            if (!(i.hasClass("sbi_no_resraise") || i.hasClass("sbi_had_error") || i.find(".sbi_link_area").length && i.find(".sbi_link_area").hasClass("sbi_had_error"))) {
                if (n.length < 1) {
                    i.find(".sbi_link_area").length && i.find(".sbi_link_area").attr("href", window.sbi.options.placeholder.replace("placeholder.png", "thumb-placeholder.png"));
                    return
                }
                (i.find(".sbi_link_area").length && i.find(".sbi_link_area").attr("href") === window.sbi.options.placeholder.replace("placeholder.png", "thumb-placeholder.png") || !a.settings.consentGiven) && i.find(".sbi_link_area").attr("href", n[n.length - 1]),
                void 0 !== n[640] && i.find(".sbi_photo").attr("data-full-res", n[640]),
                e.each(n, function(e, i) {
                    i === o && (r = parseInt(e),
                    t = !1)
                });
                var c = 640;
                switch (a.settings.imgRes) {
                case "thumb":
                    c = 150;
                    break;
                case "medium":
                    c = 320;
                    break;
                case "full":
                    c = 640;
                    break;
                default:
                    var h = Math.max(a.settings.autoMinRes, i.find(".sbi_photo").innerWidth())
                      , g = a.getBestResolutionForAuto(h, l, i);
                    switch (g) {
                    case 320:
                        c = 320;
                        break;
                    case 150:
                        c = 150
                    }
                }
                if (c > r || o === window.sbi.options.placeholder || t) {
                    if (a.settings.debugEnabled) {
                        var f = o === window.sbi.options.placeholder ? "was placeholder" : "too small";
                        console.log("rais res for " + o, f)
                    }
                    var b = n[c].split("?ig_cache_key")[0];
                    if (o !== b && i.find(".sbi_photo img").attr("src", b),
                    r = c,
                    "auto" === a.settings.imgRes) {
                        var u = !1;
                        i.find(".sbi_photo img").on("load", function() {
                            var s = e(this)
                              , t = s.get(0).naturalWidth / s.get(0).naturalHeight;
                            if (1e3 !== s.get(0).naturalWidth && t > l && !u) {
                                switch (a.settings.debugEnabled && console.log("rais res again for aspect ratio change " + o),
                                u = !0,
                                h = i.find(".sbi_photo").innerWidth(),
                                g = a.getBestResolutionForAuto(h, t, i),
                                c = 640,
                                g) {
                                case 320:
                                    c = 320;
                                    break;
                                case 150:
                                    c = 150
                                }
                                c > r && (b = n[c].split("?ig_cache_key")[0],
                                s.attr("src", b)),
                                ("masonry" === a.layout || "highlight" === a.layout) && (e(a.el).find("#sbi_images").smashotope(a.isotopeArgs),
                                setTimeout(function() {
                                    e(a.el).find("#sbi_images").smashotope(a.isotopeArgs)
                                }, 500))
                            } else if (a.settings.debugEnabled) {
                                var d = u ? "already checked" : "no aspect ratio change";
                                console.log("not raising res for replacement  " + o, d)
                            }
                        })
                    }
                }
                i.find("img").on("error", function() {
                    if (e(this).hasClass("sbi_img_error"))
                        console.log("unfixed error " + e(this).attr("src"));
                    else {
                        if (e(this).addClass("sbi_img_error"),
                        !(e(this).attr("src").indexOf("media/?size=") > -1 || e(this).attr("src").indexOf("cdninstagram") > -1 || e(this).attr("src").indexOf("fbcdn") > -1) && a.settings.consentGiven) {
                            if ("undefined" !== e(this).closest(".sbi_photo").attr("data-img-src-set")) {
                                var i = JSON.parse(e(this).closest(".sbi_photo").attr("data-img-src-set").replace(/\\\//g, "/"));
                                void 0 !== i.d && (e(this).attr("src", i.d),
                                e(this).closest(".sbi_item").addClass("sbi_had_error").find(".sbi_link_area").attr("href", i[640]).addClass("sbi_had_error"))
                            }
                        } else {
                            a.settings.favorLocal = !0;
                            var i = a.getImageUrls(e(this).closest(".sbi_item"));
                            void 0 !== i[640] && (e(this).attr("src", i[640]),
                            e(this).closest(".sbi_item").addClass("sbi_had_error").find(".sbi_link_area").attr("href", i[640]).addClass("sbi_had_error"))
                        }
                        setTimeout(function() {
                            a.afterResize()
                        }, 1500)
                    }
                })
            }
        },
        maybeRaiseImageResolution: function(i) {
            var s = this
              , t = !s.isInitialized;
            e(s.el).find(void 0 !== i && !0 === i ? ".sbi_item.sbi_new" : ".sbi_item").each(function(i) {
                !e(this).hasClass("sbi_num_diff_hide") && e(this).find(".sbi_photo").length && void 0 !== e(this).find(".sbi_photo").attr("data-img-src-set") && s.maybeRaiseSingleImageResolution(e(this), i, t)
            }),
            s.isInitialized = !0
        },
        getBestResolutionForAuto: function(i, s, t) {
            (isNaN(s) || s < 1) && (s = 1);
            var a = 10 * Math.ceil(i * s / 10)
              , n = [150, 320, 640];
            if (t.hasClass("sbi_highlighted") && (a *= 2),
            -1 === n.indexOf(parseInt(a))) {
                var o = !1;
                e.each(n, function(e, i) {
                    i > parseInt(a) && !o && (a = i,
                    o = !0)
                })
            }
            return a
        },
        hideExtraImagesForWidth: function() {
            if ("carousel" !== this.layout) {
                var i = e(this.el)
                  , s = void 0 !== i.attr("data-num") && "" !== i.attr("data-num") ? parseInt(i.attr("data-num")) : 1
                  , t = void 0 !== i.attr("data-nummobile") && "" !== i.attr("data-nummobile") ? parseInt(i.attr("data-nummobile")) : s;
                480 > e(window).width() || "mobile" === window.sbi_preview_device ? t < i.find(".sbi_item").length && i.find(".sbi_item").slice(t - i.find(".sbi_item").length).addClass("sbi_num_diff_hide") : s < i.find(".sbi_item").length && i.find(".sbi_item").slice(s - i.find(".sbi_item").length).addClass("sbi_num_diff_hide")
            }
        },
        setImageSizeClass: function() {
            var i = e(this.el);
            i.removeClass("sbi_small sbi_medium");
            var s = i.innerWidth()
              , t = parseInt(i.find("#sbi_images").outerWidth() - i.find("#sbi_images").width()) / 2
              , a = this.getColumnCount()
              , n = (s - t * (a + 2)) / a;
            n > 120 && n < 240 ? i.addClass("sbi_medium") : n <= 120 && i.addClass("sbi_small")
        },
        setMinImageWidth: function() {
            e(this.el).find(".sbi_item .sbi_photo").first().length ? this.minImageWidth = e(this.el).find(".sbi_item .sbi_photo").first().innerWidth() : this.minImageWidth = 150
        },
        setImageResolution: function() {
            if ("auto" === this.settings.imgRes)
                this.imageResolution = "auto";
            else
                switch (this.settings.imgRes) {
                case "thumb":
                    this.imageResolution = 150;
                    break;
                case "medium":
                    this.imageResolution = 320;
                    break;
                default:
                    this.imageResolution = 640
                }
        },
        getImageUrls: function(e) {
            var i = JSON.parse(e.find(".sbi_photo").attr("data-img-src-set").replace(/\\\//g, "/"))
              , s = e.attr("id").replace("sbi_", "");
            if (this.settings.consentGiven || this.settings.overrideBlockCDN || (i = []),
            void 0 !== this.resizedImages[s] && "video" !== this.resizedImages[s] && "pending" !== this.resizedImages[s] && "error" !== this.resizedImages[s].id && "video" !== this.resizedImages[s].id && "pending" !== this.resizedImages[s].id) {
                if (void 0 !== this.resizedImages[s].sizes) {
                    var t = [];
                    void 0 !== this.resizedImages[s].sizes.full && (i[640] = sb_instagram_js_options.resized_url + this.resizedImages[s].id + "full.jpg",
                    t.push(640)),
                    void 0 !== this.resizedImages[s].sizes.low && (i[320] = sb_instagram_js_options.resized_url + this.resizedImages[s].id + "low.jpg",
                    t.push(320)),
                    void 0 !== this.resizedImages[s].sizes.thumb && (t.push(150),
                    i[150] = sb_instagram_js_options.resized_url + this.resizedImages[s].id + "thumb.jpg"),
                    this.settings.favorLocal && (-1 === t.indexOf(640) && t.indexOf(320) > -1 && (i[640] = sb_instagram_js_options.resized_url + this.resizedImages[s].id + "low.jpg"),
                    -1 === t.indexOf(320) && (t.indexOf(640) > -1 ? i[320] = sb_instagram_js_options.resized_url + this.resizedImages[s].id + "full.jpg" : t.indexOf(150) > -1 && (i[320] = sb_instagram_js_options.resized_url + this.resizedImages[s].id + "thumb.jpg")),
                    -1 === t.indexOf(150) && (t.indexOf(320) > -1 ? i[150] = sb_instagram_js_options.resized_url + this.resizedImages[s].id + "low.jpg" : t.indexOf(640) > -1 && (i[150] = sb_instagram_js_options.resized_url + this.resizedImages[s].id + "full.jpg")))
                }
            } else
                (void 0 === this.resizedImages[s] || void 0 !== this.resizedImages[s].id && "pending" !== this.resizedImages[s].id && "error" !== this.resizedImages[s].id) && this.addToNeedsResizing(s);
            return i
        },
        getAvatarUrl: function(e, i) {
            if ("" === e)
                return "";
            var s = this.settings.general.avatars
              , i = void 0 !== i ? i : "local";
            return "local" === i ? void 0 !== s["LCL" + e] && 1 === parseInt(s["LCL" + e]) ? sb_instagram_js_options.resized_url + e + ".jpg" : void 0 !== s[e] ? s[e] : "" : void 0 !== s[e] ? s[e] : void 0 !== s["LCL" + e] && 1 === parseInt(s["LCL" + e]) ? sb_instagram_js_options.resized_url + e + ".jpg" : ""
        },
        addToNeedsResizing: function(e) {
            -1 === this.needsResizing.indexOf(e) && this.needsResizing.push(e)
        },
        listenForVisibilityChange: function() {
            var i, s, t, a = this;
            i = jQuery,
            s = {
                callback: function() {},
                runOnLoad: !0,
                frequency: 100,
                sbiPreviousVisibility: null
            },
            (t = {}).sbiCheckVisibility = function(e, i) {
                if (jQuery.contains(document, e[0])) {
                    var s = i.sbiPreviousVisibility
                      , a = e.is(":visible");
                    i.sbiPreviousVisibility = a,
                    null == s ? i.runOnLoad && i.callback(e, a) : s !== a && i.callback(e, a),
                    setTimeout(function() {
                        t.sbiCheckVisibility(e, i)
                    }, i.frequency)
                }
            }
            ,
            i.fn.sbiVisibilityChanged = function(e) {
                var a = i.extend({}, s, e);
                return this.each(function() {
                    t.sbiCheckVisibility(i(this), a)
                })
            }
            ,
            "function" == typeof e(this.el).filter(":hidden").sbiVisibilityChanged && e(this.el).filter(":hidden").sbiVisibilityChanged({
                callback: function(e, i) {
                    a.afterResize()
                },
                runOnLoad: !1
            })
        },
        getColumnCount: function() {
            var i = e(this.el)
              , s = this.settings.cols
              , t = this.settings.colsmobile
              , a = this.settings.colstablet
              , n = s;
            return sbiWindowWidth = window.innerWidth,
            i.hasClass("sbi_mob_col_auto") ? (sbiWindowWidth < 640 && parseInt(s) > 2 && 7 > parseInt(s) && (n = 2),
            sbiWindowWidth < 640 && parseInt(s) > 6 && 11 > parseInt(s) && (n = 4),
            sbiWindowWidth <= 480 && parseInt(s) > 2 && (n = 1)) : sbiWindowWidth > 480 && sbiWindowWidth <= 800 ? n = a : sbiWindowWidth <= 480 && (n = t),
            parseInt(n)
        },
        checkConsent: function() {
            if (this.settings.consentGiven || !this.settings.gdpr)
                return !0;
            if ("undefined" != typeof CLI_Cookie)
                null !== CLI_Cookie.read(CLI_ACCEPT_COOKIE_NAME) && (null !== CLI_Cookie.read("cookielawinfo-checkbox-non-necessary") && (this.settings.consentGiven = "yes" === CLI_Cookie.read("cookielawinfo-checkbox-non-necessary")),
                null !== CLI_Cookie.read("cookielawinfo-checkbox-necessary") && (this.settings.consentGiven = "yes" === CLI_Cookie.read("cookielawinfo-checkbox-necessary")));
            else if (void 0 !== window.cnArgs) {
                var e = ("; " + document.cookie).split("; cookie_notice_accepted=");
                if (2 === e.length) {
                    var i = e.pop().split(";").shift();
                    this.settings.consentGiven = "true" === i
                }
            } else
                void 0 !== window.cookieconsent ? this.settings.consentGiven = "allow" === function e(i) {
                    for (var s = i + "=", t = window.document.cookie.split(";"), a = 0; a < t.length; a++) {
                        var n = t[a].trim();
                        if (0 == n.indexOf(s))
                            return n.substring(s.length, n.length)
                    }
                    return ""
                }("complianz_consent_status") : void 0 !== window.Cookiebot ? this.settings.consentGiven = Cookiebot.consented : void 0 !== window.BorlabsCookie && (this.settings.consentGiven = void 0 !== window.BorlabsCookie.Consents ? window.BorlabsCookie.Consents.hasConsent("instagram") : window.BorlabsCookie.checkCookieConsent("instagram"));
            var s = jQuery.Event("sbicheckconsent");
            return s.feed = this,
            jQuery(window).trigger(s),
            this.settings.consentGiven
        },
        afterConsentToggled: function() {
            if (this.checkConsent()) {
                var e = this;
                e.maybeRaiseImageResolution(),
                setTimeout(function() {
                    e.afterResize()
                }, 500)
            }
        },
        locationGuess: function() {
            var i = e(this.el)
              , s = "content";
            return i.closest("footer").length ? s = "footer" : i.closest(".header").length || i.closest("header").length ? s = "header" : (i.closest(".sidebar").length || i.closest("aside").length) && (s = "sidebar"),
            s
        }
    },
    window.sbi_init = function() {
        window.sbi = new i,
        window.sbi.createPage(window.sbi.createFeeds, {
            whenFeedsCreated: window.sbi.afterFeedsCreated
        })
    }
}(jQuery),
jQuery(document).ready(function(e) {
    void 0 === window.sb_instagram_js_options && (window.sb_instagram_js_options = {
        font_method: "svg",
        resized_url: location.protocol + "//" + window.location.hostname + "/wp-content/uploads/sb-instagram-feed-images/",
        placeholder: location.protocol + "//" + window.location.hostname + "/wp-content/plugins/instagram-feed/img/placeholder.png"
    }),
    void 0 !== window.sb_instagram_js_options.resized_url && -1 === window.sb_instagram_js_options.resized_url.indexOf(location.protocol) && ("http:" === location.protocol ? window.sb_instagram_js_options.resized_url = window.sb_instagram_js_options.resized_url.replace("https:", "http:") : window.sb_instagram_js_options.resized_url = window.sb_instagram_js_options.resized_url.replace("http:", "https:")),
    sbi_init(),
    e("#cookie-notice a").on("click", function() {
        setTimeout(function() {
            e.each(window.sbi.feeds, function(e) {
                window.sbi.feeds[e].afterConsentToggled()
            })
        }, 1e3)
    }),
    e("#cookie-law-info-bar a").on("click", function() {
        setTimeout(function() {
            e.each(window.sbi.feeds, function(e) {
                window.sbi.feeds[e].afterConsentToggled()
            })
        }, 1e3)
    }),
    e(".cli-user-preference-checkbox").on("click", function() {
        setTimeout(function() {
            e.each(window.sbi.feeds, function(e) {
                window.sbi.feeds[e].settings.consentGiven = !1,
                window.sbi.feeds[e].afterConsentToggled()
            })
        }, 1e3)
    }),
    e(window).on("CookiebotOnAccept", function(i) {
        e.each(window.sbi.feeds, function(e) {
            window.sbi.feeds[e].settings.consentGiven = !0,
            window.sbi.feeds[e].afterConsentToggled()
        })
    }),
    e(document).on("cmplzAcceptAll", function(i) {
        e.each(window.sbi.feeds, function(e) {
            window.sbi.feeds[e].settings.consentGiven = !0,
            window.sbi.feeds[e].afterConsentToggled()
        })
    }),
    e(document).on("cmplzRevoke", function(i) {
        e.each(window.sbi.feeds, function(e) {
            window.sbi.feeds[e].settings.consentGiven = !1,
            window.sbi.feeds[e].afterConsentToggled()
        })
    }),
    e(document).on("borlabs-cookie-consent-saved", function(i) {
        e.each(window.sbi.feeds, function(e) {
            window.sbi.feeds[e].settings.consentGiven = !1,
            window.sbi.feeds[e].afterConsentToggled()
        })
    })
}));
