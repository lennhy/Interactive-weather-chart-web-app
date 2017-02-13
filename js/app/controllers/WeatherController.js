function WeatherController(WeatherFactory) {
  var vm = this;
  var url = 'js/weather.json';

  WeatherFactory
    .httpGetWeatherByState(url)
      .then(function (object){
        vm.weather = object.data.query;
        console.log(vm.weather)
      });


  var dataArray = [
    {
     "code": "23",
     "date": "22 Nov 2016",
     "day": "Tue",
     "high": "44",
     "low": "35",
     "text": "Breezy"
    },
    {
     "code": "30",
     "date": "23 Nov 2016",
     "day": "Wed",
     "high": "47",
     "low": "34",
     "text": "Partly Cloudy"
    },
    {
     "code": "26",
     "date": "24 Nov 2016",
     "day": "Thu",
     "high": "51",
     "low": "38",
     "text": "Cloudy"
    },
    {
     "code": "26",
     "date": "25 Nov 2016",
     "day": "Fri",
     "high": "51",
     "low": "45",
     "text": "Cloudy"
    },
    {
     "code": "30",
     "date": "26 Nov 2016",
     "day": "Sat",
     "high": "51",
     "low": "44",
     "text": "Partly Cloudy"
    },
    {
     "code": "30",
     "date": "27 Nov 2016",
     "day": "Sun",
     "high": "49",
     "low": "38",
     "text": "Partly Cloudy"
    },
    {
     "code": "12",
     "date": "28 Nov 2016",
     "day": "Mon",
     "high": "50",
     "low": "38",
     "text": "Rain"
    },
    {
     "code": "12",
     "date": "29 Nov 2016",
     "day": "Tue",
     "high": "54",
     "low": "42",
     "text": "Rain"
    },
    {
     "code": "28",
     "date": "30 Nov 2016",
     "day": "Wed",
     "high": "54",
     "low": "43",
     "text": "Mostly Cloudy"
    },
    {
     "code": "39",
     "date": "01 Dec 2016",
     "day": "Thu",
     "high": "51",
     "low": "42",
     "text": "Scattered Showers"
    }
   ]
  // Bargraph
  // save svg in a variable to reuse and add shapes and data
  // const svg = d3.select(".chart").append("svg")
  //   .attr("height", "100%")
  //   .attr("width","100%");

  // svg.selectAll("rect")
  //   // binds data to elements
  //   .data(dataArray)
  //   .enter().append("rect")
  //           .attr("height", function(d,i){return d.high * 5;})
  //           .attr("width", "50")
  //           .attr("x", function(d,i){return 60 * i;})
  //           .attr("y", function(d,i){return 300-(d.high * 5);});
  //
  // // Circle
  // var newX = -300;
  // svg.selectAll("circle.first")
  //      // binds data to elements
  //      .data(dataArray)
  //      .enter().append("circle") // compares the data we have on the page with our source data
  //             .attr("class", "first")
  //             .attr("cx", function(d,i){newX+=(d.high *2) + (i*4);return newX;})
  //             .attr("cy", "400")
  //             .attr("r",  function(d){ return d.high;});
  //
  // // // line
  // var newX = 600;
  // svg.selectAll("line")
  //       // binds data to elements
  //       .data(dataArray)
  //       .enter().append("line")
  //              .attr("x1", newX)
  //              .attr("y1", function(d, i) {return 80+(i*20); })
  //              .attr("x2", function(d) {return newX+(d.high*15); })
  //              .attr("y2","30")
  //
  // // text
  // var textArray = ["start", "middle", "end"];
  // svg.append("text").selectAll("tspan")
  //       .data(textArray)
  //       .enter().append("tspan")
  //       .attr("x", newX)
  //       .attr("y", function(d,i){return 150+ (i*30);})
  //       .attr("font-size", "40")
  //       .text(function(d){return d;});

  // DAYS
  // var d = new Date();
  // var weekday = new Array(7);
  // weekday[0] =  "Sun";
  // weekday[1] = "Mon";
  // weekday[2] = "Tue";
  // weekday[3] = "Wed";
  // weekday[4] = "Thu";
  // weekday[5] = "Fri";
  // weekday[6] = "Sat";
  //
  // var currentDay = weekday[d.getDay()]



  // ---------------------------------- VARIABLES

  // var dataDays = [
  //   "Sun",
  //   "Mon",
  //   "Tue",
  //   "Wed",
  //   "Thu",
  //   "Fri",
  //   "Sat"
  // ]

  var height= 500;
  var width = 500;
  var formattedDataArray =[];
  var lows =[];
  var highs =[];
  var dates =[];
  var days =[];

  var margin = {left:0, right:260, top:-200, bottom:0};

  // Low temperatures numbers array
  dataArray.map(function(x,i){
    let lowTemp = parseInt(x.low)
    lows.push(lowTemp);
    return lows.sort();
  });

  // high temperatures numbers array
  dataArray.map(function(x,i){
    let highTemp = parseInt(x.high)
    highs.push(highTemp);
    return highs.sort();
  });

  // Date numbers array
  dataArray.map(function(x,i){
    date = parseInt(x.date);
    dates.push(date);
    return dates.sort();
  });

  // Organize all Data accordingly to be displayed on the chart
  dataArray.map(function(x,i){
    let obj = {x:i, y:parseInt(x.low)}
    formattedDataArray.push(obj);
  });

  // Days array
  dataArray.map(function(x,i){
    day = x.day;
    days.push(day);
  });
  // ---------------------------------- PATH GENERATOR

  // Create an SVG Path
  var svg = d3.select(".chart").append("svg")
    .attr("height", "100%")
    .attr("width","100%");

  //  Append a group called g
  var chartGroup = svg.append("g").attr("transform", "translate(260, 0)");

  //  Create d3 line generator
  var line = d3.line()
          .x(function(d, i){return d.x*60;})
          .y(function(d, i){return d.y*15;})
          .curve(d3.curveCardinal);

  // Execute the Path line
  chartGroup.append("path")
          .attr("fill", "none")
          .attr("stroke", "blue")
          .attr("d", line(formattedDataArray))
          .attr("transform", "translate("+margin.left+","+margin.top+")");



  // ---------------------------------- SVG CIRCLE NODES

  // Circular  Nodes on path
  chartGroup.selectAll("circle.first")
           // binds data to elements
           .data(formattedDataArray)
           // compares the data we have on the page with our source data
           .enter().append("circle")
                  .style("fill", "blue")
                  .attr("class", "first")
                  .attr("cx", function(d, i){return d.x*60;})
                  .attr("cy", function(d, i){return d.y*15;})
                  .attr("r", 2)
                  .attr("transform", "translate("+margin.left+","+margin.top+")");



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

angular
        .module('weatherApp')
        .controller('WeatherController', WeatherController);
