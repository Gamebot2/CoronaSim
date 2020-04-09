var bSlider = document.getElementById("bSlider");
var kSlider = document.getElementById("kSlider");

var bValue = document.getElementById("bValue");
var kValue = document.getElementById("kValue");

bValue.innerHTML = bSlider.value + "%";
kValue.innerHTML = kSlider.value + "%";

var bSlider2 = document.getElementById("bSlider2");
var kSlider2 = document.getElementById("kSlider2");

var bValue2 = document.getElementById("bValue2");
var kValue2 = document.getElementById("kValue2");

bValue2.innerHTML = bSlider2.value + "%";
kValue2.innerHTML = kSlider2.value + "%";

var bedset = false;
var bedset2 = false;

var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Susceptible',
            data: [],
            borderColor:'rgba(99, 132, 255, 1)',
            borderWidth: 1.5,
            pointRadius: 0.5,
        }, {
            label: 'Infected',
            data: [],
            borderColor:'rgba(255, 99, 132, 1)',
            borderWidth: 1.5,
            pointRadius: 0.5,
        }, {
            label: 'Recovered',
            data: [],
            borderColor:'rgba(132, 255, 99, 1)',
            borderWidth: 1.5,
            pointRadius: 0.5
        }, {
            label: 'Hospital Beds',
            data: [],
            borderColor: 'rgba(25, 25, 25, 1)',
            borderWidth: 1,
            pointRadius: 0
        }]
    },
    options: {
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Days"
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "People Infected in USA"
                },
                ticks: {
                    beginAtZero: false
                }
            }]
        }
    }
});

var ctx2 = document.getElementById('infectionChart');
var infectionChart = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Infected',
            data: [],
            borderColor:'rgba(255, 99, 132, 1)',
            borderWidth: 1.5,
            pointRadius: 0.5,
        }, {
            label: 'Hospital Beds',
            data: [],
            borderColor: 'rgba(25, 25, 25, 1)',
            borderWidth: 1,
            pointRadius: 0
        }]
    },
    options: {
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Days"
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "People Infected in USA"
                },
                ticks: {
                    beginAtZero: false
                }
            }]
        }
    }
});

$(document).ready(function() {
    var b = (document.getElementById("bSlider").value) / 100;
    var k = (document.getElementById("kSlider").value) / 100;
    var url = "/data/" + b + "/" + k;

    //Begin the data retrieval
    $.get(url, function(data, status){
        updateChart(data);
        updateInfectionChart(data);
    });
});

bSlider.oninput = function() {
    var b = (document.getElementById("bSlider").value) / 100;
    var k = (document.getElementById("kSlider").value) / 100;
    var url = "/data/" + b + "/" + k;
    bValue.innerHTML = document.getElementById("bSlider").value + "%";

    //Begin the data retrieval
    $.get(url, function(data, status){
        updateChart(data);
    });
}

kSlider.oninput = function() {
    var b = (document.getElementById("bSlider").value) / 100;
    var k = (document.getElementById("kSlider").value) / 100;
    var url = "/data/" + b + "/" + k;
    kValue.innerHTML = document.getElementById("kSlider").value + "%";

    //Begin the data retrieval
    $.get(url, function(data, status){
        updateChart(data);
    });
}

bSlider2.oninput = function() {
    var b = (document.getElementById("bSlider2").value) / 100;
    var k = (document.getElementById("kSlider2").value) / 100;
    var url = "/data/" + b + "/" + k;
    bValue2.innerHTML = document.getElementById("bSlider2").value + "%";

    //Begin the data retrieval
    $.get(url, function(data, status){
        updateInfectionChart(data);
    });
}

kSlider2.oninput = function() {
    var b = (document.getElementById("bSlider2").value) / 100;
    var k = (document.getElementById("kSlider2").value) / 100;
    var url = "/data/" + b + "/" + k;
    kValue2.innerHTML = document.getElementById("kSlider2").value + "%";

    //Begin the data retrieval
    $.get(url, function(data, status){
        updateInfectionChart(data);
    });
}

function updateChart(data) {
    var xLabels = [];
    var susceptible = [];
    var infected = [];
    var recovered = [];
    var hospitalbeds = [];

    var maxInfected = 0;

    for(var i = 0; i < data.length; i++) {
        xLabels.push(i);
        susceptible.push(Math.round(data[i][0]));
        infected.push(Math.round(data[i][1]));
        recovered.push(Math.round(data[i][2]));
        if(!bedset) {
            hospitalbeds.push(1700000);
        }
        if(infected[i] > maxInfected) {
            maxInfected = infected[i];
        }
    }

    myChart.data.labels = xLabels;
    myChart.data.datasets[0].data = susceptible;
    myChart.data.datasets[1].data = infected;
    myChart.data.datasets[2].data = recovered;
    if(!bedset) {
        myChart.data.datasets[3].data = hospitalbeds;
        bedset = true;
    }
    myChart.update();

    document.getElementById("peopleInfected").innerHTML = numberWithCommas(Math.round(data[data.length-1][2]));
    document.getElementById("maxInfected").innerHTML = numberWithCommas(maxInfected);
    if(maxInfected > 1700000) {
        document.getElementById("warning").innerHTML = "Max Healthcare Capacity Exceeded";
    } else {
        document.getElementById("warning").innerHTML = "";
    }

}

function updateInfectionChart(data) {
    var xLabels = [];
    var infected = [];
    var hospitalbeds = [];

    var maxInfected = 0;

    for(var i = 0; i < data.length; i++) {
        xLabels.push(i);
        infected.push(Math.round(data[i][1]));
        if(!bedset2) {
            hospitalbeds.push(1700000);
        }
        if(infected[i] > maxInfected) {
            maxInfected = infected[i];
        }
    }

    infectionChart.data.labels = xLabels;
    infectionChart.data.datasets[0].data = infected;
    if(!bedset2) {
        infectionChart.data.datasets[1].data = hospitalbeds;
        bedset2 = true;
    }
    infectionChart.update();

    document.getElementById("maxInfected2").innerHTML = numberWithCommas(maxInfected);
    if(maxInfected > 1700000) {
        document.getElementById("warning2").innerHTML = "Max Healthcare Capacity Exceeded";
    } else {
        document.getElementById("warning2").innerHTML = "";
    }

}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}