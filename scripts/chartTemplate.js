function renderCharts(config = {}) {

    // ──────────────────────────────────────────────────────────────
    // Configuration (values can be overridden via the `config` arg)
    // ──────────────────────────────────────────────────────────────
    const {
        // DOM
        containerSelector = "#deficitGDP-container",
        // Data
        thisFileName      = "./fred_weekly_update.csv?v=1",
        // Left‑axis domain
        xDomainLow        = -3500000,
        xDomainHigh       = -300000,
        // Labels
        thisTitle         = "US Budget Deficit and % of GDP",
        thisYTitle        = "US Budget Deficit (in Millions of $)",
        thisYTitleRight   = "Budget Deficit % GDP",
        // Tool‑tips
        toolTipDesc       = "Deficit",
        toolTipDesc2      = "Deficit/GDP",
        // Series mapping
        jsonX             = "deficit",
        jsonX2            = "defper",
        // Styling
        strokeColor       = "red",
        strokeColor2      = "gray",
        strokeWidth       = 3,
        backgroundOpacity = 0.05,
        isStepCurve       = false,
        // Flags
        isDollar          = true,
        isPercentage      = false,
        isTwoVariables    = true,
        isDollar2         = false,
        isPercentage2     = true,
        // Right‑axis domain
        xDomainL2         = 0,
        xDomainH2         = 15,
        // Auto‑domain calculation
        autoDomainLeft  = false,   // true → pad 5 % beyond min/max
        autoDomainRight = false,   // for the right axis when isTwoVariables
        // Event line & shading toggle
        showEventLines  = true,   // false → hide vertical lines & shading
        // Source links
        oLink1            = "https://fred.stlouisfed.org/series/FYFSD",
        oLink2            = "https://fred.stlouisfed.org/series/FYFSGDA188S",
        oLinkName         = "Surplus/Deficit Source",
        oLinkName2        = "Percent of GDP Source",
        // Logo placement
        isTopL            = false,
        isTopR            = false,
        isBotL            = true,
        isBotR            = false,
        // Forward‑fill sparse series to match daily grid
        forwardFillX   = false,
        forwardFillX2  = false,
        // Optional date filter (ISO strings 'YYYY-MM-DD')
        dateStart        = null,
        dateEnd          = null,
    } = config;

    // Remove any existing SVG to re-render on resize
    d3.select(containerSelector + " svg").remove();
    d3.select("#tooltip").remove();  // Remove any existing tooltip

    // Get the size of the container (it will change on window resize)
    const container = d3.select(containerSelector);
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
        .attr("transform", `translate(${margin.left},${margin.top})`);


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
        .attr("x", (width+50) / 2)
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

    // Load the CSV data (optionally filtered by dateStart/dateEnd)
    d3.csv(thisFileName).then(data => {
        data.forEach(d => {
            d.date = parseTime(d.date);
            d[jsonX]  = (d[jsonX]  && d[jsonX]  !== 'null') ? +d[jsonX]  : null;
            d[jsonX2] = (d[jsonX2] && d[jsonX2] !== 'null') ? +d[jsonX2] : null;
        });

        // ── optionally forward‑fill to smooth frequency mismatches ─────────
        if (forwardFillX) {
            let last = null;
            data.forEach(d => {
                if (d[jsonX] != null) last = d[jsonX];
                else d[jsonX] = last;
            });
        }
        if (isTwoVariables && forwardFillX2) {
            let last2 = null;
            data.forEach(d => {
                if (d[jsonX2] != null) last2 = d[jsonX2];
                else d[jsonX2] = last2;
            });
        }

        // ── trim to user‑requested time range, if any ───────────────────
        const startDate = dateStart ? parseTime(dateStart) : null;
        const endDate   = dateEnd   ? parseTime(dateEnd)   : null;
        if (startDate || endDate) {
            data = data.filter(d =>
                (!startDate || d.date >= startDate) &&
                (!endDate   || d.date <= endDate)
            );
        }

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, width]);

        // ── derive y‑axis domains, with optional 5 % padding ─────────────
        let leftLow  = xDomainLow;
        let leftHigh = xDomainHigh;
        if (autoDomainLeft) {
            const valsLeft = data
              .filter(d => d[jsonX] !== null)
              .map(d => d[jsonX]);
            if (valsLeft.length) {
              const minL = d3.min(valsLeft);
              const maxL = d3.max(valsLeft);
              const padL = (maxL - minL) * 0.05 || 1; // fallback pad = 1
              leftLow  = minL - padL;
              leftHigh = maxL + padL;
            }
        }

        let rightLow  = xDomainL2;
        let rightHigh = xDomainH2;
        if (isTwoVariables && autoDomainRight) {
            const valsRight = data
              .filter(d => d[jsonX2] !== null)
              .map(d => d[jsonX2]);
            if (valsRight.length) {
              const minR = d3.min(valsRight);
              const maxR = d3.max(valsRight);
              const padR = (maxR - minR) * 0.05 || 1;
              rightLow  = minR - padR;
              rightHigh = maxR + padR;
            }
        }

        const y = d3.scaleLinear()
            .domain([leftLow, leftHigh])
            .range([height, 0]);
        
        const y2 = d3.scaleLinear()
            .domain([rightLow, rightHigh])
            .range([height, 0]);

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

        const lineX1 = d3.line()
            .defined(d => d[jsonX] !== null)
            .x(d => x(d.date))
            .y(d => y(d[jsonX]));
        
        const lineX2 = d3.line()
            .defined(d => d[jsonX2] !== null)
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


    /* ── Election cycle markers & background shading ─────────────── */
    if (showEventLines) {
        const eventDates = [
          { date: "2013-01-01", label: "Obama Elected",  color: "blue" },
          { date: "2017-01-01", label: "Trump Elected",  color: "red"  },
          { date: "2021-01-01", label: "Biden Elected",  color: "blue" },
          { date: "2025-01-01", label: "Trump Term 2",   color: "red"  }
        ];
        const eventsParsed = eventDates.map(e => ({ ...e, d: parseTime(e.date) }));

        /* 1️⃣  background rectangles FIRST (so they sit behind data) */
        eventsParsed.forEach((e, idx) => {
          const xStartRaw = x(e.d);
          const xEndRaw   = idx === eventsParsed.length - 1
                              ? width
                              : x(eventsParsed[idx + 1].d);

          // clamp to visible plot
          const xStart = Math.max(0, xStartRaw);
          const xEnd   = Math.min(width, xEndRaw);

          // skip if the entire band is off‑screen
          if (xEnd <= 0 || xStart >= width) return;

          svg.append("rect")
             .attr("x", xStart)
             .attr("y", 0)
             .attr("width", xEnd - xStart)
             .attr("height", height)
             .style("fill", e.color)
             .style("opacity", backgroundOpacity);
        });

        /* 2️⃣  vertical lines + labels on top (only if they fall inside plot) */
        eventsParsed.forEach(({ d, label }, idx) => {
          const xPos = x(d);
          if (xPos < 0 || xPos > width) return; // skip off‑screen events

          svg.append("line")
             .attr("x1", xPos).attr("x2", xPos)
             .attr("y1", 0).attr("y2", height)
             .attr("stroke", "black")
             .attr("stroke-width", 1)
             .attr("stroke-dasharray", "4");

          svg.append("text")
             .attr("x", xPos + (idx % 2 ? -15 : 15))  // stagger a bit
             .attr("y", -10)
             .style("text-anchor", "middle")
             .style("font-size", eventFontSizes)
             .style("font-weight", "bold")
             .text(label);
        });
    }

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
// Make available to other scripts
window.renderCharts = renderCharts;
