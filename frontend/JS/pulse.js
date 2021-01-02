window.onload = function() {
    var ctx = document.getElementById('canvas01').getContext('2d');
    window.myLine = new Chart(ctx, config);
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
            typeQuery: 'heartRate'
        },
        success: function(data) {

            let sizeLabels = config.data.labels.length;
            let datos = JSON.parse(data);
            let sizeData = datos.length;

            let aux = 0;

            if (sizeLabels == 0) {

                datos.forEach(i => {

                    config.data.labels.push(parseInt(i.fechaD) * 1000);
                    config.data.datasets[0].data.push(i.heartRate);

                    window.myLine.update();

                });

            } else {

                datos.forEach(i => {

                    config.data.labels.push(parseInt(i.fechaD) * 1000);
                    config.data.datasets[0].data.push(i.heartRate);

                    config.data.labels.shift();
                    config.data.datasets[0].data.shift();

                });

                window.myLine.update();

            }
        }
    });
}

//heart Rate
var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Heart Rate',
            backgroundColor: "#FF3333",
            borderColor: "#FF3333",
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
                    min: 50,
                    stepSize: 1
                }
            }]
        }
    }
};