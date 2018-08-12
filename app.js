//Define the SVG area dimensions.
var svgWidth = 950;
var svgHeight = 750;

//Define the chart's margins as an object.
var margin = {
	top: 60,
	right: 40,
	bottom: 100,
	left: 100
};

//Define the dimensions of the chart area.
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

//Create a SVG warper and append the SVG group that will hold our chart and 
//the latter by the top and right margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

//Append a div to the body to create tooltips, and assign it a class.
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 1);

//Load the CSV file.
d3.csv("data/data.csv", function(error,healthAge){
	if (error) throw error;

	healthAge.forEach(function(data){
		data.age = +data.age;
		data.smokes = +data.smokes;
	});


	//Create the xBandScale function.
	var xLinearScale = d3.scaleLinear().range([0, chartWidth]);

	//Create the yLinearScale function.

	var yLinearScale = d3.scaleLinear().range([chartHeight,0]);

	

	//Create the axis functions.
	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

	//Scale the domain.
	xLinearScale.domain([0, d3.max(healthAge, function(data){
		return +data.age;
	})]);

	yLinearScale.domain([0, d3.max(healthAge,function(data){
		return +data.smokes;
	})]);

	//Associate the tooltips with the data.
	var toolTip = d3.tip()
	  .attr("class", "toolTip")
	  .offset([80, -60])
	  .html(function(data) {
	    var state = data.state;
	    var smokingRate = +data.smokes;
	    var age = +data.age;
	    return (state + "<br> Smoke Rate " + smokes + "<br> Percentage of People who smoke based on age: " + age);
	  });

	 chart.call(toolTip);

	//Function to append the data points to the chart.
	 chart.selectAll("circle")
	  .data(healthData)
	  .enter().append("circle")
	    .attr("cx", function(data, index) {
	    	console.log(data.poverty);
	    	return xLinearScale(data.poverty);
	    })
	    .attr("cy", function(data, index) {
	    	console.log(data.healthStatus);
	    	return yLinearScale(data.healthAge);
	    })
	    .attr("r", "10")
	    .attr("fill","blue")
	    .style("opacity", 0.5)
	    .on("click", function(data) {
	    	toolTip.show(data);
	    })
	    //On mouseout event.
	    .on("mouseout", function(data, index) {
	    	toolTip.hide(data);
	    });	

	  //Append the bottom axis.
	  chart.append("g")
	   .attr("transform", `translate(0, ${chartHeight})`)
	   .call(bottomAxis);

     //Append the left axis.
     chart.append("g")
       .call(leftAxis);

     //Append the y-axis labels.
     chart.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left + 40)
       .attr("x", 0 - (chartHeight))
       .attr("dy", "1em")
       .attr("class", "axisText")
       .text("Percentage of the Population in Fair or Poor Health");

     //Append the x-axis labels.
    chart.append("text")
     .attr("transform", "translate(" + (chartWidth/3) + "," + (chartHeight + margin.top + 30) + ")") 
     .attr("class", "axisText")
     .text("Percentage of the Population Below the Poverty Line");

});