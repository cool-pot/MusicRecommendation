var apigClient = apigClientFactory.newClient();
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
let term = getParameterByName("searchterm");
// let term = "Taylor Swift"
let additionalParams={}
let body = {}
let params = {"term": term }
apigClient.generalSearchGet(params, body, additionalParams).then(function(result){
    console.log("------------------------------------------------------------------------------------")
    console.log("Succeed : generalSearchGet")
    data = result["data"]["hits"]["hits"]
    search1 = data[0]
    searchSinger1 = search1["_source"]["artist"]
    searchName1  = search1["_source"]["title"]
    search2 = data[1]
    searchSinger2 = search2["_source"]["artist"]
    searchName2  = search2["_source"]["title"]
    search3 = data[2]
    searchSinger3 = search3["_source"]["artist"]
    searchName3  = search3["_source"]["title"]
    search4 = data[3]
    searchSinger4 = search4["_source"]["artist"]
    searchName4  = search4["_source"]["title"]
    search5 = data[4]
    searchSinger5 = search5["_source"]["artist"]
    searchName5  = search5["_source"]["title"]
    search6 = data[5]
    searchSinger6 = search6["_source"]["artist"]
    searchName6  = search6["_source"]["title"]
    search7 = data[6]
    searchSinger7 = search7["_source"]["artist"]
    searchName7  = search7["_source"]["title"]
    search8 = data[7]
    searchSinger8 = search8["_source"]["artist"]
    searchName8  = search8["_source"]["title"]

    document.getElementById("searchName1").innerHTML = searchName1;
    document.getElementById("searchName2").innerHTML = searchName2;
    document.getElementById("searchName3").innerHTML = searchName3;
    document.getElementById("searchName4").innerHTML = searchName4;
    document.getElementById("searchName5").innerHTML = searchName5;
    document.getElementById("searchName6").innerHTML = searchName6;
    document.getElementById("searchName7").innerHTML = searchName7;
    document.getElementById("searchName8").innerHTML = searchName8;


}).catch(function(result){
    console.log("Error : generalSearchGet")
    console.log(result)
})


var artist
// BotRequest("shape of you,ed sheeran")
$(document).ready(function(){
    $(".click-to-jump").click(function(){
        if ($(this).attr("id") === "searchName1"){
            artist = searchSinger1
        }
        if ($(this).attr("id") === "searchName2"){
            artist = searchSinger2
        }
        if ($(this).attr("id") === "searchName3"){
            artist = searchSinger3
        }
        if ($(this).attr("id") === "searchName4"){
            artist = searchSinger4
        }
        if ($(this).attr("id") === "searchName5"){
            artist = searchSinger5
        }
        if ($(this).attr("id") === "searchName6"){
            artist = searchSinger6
        }
        if ($(this).attr("id") === "searchName7"){
            artist = searchSinger7
        }
        if ($(this).attr("id") === "searchName8"){
            artist = searchSinger8
        }
        // console.log(document.getElementById($(this).attr("id")).innerHTML);

        var song = document.getElementById($(this).attr("id")).innerHTML;
        window.location.assign("play.html?songname="+ song +"&artist="+ artist)

    });

});

