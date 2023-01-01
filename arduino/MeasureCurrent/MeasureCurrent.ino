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


#define NBMON 5
EnergyMonitor emon[NBMON];                   // Create an vector of monitor objects
EnergyHistogram *energy[NBMON];
int analogPorts[NBMON]={A0,A1,A2,A3,A6};    // We volontary skip the A4 and A5 port to save then for a future I2C communication 

void setup()
{  
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  for(int i=0;i<NBMON;i++) {
    emon[i]=EnergyMonitor();
    emon[i].current(analogPorts[i],21.1);
    energy[i]=new EnergyHistogram(i);
  } 

}

void loop()
{
    for(int i=0;i<NBMON;i++) {
      double Irms = emon[i].calcIrms(1000)*220.0;  // Calculate Irms for 200V
      energy[i]->addMeasure(Irms);
    }

  if (Serial.available() > 0) {  
    digitalWrite(LED_BUILTIN, HIGH); 

    String ts=Serial.readStringUntil('\n'); // We collect the timestamp from the caller and add it in the response document
    
    for(int i=0;i<NBMON;i++) {
      StaticJsonDocument<400> deviceConsumption;
      deviceConsumption["consumptionDate"] = ts;
      deviceConsumption["deviceNumber"] = i;
      JsonArray consumption = deviceConsumption.createNestedArray("consumption");
      JsonArray details = deviceConsumption.createNestedArray("details");
      for(int bucket=0;bucket<HISTOGRAM_LENGTH;bucket++) {
          consumption.add(energy[i]->getConsumption(bucket));
          details.add(energy[i]->getDuration(bucket));
      }
      energy[i]->reset();
      serializeJson(deviceConsumption, Serial);
      Serial.println();
    }

    Serial.println("done");
    digitalWrite(LED_BUILTIN, LOW); 

  }
}
