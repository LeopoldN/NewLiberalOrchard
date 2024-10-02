document.getElementById('genButton').addEventListener('click', generateChart);
function generateChart(event) {
    if (event) {
        event.preventDefault(); // Prevent the default form submission
    }
    console.log("howdy");
    var thisFileName = document.getElementById("thisFileName").value;
    var xDomainLow = document.getElementById("xDomainLow").value;
    var xDomainHigh = document.getElementById("xDomainHigh").value;
    var xDomainL2 = document.getElementById("xDomainL2").value;
    var xDomainH2 = document.getElementById("xDomainH2").value;
    var thisTitle = document.getElementById("thisTitle").value;
    var thisYTitle = document.getElementById("thisYTitle").value;
    var thisYTitleRight = document.getElementById("thisYTitleRight").value;
    var isTwoVariables = document.getElementById("isTwoVariables").checked;
    var isStepCurve = document.getElementById("isStepCurve").checked;
    var isDollar = document.getElementById("isDollar").checked;
    var isPercentage = document.getElementById("isPercentage").checked;
    var isDollar2 = document.getElementById("isDollar2").checked;
    var isPercentage2 = document.getElementById("isPercentage2").checked;
    var toolTipDesc = document.getElementById("toolTipDesc").value;
    var toolTipDesc2 = document.getElementById("toolTipDesc2").value;
    var strokeWidth = document.getElementById("strokeWidth").value;
    var jsonX = document.getElementById("jsonX").value;
    var jsonX2 = document.getElementById("jsonX2").value;
    var strokeColor = document.getElementById("strokeColor").value;
    var strokeColor2 = document.getElementById("strokeColor2").value;

    var isTopL = document.getElementById("isTopL").checked;
    var isTopR = document.getElementById("isTopR").checked;
    var isBotL = document.getElementById("isBotL").checked;
    var isBotR = document.getElementById("isBotR").checked;

    const chartJS = `
    function renderChart() {
        const thisFileName = "/CSV/${thisFileName}?v=1";
        const xDomainLow = ${xDomainLow};
        const xDomainHigh = ${xDomainHigh};
        const xDomainL2 = ${xDomainL2};
        const xDomainH2 = ${xDomainH2};
        const thisTitle = "${thisTitle}";
        const thisYTitle = "${thisYTitle}";
        const thisYTitleRight = "${thisYTitleRight}";
        const isTwoVariables = ${isTwoVariables};
        const isStepCurve = ${isStepCurve};
        const isDollar = ${isDollar};
        const isPercentage = ${isPercentage};
        const isDollar2 = ${isDollar2};
        const isPercentage2 = ${isPercentage2};
        const toolTipDesc = ${toolTipDesc};
        const jsonX = ${jsonX};
        const strokeColor = ${strokeColor};
        const toolTipDesc2 = ${toolTipDesc2};
        const jsonX2 = ${jsonX2};
        const strokeColor2 = ${strokeColor2};
        const strokeWidth = ${strokeWidth};
        var isBotR = ${isBotR};
        var isBotL = ${isBotL};
        var isTopR = ${isTopR};
        var isTopL = ${isTopL};

    // Remove any existing SVG to re-render on resize
    d3.select("#debts-container svg").remove();
    d3.select("#tooltip").remove();  // Remove any existing tooltip

    // Get the size of the container (it will change on window resize)
    const container = d3.select("#debts-container");
    const containerWidth = container.node().getBoundingClientRect().width;
    const containerHeight = container.node().getBoundingClientRect().height;

    // Adjust margins based on screen width (smaller for mobile)
    let margin = { top: 100, right: 80, bottom: 50, left: 80 };

    if (containerWidth < 500) {  // for mobile
        margin = { top: 80, right: 30, bottom: 40, left: 30 };
    } 
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Append the svg object to the chart container
    const svg = container
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", \`translate(\${margin.left},\${margin.top})\`);


    // Append an image to the chart
    var locationX =0;
    var locationY =0;
    if(isTopL){locationX = 0-10; locationY = 0;}
    if(isTopR){locationX = (width-margin.right-10); locationY = 0;}
    if(isBotL){locationX = 0-10; locationY = (height-100);}
    if(isBotR){locationX = width-margin.right-10; locationY = (height-100);}

    svg.append("image")
        .attr("xlink:href", "/assets/Logo_black.svg")  // Path to the image file
        .attr("x", locationX)  // Adjust the x position to place the image as desired
        .attr("y", locationY)          // Adjust the y position to place the image as desired
        .attr("width", 100)     // Set the width of the image
        .attr("height", 100)   // Set the height of the image
        .attr("opacity", 0.5);  // Set the opacity (50% visible)  

    // Adjust font sizes dynamically based on container width
    const titleFontSize = containerWidth < 500 ? "16px" : "24px";  // smaller title for mobile
    const labelFontSize = containerWidth < 500 ? "14px" : "16px";  // smaller labels for mobile
    const eventFontSizes = containerWidth < 500 ? "8px" : "12px";

    // Add the title
    svg.append("text")
        .attr("x", (width+50) / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text(thisTitle)
        .style("font-size", titleFontSize)
        .style("font-weight", "bold");

        // Add axis labels
        svg.append("text")
            .attr("transform", \`translate(\${width / 2}, \${height + margin.bottom - 10})\`)
            .style("text-anchor", "middle")
            .attr("class", "axis-label")
            .text("Date");

        // Y Axis Label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 15)
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
            .attr("transform", \`translate(0,\${height})\`)
            .call(d3.axisBottom(x)
            .ticks(Math.max(2, Math.floor(containerWidth / 100))) // Adjust number of ticks based on width
        );  // fewer ticks on mobile;

        svg.append("g")
            .call(d3.axisLeft(y));

        if(isTwoVariables){
        svg.append("g")
            .attr("transform", \`translate(\${width}, 0)\`)  // Move to the right side
            .call(d3.axisRight(y2));                      // Use axisRight for right-hand side
        }

        // Add gridlines
        const makeXGridlines = () => d3.axisBottom(x).ticks(5);
        const makeYGridlines = () => d3.axisLeft(y).ticks(5);

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", \`translate(0,\${height})\`)
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
            .y(d => y((d[jsonX]/1000)));
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
        //    .text("");


        // Add event lines and labels
        const eventDates = [
            {date: "2013-01-01", label: "Obama Elected"},
            {date: "2017-01-01", label: "Trump Elected"}
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
                .style("font-size", eventFontSizes)
                .style("font-weight", "bold")
                .text(event.label);
        });

        // Parse the first event date (Obama elected)
        const ObamaDate = new Date(eventDates[1].date);

        // Get the x-coordinate for the Obama date
        const ObamaX = x(ObamaDate);

        // Add the red rectangle with 50% opacity
        svg.append("rect")
        .attr("x", 0)                          // Start from the left side
        .attr("y", 0)                          // Top of the chart
        .attr("width", ObamaX)               // Width goes to the Kennedy date
        .attr("height", height)                // Full height of the chart
        .style("fill", "blue")                  // Set the color to red
        .style("opacity", backgroundOpacity);                // 50% opacity
        svg.append("rect")
        .attr("x", ObamaX)                          // Start from the left side
        .attr("y", 0)                          // Top of the chart
        .attr("width", width/2)               // Width goes to the Kennedy date
        .attr("height", height)                // Full height of the chart
        .style("fill", "red")                  // Set the color to red
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
                    .html(\`
                        <strong">Date:</strong> \${d3.timeFormat("%B %d, %Y")(d.date)}<br/>
                        <strong><font color=\${strokeColor}>\${toolTipDesc}</font>:</strong> \${isDollar ? '$' : ''}\${isDollar ? (d[jsonX]/1000).toLocaleString() : d[jsonX]}\${isPercentage ? '%' : ''}<br/>
                        \${isTwoVariables ? \`<strong><font color=\${strokeColor2}>\${toolTipDesc2}</font>:</strong> \${isDollar2 ? '$' : ''}\${isDollar2 ? d[jsonX2].toLocaleString() : d[jsonX2].toFixed(2)}\${isPercentage2 ? '%' : ''}<br/>\` : ''}\`
                    );
            })            
            .on("mouseout", () => {
                focusLine.style("display", "none");
                tooltip.style("display", "none");
            });
    });


        // Rest of your existing D3.js code goes here...
    }

    // Call the function initially to render the chart
    renderChart();

    // Add an event listener to redraw the chart when the window is resized
    window.addEventListener("resize", renderChart);
`;

// Create a Blob from the JavaScript string
const blob = new Blob([chartJS], { type: 'application/javascript' });
const url = URL.createObjectURL(blob);

// Create a link to download the JavaScript file
const a = document.createElement("a");
a.href = url;
a.download = "chart.js";
a.click();
URL.revokeObjectURL(url); // Clean up the URL
}


