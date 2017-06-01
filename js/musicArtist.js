window.onload = function () {
  document.getElementById("show_button").style.display = 'none';
  document.getElementById("selectedImageSection").style.display = 'block';
}

function clearSearchField() {
  document.getElementById("search_text").value = "";
  document.getElementById("search_text").focus();
}

function backToSearch(){

  document.getElementById("show_button").style.display = 'none';
  document.getElementById("gallery-detail").style.display = 'block';
  document.getElementById("detail_button").style.display = 'none';
  document.getElementById("gallery-photo").style.display = 'none';
  //document.getElementById("pager").style.display = 'none';
  document.getElementById("selectedImageSection").style.display = 'block';
  document.getElementById("detail").style.display = 'block';
  //document.getElementById("selected-photo").style.display = 'none';
  document.getElementById("zoom-photo").style.display = 'none';
  clearSearchField();
}

function searchMusicArtist() {
  var search_value = document.getElementById("search_text").value;
  var apiKey = 'spmrwRJvotGBaGgrhAiA';
  var secretKey = 'nWHUTMqsEWSgOFhYQNsdkKJSzyEWWZsG';
  var xmlhttp, jsonResponse;

  /*** Initialize the AJAX */
  if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
  }

  if(!search_value){
    alert('please provide a text to search for');/*handle it in a good way*/
    clearSearchField();
  }else{
    //https://api.discogs.com/database/search?q=Usher&type=artist&secret=nWHUTMqsEWSgOFhYQNsdkKJSzyEWWZsG&key=spmrwRJvotGBaGgrhAiA
    var requestURL = 'https://api.discogs.com/database/search?type=artist&key=' + apiKey + '&secret=' + secretKey + '&q=' + search_value;
    xmlhttp.open("GET", requestURL, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var actualResponse = JSON.parse(xmlhttp.responseText);
            var artistId = actualResponse.results[0].id;
            //https://api.discogs.com/artists/97139?secret=secretKey&key=apiKey
            var discogsURL = 'https://api.discogs.com/artists/97139?secret=' + secretKey +'&key=' + apiKey;
            xmlhttp.open("GET", discogsURL, true);
            xmlhttp.send();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var discogsResponse = JSON.parse(xmlhttp.responseText);
                    var aliasArray = [];
                    var nameArray = [];
                    var imageId = document.getElementById("imgArtist");
                    var name = document.getElementById("name");
                    var realName = document.getElementById("birthName");
                    var birthDate = document.getElementById("dob");
                    var alias = document.getElementById("alias");
                    //var nameVariants = document.getElementById("variations");
                    var genre = document.getElementById("artistGenre");
                    var activeYears = document.getElementById("yearActive");
                    var profile = document.getElementById("profile");

                    imageId.src = discogsResponse.images[0].resource_url;
                    name.innerHTML = discogsResponse.name;
                    realName.innerHTML = discogsResponse.realname;
                    birthDate.innerHTML = discogsResponse.dateofbirth;

                    for (var i = 0; i < discogsResponse.aliases.length; i++){
                      var aliasVar = discogsResponse.aliases[i].name;
                      aliasArray.push(aliasVar);
                    }
                    alias.innerHTML = aliasArray;
                    profile.innerHTML = discogsResponse.profile;

                    var iTunesURL = 'https://itunes.apple.com/search?limit=8' + '&term=' + search_value;
                    xmlhttp.open("GET", iTunesURL, true);
                    xmlhttp.send();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                          var iTunesResponse = JSON.parse(xmlhttp.responseText);
                          //console.log(iTunesResponse);
                          var collectionId;
                          for (var i = 0; i < iTunesResponse.results.length; i++) {
                              collectionId = iTunesResponse.results[i].collectionId;
                              var src = iTunesResponse.results[i].artworkUrl30;
                              document.getElementById("gallery-photo").style.display = 'block';
                              document.getElementById("gallery-photo").style.cursor = 'pointer';
                              var list = document.createElement("li");
                              var img = document.createElement("img");
                              img.src = iTunesResponse.results[i].artworkUrl30;//src
                              img.width = '100';
                              img.height = '100';
                              img.id = iTunesResponse.results[i].collectionId;
                              list.appendChild(img);
                              document.getElementById('photolist').appendChild(list);
                          }
                          var photoListElement = document.getElementById("photolist").getElementsByTagName('li');
                          for(var i = 0; i<photoListElement.length; i++){
                              var imgElement = photoListElement[i];
                              imgElement.onclick = function(object){
                                  document.getElementById("selectedImageSection").style.display = 'block';
                                  document.getElementById("selected-photo").style.display = 'block';
                                  if (object.target.tagName == 'IMG') {
                                    var id = object.target.getAttribute("id");
                                    //console.log(id);
                                    // https://itunes.apple.com/lookup?id=386153476&entity=song
                                    var trackURL = 'https://itunes.apple.com/lookup?entity=song' + '&id=' + id;
                                    xmlhttp.open("GET", trackURL, true);
                                    xmlhttp.send();
                                    xmlhttp.onreadystatechange = function () {
                                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                                            var trackResponse = JSON.parse(xmlhttp.responseText);
                                            var trackImg = document.getElementById("imgTrack");
                                            var coll_name = document.getElementById("coll_name");
                                            var coll_price = document.getElementById("coll_price");
                                            var coll_genre = document.getElementById("coll_genre");
                                            var coll_copyright = document.getElementById("coll_copyright");
                                            var coll_released = document.getElementById("date_released");

                                            trackImg.src = trackResponse.results[0].artworkUrl60;
                                            coll_name.innerHTML = trackResponse.results[0].collectionName;
                                            coll_price.innerHTML = trackResponse.results[0].collectionPrice;
                                            coll_genre.innerHTML = trackResponse.results[0].primaryGenreName;
                                            coll_copyright.innerHTML = trackResponse.results[0].copyright;
                                            coll_released.innerHTML = trackResponse.results[0].releaseDate;

                                            for(var i = 0; i < trackResponse.results.length; i++){
                                                var track_table = "<table border='1|1'>";
                                                track_table+="<tr>";
                                                    track_table+="<th>"+'Track Name'+"</td>";
                                                    track_table+="<th>"+'Artist Name'+"</th>";
                                                    track_table+="<th>"+'Time'+"</th>";
                                                    track_table+="<th>"+'Price'+"</th>";
                                                track_table+="</tr>";
                                                for(i=0;i<trackResponse.results.length;i++){
                                                    if(trackResponse.results[i].trackName !== undefined){
                                                        track_table+="<tr>";
                                                            track_table+="<td>"+trackResponse.results[i].trackCensoredName+"</td>";
                                                            track_table+="<td>"+trackResponse.results[i].artistName+"</td>";
                                                            track_table+="<td>"+trackResponse.results[i].trackTimeMillis+"</td>";
                                                            track_table+="<td>"+trackResponse.results[i].trackPrice+"</td>";
                                                        track_table+="</tr>";
                                                    }
                                                }
                                                track_table+="</table>";
                                                document.getElementById("track_table").innerHTML = track_table;
                                            }
                                        }
                                    }
                                  }
                              }
                          }
                        }
                    }
                }
            }
        }
    };
    clearSearchField();
    //document.getElementById("selectedlist").innerHTML = '';
    document.getElementById("gallery-detail").style.display = 'none';
    document.getElementById("show_button").style.display = 'block';
    document.getElementById("back_button").style.display = 'block';
    document.getElementById("detail").style.display = 'block';
  }
}
