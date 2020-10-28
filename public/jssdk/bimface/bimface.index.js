'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var modules = ['/Private/thirdparty.js', '/Private/three.js', '/Private/viewerfloor.js', '/Private/PntLoader.js', '/Private/BimTilesLoader.js', '/Private/Editor.js', '/Private/WebViewer.js', '/Private/bimface.bufferfly.js', '/Private/mdvDrawing2D.js', '/Private/bimcube.js'];

var transformFullUrl = function transformFullUrl(baseUrl, modules$$1) {
  for (var i = 0; i < modules$$1.length; i++) {
    modules$$1[i] = baseUrl + modules$$1[i];
  }
};

var isPdfView = function isPdfView(data, options) {
  var isPdf = data.workerType === 'pdf-transfer' || options.viewType === "pdfView";
  isPdf && (data.renderType = 'pdfView'); // 目前pdf的viewMetaData写的也是renderType = 'bimView'，待此原始数据修改后可去掉此处的判断
  return isPdf;
};

var isDrawingView = function isDrawingView(data, options) {
  return data.renderType == "drawingView" || options.viewType == BimfaceViewTypeOption.DrawingView;
};

//获取需要加载的js/css资源
var getLoadModules = function getLoadModules(configurations) {
  var sdkVersion = BimfaceLoaderConfig.dataEnvType == "Local" ? 'bimface' : configurations.sdkVersion;
  var uiVersion = BimfaceLoaderConfig.dataEnvType == "Local" ? 'bimface' : configurations.uiVersion;
  var options = configurations.options;
  var configuration = options.configuration;

  var debugModules = ['/Bimface/Bimface.css', '/Application/Application.js', '/Bimface/Bimface.js', '/Drawing/Drawing.js'];
  var sdkModules = [];

  if (options.build === BimfaceConfigrationOption.Debug) {
    if (options.dataPath) {
      sdkModules = [].concat(modules, debugModules);
    } else {
      sdkModules = modules;
    }
  } else if (options.build === BimfaceConfigrationOption.Release && !isDrawingView(configurations.metadata, configurations.options)) {
    sdkModules = [].concat(_toConsumableArray(sdkModules), ['/' + sdkVersion + '/bimface.foxfly' + configuration + '.js']);
  }

  var commonModules = ['/' + sdkVersion + '/' + options.language + '.js', '/' + uiVersion + '/Application' + configuration + '.js'];
  if (isPdfView(configurations.metadata, configurations.options)) {
    sdkModules = [].concat(_toConsumableArray(sdkModules), commonModules, ['/' + sdkVersion + '/Bimface.css', '/' + sdkVersion + '/bimface.pdf.css', '/' + sdkVersion + '/bimface.pdf.js', '/' + sdkVersion + '/bimface.pdfviewer.js']);
  } else if (isDrawingView(configurations.metadata, configurations.options)) {
    sdkModules = [].concat(_toConsumableArray(sdkModules), commonModules, ['/' + sdkVersion + '/Drawing.css', '/' + sdkVersion + '/bimface.bufferfly.js', '/' + sdkVersion + '/Drawing' + configuration + '.js']);
  } else {
    sdkModules = [].concat(_toConsumableArray(sdkModules), commonModules, ['/' + sdkVersion + '/Bimface.css', '/' + sdkVersion + '/thirdparty.js', '/' + sdkVersion + '/BimTilesLoader.js', '/' + sdkVersion + '/Bimface' + configuration + '.js']);
  }

  return sdkModules;
};

var postProcessing = function postProcessing(configurations) {
  var data = configurations.metadata;
  var options = configurations.options;
  var successCb = configurations.successCb;

  var sdkModules = getLoadModules(configurations);
  transformFullUrl(options.staticHost, sdkModules);

  data.databagId = '' + data.databagId;

  if (options.path) {
    data.path = options.path;
    data.dataPath = "./";
  } else if (options.resourcePath) {
    data.path = options.resourcePath.replace('viewToken', '');
  }
  data.sdkPath = options.sdkPath;

  if (sdkModules.length == 0) {
    successCb(data);
  } else {
    loadResource(sdkModules, function () {
      if (options.build === BimfaceConfigrationOption.Debug && options.dataPath) {
        var arr = options.dataPath.split("/");
        successCb({
          databagId: arr.pop(),
          path: arr.join("/")
        });
      }
      successCb(data);
    });
  }
};

window.postProcessing = postProcessing;