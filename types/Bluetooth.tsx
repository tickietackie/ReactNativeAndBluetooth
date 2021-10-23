type Device = {
  id: String;
  name: String;
  rssi: Number;
  txPowerLevel: Number;
  serviceUUIDs: String[];
  appearance?: Number;
};

export default Device;
