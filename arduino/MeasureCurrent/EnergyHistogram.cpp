
#include <Arduino.h>
#include "EnergyHistogram.h"

EnergyHistogram::EnergyHistogram(int device) {
  _device = device;
  reset();
}

void EnergyHistogram::reset() {
  _lastCheckTime=millis();
  for(int bucket=0;bucket<HISTOGRAM_LENGTH;bucket++) {
    _histogram[bucket] = 0.0; 
    _duration[bucket] = 0; 
  }

}
void EnergyHistogram::addMeasure(double power) {
  int bucket= power / 1000;
  if(bucket>=HISTOGRAM_LENGTH) {
    bucket=HISTOGRAM_LENGTH-1;
  }
  long now=millis();
  if(_lastCheckTime>now) {
     _lastCheckTime=0; // to protect from time millis reset
  }
  long segmentDuration=now-_lastCheckTime;
  _histogram[bucket]+=power*(float)segmentDuration/3600000.0;
  _duration[bucket]+=segmentDuration; // we store the duration in miliseconds
  _lastCheckTime=now;
}

long EnergyHistogram::getDuration(int bucket) {
  return _duration[bucket]/1000; // convert into seconds
}

double EnergyHistogram::getConsumption(int bucket) {
  return _histogram[bucket];
}
