#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include "MAX30100_PulseOximeter.h"
#include <SoftwareSerial.h>

#define RX 2
#define TX 3  
#define REPORTING_PERIOD_MS     2000

Adafruit_MLX90614 mlx = Adafruit_MLX90614();
PulseOximeter pox;
uint32_t tsLastReport = 0;

String AP = "Flia_Gonzales";       // AP NAME
String PASS = "3218687016"; // AP PASSWORD

String HOST = "192.168.101.4";
String PORT = "80";

int countTrueCommand;
int countTimeCommand; 
boolean found = false; 
int valSensor = 1;

bool stateSend = false;

//Data send
float heart_rate = 0;
float oxygen_saturation = 0;
float temp_ambC = 0;
float temp_objC = 0;

SoftwareSerial esp8266(RX,TX); 


void setup() {
    
  pinMode(9, OUTPUT); 
  Serial.begin(115200);
 
  esp8266.begin(115200);//115200
  
  sendCommand("AT",5,"OK");
  sendCommand("AT+CWMODE=1",5,"OK");
  sendCommand("AT+CWJAP=\""+ AP +"\",\""+ PASS +"\"",20,"OK");
  
  
   // Serial.begin(9600);
   
    Serial.println("Adafruit MLX90614 test");  
    Serial.print("Initializing pulse oximeter..");
 
    // Initialize the PulseOximeter instance
    // Failures are generally due to an improper I2C wiring, missing power supply
    // or wrong target chip
    if (!pox.begin()) {
        Serial.println("FAILED");
        for(;;);
    } else {
        Serial.println("SUCCESS");
    }
     pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);
    // Register a callback for the beat detection
   //  pox.setOnBeatDetectedCallback(onBeatDetected);
    mlx.begin();  
}

void loop() {

    pox.update();
    
    if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
      
      heart_rate = pox.getHeartRate();
      oxygen_saturation = pox.getSpO2();
      temp_ambC = mlx.readAmbientTempC();
      temp_objC = mlx.readObjectTempC();
      tsLastReport = millis();
     
    }
   
   showDataSend();

  
   if (heart_rate > 0 and oxygen_saturation> 0){
      stateSend = true;
    }
    
    if(stateSend){
     // Serial.println("Beat!");

       sendDataServer();

      heart_rate = -1;
      oxygen_saturation = -1;
      stateSend = false;
      }
   
   

}

void sendDataServer(){
  
      digitalWrite(9, LOW);
      String getData = "GET /hellodata/index.php?heartrate="+String(heart_rate)+"&oxygen="+String(oxygen_saturation)
              +"&tempambc="+String(temp_ambC)+"&tempobjc="+String(temp_objC);
       sendCommand("AT+CIPMUX=1",5,"OK");
       sendCommand("AT+CIPSTART=0,\"TCP\",\""+ HOST +"\","+ PORT,7,"OK") ; //15
       sendCommand("AT+CIPSEND=0," +String(getData.length()+4),2,">"); //4
       
       esp8266.println(getData);
       
      // delay(500); //delay 1500
     
       countTrueCommand++;
       sendCommand("AT+CIPCLOSE=0",5,"OK");
  
       digitalWrite(9, HIGH);
      
       showDataSend();
       stateSend = false;
 
}

/*void onBeatDetected()
{
    Serial.println("Beat!");   
}*/
void sendCommand(String command, int maxTime, char readReplay[]) {

  Serial.print(countTrueCommand);
  Serial.print(". at command => ");
  Serial.print(command);
  Serial.print(" ");
  
  while(countTimeCommand < (maxTime*1))
  {
    esp8266.println(command);//at+cipsend
    if(esp8266.find(readReplay))//ok
    {
      found = true;
      break;
    }
  
    countTimeCommand++;
  }
  
  if(found == true)
  {
    Serial.println("OYI");
    countTrueCommand++;
    countTimeCommand = 0;
  }
  
  if(found == false)
  {
    Serial.println("Fail");
    countTrueCommand = 0;
    countTimeCommand = 0;
  }
  
  found = false;
  
 }


void showDataSend(){
    
  Serial.println("(*) Data send");
  Serial.println("heartRate: "+String(heart_rate));
  Serial.println("oxygen: "+String(oxygen_saturation));
  Serial.println("tempAmbC: "+String(temp_ambC));
  Serial.println("tempObjC: "+String(temp_objC)); 

   Serial.println("heartRate: "+String(pox.getHeartRate()));
  Serial.println("oxygen: "+String(pox.getSpO2()));
  
}
