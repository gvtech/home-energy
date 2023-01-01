/**
   HTTPS Client to push data on a Storage end point
*/

#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <ESP8266HTTPClient.h>

#include <WiFiClientSecureBearSSL.h>
#include <ArduinoJson.h>

#include "credentials.h"

ESP8266WiFiMulti WiFiMulti;

BearSSL::WiFiClientSecure *client;

String lastRun="";

void setup() {

  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(WIFI_SSID, WIFI_PSW);

}

bool sendTime(BearSSL::WiFiClientSecure *client) {
    HTTPClient https;
    if (https.begin(*client, "https://worldtimeapi.org/api/timezone/Europe/Paris")) { 
     int httpCode = https.GET();
     if (httpCode == HTTP_CODE_OK) {
          String json = https.getString();
          StaticJsonDocument<200> doc;
          DeserializationError error = deserializeJson(doc, json);
          const char* datetime = doc["datetime"];
          Serial.println(datetime);
          return true;
      }
    }
    return false;
}

void sendConsumption(BearSSL::WiFiClientSecure *client) {
    HTTPClient https;

    int retry=0;
    while(true) {
      if (Serial.available() > 0) {
          String consumptionData=Serial.readStringUntil('\n');
          if(consumptionData.equals("done")){
           break;
          }
          else if (https.begin(*client, BACKEND_URL)) { 
          https.addHeader("Content-Type", "application/json");
          int httpCode = https.POST(consumptionData);
          https.end();
        }
      else {
          retry+=1;
          if(retry>10) {
            break;
        }
        delay(1000); 
       }
      }
    }
}

void loop() {
  // wait for WiFi connection
  if (WiFiMulti.run() == WL_CONNECTED) {

    client=new BearSSL::WiFiClientSecure();
    client->setInsecure();
    if (sendTime(client)) {
      sendConsumption(client);
    }
  }
  delay(10000);
}
