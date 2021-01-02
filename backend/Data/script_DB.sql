
/*
Mysql
DB: device
*/

CREATE TABLE `device_register`(
    idRegister int (10) AUTO_INCREMENT, 
    fecha TIMESTAMP, 
    serieDevice varchar(3) NOT NULL,
    heartRate float(4,2) NOT NULL,
    bpmSpO2 float(4,2) NOT NULL,
    ambientTempC float(4,2) NOT NULL, 
    objectTempC float(4,2),
    PRIMARY KEY (`idRegister`)
); 
