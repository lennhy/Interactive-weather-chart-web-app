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
var d = new Date();
var weekday = new Array(7);
weekday[0] =  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

var currentDay = weekday[d.getDay()]

// Path genertors
const svg = d3.select(".chart").append("svg")
  .attr("height", "100%")
  .attr("width","100%")

var newArr =[];
var lows =[];
var dates =[];

var margin = {left:250, right:250, top:600, bottom:0};

// Create a new array with low temperatures numbers
dataArray.map(function(x,i){
  let lowTemp = parseInt(x.low)
  lows.push(lowTemp);
  return lows.sort();
});

// Create a new array with low temperatures numbers
dataArray.map(function(x,i){
  date = parseInt(x.date)
  dates.push(date);
  return dates.sort();
});

// Create a new array with data
dataArray.map(function(x,i){
  let obj = {x:parseInt(x.low*2), y:5+(i*15)}
  newArr.push(obj);
});

var height= 200;
var width = 500;
// Create scale
// var y = d3.scaleLinear()
//         .domain([0,d3.max(dataArray)])
        // .range(lows[lows.length-1],0);

var y = d3.scaleLinear()
        .domain(d3.extent(lows))
        .range([height,0]);

// var x = d3.scaleLinear()
//         .domain([dataArray[0].date.substring(0,2), dataArray[dataArray.length-1].date.substring(0,2)])
//         .range([lows[lows.length-1], lows[0]]);

var x = d3.scaleLinear()
        .domain(d3.extent(dates))
        .range([0,width]);
// var x = d3.scaleTime()
//         .domain([0,d3.max(dataArray)])
//         .range(0, lows[lows.length-1],0);


var yAxis = d3.axisLeft(y);


// svg line is an elements d3 line is a generator
var line = d3.line()
        .x(function(d){return d.x*6;})
        .y(function(d){return d.y*4;})
        .curve(d3.curveCardinal);

svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("d", line(newArr))
        .attr("transform", "translate("+margin.left+","+margin.top+") rotate(270)");

//  nodes on path
svg.selectAll("circle.first")
         // binds data to elements
         .data(newArr)
         .enter().append("circle") // compares the data we have on the page with our source data
                .style("fill", "red")
                .attr("class", "first")
                .attr("cx", function(d){return d.x*6;})
                .attr("cy", function(d){return d.y*4;})
                .attr("r", 4)
                .attr("transform", "translate("+margin.left+","+margin.top+") rotate(270)");
