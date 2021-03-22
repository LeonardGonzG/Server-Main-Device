window.onload = function() {
    var ctxOxigeno = document.getElementById('canvas02').getContext('2d');
    window.myLine = new Chart(ctxOxigeno, config);

};

setInterval(function() {
    requestData('A01');
}, 1000);

function requestData(nameDevice) {
    $.ajax({
        type: "POST",
        url: "http://localhost/IOT/backend/get_data.php",
        data: {
            device: nameDevice,
            typeQuery: 'oxygen'
        },
        success: function(data) {

            config.data.labels = [];
            config.data.datasets[0].data = [];
            window.myLine.update();

            let datos = JSON.parse(data);

            datos.forEach(i => {

                config.data.labels.push(parseInt(i.fechaD) * 1000);
                config.data.datasets[0].data.push(i.bpmSpO2);

                config.data.labels.shift();
                config.data.datasets[0].data.shift();
            });

            window.myLine.update();

        }
    });
}


var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'bpm / SpO2',
            backgroundColor: "#0831FC",
            borderColor: "#0831FC",
            data: [],
            fill: false,

        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Sensor MAX30100 PulseOximeter'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                },
                type: 'time',
                time: {
                    unit: 'second'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                },
                ticks: {
                    max: 110,
                    min: 90,
                    stepSize: 1
                }
            }]
        }
    }
};