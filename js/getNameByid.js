var apigClient = apigClientFactory.newClient();
var XJapigClient = XJapigClientFactory.newClient();

user_id = "7777b167ad5a6efe40b9e99c33ad1503d8320220";
additionalParams={}
body = {}
params = {"user_id": user_id}
var artist1, artist2, artist3, artist4, artist5, artist6, artist7, artist8
var name1, name2, name3, name4, name5, name6, name7, name8
var recommend1
var recommend2
var recommend3
var recommend4
var recommend5
var recommend6
var recommend7
var recommend8

apigClient.getUserRecommendListGet(params, body, additionalParams).then(function(result1){
    data = result1["data"]
    recommend1 = data["RecommendList"][0]
    recommend2 = data["RecommendList"][1]
    recommend3 = data["RecommendList"][2]
    recommend4 = data["RecommendList"][3]
    recommend5 = data["RecommendList"][4]
    recommend6 = data["RecommendList"][5]
    recommend7 = data["RecommendList"][6]
    recommend8 = data["RecommendList"][7]

    //track_id = recommend1
    additionalParams={}
    body = {}
    //params = {"track_id": track_id}
    apigClient.getTrackInfoByTrackIdGet({"track_id": recommend1}, body, additionalParams).then(function(result1){
        name1 = result1["data"]["_source"]["title"]
        document.getElementById("name1").innerHTML = name1;
        artist1 = result1["data"]["_source"]["artist"]
    })
    apigClient.getTrackInfoByTrackIdGet({"track_id": recommend2}, body, additionalParams).then(function(result2){
        name2 = result2["data"]["_source"]["title"];
        document.getElementById("name2").innerHTML = name2;
        artist2 = result2["data"]["_source"]["artist"];
    })
    apigClient.getTrackInfoByTrackIdGet({"track_id": recommend3}, body, additionalParams).then(function(result3){
        name3 = result3["data"]["_source"]["title"]
        document.getElementById("name3").innerHTML = name3;
        artist3 = result3["data"]["_source"]["artist"]
    })
    apigClient.getTrackInfoByTrackIdGet({"track_id": recommend4}, body, additionalParams).then(function(result4){
        name4 = result4["data"]["_source"]["title"]
        document.getElementById("name4").innerHTML = name4;
        artist4 = result4["data"]["_source"]["artist"]
    })
    apigClient.getTrackInfoByTrackIdGet({"track_id": recommend5}, body, additionalParams).then(function(result5){
        name5 = result5["data"]["_source"]["title"]
        document.getElementById("name5").innerHTML = name5;
        artist5 = result5["data"]["_source"]["artist"]
    })
    apigClient.getTrackInfoByTrackIdGet({"track_id": recommend6}, body, additionalParams).then(function(result6){
        name6 = result6["data"]["_source"]["title"]
        document.getElementById("name6").innerHTML = name6;
        artist6 = result6["data"]["_source"]["artist"]
    })
    apigClient.getTrackInfoByTrackIdGet({"track_id": recommend7}, body, additionalParams).then(function(result7){
        name7 = result7["data"]["_source"]["title"]
        document.getElementById("name7").innerHTML = name7;
        artist7 = result7["data"]["_source"]["artist"]
    })
    apigClient.getTrackInfoByTrackIdGet({"track_id": recommend8}, body, additionalParams).then(function(result8){
        name8 = result8["data"]["_source"]["title"]
        document.getElementById("name8").innerHTML = name8;
        artist8 = result8["data"]["_source"]["artist"]
    })

})


// $(document).on('ready', () => {
//     console.log("test");
//     $(".click-to-jump").on("click", (e) => {
//         e.preventDefault();
//         console.log($(this))
//        console.log($(this).attr("id"));
//        console.log("haha");
//     });
// })



function BotRequest(userMessage, callback) {

    var params = {
    };

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
        .then(function(result){
            // console.log("Successs")
            // completeRequest(result);
            callback(null, result);
        }).catch(function(result) {
        console.log("Failure: ")
    })
    return botMessage
}

function completeRequest(result) {
    console.log(result);
    var data = result["data"];
    var messages = data["messages"]
    var message = messages[0]
    botMessage = message["text"]
    var timestamp = message["timestamp"]
    console.log(botMessage);

}
var artist
// BotRequest("shape of you,ed sheeran")
$(document).ready(function(){
    $(".click-to-jump").click(function(){

        if ($(this).attr("id") === "name1"){
            artist = artist1
        }
        if ($(this).attr("id") === "name2"){
            artist = artist2
        }
        if ($(this).attr("id") === "name3"){
            artist = artist3
        }
        if ($(this).attr("id") === "name4"){
            artist = artist4
        }
        if ($(this).attr("id") === "name5"){
            artist = artist5
        }
        if ($(this).attr("id") === "name6"){
            artist = artist6
        }
        if ($(this).attr("id") === "name7"){
            artist = artist7
        }
        if ($(this).attr("id") === "name8"){
            artist = artist8
        }
        console.log(artist)
        console.log($(this).attr("id"));
        console.log(document.getElementById($(this).attr("id")).innerHTML);
        // let id = $(this).attr("id");
        // const options = {
        //     url: "",
        //     method: "GET",
        //     data: {
        //
        //     },
        //     success: (err, result) => {
        //         console.log(err);
        //         console.log(result);
        //     }
        // }
        // $.ajax(options);
        var song = document.getElementById($(this).attr("id")).innerHTML;
        // window.location.assign('play.html?songname="+ song +"&artist="+ artist+" ')
        window.location.assign("play.html?songname="+ song +"&artist="+ artist)
        // BotRequest(require, (err, result) => {
        //     if (err) {
        //         console.log("error")
        //     } else {
        //         console.log(result.data.messages);
        //         let data = JSON.parse(result.data.messages[0].text);
        //         similarList = data[0];
        //         infoList = data[1].split(',');
        //         musicName= infoList[0].split('-')[0].trim()
        //         singer= infoList[0].split('-')[1].trim()
        //         img = infoList[1]
        //         playit = infoList[2]
        //         console.log(similarList);
        //         console.log(musicName);
        //         console.log(singer);
        //         console.log(img);
        //         console.log(playit);
        //         console.log("---------------");
        //     }
        // })
    });
});

