

#define HISTOGRAM_LENGTH 5
class EnergyHistogram {
  public:
    EnergyHistogram();
    void reset();
    void addMeasure(float power);
    long getDuration(int bucket);
    float getConsumption(int bucket);
  private:
    float _histogram[HISTOGRAM_LENGTH];// store the consumption in wh
    long _duration[HISTOGRAM_LENGTH];   // store the duration of the bucket
    unsigned long _lastCheckTime;
};
