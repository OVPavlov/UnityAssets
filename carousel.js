document.querySelectorAll('[data-carousel]').forEach(function(c) {
  var track   = c.querySelector('.carousel-track');
  var slides  = Array.prototype.slice.call(c.querySelectorAll('.carousel-slide'));
  var dotsEl  = c.querySelector('.carousel-dots');
  var prevBtn = c.querySelector('.carousel-btn.prev');
  var nextBtn = c.querySelector('.carousel-btn.next');
  var n = slides.length;
  var cur = 0;

  /* Build dot buttons */
  for (var d = 0; d < n; d++) {
    var dot = document.createElement('button');
    dot.className = 'dot' + (d === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (d + 1));
    dot.dataset.idx = d;
    dotsEl.appendChild(dot);
  }
  var dots = Array.prototype.slice.call(dotsEl.querySelectorAll('.dot'));

  /* Pause YouTube in a slide (via postMessage — requires enablejsapi=1) */
  function pauseYT(slide) {
    var f = slide.querySelector('iframe');
    if (!f) return;
    try {
      f.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*'
      );
    } catch (e) {}
  }

  /* Navigate to slide idx */
  function go(idx) {
    pauseYT(slides[cur]);
    cur = (idx + n) % n;
    track.style.transform = 'translateX(-' + (cur * 100) + '%)';
    dots.forEach(function(d, k) { d.classList.toggle('active', k === cur); });
  }

  prevBtn.addEventListener('click', function() { go(cur - 1); });
  nextBtn.addEventListener('click', function() { go(cur + 1); });
  dots.forEach(function(d) {
    d.addEventListener('click', function() { go(parseInt(d.dataset.idx, 10)); });
  });

  /* Hide controls when there is only one slide */
  if (n <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    dotsEl.style.display  = 'none';
  }

  /* YouTube play button: click injects an autoplay iframe over the thumbnail.
     enablejsapi=1 enables the postMessage pause command above. */
  slides.forEach(function(slide) {
    var playBtn = slide.querySelector('.yt-play');
    if (!playBtn) return;
    var ytId = slide.dataset.yt;

    playBtn.addEventListener('click', function() {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube.com/embed/' + ytId
            + '?autoplay=1&enablejsapi=1&rel=0';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; '
              + 'gyroscope; picture-in-picture; web-share';
      f.allowFullscreen = true;
      f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      slide.appendChild(f);
      playBtn.style.display = 'none';
    });
  });
});
