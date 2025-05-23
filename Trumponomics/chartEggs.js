function renderChart() {

    // Remove any existing SVG to re-render on resize
    d3.select("#eggsD svg").remove();
    d3.select("#tooltip").remove();  // Remove any existing tooltip

    // Get the size of the container (it will change on window resize)
    const container = d3.select("#eggsD");
    mobileSize = 600;
    var containerWidth = container.node().getBoundingClientRect().width;
    var containerHeight = container.node().getBoundingClientRect().height;

    // Variables to quick Change names
    const thisFileName = "/Trumponomics/egg_dozen.json?v=1";
    const xDomainLow = 1.15;
    const xDomainHigh = 5;
    var thisTitle = "US Average Egg Prices (Large)";
    var thisYTitle = "Cost per dozen in $";
    const isStepCurve = false;
    const toolTipDesc = "Average Price";
    const isDollar = true;
    const isPercentage = false;
    const jsonX = "eggs";
    const strokeColor = "black";
    const backgroundOpacity = 0.05;
    const strokeWidth = 3;

    const isTwoVariables = false;
    const strokeColor2 = "gray";
    const thisYTitleRight = "Budget Deficit % GDP";
    const toolTipDesc2 = "Deficit/GDP";
    const xDomainL2 = 0;
    const xDomainH2 = 15;
    const isDollar2 = false;
    const isPercentage2 = true;
    const jsonX2 = "defper";
    var ticks = 8;
    var logoSize = 100;
    if(containerWidth <= mobileSize){
        ticks = 5;
        logoSize = 50;
        thisYTitle = "";
        thisTitle = "Average Egg Prices";
        containerHeight = 300;
        containerWidth = 340;
    }

    var oLink1 = "https://fred.stlouisfed.org/series/APU0000708111";
    var oLink2 = "https://fred.stlouisfed.org/series/FYFSGDA188S";
    var oLinkName = "Surplus/Deficit Source";
    var oLinkName2 = "Percent of GDP Source";
    if(containerWidth <= mobileSize){
        oLinkName = "Source 1";
        oLinkName2 = "Source 2";
    }

    // Place Icon
    const isTopL = false;
    const isTopR = false;
    const isBotL = false;
    const isBotR = true;

    // Adjust margins based on screen width (smaller for mobile)
    let margin = { top: 100, right: 80, bottom: 50, left: 80 };
    if (containerWidth <= mobileSize) {  // for mobile
        margin = { top: 80, right: 30, bottom: 40, left: 28 };
    } 
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    var titleSpacing = (width-50) / 2;
    if(containerWidth <= mobileSize){
        titleSpacing = width/2;
    }

    // Append the svg object to the chart container
    const svg = container
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    // Append an image to the chart
    var locationX =0;
    var locationY =0;
    if(isTopL){locationX = 0-10; locationY = 0;}
    if(isTopR){locationX = (width-margin.right-10); locationY = 0;}
    if(isBotL){locationX = 0-10; locationY = (height-logoSize);}
    if(isBotR){locationX = width-margin.right-10; locationY = (height-logoSize);}

    svg.append("image")
        .attr("xlink:href", "/assets/Logo_black.svg")  // Path to the image file
        .attr("x", locationX)  // Adjust the x position to place the image as desired
        .attr("y", locationY)          // Adjust the y position to place the image as desired
        .attr("width", logoSize)     // Set the width of the image
        .attr("height", logoSize)   // Set the height of the image
        .attr("opacity", 0.5);  // Set the opacity (50% visible)  

    // Adjust font sizes dynamically based on container width
    const titleFontSize = containerWidth <= mobileSize ? "16px" : "24px";  // smaller title for mobile
    const labelFontSize = containerWidth <= mobileSize ? "12px" : "16px";  // smaller labels for mobile
    const eventFontSizes = containerWidth <= mobileSize ? "8px" : "12px";

    // Add source text
        svg.append("text")
        .attr("x", 0) // Center the text horizontally
        .attr("y", height+35) // Position near the bottom of the SVG
        .attr("text-anchor", "middle") // Align text to center
        .style("font-size", "12px")
        .style("fill", "#000")
        .style("cursor", "pointer")
        .text(oLinkName)
        .on("click", function() {
        // Redirect to the sources page when clicked
        window.open(oLink1, "_blank");
        });
    if(isTwoVariables){
    svg.append("text")
        .attr("x", 0) // Center the text horizontally
        .attr("y", height+50) // Position near the bottom of the SVG
        .attr("text-anchor", "middle") // Align text to center
        .style("font-size", "12px")
        .style("fill", "#000")
        .style("cursor", "pointer")
        .text(oLinkName2)
        .on("click", function() {
        // Redirect to the sources page when clicked
        window.open(oLink2, "_blank");
        });
    }

    // Add the title
    svg.append("text")
        .attr("x", titleSpacing)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text(thisTitle)
        .style("font-size", titleFontSize)
        .style("font-weight", "bold");

        // Add axis labels
        svg.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
            .style("text-anchor", "middle")
            .attr("class", "axis-label")
            .text("Date");

        // Y Axis Label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("class", "axis-label")
            .text(thisYTitle);

        if(isTwoVariables){
        // Y Axis Label on the Right
        svg.append("text")
            .attr("transform", "rotate(90)")
            .attr("y", (0-width-margin.right+15))
            .attr("x", height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("class", "axis-label")
            .text(thisYTitleRight);
        }
 


    const parseTime = d3.timeParse("%Y-%m-%d");

    var lastDate = 0;

    // Load the JSON data
    d3.json(thisFileName).then(data => {
        data.forEach(d => {
            d.date = parseTime(d.date);
            d[jsonX] = (d[jsonX]) !== null ? +d[jsonX] : null;
            d[jsonX2] = (d[jsonX2]) !== null ? +d[jsonX2] : null;
        });

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([xDomainLow, xDomainHigh])
            .range([height, 0]);
        
        const y2 = d3.scaleLinear()
            .domain([xDomainL2,xDomainH2])
            .range([height,0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x)
            .ticks(Math.max(2, Math.floor(containerWidth / 100))) // Adjust number of ticks based on width
        );  // fewer ticks on mobile;

        svg.append("g")
            .call(d3.axisLeft(y));

        if(isTwoVariables){
        svg.append("g")
            .attr("transform", `translate(${width}, 0)`)  // Move to the right side
            .call(d3.axisRight(y2));                      // Use axisRight for right-hand side
        }

        // Add gridlines
        const makeXGridlines = () => d3.axisBottom(x).ticks(ticks);
        const makeYGridlines = () => d3.axisLeft(y).ticks(ticks);

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

        const lineX1 = d3.line()
            .x(d => x(d.date))
            .y(d => y(d[jsonX]));
        const lineX2 = d3.line()
            .x(d => x(d.date))
            .y(d => y2(d[jsonX2]));
            

        // Draw lines for each candidate

    if(isStepCurve && isTwoVariables){
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", d3.line()
            .curve(d3.curveStep)
                .x(d => x(d.date))
                .y(d => y(d[jsonX])));
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", strokeColor2)
            .attr("stroke-width", strokeWidth)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", d3.line()
            .curve(d3.curveStep)
                .x(d => x(d.date))
                .y(d => y2(d[jsonX2])));
    }else if(isStepCurve && !isTwoVariables){
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", d3.line()
            .curve(d3.curveStep)
                .x(d => x(d.date))
                .y(d => y(d[jsonX])));
    }else if(!isStepCurve && isTwoVariables){
        svg.append("path")
            .datum(data)
            .attr("class", "line Var 1")
            .attr("d", lineX1)
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth)
            .attr("fill", "none");
        svg.append("path")
            .datum(data)
            .attr("class", "Line Var 2")
            .attr("d", lineX2)
            .attr("stroke", strokeColor2)
            .attr("stroke-width", strokeWidth)
            .attr("fill", "none");
    }else{
        svg.append("path")
            .datum(data)
            .attr("class", "line Var 1")
            .attr("d", lineX1)
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth)
            .attr("fill", "none");
    }
        // Add candidate labels on the right side
        const latestData = data.filter(d => d[jsonX] !== null).slice(-1)[0];



        //svg.append("text")
        //    .attr("x", x(latestData.date) + 10)
        //    .attr("y", y(latestData.cpi))
        //    .attr("fill", "blue")
        //    .attr("text-anchor", "start")
        //    .text(`CPI ${latestData.cpi}%`);


        // Add event lines and labels
        const eventDates = [
            {date: "2017-01-01", label: "Trump Elected"},
            {date: "2018-01-01", label: "TCJA Passed"},
            {date: "2021-01-01", label: "Biden Elected"},
            {date: "2022-08-09", label: "Chips Act Passed"},
            {date: "2022-08-16", label: "IRA Passed"}
        //    {date: "2025-01-01", label: "Trump Re-elected"}
        ];

        // Parse event dates and add event lines
        eventDates.forEach((event,index) => {
            const eventDate = parseTime(event.date);
            let shift = 0;
            if(index % 2 == 0){
                shift = -13;
            }else{
                shift = 0;
            }

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
                .attr("x", x(eventDate))
                .attr("y", -10+shift)  // Higher above the chart
                .attr("text-anchor", "middle")
                .style("font-size", eventFontSizes)
                .style("font-weight", "bold")
                .text(event.label);
        });

        // Parse the first event date (Obama elected)
        const TrumpDate = new Date("2017-01-01");
        const BidenDate = new Date("2021-01-01");

        // Get the x-coordinate for the Obama date
        const TrumpX = x(TrumpDate);
        const BidenX = x(BidenDate)-x(TrumpDate);

        // Add the red rectangle with 50% opacity
        svg.append("rect")
        .attr("x", 0)                          // Start from the left side
        .attr("y", 0)                          // Top of the chart
        .attr("width", BidenX)               // Width goes to the Kennedy date
        .attr("height", height)                // Full height of the chart
        .style("fill", "red")                  // Set the color to red
        .style("opacity", backgroundOpacity);                // 50% opacity
        svg.append("rect")
        .attr("x", BidenX)                          // Start from the left side
        .attr("y", 0)                          // Top of the chart
        .attr("width", width-BidenX)               // Width goes to the Kennedy date
        .attr("height", height)                // Full height of the chart
        .style("fill", "blue")                  // Set the color to red
        .style("opacity", backgroundOpacity);                // 50% opacity


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
                        <strong">Date:</strong> ${d3.timeFormat("%B %d, %Y")(d.date)}<br/>
                        <strong><font color=${strokeColor}>${toolTipDesc}</font>:</strong> ${isDollar ? '$' : ''}${isDollar ? (d[jsonX]).toLocaleString() : d[jsonX]}${isPercentage ? '%' : ''}<br/>
                        ${isTwoVariables ? `<strong><font color=${strokeColor2}>${toolTipDesc2}</font>:</strong> ${isDollar2 ? '$' : ''}${isDollar2 ? d[jsonX2].toLocaleString() : d[jsonX2].toFixed(2)}${isPercentage2 ? '%' : ''}<br/>` : ''}`
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
