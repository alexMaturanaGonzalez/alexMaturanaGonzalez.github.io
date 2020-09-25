/**
 * 1. Slider Images
 * 2. Portfolio
 * 3. Map
 * 4. Menu Mobile
 * 5. Progress
 */

'use strict';

(function ($) {

	$.fn.charlottyIsotope = function (opts) {
		var $self = $(this),
			defaults = {
				filter         : '*',
				itemSelector   : '.grid-item',
				percentPosition: true,
				masonry        : {
					columnWidth: '.grid-sizer'
				}
			},
			options = $.extend(defaults, $self.data(), opts),
			$controls = $('.controls', $self),
			$grid = $('.grids', $self),
			$images = $('img', $self),
			count = 0,
			total = $images.length;

		$.each($images, function () {
			var image = new Image();

			image.src = $(this).attr('src');

			image.onload = function () {

				count++;

				if (count === total) {
					$('.grid-item', $grid).addClass('ready');
					$grid.isotope(options);
					$grid.data('isIsotope', true);
				}
			}
		});

		$grid.on('arrangeComplete', function () {
			var $items = $('.grid-item:not(.ready)', $grid);

			if ($items.length) {
				$items.addClass('ready');
				setTimeout(function () {
					$('.kd-hidden', $grid).addClass('kd-show');
				}, 300);
			}
		});

		$('a', $controls).on('click', function (event) {

			event.preventDefault();

			var $this = $(this),
				filter = $this.data('filter');

			if (!$this.hasClass('active')) {
				$('.active', $controls).removeClass('active');
				$this.addClass('active');

				$grid.isotope({
					filter: filter
				});
			}
		});
		if ($self.hasClass('gallery')) {
			$self.charlottyMagnificPopup();
		}

	};
	$.fn.charlottyMagnificPopup = function (opts) {

		var $self = $(this),
			options = $.extend({
				delegate   : '.media',
				type       : 'image',
				tLoading   : '<div class="dots">\
							<div class="dot active"></div>\
							<div class="dot active"></div>\
							<div class="dot active"></div>\
							<div class="dot active"></div>\
						</div>',
				mainClass  : 'mfp-img-mobile',
				gallery    : {
					enabled           : true,
					navigateByImgClick: true,
					preload           : [0, 3] // Will preload 0 - before current, and 1 after the current image
				},
				image      : {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
				},
				closeMarkup: '<button title="%title%" type="button" class="mfp-close"></button>',
				callbacks  : {
					markupParse      : function (item) {
					},
					imageLoadComplete: function () {
						var $container = $('.mfp-container');

						$container.addClass('load-done');
						setTimeout(function () {
							$container.addClass('load-transition');
						}, 50);
					},
					change           : function () {
						var $container = $('.mfp-container');
						$container.removeClass('load-done load-transition');
					}

				}
			}, $self.data(), opts);
		$('.media', $self).each( function () {
			var href = $(this).data('url');

			if (href && href !== '') {
				$(this).attr('href', href);
			}

		});
		$self.magnificPopup(options);
	};

	$(document).ready(function () {

		/* 1. Slider Images */
		var $sliderSection = $('#slider-section');

		if ($sliderSection.length) {
			$('.owl-carousel', $sliderSection).owlCarousel({
				items    : 1,
				nav      : true,
				dots     : true,
				navText  : ['', ''],
				loop     : true,
				mouseDrag: false,
				onInitialized: function(e, ui) {
					var wh = $(window).height(),
						offsetTop = $sliderSection.offset().top;

					$('.item', $sliderSection).height((wh - offsetTop));
				},
				onResize: function () {
					var wh = $(window).height(),
						offsetTop = $sliderSection.offset().top;

					$('.item', $sliderSection).height((wh - offsetTop));
				}
			});
		}

		/* 2. Portfolio */
		// Isotope
		var $portfolio = $('.portfolio');

		if ($portfolio.length) {

			$portfolio.each(function () {
				$(this).charlottyIsotope();
			})
		}

		/* 3. Map */
		// Maps Google
		var $maps = $('.maps');

		if ($maps.length) {
			var lat = $maps.data('lat') ? $maps.data('lat') : '21.036671',
				long = $maps.data('long') ? $maps.data('long') : '105.835090',
				zoom = $maps.data('zoom') ? $maps.data('zoom') : 15,
				dataMap = {
					zoom                 : zoom,
					center               : new google.maps.LatLng(lat, long),
					mapTypeId            : google.maps.MapTypeId.ROADMAP,
					mapTypeControlOptions: {
						mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
							'styled_map']
					},
					scrollwheel          : false,
					styles               : [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]}]
				},
				map = new google.maps.Map($maps[0], dataMap),
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(lat, long),
					map     : map,
					icon    : 'images/marker.png'
				});
		}

		// 6. Project Details
		var $imageProject = $('.images-project');

		if ($imageProject.length) {
			$imageProject.charlottyMagnificPopup({
				delegate: 'a'
			});
		}

		/* Menu Mobile */

		var $btnMenu = $('.menu-mobile');

		if ($btnMenu.length) {
			var $header = $('#header'),
				$mainMenu = $('.menu-list', $header),
				$closeMenu = $('.btn-close');

			$mainMenu.onePageNav({
				currentClass: 'active',
				changeHash: false,
				scrollSpeed: 750
			});

			$btnMenu.on('click', function () {
				$header.addClass('active');
				$btnMenu.addClass('active');
			});

			$closeMenu.on('click', function () {
				$header.removeClass('active');
				$btnMenu.removeClass('active');
			});
			$('.cover').on('click', function () {
				$closeMenu.trigger('click');
			});
			$(document).on('keydown', function (e) {
				if (e.keyCode === 27) {
					$closeMenu.trigger('click');
				}
			});
			$('.menu-item-has-children > a', $mainMenu).on('click', function (event) {
				var ww = $(window).width();

				if (ww <= 991) {
					event.preventDefault();

					var $target = $(event.target).closest('.menu-item-has-children').children('a'),
						$subMenu = $target.next('ul');

					$target.toggleClass('active');

					if ($target.hasClass('active')) {
						$subMenu.slideDown(400);
					}
					else {
						$subMenu.slideUp(400);
					}
				}
			});
		}

		// Twitter

		var $twitter = $('.kd-twitter .widget-content');

		if ($twitter.length) {
			$twitter.owlCarousel({
				items     : 1,
				nav       : false,
				autoHeight: true
			})
		}

		var $preloader = $('.preloader');

		if ($preloader.length) {
			$(window).on('load', function () {
				$preloader.fadeOut(400);
			});
		}
	});

	var $wrapGrids = $('#portfolio, .projects-related');

	$wrapGrids.on('click', '.grid-item', function (event) {
		var ww = $(window).width(),
			$item = $(event.target).hasClass('grid-item') ? $(event.target) : $(event.target).closest('.grid-item');

		if (ww <= 600) {
			$('.item-hover').removeClass('item-hover');
			$item.toggleClass('item-hover');
		}
	});
	$wrapGrids.on('click', '.title, .cat', function (event) {
		var ww = $(window).width();
		if (ww <= 600) {
			event.stopPropagation();
		}
	});

	// Progress
	var $progress = $('.skills-progress');

	$('.skill-item', $progress).each( function () {
		var percent = $(this).data('percent');

		if (percent && parseInt(percent, 10)) {
			$('.skill-percent', this).css('width', percent + '%');
		}
	});
	// Testimonial Slideshow
	var $testimonial = $('.testimonial-items');

	if ($testimonial.length) {
		$testimonial.owlCarousel({
			items: 1,
			nav: false,
			dots: true,
			autoHeight: true
		});
	}

	var $backToTop = $('.back-to-top');

	$backToTop.on('click', function () {
		$('html, body').animate({
			scrollTop: 0
		}, 500);
	});

	$(window).on('scroll', function () {
		var wt = $(window).scrollTop();

		if (wt > 500) {
			$backToTop.addClass('active');
		}
		else {
			$backToTop.removeClass('active');
		}
	});

	$('.go-to-portfolio').on('click', function (event) {
		var href = $(this).attr('href');
		if ($(href).length) {
			event.preventDefault();
			var offestTop = $(href).offset().top;

			$('html, body').animate({
				scrollTop: offestTop
			}, 750);
		}
	});

	var $preload = $('#preload');

	if ($preload.length) {
		$(window).on('load', function () {
			$preload.fadeOut(400);
		});
	}

})(jQuery);