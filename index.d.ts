interface BluetoothManufacturerDataFilterInit extends BluetoothDataFilterInit {
    companyIdentifier: number;
}
interface BluetoothServiceDataFilterInit extends BluetoothDataFilterInit {
    service: BluetoothServiceUUID;
}
interface BluetoothLEScanFilterInit {
    services?: Array<BluetoothServiceUUID>;
    name?: string;
    namePrefix?: string;
    manufacturerData?: Array<BluetoothManufacturerDataFilterInit>;
    serviceData?: Array<BluetoothServiceDataFilterInit>;
}