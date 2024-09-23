function renderChart() {
    // Remove any existing SVG to re-render on resize
    d3.select("#chart-container2 svg").remove();
    d3.select("#tooltip").remove();  // Remove any existing tooltip


    // Get the size of the container (it will change on window resize)
    const container = d3.select("#chart-container2");
    const containerWidth = container.node().getBoundingClientRect().width;
    const containerHeight = container.node().getBoundingClientRect().height;

    // Increase the top margin to create space for the title
    const margin = {top: 100, right: 150, bottom: 50, left: 50}; 
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;


    // Create the SVG container
    const svg = container
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Append an image to the chart
    svg.append("image")
    .attr("xlink:href", "/assets/Logo_black.svg")  // Path to the image file
    .attr("x", width-75)  // Adjust the x position to place the image as desired
    .attr("y", (height-100))          // Adjust the y position to place the image as desired
    .attr("width", 100)     // Set the width of the image
    .attr("height", 100)   // Set the height of the image
    .attr("opacity", 0.5);  // Set the opacity (50% visible)

    // Add the title
    svg.append("text")
        .attr("x", (width+50) / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("Kamala's polling lead")
        .style("font-size", "24px")
        .style("font-weight", "bold");

    // Parse the date and format the data
    const parseDate = d3.timeParse("%Y-%m-%d");

    // Load the data from external JSON file
    d3.json("pollingData.json?v=2").then(data => {

        // Convert date strings to Date objects
        data.forEach(d => {
            d.date = parseDate(d.date);
            d.diff = d.diff !== null ? +d.diff : null;
        });

        // Set scales
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([-4,4])
            .range([height, 0]);

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // Add Y axis
        svg.append("g").call(d3.axisLeft(y));

        // Add gridlines
        const makeXGridlines = () => d3.axisBottom(x).ticks(5);
        const makeYGridlines = () => d3.axisLeft(y).ticks(5);

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(makeXGridlines()
                .tickSize(-height)
                .tickFormat("")
            );

        svg.append("g")
            .attr("class", "grid")
            .call(makeYGridlines()
                .tickSize(-width)
                .tickFormat("")
            );




        //threshold coloring

        // Calculate offset for the 0 point in the y-axis
        const offset0 = y(0) / height; // This gives the relative position of 0 on the y-axis

        const gradientId = "threshold-gradient";

        // Define the gradient and map it to the chart area (based on the y scale)
        svg.append("linearGradient") // normally based on the full height of the SVG
            .attr("id", gradientId)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", "0%")
            .attr("y1", y(4))    // Corresponds to y-value +4
            .attr("x2", "0%")
            .attr("y2", y(-4))   // Corresponds to y-value -4
          .selectAll("stop")
          .data([
            { offset: "0%", color: "blue" },   // Blue at top
            { offset: `${(y(0) / height) * 100}%`, color: "blue" },  // Blue up to y(0)
            { offset: `${(y(0) / height) * 100}%`, color: "red" },   // Red from y(0)
            { offset: "100%", color: "red" }   // Red at bottom
          ])
          .join("stop")
            .attr("offset", d => d.offset)
            .attr("stop-color", d => d.color);
        
        
        
              
  
        // 0 Line
        svg.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", y(0))
            .attr("y2", y(0))
            .attr("stroke", "gray")
            .attr("stroke-width", 1)

        // Add candidate labels on the right side
        const latestData = data.filter(d => d.diff !== null).slice(-1)[0];

        svg.append("text")
            .attr("x", x(latestData.date) + 10)
            .attr("y", y(latestData.diff))
            .attr("fill", "blue")
            .attr("text-anchor", "start")
            .text(`Harris D+${latestData.diff}%`);


        // Line generator
        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.diff));

        // Append the line
            svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", `url(#${gradientId})`)
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", d3.line()
            .curve(d3.curveStep)
                .x(d => x(d.date))
                .y(d => y(d.diff)));
        

        // Add axis labels
        svg.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
            .style("text-anchor", "middle")
            .attr("class", "axis-label")
            .text("Date");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 15)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("class", "axis-label")
            .text("Difference (%)");


        // Add legend
        //const legend = svg.append("svg")
        //    .attr("class", "legend");

        //legend.append("rect")
        //    .attr("x", width + 15)
        //    .attr("y", 5)
        //    .attr("width", 15)
        ///    .attr("height", 15)
        //    .style("fill", "blue");

        //legend.append("text")
         //   .attr("x", width + 35)
        //    .attr("y", 17)
        //    .text("Kamala Harris");

       // legend.append("rect")
       //     .attr("x", width + 15)
       //     .attr("y", 25)
        //    .attr("width", 15)
        //    .attr("height", 15)
        //    .style("fill", "red");

       // legend.append("text")
       //     .attr("x", width + 35)
       //     .attr("y", 37)
       //     .text("Donald Trump");



        // Add hover effects
        const bisectDate = d3.bisector(d => d.date).left;

        const focusLine = svg.append("line")
            .attr("stroke", "gray")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4")
            .style("display", "none");

        // Create the tooltip div (hidden by default)
        const tooltip = d3.select("body").append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .style("background", "white")
            .style("border", "1px solid black")
            .style("border-radius", "5px")  // Add a slight border radius for styling
            .style("padding", "8px")
            .style("pointer-events", "none")
            .style("z-index", "1000")         // Make sure tooltip is on top
            .style("display", "none");

            svg.append("rect")//creating rectangle around the chart
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mousemove", function(event) {
                const mouseX = d3.pointer(event, this)[0];
                const mouseY = d3.pointer(event, this)[1]; // Get mouse Y relative to rect
                const hoveredDate = x.invert(mouseX);
            
                const index = bisectDate(data, hoveredDate, 1);
                const d0 = data[index - 1];
                const d1 = data[index];
                const d = hoveredDate - d0.date > d1.date - hoveredDate ? d1 : d0;

            
                // Show vertical hover line
                focusLine
                    .attr("x1", x(d.date))
                    .attr("x2", x(d.date))
                    .attr("y1", 0)
                    .attr("y2", height)
                    .style("display", "block");
            

                // Set the tooltip position based on the vertical line's x-position and the height of the chart
                tooltip
                    .style("left", (event.pageX + 10) + "px") // PageX for position in viewport
                    .style("top", (event.pageY - 30) + "px") // Adjust to show above the mouse
                    .style("display", "inline-block")
                    .html(`
                        <strong>Date:</strong> ${d3.timeFormat("%B %d, %Y")(d.date)}<br/>
                        <strong>Difference:</strong> ${d.diff}%<br/>`
                    );
            })            
            .on("mouseout", () => {
                focusLine.style("display", "none");
                tooltip.style("display", "none");
            });
            

    });

}

// Call the function initially to render the chart
renderChart();

// Add an event listener to redraw the chart when the window is resized
window.addEventListener("resize", renderChart);