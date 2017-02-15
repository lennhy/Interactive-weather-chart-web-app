function WeatherController(WeatherService) {
var vm = this;
var url = 'js/weather.json';
var currentDay = new Date().toString().substring(0,3);
console.log(currentDay);
// -------------------GET DATA VIA HTTP REQUEST

WeatherService
.httpGetWeatherByState(url)
  .then(function (obj){
    // console.log(obj);
    vm.currentWeather =  obj.data.query.results.channel;
    vm.weatherForcast = obj.data.query.results.channel.item.forecast;
    returnData(vm.weatherForcast);
  });

// ------------------------TOGGLE FUNCTION

vm.toggle = function(){

  let moreData= document.getElementById("more-data-container");
  if(moreData.style.display == "none"){
    moreData.style.display = "block";
  }else{
    moreData.style.display = "none";
  }
}

var height= 500;
var width = 500;
var formattedDataArrayLows =[];
var formattedDataArrayHighs=[];
var margin = {left:0, right:260, top:-200, bottom:0};

// --------------------------PREP DATA

function returnData(arr){

    var lows =[];
    var highs =[];
    var dates =[];
    var days =[];

    arr.map(function(x,i){
        let lowTemp = parseInt(x.low)
        lows.push(lowTemp);
        lows.sort();

        // high temperatures numbers array
        let highTemp = parseInt(x.high)
        highs.push(highTemp);
        highs.sort();

        // Date numbers array
        date = parseInt(x.date);
        dates.push(date);
        dates.sort();

        // Organize all Data accordingly to be displayed on the chart
        let obj = {x:i, y:parseInt(x.low)}
        formattedDataArrayLows.push(obj);

        // Days array
        day = x.day;
        days.push(day);

        // Organize all Data accordingly to be displayed on the chart
        obj = {x:i, y:parseInt(x.high)}
        formattedDataArrayHighs.push(obj);


    });




// ---------------------------------- CREATE CHART PATH GENERATOR

// Create an SVG Path
var svg = d3.select(".chart").append("svg")
.attr("height", "100%")
.attr("width","100%");

//  Append a group called g
var chartGroup = svg.append("g").attr("transform", "translate(260, 0)");

//  Create d3 line generator
 line = d3.line()
      .x(function(d, i){return d.x*60;})
      .y(function(d, i){return d.y*15;})
      .curve(d3.curveCardinal);

//  Create d3 line generator
 lineTwo = d3.line()
      .x(function(d, i){return d.x*60;})
      .y(function(d, i){return d.y*15;})
      .curve(d3.curveCardinal);


// Execute the Path line
chartGroup.append("path")
      .attr("fill", "none")
      .attr("stroke", "#007acc")
      .attr("d", line(formattedDataArrayLows))
      .attr("transform", "translate("+margin.left+","+margin.top+")");

// Execute the Path line
chartGroup.append("path")
      .attr("fill", "none")
      .attr("stroke", "#00cc00")
      .attr("d", lineTwo(formattedDataArrayHighs))
      .attr("transform", "translate(0,-400)");


// ---------------------------------- SVG CIRCLE NODES AND TOOLTIP EVENT

var tooltip = d3.select("chart").append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);
// Circular  Nodes on path
chartGroup.selectAll("circle.first")
       // binds data to elements
      .data(formattedDataArrayLows)
       // compares the data we have on the page with our source data
     .enter().append("circle")
            .style("fill", "#007acc")
            .attr("class", "first")
            .attr("cx", function(d, i){return d.x*60;})
            .attr("cy", function(d, i){return d.y*15;})
            .attr("r", 5)
            .attr("transform", "translate("+margin.left+","+margin.top+")")
            chartGroup.selectAll("circle.first")
                  .data(arr)
                  .on("mouseover", function(d) {
                            tooltip
                           .style("opacity", 1)
                           .style("left", (d3.event.pageX) + "px")
                           .style("top", (d3.event.pageY - 28) + "px");})

                 .on("mouseout", function(d) {
                   tooltip
                     .style("opacity", 0).text(d.day + ", "+ d.low +", " + d.text)
                     console.log(d);
                  });


// Circular  Nodes on path
chartGroup.selectAll("circle.second")
     // binds data to elements
     .data(formattedDataArrayHighs)
     // compares the data we have on the page with our source data
     .enter().append("circle")
            .style("fill", "#00cc00")
            .attr("class", "second")
            .attr("cx", function(d, i){return d.x*60;})
            .attr("cy", function(d, i){return d.y*15;})
            .attr("r", 5)
            .attr("transform", "translate(0,-400)");
            chartGroup.selectAll("circle.second")
                  .data(arr)
                  .on("mouseover", function(d) {
                            tooltip
                           .style("opacity", 1)
                           .style("left", (d3.event.pageX) + "px")
                           .style("top", (d3.event.pageY - 28) + "px");})

                 .on("mouseout", function(d) {
                   tooltip
                     .style("opacity", 0).text(d.day + ", "+ d.high +", " + d.text)
                     console.log(d);
                  });



// ---------------------------------- X AXIS Y AXIS SCALE

// Scale bars
var y = d3.scaleLinear()
      .domain([0, 100])
      .range([height,0]);

var x = d3.scalePoint()
      .domain(days)
      .range([0, width]);

var yAxis = d3.axisLeft(y);
var xAxis = d3.axisBottom(x);


// ---------------------------------- GROUPS

// chartGroup.append("path").attr("d", line(lows))
svg.append("g")
        .attr("class", "axis y")
        .attr("transform", "translate(260, 0)")
        .call(yAxis);

svg.append("g")
        .attr("class", "axis x")
        .attr("transform", "translate(260, 500)")
        .call(xAxis);
      }
}

angular
    .module('weatherApp')
    .controller('WeatherController', WeatherController);
