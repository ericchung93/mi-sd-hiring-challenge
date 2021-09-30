import { convertDate } from "./utils";

var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


function getDate(){
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    
    return today;
}

const getLocation = async (zip_code) => {
    
    const response = await fetch('https://se-weather-api.herokuapp.com/api/v1/geo?zip_code=' + zip_code);
    const locJson = await response.json(); //extract JSON from the http response
    if(locJson.latitude == undefined || locJson.longitude == undefined){
        alert("Please enter a valid zipcode!");
    }
    else{
        var date = getDate();
        console.log(locJson);
        var content = "<h3 class='location' style=text-align='center'>WEATHER FORECAST FOR "+locJson.city.toUpperCase()+", "+locJson.regionCode+"</h3>";
        document.getElementById('header').innerHTML = content;
        getForecast(locJson.latitude, locJson.longitude, date);
    }
  }

const getForecast = async (lat, long, tdate) => {
    const response = await fetch('https://se-weather-api.herokuapp.com/api/v1/forecast?latitude=' + lat + '&longitude=' + long + '&date=' + tdate);
    const forcJson = await response.json();
    console.log(forcJson);
    buildTable(forcJson);
}

function buildTable(forecast){
    var tomorrow = new Date().getDay() + 1;
    if (tomorrow == 7){     // After Saturday, return to Sunday (value of 0)
        tomorrow = 0;
    }
    var dayafter = tomorrow + 1;
    if (dayafter == 7){ 
        dayafter = 0;
    }
    var content = "<tr><th>Today: </th><th>"+week[tomorrow]+": </th><th>"+week[dayafter]+": </th></tr>"

    content += "<tr>";
    for (var i = 0; i < 3; i++){
        content+= "<td><img src='img/"+ forecast.daily.data[i].icon + ".png'><div>"+ capitalize(forecast.daily.data[i].icon) +"</div><div>"+ parseInt(forecast.daily.data[i].temperatureHigh) + "/" + parseInt(forecast.daily.data[i].temperatureLow) +"°F</div></td>";
    }
    content += "</tr>";
    console.log(content);
    document.getElementById('display').innerHTML = content;

}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1);
}

window.onload = function(){
    document.getElementById('gobtn').onclick = function() {
        var zip_code = document.getElementById('ziptxt').value;
        getLocation(zip_code);
    }
}
