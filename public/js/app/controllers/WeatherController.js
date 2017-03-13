function WeatherController(WeatherService, $scope) {
  var vm = this;
  var url;
  vm.input = "newyork, us";

  // Change the input value when user types in a zip code
  vm.submitLocal = function(input){
    d3.select(".chart").selectAll("svg").remove();
    vm.input = input;
    url = `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${vm.input}")&format=json`;
    start();
  }

  // When window loads default location to new york
  Window.onload = start();
  vm.input = " "

  function start(){
    url = `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${vm.input}")&format=json`
    WeatherService
    .httpGetWeatherByState(url)
      .then(function (obj){
          if(obj === null || obj === undefined){
            let el = document.getElementById("error-message");
            el.innerHTML = "Something went wrong! Try reloading the page.";
            el.style.display = "block";
          }
          if(obj.data.query.results !== null || obj !== undefined){
            vm.currentWeather =  obj.data.query.results.channel;
            vm.weatherForcast = obj.data.query.results.channel.item.forecast;
            returnData(vm.weatherForcast);
          }
      }, function error(err){
          console.log(err);
    });

      let moreData= document.getElementById("more-data-container");
      moreData.style.display = "";


    // --------------------------------------TOGGLE FUNCTION

    vm.toggle = function(){
      vm.showMore = !vm.showMore;
    }

    var formattedDataArrayLows =[];
    var formattedDataArrayHighs=[];


    // -----------------------------------------PACKAGE DATA

    function returnData(weatherData){
      weatherData.splice(7,3);

        // var lows =[];
        var highs =[];
        var dates =[];
        var days =[];

        var lows = weatherData.map((e,i)=>{  return 100 - Number(e.low);})
        var highs = weatherData.map((e,i)=>{  return 100 - Number(e.high);})

        // console.log(newWeather)
        weatherData.forEach(function(x,i){
            // Organize all Data accordingly to be displayed on the chart
            let obj = {x:i,y:lows[i]}
            formattedDataArrayLows.push(obj);

            // Days array
            day = x.day;
            days.push(day);

            // Organize all Data accordingly to be displayed on the chart
            obj = {x:i, y:highs[i]}
            formattedDataArrayHighs.push(obj);

      });


    // ---------------------------------- CREATE CHART PATH GENERATOR

    function resizeChart(){
      window.addEventListener('resize', svg.render);
      var tooltip = d3.select("chart").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

      var height= window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

      // Create an SVG Path
      var svg = d3.select(".chart").append("svg")
      .attr("height", height)
      .attr("width", width);

      //  Append a group called g
      var chartGroup = svg.append("g").attr("transform", "translate(260, 100)");

      // ---------------------------------------LINE PATHS
       // Create d3 line generator
       // d = Path = "Mx,y Lx,y Lx,y Lx,y Lx,y Lx,y"
       // M = move to
       // L = Line to
       //  lows
       line = d3.line()
            .x(function(d, i){;return d.x*60;})
            .y(function(d, i){return d.y*5;})
            .curve(d3.curveCardinal);

       //  Create d3 line generator
       //  highs
       lineTwo = d3.line()
            .x(function(d, i){return d.x*60;})
            .y(function(d, i){return d.y*5;})
            .curve(d3.curveCardinal);


      // Execute the Path line for lows
      chartGroup.append("path")
            .attr("fill", "none")
            .attr("stroke", "#007acc")
            .attr("d", line(formattedDataArrayLows))
            .attr("transform", "translate(-200,-170)");

      // Execute the Path line for highs
      chartGroup.append("path")
            .attr("fill", "none")
            .attr("stroke", "#00cc00")
            .attr("d", lineTwo(formattedDataArrayHighs))
            .attr("transform", "translate(-200,-150)");



      // ---------------------------------- SVG CIRCLE NODES AND TOOLTIP EVENT

      // Green is high temperature
      chartGroup.append("circle")
                  .style("fill", "#007acc")
                  .attr("class", "example")
                  .attr("cx",360)
                  .attr("cy",-50)
                  .attr("r", 5);

      chartGroup.append("text")
                   .attr("class", "text")
                   .attr("x", 280)
                   .attr("y", -70)
                   .text("Highs");

      // Blue is low temperature
      chartGroup.append("circle")
                  .style("fill", "#00cc00")
                  .attr("class", "example")
                  .attr("cx", 300)
                  .attr("cy",-50)
                  .attr("r", 5);

     chartGroup.append("text")
                  .attr("class", "text")
                  .attr("x", 340)
                  .attr("y", -70)
                  .text("Lows");

      // Circular  Nodes on path
      chartGroup.selectAll("circle.first")
             // binds data to elements
            .data(formattedDataArrayLows)
             // compares the data we have on the page with our source data
           .enter().append("circle")
                  .style("fill", "#007acc")
                  .attr("class", "first")
                  .attr("cx", function(d, i){return d.x*60;})
                  .attr("cy", function(d, i){console.log(d.y*5);return d.y*5;})
                  .attr("r", 5)
                  .attr("transform", "translate(-200,-170)");
                  chartGroup.selectAll("circle.first")
                        .data(weatherData)
                        .on("mouseover", function(d) {
                                  tooltip
                                 .text(d.day + ", "+ d.low +", " + d.text)
                                 .style("opacity", 1)
                                 .style("left", (d3.event.pageX) + "px")
                                 .style("top", (d3.event.pageY - 28) + "px");})

                       .on("mouseout", function(d) {
                         tooltip
                         .style("opacity", 0)
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
                  .attr("cy", function(d, i){return d.y*5;})
                  .attr("r", 5)
                  .attr("transform", "translate(-200,-150)");
                  chartGroup.selectAll("circle.second")
                        .data(weatherData)
                        .on("mouseover", function(d) {
                                  tooltip
                                 .text(d.day + ", "+ d.high +", " + d.text)
                                 .style("opacity", 1)
                                 .style("left", (d3.event.pageX) + "px")
                                 .style("top", (d3.event.pageY - 28) + "px")
                               })

                       .on("mouseout", function(d) {
                         tooltip
                           .style("opacity", 0)
                        });

      // ---------------------------------- X AXIS Y AXIS SCALE

      // Scale bars
      var y = d3.scaleLinear()
            .domain([0, 100])
            .range([400,40]);

      var x = d3.scalePoint()
            .domain(updateToCurrentDay(days))
            .range([0, 360])

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

      // --------------------------------------- GROUPS

      // chartGroup.append("path").attr("d", line(lows))
      svg.append("g")
              .attr("class", "axis y")
              .attr("transform", "translate(60, 0)")
              .call(yAxis);

      svg.append("g")
              .attr("class", "axis x")
              .attr("transform", "translate(60, 400)")
              .call(xAxis);
      }
          d3.select(window).on("resize", resizeChart());
    }
  }
}

angular
    .module('weatherApp')
    .controller('WeatherController', WeatherController);
