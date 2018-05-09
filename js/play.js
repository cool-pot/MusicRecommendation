var XJapigClient = XJapigClientFactory.newClient();

(function () {
    var billyBreathes, changePosition, changeSong, changeVolume, harryHood, pauseSong, playSong, playlist,
        suzyGreenberg, themeFromTheBottom, updatePositionSlider, updateSlider;

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

    changeSong = function (song) {
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

    updatePositionSlider = function () {
        return window.position += 1;
    };

    playSong = function (song) {
        song.play();
        return window.add = setInterval(updatePositionSlider, 1000);
    };

    pauseSong = function (song) {
        song.pause();
        return clearInterval(window.add);
    };

    changeVolume = function (song) {
        return song.volume(window.volume);
    };

    changePosition = function (song) {
        return song.pos(window.position);
    };

    updateSlider = function () {
        return $(".slider").slider("value", window.position);
    };


    function BotRequest(userMessage, callback) {

        var params = {};

        var body = {
            "messages": [
                {
                    "type": "string",
                    "unstructured": {
                        "id": "123",
                        "text": userMessage,
                        "timestamp": new Date().getTime()
                    }
                }
            ]
        };

        var additionalParams = {};

        XJapigClient.chatbotPost(params, body, additionalParams)
            .then(function (result) {
                // console.log("Successs")
                // completeRequest(result);
                callback(null, result);
            }).catch(function (result) {
        })
    }


    function readFromUrl() {
        let songname = getParameterByName("songname");
        let artist = getParameterByName("artist");
        console.log(songname);
        console.log(artist);
        var require = songname+","+artist
        console.log(require)
        BotRequest(require, (err, result) => {
            if (err) {
                console.log("error")
            } else {
                let data = JSON.parse(result.data.messages[0].text);
                console.log(data);
                similarList = data[0];
                similarSinger1 = similarList[0].split('-')[0].trim()
                similarName1 = similarList[0].split('-')[1].trim()
                similarSinger2 = similarList[1].split('-')[0].trim()
                similarName2 = similarList[1].split('-')[1].trim()
                similarSinger3 = similarList[2].split('-')[0].trim()
                similarName3 = similarList[2].split('-')[1].trim()
                similarSinger4 = similarList[3].split('-')[0].trim()
                similarName4 = similarList[3].split('-')[1].trim()
                similarSinger5 = similarList[4].split('-')[0].trim()
                similarName5 = similarList[4].split('-')[1].trim()
                similarSinger6 = similarList[5].split('-')[0].trim()
                similarName6 = similarList[5].split('-')[1].trim()
                console.log("simlar")

                infoList = data[1].split(',');
                musicName= infoList[0].split('-')[0].trim()
                singer= infoList[0].split('-')[1].trim()
                img = infoList[1]
                playit = infoList[2]
                console.log(similarList);
                console.log(musicName);
                console.log(singer);
                console.log(img);
                console.log(playit);
                console.log("---------------");
                $("#marker").after("  <div class=\"apple-stuff\"><i class=\"fa fa-wifi\">\n" +
                    "    <div class=\"date\">12:00 AM</div></i><i class=\"fa fa-battery-3 battery\"></i></div>\n" +
                    "  <div class=\"picture-section\">\n" +
                    "    <h3>Now Playing</h3>\n" +
                    "    <div class=\"band\">\n" +
                    "      <div class=\"overlay\"></div>\n" +
                    "    </div>\n" +
                    "  </div>\n" +
                    "  <div class=\"slider\"></div>\n" +
                    "  <div class=\"time\"></div>\n" +
                    "  <div class=\"song-title\">\n" +
                    "    <div class=\"artist\">" + singer + "</div>\n" +
                    "    <div class=\"song\">"+ musicName +"</div>\n" +
                    "  </div>\n" +
                    "  <div class=\"playlist-controls\">\n" +
                    "    <div class=\"circle\"></div>\n" +
                    "    <div class=\"play-song\"><i class=\"fa fa-play\" id=\"play\"></i></div>\n" +
                    "  </div>\n" +
                    "  <div class=\"song-list\">\n" +
                    "    <div class=\"line\"></div>\n" +
                    "    <div class=\"line two\"></div>\n" +
                    "    <div class=\"line three\"></div>\n" +
                    "    <div class=\"line four\"></div>\n" +
                    "    <table>\n" +
                    "      <tr id=\"billy\" data-title=\"billyBreathes\">\n" +
                    "        <td class=\"num\">1</td>\n" +
                    "        <td class=\"title\" ><a href='play.html?songname="+ similarName1 +"&artist="+ similarSinger1+" ' style='color: white'>"+ similarList[0] +"</a></td>\n" +
                    "        <td class=\"length\">3:00</td>\n" +
                    "      </tr>\n" +
                    "      <tr id=\"hood\" data-title=\"harryHood\">\n" +
                    "        <td class=\"num\">2</td>\n" +
                    "        <td class=\"title\"><a href='play.html?songname="+ similarName2 +"&artist="+ similarSinger2+" ' style='color: white'>"+ similarList[1] +"</a></td>\n" +
                    "        <td class=\"length\">2:54</td>\n" +
                    "      </tr>\n" +
                    "      <tr id=\"suzy\" data-title=\"suzyGreenberg\">\n" +
                    "        <td class=\"num\">3</td>\n" +
                    "        <td class=\"title\"><a href='play.html?songname="+ similarName3 +"&artist="+ similarSinger3+" ' style='color: white'>"+ similarList[2] +"</a></td>\n" +
                    "        <td class=\"length\">2:54</td>\n" +
                    "      </tr>\n" +
                    "      <tr id=\"divided\" data-title=\"themeFromTheBottom\">\n" +
                    "        <td class=\"num\">4</td>\n" +
                    "        <td class=\"title\"><a href='play.html?songname="+ similarName4 +"&artist="+ similarSinger4+" ' style='color: white'>"+ similarList[3] +"</a></td>\n" +
                    "        <td class=\"length\">2:54</td>\n" +
                    "      </tr>\n" +
                    "    </table>\n" +
                    "    <div class=\"social\"><a href=\"https://twitter.com/McGreenBeats\" target=\"_blank\"><i class=\"fa fa-twitter\"></i></a><a href=\"https://www.linkedin.com/in/mattcgreenberg\" target=\"_blank\"><i class=\"fa fa-linkedin\"></i></a><a href=\"http://codepen.io/mattgreenberg/\" target=\"_blank\"><i class=\"fa fa-codepen\">  </i></a></div>\n" +
                    "  </div>\n" +
                    "  \n" +
                    "  \n" +
                    "  \n" +
                    "  \n" +
                    "  \n" +
                    "  <div class=\"volume\"><i class=\"fa fa-volume-off\" id=\"volume-off\"></i><i class=\"fa fa-volume-up\" id=\"volume-up\"></i>\n" +
                    "    <div class=\"slider-volume\"></div>\n" +
                    "  </div>\n" +
                    "  <div class=\"slide-up\"><i class=\"fa fa-chevron-up\"></i></div>");


                updateSlider();
            }
        })


    }

    var slideUp;


    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    $(document).delegate('#play', 'click', function()
    {
        //your code
        console.log("yo");
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

    $(document).ready(() => {

        readFromUrl();

    })
    $(document).delegate('.slider', 'slider', function(){
        return {
            min: 0,
            range: "min",
            max: window.duration,
            value: 0,
            slide: function(event, ui) {
                window.position = ui.value;
                console.log(ui.value);
                return changePosition(window.currentSong);
            }
        };
    })
    // $(".slider").slider({
    //     min: 0,
    //     range: "min",
    //     max: window.duration,
    //     value: 0,
    //     slide: function(event, ui) {
    //         window.position = ui.value;
    //         console.log(ui.value);
    //         return changePosition(window.currentSong);
    //     }
    // });



    $("#volume-off").click(function () {
        currentSong.volume(0);
        return $(".slider-volume").slider("value", 0);
    });
    $("#volume-up").click(function () {
        currentSong.volume(1);
        return $(".slider-volume").slider("value", 100);
    });
    $(".slider-volume").slider({
        min: 0,
        range: "min",
        max: 100,
        value: 50,
        slide: function (event, ui) {
            console.log("hey");
            window.volume = ui.value / 100;
            return changeVolume(window.currentSong);
        }
    });

    $("#play").on("click", () => {
        console.log("yo");
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
    $(document).delegate('.slide-up', 'click', function(){
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
    // $(".slide-up").click(function() {
    //     if (slideUp) {
    //         $(".song-list, .playlist-controls, .overlay").addClass("active");
    //         $(".slide-up").html("<i class='fa fa-chevron-down'></i>");
    //         return slideUp = !slideUp;
    //     } else {
    //         $(".song-list, .playlist-controls, .overlay").removeClass("active");
    //         $(".slide-up").html("<i class='fa fa-chevron-up'></i>");
    //         return slideUp = !slideUp;
    //     }
    // });
    $("tr").click(function () {
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

}).call(this);
