angular.module('starter.factories')

  .factory('DeviceInformationFactory', function() {
    var  device = {};
    device.deviceInformation = ionic.Platform.device();
    device.isWebView = ionic.Platform.isWebView();;
    device.isIPad = ionic.Platform.isIPad();
    device.isIOS = ionic.Platform.isIOS();
    device.isAndroid = ionic.Platform.isAndroid();
    device.isWindowsPhone = ionic.Platform.isWindowsPhone();
    device.currentPlatform = ionic.Platform.platform();
    device.currentPlatformVersion = ionic.Platform.version();

    return device;
  });
