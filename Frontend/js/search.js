var apigClient = apigClientFactory.newClient();
var XJapigClient = XJapigClientFactory.newClient();

var data, search1, searchSinger1, searchName1, search2, searchSinger2, searchName2, search3, searchSinger3, searchName3, search4, searchSinger4, searchName4
var search5, searchSinger5, searchName5, search6, searchSinger6, searchName6, search7, searchSinger7, searchName7, search8, searchSinger8, searchName8
var artist1, artist2, artist3, artist4, artist5, artist6, artist7, artist8
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
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
            callback(null, result);
        }).catch(function (result) {
    })
}

let term = getParameterByName("searchterm");
let additionalParams={}
let body = {}
let params = {"term": term }
apigClient.generalSearchGet(params, body, additionalParams).then(function(result){
    console.log("------------------------------------------------------------------------------------")
    console.log("Succeed : generalSearchGet")
    console.log(result)
    data = result["data"]["hits"]["hits"];
    console.log("mark0");
    console.log(data);
    let searchList = [];
    data.forEach(item => {
        let artist = item["_source"].artist;
        let title = item["_source"].title;
        searchList.push({
            artist: artist,
            title: title
        });
    })


    console.log("searchlist:")
    console.log(searchList);
    let counter = 1;
    let songs = [];
    getSongs(searchList).then(songs => {
        console.log(songs);
        songs.forEach(song => {
            $("#append-marker").before("<div class=\"col-md-3 content-grid last-grid\">\n" +
                "                        <a class=\"play-icon popup-with-zoom-anim\" href=\"#small-dialog\"><img class=\"click-to-jump\" id=\""+song.song + "-" + song.artist+"\"src=\""+ song.imageUrl + "\" title=\""+ song.song +"\"></a>\n" +
                "                        <a class=\"button play-icon popup-with-zoom-anim\" href=\"#small-dialog\"><p></p></a>\n" +
                "                    </div>")
        })
    })


    function getSongs(searchList) {
        let counter = 0;
        searchList = searchList.slice(0, 4);
        return new Promise((resolve, reject) => {
            searchList.forEach(search => {
                if (counter >= 4) return;
                let params = search.title + "," + search.artist;
                BotRequest(params, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let data = JSON.parse(result.data.messages[0].text);
                        console.log(data);
                        let similarList = data[0];
                        let infoList = data[1].split(",");
                        let song = infoList[0].split("-")[0].trim();
                        let artist = infoList[0].split("-")[1].trim();
                        let info = {
                            song: song,
                            artist: artist,
                            imageUrl: infoList[1],
                            playUrl: infoList[2]
                        };
                        songs.push(info);
                    }
                    counter++;
                    if (counter === 4) {
                        resolve(songs);
                    }
                })
            })
        })
    }


}).catch(function(result){
    console.log("Error : generalSearchGet")
    console.log(result)
})


var artist
$(document).ready(function(){
    $(document).delegate('.click-to-jump', 'click', function() {
        let id = $(this).attr("id");
        let song = id.split("-")[0].trim();
        let artist = id.split("-")[1].trim();
        window.location.assign("play.html?songname="+ song +"&artist="+ artist)

    })
    $("#search-button").click((e) => {
        e.preventDefault();
        term = $("#search-result").val();
        console.log("term:");
        console.log(term);
        window.open("search.html?searchterm="+term);
    })

});

