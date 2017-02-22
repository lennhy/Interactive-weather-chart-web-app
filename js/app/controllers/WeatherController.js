function WeatherController(WeatherService) {
var vm = this;
var url;
vm.input = "newyork, us";

// Change the input value when user types in a zip code
vm.submitLocal = function(input){
  vm.input = input;
  url = `http://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${vm.input}")&format=json`;
  start();
}

// when window loads default location to new york
Window.onload = start();
function start(){
  url = `http://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${vm.input}")&format=json`
  WeatherService
  .httpGetWeatherByState(url)
    .then(function (obj){
      // console.log(obj.data);
      vm.currentWeather =  obj.data.query.results.channel;
      vm.weatherForcast = obj.data.query.results.channel.item.forecast;
      returnData(vm.weatherForcast);
      console.log(vm.weatherForcast);

    });
    let moreData= document.getElementById("more-data-container");
    moreData.style.display = "";

  // ------------------------TOGGLE FUNCTION
  vm.toggle = function(){
    vm.showMore = !vm.showMore;
  }

  var height= 500;
  var width = 360;
  var formattedDataArrayLows =[];
  var formattedDataArrayHighs=[];
  var margin = {left:0, right:260, top:-120, bottom:0};

  // --------------------------PREP DATA

  function returnData(weatherData){
    weatherData.splice(7,3);
    console.log(weatherData);

      var lows =[];
      var highs =[];
      var dates =[];
      var days =[];

      weatherData.map(function(x,i){
        console.log(x,i);
          // Low temperatures
          let lowTemp = parseInt(x.low)
          lows.push(lowTemp);
          lows.sort();

          // High temperatures numbers array
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
      console.log(weatherData);




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
        .y(function(d, i){console.log(d.y*10);  return d.y*10;})
        .curve(d3.curveCardinal);

  //  Create d3 line generator
   lineTwo = d3.line()
        .x(function(d, i){return d.x*60;})
        .y(function(d, i){return d.y*10;})
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
        .attr("transform", "translate(0,-270)");


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
              .attr("cy", function(d, i){return d.y*10;})
              .attr("r", 5)
              .attr("transform", "translate("+margin.left+","+margin.top+")")
              chartGroup.selectAll("circle.first")
                    .data(weatherData)
                    .on("mouseover", function(d) {
                              tooltip
                             .style("opacity", 1)
                             .style("left", (d3.event.pageX) + "px")
                             .style("top", (d3.event.pageY - 28) + "px");})

                   .on("mouseout", function(d) {
                     tooltip
                       .style("opacity", 0).text(d.day + ", "+ d.low +", " + d.text)
                      //  console.log(d);
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
              .attr("cy", function(d, i){return d.y*10;})
              .attr("r", 5)
              .attr("transform", "translate(0,-270)");
              chartGroup.selectAll("circle.second")
                    .data(weatherData)
                    .on("mouseover", function(d) {
                              tooltip
                             .style("opacity", 1)
                             .style("left", (d3.event.pageX) + "px")
                             .style("top", (d3.event.pageY - 28) + "px")
                             .text(d.day + ", "+ d.high +", " + d.text);
                           })

                   .on("mouseout", function(d) {
                     tooltip
                       .style("opacity", 0)
                      //  console.log(d);
                    });



  // ---------------------------------- X AXIS Y AXIS SCALE

  // Scale bars
  var y = d3.scaleLinear()
        .domain([0, 100])
        .range([height,0]);

  var x = d3.scalePoint()
        .domain(updateToCurrentDay(days))
        .range([0, width])




  var yAxis = d3.axisLeft(y);
  var xAxis = d3.axisBottom(x);

  // display the day on chart matching today as the to current day
  function updateToCurrentDay(daysOfTheWeek){
      var currentDay = new Date().toString().substring(0,3);
      for(let i=0; i<days.length; i++) {
        if(daysOfTheWeek[i]==currentDay){
          daysOfTheWeek[i] = "Today";
        }
      }
      return daysOfTheWeek;
  }


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
}

angular
    .module('weatherApp')
    .controller('WeatherController', WeatherController);
