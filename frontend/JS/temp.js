window.onload = function() {
    var ctx = document.getElementById('canvas03').getContext('2d');
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
            typeQuery: 'temp'
        },
        success: function(data) {

            config.data.labels = [];
            config.data.datasets[0].data = [];
            window.myLine.update();

            let datos = JSON.parse(data);
            datos.forEach(i => {

                config.data.labels.push(parseInt(i.fechaD) * 1000);
                config.data.datasets[0].data.push(i.ambientTempC);
                config.data.datasets[1].data.push(i.objectTempC);

                config.data.labels.shift();
                config.data.datasets[0].data.shift();
            });

            window.myLine.update();

        }
    });
}

//heart Rate
var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
                label: 'Ambient Temp °C',
                backgroundColor: "#8D08FC",
                borderColor: "#8D08FC",
                data: [],
                fill: false,

            },
            {
                label: 'Person Temp °C',
                backgroundColor: "#FCA308",
                borderColor: "#FCA308",
                data: [],
                fill: false,

            }
        ]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Sensor MLX90614 Temperature'
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
                    max: 50,
                    min: 10,
                    stepSize: 1
                }
            }]
        }
    }
};