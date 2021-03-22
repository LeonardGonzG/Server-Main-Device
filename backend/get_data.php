<?php
require_once(dirname( __FILE__ ) .'/Data/conect_DB.php');
$pdo = Database::getInstance()->getPdoObject();
    
$device = NULL;
$requestUser = NULL;

if(isset($_POST['device'])&& isset($_POST['typeQuery'])) {
    
    $device=$_POST['device'];
    $requestUser = $_POST['typeQuery'];

    unset($_POST);
 }

 if($requestUser=='heartRate'){
    getDataDeviceHeart($device, $pdo);

 }else if($requestUser=='oxygen'){
    getDataDeviceOxygen($device, $pdo);
 }else if($requestUser=='temp'){
    getDataDeviceTempC($device, $pdo);
 }else{
    echo json_encode('No se encuentran datos');
 }




//Obtenemos todos los registros dependiendo del dispositivo registrado
function getDataDeviceHeart($serieDevice, $pdo){

    $query = $pdo->prepare("SELECT idRegister, UNIX_TIMESTAMP(fecha) as fechaD, heartRate FROM `device_register` WHERE TRIM(serieDevice) = TRIM(:serieDevice) ORDER BY fecha DESC LIMIT 50");
    $query->execute(['serieDevice'=> $serieDevice]);
      
    $messages = $query->fetchAll( PDO::FETCH_OBJ);
    echo json_encode($messages);
}

function getDataDeviceOxygen($serieDevice, $pdo){

    $query = $pdo->prepare("SELECT idRegister, UNIX_TIMESTAMP(fecha) as fechaD, bpmSpO2 FROM `device_register` WHERE TRIM(serieDevice) = TRIM(:serieDevice) ORDER BY fecha DESC LIMIT 50");
    $query->execute(['serieDevice'=> $serieDevice]);
      
    $messages = $query->fetchAll( PDO::FETCH_OBJ);
    echo json_encode($messages);
}

function getDataDeviceTempC($serieDevice, $pdo){

    $query = $pdo->prepare("SELECT idRegister, UNIX_TIMESTAMP(fecha) as fechaD, ambientTempC, objectTempC FROM `device_register` WHERE TRIM(serieDevice) = TRIM(:serieDevice) ORDER BY fecha DESC LIMIT 50");
    $query->execute(['serieDevice'=> $serieDevice]);
      
    $messages = $query->fetchAll( PDO::FETCH_OBJ);
    echo json_encode($messages);
}




?>
