jQuery(document).ready((function($) {
    function carousel_starts_on_screen(splc_container_id, splcSwiper) {
        splcSwiper.autoplay.stop();
        const $spLogoCarouselSection = $("#" + splc_container_id + ".logo-carousel-free-area");
        $(window).on("scroll", (function() {
            const sectionOffset = $spLogoCarouselSection.offset()
              , sectionHeight = $spLogoCarouselSection.height()
              , sectionTop = sectionOffset.top - $(window).scrollTop()
              , sectionBottom = sectionTop + sectionHeight
              , isSectionVisible = sectionTop <= $(window).height() && sectionBottom >= 0;
            isSectionVisible ? splcSwiper.autoplay.start() : splcSwiper.autoplay.stop()
        }
        ))
    }
    $(".sp-lc-container").each((function(index) {
        var splc_container, splc_container_id = $(this).attr("id"), spLogoCarousel = $("#" + splc_container_id + " .sp-logo-carousel"), spLogoCarouselData = spLogoCarousel.data("carousel"), spLogoCarouselStartsOnscreen = spLogoCarousel.data("carousel-starts-onscreen");
        if (spLogoCarousel.length > 0 && !$("#" + splc_container_id + ' .sp-logo-carousel[class*="-initialized"]').length > 0) {
            var splcSwiper = new Swiper("#" + splc_container_id + " .sp-logo-carousel",{
                speed: spLogoCarouselData.speed,
                slidesPerView: spLogoCarouselData.slidesPerView.mobile,
                spaceBetween: spLogoCarouselData.spaceBetween,
                loop: spLogoCarouselData.infinite,
                loopFillGroupWithBlank: !0,
                simulateTouch: spLogoCarouselData.simulateTouch,
                allowTouchMove: spLogoCarouselData.allowTouchMove,
                freeMode: spLogoCarouselData.freeMode,
                pagination: 1 == spLogoCarouselData.pagination && {
                    el: "#" + splc_container_id + " .swiper-pagination",
                    clickable: !0,
                    renderBullet: function(index, className) {
                        return '<span class="' + className + '"></span>'
                    }
                },
                autoplay: {
                    delay: spLogoCarouselData.autoplay_speed
                },
                navigation: 1 == spLogoCarouselData.navigation && {
                    nextEl: "#" + splc_container_id + " .sp-lc-button-next",
                    prevEl: "#" + splc_container_id + " .sp-lc-button-prev"
                },
                breakpoints: {
                    576: {
                        slidesPerView: spLogoCarouselData.slidesPerView.mobile_landscape
                    },
                    768: {
                        slidesPerView: spLogoCarouselData.slidesPerView.tablet
                    },
                    992: {
                        slidesPerView: spLogoCarouselData.slidesPerView.desktop
                    },
                    1200: {
                        slidesPerView: spLogoCarouselData.slidesPerView.lg_desktop
                    }
                },
                fadeEffect: {
                    crossFade: !0
                },
                keyboard: {
                    enabled: !0
                }
            });
            !1 === spLogoCarouselData.autoplay && splcSwiper.autoplay.stop(),
            spLogoCarouselData.stop_onHover && spLogoCarouselData.autoplay && $(spLogoCarousel).on({
                mouseenter: function() {
                    splcSwiper.autoplay.stop()
                },
                mouseleave: function() {
                    splcSwiper.autoplay.start()
                }
            }),
            spLogoCarouselStartsOnscreen && carousel_starts_on_screen(splc_container_id, splcSwiper),
            $(window).on("resize", (function() {
                splcSwiper.update()
            }
            )),
            $(window).trigger("resize")
        }
    }
    )),
    jQuery("body").find(".sp-logo-carousel.lcp-preloader").each((function() {
        var logo_carousel_id = $(this).attr("id"), parents_class, parents_siblings_id = jQuery("#" + logo_carousel_id).parent(".logo-carousel-free-area").find(".sp-logo-carousel-preloader").attr("id");
        $(document).ready((function() {
            $("#" + parents_siblings_id).animate({
                opacity: 0
            }, 600).remove()
        }
        ))
    }
    )),
    $(".logo-carousel-free-area").addClass("splc-logo-carousel-loaded")
}
));
