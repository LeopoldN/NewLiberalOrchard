function renderChart() {
    // Remove any existing SVG to re-render on resize
    d3.select("#chart-container svg").remove();
    d3.select("#tooltip").remove();  // Remove any existing tooltip

    // Get the size of the container (it will change on window resize)
    const container = d3.select("#chart-container");
    const containerWidth = container.node().getBoundingClientRect().width;
    const containerHeight = container.node().getBoundingClientRect().height;

    // Increase the top margin to create space for the title
    const margin = {top: 100, right: 150, bottom: 50, left: 50}; 
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Append the svg object to the chart container
    const svg = container
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add the title
    svg.append("text")
        .attr("x", (width+50) / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("2024 Presidential Election Polling")
        .style("font-size", "24px")
        .style("font-weight", "bold");

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
            .text("Likely Vote (%)");

    const parseTime = d3.timeParse("%Y-%m-%d");

    // Load the JSON data
    d3.json("pollingData.json?v=1").then(data => {
        data.forEach(d => {
            d.date = parseTime(d.date);
            d.harris = +d.harris;
            d.trump = +d.trump;
        });

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([40, 55])
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

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

        const lineHarris = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.harris));

        const lineTrump = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.trump));

        // Draw lines for each candidate
        svg.append("path")
            .datum(data)
            .attr("class", "line harris")
            .attr("d", lineHarris)
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none");

        svg.append("path")
            .datum(data)
            .attr("class", "line trump")
            .attr("d", lineTrump)
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("fill", "none");

        // Add candidate labels on the right side
        const latestData = data[data.length - 1];

        svg.append("text")
            .attr("x", width + 10)
            .attr("y", y(latestData.harris))
            .attr("fill", "blue")
            .attr("text-anchor", "start")
            .text(`Harris ${latestData.harris}%`);

        svg.append("text")
            .attr("x", width + 10)
            .attr("y", y(latestData.trump))
            .attr("fill", "red")
            .attr("text-anchor", "start")
            .text(`Trump ${latestData.trump}%`);


        // Add event lines and labels
        const eventDates = [
            {date: "2024-07-21", label: "Biden drops"},
            {date: "2024-08-19", label: "DNC"},
            {date: "2024-08-21", label: "Kennedy drops"}
        ];

        // Parse event dates and add event lines
        eventDates.forEach((event,index) => {
            const eventDate = parseTime(event.date);
            let shift = 0;
            if(index ==1) {shift =-15
            }else if(index==2) {shift=45};

            // Add the vertical line for the event
            svg.append("line")
                .attr("x1", x(eventDate))
                .attr("x2", x(eventDate))
                .attr("y1", 0)  
                .attr("y2", height)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "4");

            // Add the event label text
            svg.append("text")
                .attr("x", x(eventDate)+shift)
                .attr("y", -10)  // Higher above the chart
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .style("font-weight", "bold")
                .text(event.label);
        });


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
                        <strong>Harris:</strong> ${d.harris}%<br/>
                        <strong>Trump:</strong> ${d.trump}%<br/>`
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
