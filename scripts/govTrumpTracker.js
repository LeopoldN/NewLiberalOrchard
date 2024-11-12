// General Options for the stacked bar charts with adjustments for bar size
const getCommonOptions = (maxValue, annotationValue) => ({
    indexAxis: 'y', // Change the bar chart to horizontal
    responsive: false, // Make chart sizes fixed instead of adjusting to container size
    plugins: {
        legend: {
            display: false, // Hide the legend (remove Democrat and Republican labels above the chart)
        },
        tooltip: {
            enabled: false // Disable tooltip on hover
        },
        datalabels: {
            color: 'white', // Color for the labels inside the bars
            font: {
                weight: 'bold',
                size: 14
            },
            formatter: function(value, context) {
                return `${context.dataset.label}: ${value}`;
            },
            anchor: 'center',
            align: 'center'
        },
        title: {
            display: true,
            text: (ctx) => ctx.chart.canvas.id === 'houseChart' ? 'House' :
                            ctx.chart.canvas.id === 'senateChart' ? 'Senate' :
                            'Supreme Court',
            color: 'black',
            font: {
                size: 20,
                weight: 'bold'
            },
            align: 'center',
            padding: {
                top: 10,
                bottom: 20
            }
        },
        annotation: {
            annotations: {
                line: {
                    type: 'line',
                    xMin: annotationValue,
                    xMax: annotationValue,
                    borderColor: 'black',
                    borderWidth: 2,
                    borderDash: [6, 6], // Makes the line dotted
                    label: {
                        enabled: true,
                        content: annotationValue,
                        position: 'start',
                        color: 'black',
                        backgroundColor: 'white',
                        font: {
                            style: 'bold'
                        }
                    }
                }
            }
        }
    },
    scales: {
        x: {
            beginAtZero: true,
            stacked: true,
            max: maxValue, // Set the maximum value for the x-axis based on the chart
            ticks: {
                precision: 0
            },
            grid: {
                display: false // Remove grid lines on the x-axis
            }
        },
        y: {
            stacked: true,
            display: false, // Remove Y-axis label
            grid: {
                display: false // Remove grid lines on the y-axis
            }
        }
    },
    elements: {
        bar: {
            borderWidth: 1,
            barThickness: 10, // Reduce the bar thickness to make it smaller
            borderRadius: 20 // Round both ends of each bar
        }
    }
});

// Data for House Chart
const houseData = {
    labels: ['House'],
    datasets: [
        {
            label: 'Democrat',
            data: [216], // Seats for Democrats
            backgroundColor: 'rgba(70, 130, 180, 1)', // New Democratic Blue (Steel Blue)
            borderRadius: {
                topLeft: 20,
                bottomLeft: 20
            },
            borderSkipped: false
        },
        {
            label: 'Republican',
            data: [219], // Seats for Republicans (updated to 435)
            backgroundColor: 'rgba(128, 0, 0, 1)', // New Republican Maroon
            borderRadius: {
                topRight: 20,
                bottomRight: 20
            },
            borderSkipped: false
        }
    ]
};

// Render House Chart with specific size
const ctxHouse = document.getElementById('houseChart').getContext('2d');
document.getElementById('houseChart').width = 600;
document.getElementById('houseChart').height = 200;
new Chart(ctxHouse, {
    type: 'bar',
    data: houseData,
    options: getCommonOptions(435, 218), // Set max value to 435 for the House chart and add annotation at x = 218
    plugins: [ChartDataLabels]
});

// Data for Senate Chart
const senateData = {
    labels: ['Senate'],
    datasets: [
        {
            label: 'Democrat',
            data: [47], // Seats for Democrats
            backgroundColor: 'rgba(70, 130, 180, 1)', // New Democratic Blue (Steel Blue)
            borderRadius: {
                topLeft: 20,
                bottomLeft: 20
            },
            borderSkipped: false
        },
        {
            label: 'Republican',
            data: [53], // Seats for Republicans
            backgroundColor: 'rgba(128, 0, 0, 1)', // New Republican Maroon
            borderRadius: {
                topRight: 20,
                bottomRight: 20
            },
            borderSkipped: false
        }
    ]
};

// Render Senate Chart with specific size
const ctxSenate = document.getElementById('senateChart').getContext('2d');
document.getElementById('senateChart').width = 600;
document.getElementById('senateChart').height = 200;
new Chart(ctxSenate, {
    type: 'bar',
    data: senateData,
    options: getCommonOptions(100, 50), // Set max value to 100 for the Senate chart and add annotation at x = 50
    plugins: [ChartDataLabels]
});

// Data for Supreme Court Chart
const supremeCourtData = {
    labels: ['Supreme Court'],
    datasets: [
        {
            label: 'Liberal',
            data: [3], // Liberal Justices
            backgroundColor: 'rgba(70, 130, 180, 1)', // New Democratic Blue (Steel Blue)
            borderRadius: {
                topLeft: 20,
                bottomLeft: 20
            },
            borderSkipped: false
        },
        {
            label: 'Conservative',
            data: [6], // Conservative Justices
            backgroundColor: 'rgba(128, 0, 0, 1)' // New Republican Maroon
        }
    ]
};

// Render Supreme Court Chart with specific size
const ctxSupreme = document.getElementById('supremeCourtChart').getContext('2d');
document.getElementById('supremeCourtChart').width = 600;
document.getElementById('supremeCourtChart').height = 200;
new Chart(ctxSupreme, {
    type: 'bar',
    data: supremeCourtData,
    options: getCommonOptions(9, 4.5), // Set max value to 9 for the Supreme Court chart and add annotation at x = 5
    plugins: [ChartDataLabels]
});
