interface BluetoothLEScanOptions {
    filters?: Array<BluetoothLEScanFilterInit>;
    keepRepeatedDevices?: boolean;
    acceptAllAdvertisements?: boolean;
}
interface Bluetooth {
    requestLEScan(options?: BluetoothLEScanOptions): Promise<BluetoothLEScan>;
}
interface BluetoothLEScanFilter {
    new (init?: BluetoothLEScanFilterInit);
    readonly name: string;
    readonly namePrefix: string;
    readonly services: ReadonlyArray<UUID>;
    readonly manufacturerData: BluetoothManufacturerDataFilter;
    readonly serviceData: BluetoothServiceDataFilter;
}
interface BluetoothLEScan {
    readonly filters: ReadonlyArray<BluetoothLEScanFilter>;
    readonly keepRepeatedDevices: boolean;
    readonly acceptAllAdvertisements: boolean;
    readonly active: boolean;
    stop(): undefined;
}
interface BluetoothDataFilterInit {
    dataPrefix?: BufferSource;
    mask?: BufferSource;
}
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
interface RequestDeviceOptions {
    filters?: Array<BluetoothLEScanFilterInit>;
    optionalServices?: Array<BluetoothServiceUUID>;
    optionalManufacturerData?: Array<number>;
    acceptAllDevices?: boolean;
}
interface Bluetooth extends EventTarget {
    getAvailability(): Promise<boolean>;
    onavailabilitychanged: EventHandler;
    readonly referringDevice: BluetoothDevice;
    getDevices(): Promise<Array<BluetoothDevice>>;
    requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
}
declare var Bluetooth: Bluetooth;
interface Bluetooth extends BluetoothDeviceEventHandlers {
}
interface Bluetooth extends CharacteristicEventHandlers {
}
interface Bluetooth extends ServiceEventHandlers {
}
interface BluetoothDevice extends EventTarget {
    readonly id: string;
    readonly name: string;
    readonly gatt: BluetoothRemoteGATTServer;
    watchAdvertisements(options?: WatchAdvertisementsOptions): Promise<undefined>;
    readonly watchingAdvertisements: boolean;
}
declare var BluetoothDevice: BluetoothDevice;
interface BluetoothDevice extends BluetoothDeviceEventHandlers {
}
interface BluetoothDevice extends CharacteristicEventHandlers {
}
interface BluetoothDevice extends ServiceEventHandlers {
}
interface WatchAdvertisementsOptions {
    signal?: AbortSignal;
}
interface BluetoothRemoteGATTServer {
    readonly device: BluetoothDevice;
    readonly connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): undefined;
    getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
    getPrimaryServices(service?: BluetoothServiceUUID): Promise<Array<BluetoothRemoteGATTService>>;
}
declare var BluetoothRemoteGATTServer: BluetoothRemoteGATTServer;
interface BluetoothRemoteGATTService extends EventTarget {
    readonly device: BluetoothDevice;
    readonly uuid: UUID;
    readonly isPrimary: boolean;
    getCharacteristic(characteristic: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic>;
    getCharacteristics(characteristic?: BluetoothCharacteristicUUID): Promise<Array<BluetoothRemoteGATTCharacteristic>>;
    getIncludedService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
    getIncludedServices(service?: BluetoothServiceUUID): Promise<Array<BluetoothRemoteGATTService>>;
}
declare var BluetoothRemoteGATTService: BluetoothRemoteGATTService;
interface BluetoothRemoteGATTService extends CharacteristicEventHandlers {
}
interface BluetoothRemoteGATTService extends ServiceEventHandlers {
}
interface BluetoothRemoteGATTCharacteristic extends EventTarget {
    readonly service: BluetoothRemoteGATTService;
    readonly uuid: UUID;
    readonly properties: BluetoothCharacteristicProperties;
    readonly value: DataView;
    getDescriptor(descriptor: BluetoothDescriptorUUID): Promise<BluetoothRemoteGATTDescriptor>;
    getDescriptors(descriptor?: BluetoothDescriptorUUID): Promise<Array<BluetoothRemoteGATTDescriptor>>;
    readValue(): Promise<DataView>;
    writeValue(value: BufferSource): Promise<undefined>;
    writeValueWithResponse(value: BufferSource): Promise<undefined>;
    writeValueWithoutResponse(value: BufferSource): Promise<undefined>;
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
}
declare var BluetoothRemoteGATTCharacteristic: BluetoothRemoteGATTCharacteristic;
interface BluetoothRemoteGATTCharacteristic extends CharacteristicEventHandlers {
}
interface BluetoothCharacteristicProperties {
    readonly broadcast: boolean;
    readonly read: boolean;
    readonly writeWithoutResponse: boolean;
    readonly write: boolean;
    readonly notify: boolean;
    readonly indicate: boolean;
    readonly authenticatedSignedWrites: boolean;
    readonly reliableWrite: boolean;
    readonly writableAuxiliaries: boolean;
}
declare var BluetoothCharacteristicProperties: BluetoothCharacteristicProperties;
interface BluetoothRemoteGATTDescriptor {
    readonly characteristic: BluetoothRemoteGATTCharacteristic;
    readonly uuid: UUID;
    readonly value: DataView;
    readValue(): Promise<DataView>;
    writeValue(value: BufferSource): Promise<undefined>;
}
declare var BluetoothRemoteGATTDescriptor: BluetoothRemoteGATTDescriptor;