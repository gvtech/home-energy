/*
 *  MeasureCurrent
 *  --------------
 *  This code uses EmonLibrary examples openenergymonitor.org to collect the power consumption from diffrente devices
 *  It generate a json document on the Searial output with a timestamp got on the Serial input 
 * 
 */

#include <ArduinoJson.h>
#include "EmonLib.h"    
#include "EnergyHistogram.h"             


const int SDchipSelect = 10;

#define NBMON 5
EnergyMonitor emon[NBMON];                   // Create an vector of monitor objects
EnergyHistogram energy[NBMON];
int analogPorts[NBMON]={A0,A1,A2,A3,A6};    // We volontary skip the A4 and A5 port to save then for a future I2C communication 

void setup()
{  
  Serial.begin(115200);
  Serial.setTimeout(1000);
  pinMode(LED_BUILTIN, OUTPUT);
 
  for(int device=0;device<NBMON;device++) {
    emon[device].current(analogPorts[device],21.1);
    energy[device].reset();
  } 

}

void sendConsumption(String ts,int device) 
{
      StaticJsonDocument<200> deviceConsumption;
      deviceConsumption["consumptionDate"] = ts;
      deviceConsumption["deviceNumber"] = device;
      JsonArray consumption = deviceConsumption.createNestedArray("consumption");
      JsonArray details = deviceConsumption.createNestedArray("details");
      for(int bucket=0;bucket<HISTOGRAM_LENGTH;bucket++) {
          consumption.add(energy[device].getConsumption(bucket));
          details.add(energy[device].getDuration(bucket));
      }
      energy[device].reset();
      serializeJson(deviceConsumption, Serial);
}

void loop()
{
    for(int device=0;device<NBMON;device++) {
      float Irms = emon[device].calcIrms(1000)*220.0;  // Calculate Irms for 200V
      energy[device].addMeasure(Irms);
    }

  if (Serial.available() > 20) {  
    digitalWrite(LED_BUILTIN, HIGH); 

    String ts=Serial.readStringUntil('\n'); // We collect the timestamp from the caller and add it in the response document
    if(ts.charAt(ts.length()-1)=='\r')
            ts.setCharAt(ts.length()-1,' ');
    if(ts.length()>20 ){
        Serial.print('[');
        for(int device=0;device<NBMON;device++) { 
          sendConsumption(ts,device);
          if(device<NBMON-1)
              Serial.print(',');
        }
        Serial.print(']');
    }
    Serial.flush();
    digitalWrite(LED_BUILTIN, LOW); 

  }
}
