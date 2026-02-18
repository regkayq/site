(function($) {

	var $main = $('#main'),
		$thumbs = $main.find('article.thumb'),
		$overlay, $popup, current = 0;

	// Collect all gallery images
	var images = [];
	$thumbs.each(function(i) {
		var $a = $(this).find('a.image');
		images.push({
			href: $a.attr('href'),
			alt: $a.find('img').attr('alt') || '',
			title: $(this).find('h2').text() || ''
		});
		$a.data('index', i);
	});

	// Build lightbox elements
	function buildLightbox() {
		$overlay = $('<div id="poptrox-overlay"></div>');
		$popup = $('<div id="poptrox-popup"></div>');
		var $closer = $('<div class="closer">&times;</div>');
		var $navPrev = $('<div class="nav-previous"><i class="fa fa-chevron-left"></i></div>');
		var $navNext = $('<div class="nav-next"><i class="fa fa-chevron-right"></i></div>');
		var $img = $('<img />');

		$popup.append($closer).append($img);
		$overlay.append($popup).append($navPrev).append($navNext);
		$('body').append($overlay);

		// Close on overlay click (outside popup)
		$overlay.on('click', function(e) {
			if ($(e.target).is($overlay)) {
				closeLightbox();
			}
		});

		$closer.on('click', function() {
			closeLightbox();
		});

		$navPrev.on('click', function(e) {
			e.stopPropagation();
			showImage((current - 1 + images.length) % images.length);
		});

		$navNext.on('click', function(e) {
			e.stopPropagation();
			showImage((current + 1) % images.length);
		});

		// Keyboard navigation
		$(document).on('keydown.lightbox', function(e) {
			switch(e.key) {
				case 'Escape':
					closeLightbox();
					break;
				case 'ArrowLeft':
					showImage((current - 1 + images.length) % images.length);
					break;
				case 'ArrowRight':
					showImage((current + 1) % images.length);
					break;
			}
		});

		return { $img: $img };
	}

	function showImage(index) {
		current = index;
		var item = images[index];
		var $img = $overlay.find('img');
		$img.attr('src', item.href).attr('alt', item.alt);
	}

	function closeLightbox() {
		$overlay.remove();
		$overlay = null;
		$(document).off('keydown.lightbox');
	}

	// Open lightbox on thumb click
	$thumbs.on('click', 'a.image', function(e) {
		e.preventDefault();
		var index = $(this).data('index');
		if (images.length === 0) return;
		buildLightbox();
		showImage(index);
	});

	// Smooth scroll for anchor links
	$('a[href^="#"]').on('click', function(e) {
		var target = $(this).attr('href');
		if (target === '#') return;
		var $target = $(target);
		if ($target.length) {
			e.preventDefault();
			$('html, body').animate({
				scrollTop: $target.offset().top
			}, 500, 'swing');
		}
	});

})(jQuery);
