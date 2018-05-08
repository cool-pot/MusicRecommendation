var apigClient = apigClientFactory.newClient();
var XJapigClient = XJapigClientFactory.newClient();

user_id = "7777b167ad5a6efe40b9e99c33ad1503d8320220";
additionalParams={}
body = {}
params = {"user_id": user_id}
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
    })
    apigClient.getTrackInfoByTrackIdGet({"track_id": recommend2}, body, additionalParams).then(function(result2){
        name2 = result2["data"]["_source"]["title"]
        document.getElementById("name2").innerHTML = name2;
    })
    apigClient.getTrackInfoByTrackIdGet({"track_id": recommend3}, body, additionalParams).then(function(result3){
        name3 = result3["data"]["_source"]["title"]
        document.getElementById("name3").innerHTML = name3;
    })
    apigClient.getTrackInfoByTrackIdGet({"track_id": recommend4}, body, additionalParams).then(function(result4){
        name4 = result4["data"]["_source"]["title"]
        document.getElementById("name4").innerHTML = name4;
    })
    apigClient.getTrackInfoByTrackIdGet({"track_id": recommend5}, body, additionalParams).then(function(result5){
        name5 = result5["data"]["_source"]["title"]
        document.getElementById("name5").innerHTML = name5;
    })
    apigClient.getTrackInfoByTrackIdGet({"track_id": recommend6}, body, additionalParams).then(function(result6){
        name6 = result6["data"]["_source"]["title"]
        document.getElementById("name6").innerHTML = name6;
    })
    apigClient.getTrackInfoByTrackIdGet({"track_id": recommend7}, body, additionalParams).then(function(result7){
        name7 = result7["data"]["_source"]["title"]
        document.getElementById("name7").innerHTML = name7;
    })
    apigClient.getTrackInfoByTrackIdGet({"track_id": recommend8}, body, additionalParams).then(function(result8){
        name8 = result8["data"]["_source"]["title"]
        document.getElementById("name8").innerHTML = name8;
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
// BotRequest("shape of you,ed sheeran")

$(document).ready(function(){
    $(".click-to-jump").click(function(){
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
        var require = song + ",Guns N' Roses"
        console.log(require)
        BotRequest(require, (err, result) => {
            if (err) {
                console.log("error")
            } else {
                console.log(result.data.messages);
                let data = JSON.parse(result.data.messages[0].text);
                similarList = data[0];
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
                document.getElementById("similarList").innerHTML = similarList;
                document.getElementById("musicName").innerHTML = musicName;
                document.getElementById("singer").innerHTML = singer;
                document.getElementById("img").innerHTML = img;
                document.getElementById("playit").innerHTML = playit;





            }
        })
    });
});


