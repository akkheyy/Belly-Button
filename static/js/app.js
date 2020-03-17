function buildMetadata(sample) {
  console.log("hello buildMetadata")

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataURL = `/metadata/${sample}`

    let sampleMetadata = d3.select("#sample-metadata")
    sampleMetadata.html("")
    // Use `.html("") to clear any existing metadata
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(metadataURL).then(function(sample){
      Object.entries(sample).forEach(function([key, value]){
        let row = sampleMetadata.append("div")
        row.text(`${key}: ${value}`)
      })
    })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  console.log("hello buildCharts")

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let chartsURL = `/samples/${sample}`
    // @TODO: Build a Bubble Chart using the sample data

    d3.json(chartsURL).then(function(data){
      let trace1 = [{
        x: data.otu_ids,
        y: data.sample_values,
        text: data.otu_labels,
        mode: "markers",
        marker: {
          size: data.sample_values,
          color: data.otu_ids,
          colorscale: "Earth"
        }
      }]
    

      let layout = {
        title: "Belly Button Bacteria",
        showlegend: true,
        xaxis: {title: "OTU ID"}
      }

      Plotly.newPlot("bubble", trace1, layout)

      let trace2 = [{
        values: data.sample_values.sort((a, b) => (b - a)).slice(0, 10),
        labels: data.otu_ids.slice(0, 10),
        hovertext: data.otu_labels.slice(0, 10),
        type: "pie"
      }]


      Plotly.newPlot("pie", trace2)

    })


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
