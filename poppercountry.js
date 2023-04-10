// set the dimensions and margins of the graph
const margin = { top: 30, right: 70, bottom: 150, left: 60 },
  width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to body of page
const svg = d3
  .select("#bargraph")

  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Parse the Data
d3.csv("countrypop.csv") //, function (d) {

  .then(function (data) {
    // make X axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.Country))
      .padding(0.4);

    //create the x axis labels
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
    //title the x axis
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 9)
      .attr("x", -margin.top)
      .style("fill", "black")
      .text("Country");

    // Add and format Y axis
    const y = d3.scaleLinear().domain([0, 300000]).range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));
    //add y axis label
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.top + 17)
      .style("fill", "black")
      .text("Popularity");
    //add chart title
    svg
      .append("text")
      .attr("class", "title")
      .attr("x", width / 5)
      .attr("y", 1)
      .style("fill", "black")
      .text("Popularity over countries");

    var tooltip = d3
      .select("#bargraph")
      .append("div")
      .style("opacity", 1)
      .attr("class", "#tooltip")
      .style("background-color", "black")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("padding", "3px");

    var mouseover = function (event, d) {
      tooltip.style("opacity", 1);
    };
    var mousemove = function (event, d) {
      tooltip
        .html(d.Title)
        // .style("left", event.x / 2 + "px")
        // .style("top", event.y / 2 - 30 + "px");
        .style("left", event.pageX / 2 + "px")
        .style("top", event.pageY / 2 - 10 + "px");
      //console.log(d.Title);
    };
    var mouseleave = function (event, d) {
      tooltip.style("opacity", 0);
    };

    // var showToolTip = function (event, d) {
    //   tooltip.transition().duration(100).style("opacity", 1);
    //   tooltip
    //     .html("title: " + d.Title)
    //     .style(
    //       "left",
    //       event.clientX - svg.node().getBoundingClientRect().x + "px"
    //     )
    //     .style(
    //       "top",
    //       event.clientY - svg.node().getBoundingClientRect().y - 30 + "px"
    //     );
    // };

    // var moveToolTip = function (event, d) {
    //   tooltip
    //     .style("left", event.x / 2 + "px")
    //     .style("top", event.y / 2 - 30 + "px");
    // };

    // var hideToolTip = function (event, d) {
    //   tooltip.transition().duration(100).style("opacity", 0);
    // };

    // create bars
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.Country);
      })
      .attr("width", x.bandwidth())
      .attr("fill", "#ff0000")
      .attr("height", function (d) {
        return height - y(d.Popularity);
      })
      .attr("y", function (d) {
        return y(d.Popularity);
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    //add transition to the bars
    // svg
    //   .selectAll("rect")
    //   .transition()
    //   .duration(800)
    //   .attr("y", function (d) {
    //     return y(d.Popularity);
    //   })
    //   .attr("height", function (d) {
    //     return height - y(d.Popularity);
    //   })
    //   .delay(function (d, i) {
    //     return i * 100;
    //   });
  })
  .catch(function (error) {
    //for understanding why chart was not intially working
    console.error(error);
  });
