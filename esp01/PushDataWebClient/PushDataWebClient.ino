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

void setup() {

  Serial.begin(115200);
  Serial.setTimeout(2000);
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
          while(Serial.available()) Serial.read(); // make sure that all inputs are cleaned first
          const char* datetime = doc["datetime"];
          Serial.println(datetime);
          return true;
      }
    }
    return false;
}

void sendConsumption(BearSSL::WiFiClientSecure *client) {
    HTTPClient https;

    String databuffer=Serial.readString(); // reads the buffer until timeout
    if (https.begin(*client, BACKEND_URL)) { 
            https.addHeader("Content-Type", "application/json");
            int httpCode = https.POST(databuffer);
            https.end();
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
  delay(60000);
}
