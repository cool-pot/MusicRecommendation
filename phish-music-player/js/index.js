(function() {
  var billyBreathes, changePosition, changeSong, changeVolume, harryHood, pauseSong, playSong, playlist, suzyGreenberg, themeFromTheBottom, updatePositionSlider, updateSlider;

  themeFromTheBottom = new Howl({
    urls: ['https://s3-us-west-2.amazonaws.com/s.cdpn.io/377560/07_Theme_from_the_Bottom_(1).mp3'],
    volume: window.volume
  });

  billyBreathes = new Howl({
    urls: ['https://s3-us-west-2.amazonaws.com/s.cdpn.io/377560/10_Billy_Breathes_(1)_(1).mp3'],
    volume: window.volume
  });

  harryHood = new Howl({
    urls: ['https://s3-us-west-2.amazonaws.com/s.cdpn.io/377560/harry-hood-small.mp3'],
    volume: window.volume
  });

  suzyGreenberg = new Howl({
    urls: ['https://s3-us-west-2.amazonaws.com/s.cdpn.io/377560/suzy_greenberg_small.mp3'],
    volume: window.volume
  });

  window.open = true;

  window.volume = 0.5;

  window.position = 0;

  window.duration = 40.8;

  playlist = [suzyGreenberg];

  window.currentSong = playlist[0];

  window.add = null;

  changeSong = function(song) {
    console.log(song);
    window.currentSong.stop();
    window.currentSong.pos(0);
    window.position = 0;
    $(".slider").slider("value", 0);
    window.currentSong = song;
    $(".play-song > i").removeClass('fa-play');
    $(".play-song > i").addClass('fa-pause');
    window.open = false;
    return song.play();
  };

  updatePositionSlider = function() {
    return window.position += 1;
  };

  playSong = function(song) {
    song.play();
    return window.add = setInterval(updatePositionSlider, 1000);
  };

  pauseSong = function(song) {
    song.pause();
    return clearInterval(window.add);
  };

  changeVolume = function(song) {
    return song.volume(window.volume);
  };

  changePosition = function(song) {
    return song.pos(window.position);
  };

  updateSlider = function() {
    return $(".slider").slider("value", window.position);
  };

  $(function() {
    var slideUp;
    $(".slider").slider({
      min: 0,
      range: "min",
      max: window.duration,
      value: 0,
      slide: function(event, ui) {
        window.position = ui.value;
        console.log(ui.value);
        return changePosition(window.currentSong);
      }
    });
    setInterval(updateSlider, 1000);
    $("#volume-off").click(function() {
      currentSong.volume(0);
      return $(".slider-volume").slider("value", 0);
    });
    $("#volume-up").click(function() {
      currentSong.volume(1);
      return $(".slider-volume").slider("value", 100);
    });
    $(".slider-volume").slider({
      min: 0,
      range: "min",
      max: 100,
      value: 50,
      slide: function(event, ui) {
        console.log("hey");
        window.volume = ui.value / 100;
        return changeVolume(window.currentSong);
      }
    });
    $("#play").click(function() {
      if (window.open) {
        playSong(window.currentSong);
        $(".play-song > i").removeClass('fa-play');
        $(".play-song > i").addClass('fa-pause');
        return window.open = !window.open;
      } else {
        pauseSong(window.currentSong);
        $(".play-song > i").removeClass('fa-pause');
        $(".play-song > i").addClass('fa-play');
        return window.open = !window.open;
      }
    });
    slideUp = true;
    $(".slide-up").click(function() {
      if (slideUp) {
        $(".song-list, .playlist-controls, .overlay").addClass("active");
        $(".slide-up").html("<i class='fa fa-chevron-down'></i>");
        return slideUp = !slideUp;
      } else {
        $(".song-list, .playlist-controls, .overlay").removeClass("active");
        $(".slide-up").html("<i class='fa fa-chevron-up'></i>");
        return slideUp = !slideUp;
      }
    });
    return $("tr").click(function() {
      if ($(this).attr('data-title') === "billyBreathes") {
        changeSong(billyBreathes);
        $(".slider").slider("option", "max", 331.6);
        window.duration = 331.6;
        $(".song").html("Billy Breathes");
      } else if ($(this).attr('data-title') === "harryHood") {
        $(".song").html("Harry Hood");
        window.duration = 40.8;
        $(".slider").slider("option", "max", 40.8);
        changeSong(harryHood);
      } else if ($(this).attr('data-title') === "suzyGreenberg") {
        $(".song").html("Suzy Greenberg");
        window.duration = 40.8;
        $(".slider").slider("option", "max", 40.8);
        changeSong(suzyGreenberg);
      } else if ($(this).attr('data-title') === "themeFromTheBottom") {
        changeSong(themeFromTheBottom);
        $(".song").html("Theme From The Bottom");
        $(".slider").slider("option", "max", 382.2);
        window.duration = 382.2;
      }
      $(".song-list, .playlist-controls, .overlay").removeClass("active");
      $(".slide-up").html("<i class='fa fa-chevron-up'></i>");
      return slideUp = !slideUp;
    });
  });

}).call(this);