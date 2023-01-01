

#define HISTOGRAM_LENGTH 5
class EnergyHistogram {
  public:
    EnergyHistogram(int device);
    void reset();
    void addMeasure(double power);
    long getDuration(int bucket);
    double getConsumption(int bucket);
  private:
    int _device;
    double _histogram[HISTOGRAM_LENGTH];// store the consumption in wh
    long _duration[HISTOGRAM_LENGTH];   // store the duration of the bucket
    unsigned long _lastCheckTime;
};
