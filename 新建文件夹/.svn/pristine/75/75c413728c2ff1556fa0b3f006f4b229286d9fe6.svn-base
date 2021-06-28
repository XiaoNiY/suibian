const QWebChannelMessageTypes = {
  signal: 1,
  propertyUpdate: 2,
  init: 3,
  idle: 4,
  debug: 5,
  invokeMethod: 6,
  connectToSignal: 7,
  disconnectFromSignal: 8,
  setProperty: 9,
  response: 10,
};

export class QWebChannel {

  transport: any;
  initCallback: Function;

  execCallbacks = {};
  execId = 0;

  objects = {};

  constructor(transport, initCallback) {
    if (typeof transport !== 'object' || typeof transport.send !== 'function') {
      console.error('The QWebChannel expects a transport object with a send function and onmessage callback property.' +
                    ' Given is: transport: ' + typeof(transport) + ', transport.send: ' + typeof(transport.send));
      return;
    }
    this.transport = transport;
    this.initCallback = initCallback;

    this.transport.onmessage = message => {
      let data = message.data;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      switch (data.type) {
        case QWebChannelMessageTypes.signal:
          this.handleSignal(data);
          break;
        case QWebChannelMessageTypes.response:
          this.handleResponse(data);
          break;
        case QWebChannelMessageTypes.propertyUpdate:
          this.handlePropertyUpdate(data);
          break;
        default:
          console.error('invalid message received:', message.data);
          break;
      }
    };

    this.exec({ type: QWebChannelMessageTypes.init }, data => {
      for (const objectName of Object.keys(data)) {
        const object = new QObject(objectName, data[objectName], this);
      }
      // now unwrap properties, which might reference other registered objects
      for (const objectName of Object.keys(this.objects)) {
        this.objects[objectName].unwrapProperties();
      }
      if (this.initCallback) {
        this.initCallback(this);
      }
      this.exec({ type: QWebChannelMessageTypes.idle });
    });
  }

  send(data: any) {
    if (typeof(data) !== 'string') {
      data = JSON.stringify(data);
    }
    this.transport.send(data);
  }

  exec(data: any, callback?: Function) {
    if (!callback) {
      // if no callback is given, send directly
      this.send(data);
      return;
    }
    if (this.execId === Number.MAX_VALUE) {
      // wrap
      this.execId = Number.MIN_VALUE;
    }
    if (data.hasOwnProperty('id')) {
      console.error('Cannot exec message with property id: ' + JSON.stringify(data));
      return;
    }
    data.id = this.execId++;
    this.execCallbacks[data.id] = callback;
    this.send(data);
  }

  handleSignal(message: any) {
    const object = this.objects[message.object];
    if (object) {
      object.signalEmitted(message.signal, message.args);
    } else {
      console.warn('Unhandled signal: ' + message.object + '::' + message.signal);
    }
  }

  handleResponse(message: any) {
    if (!message.hasOwnProperty('id')) {
      console.error('Invalid response message received: ', JSON.stringify(message));
      return;
    }
    this.execCallbacks[message.id](message.data);
    delete this.execCallbacks[message.id];
  }

  handlePropertyUpdate(message: any) {
    for (const i of Object.keys(message)) {
      const data = message.data[i];
      const object = this.objects[data.object];
      if (object) {
        object.propertyUpdate(data.signals, data.properties);
      } else {
        console.warn('Unhandled property update: ' + data.object + '::' + data.signal);
      }
    }
    this.exec({ type: QWebChannelMessageTypes.idle });
  }

  debug(message) {
    this.send({type: QWebChannelMessageTypes.debug, data: message});
  }
}

function QObject(name, data, webChannel) {
  this.__id__ = name;
  webChannel.objects[name] = this;

  // List of callbacks that get invoked upon signal emission
  this.__objectSignals__ = {};

  // Cache of all properties, updated when a notify signal is emitted
  this.__propertyCache__ = {};

  const object = this;

  // ----------------------------------------------------------------------

  this.unwrapQObject = function (response) {
    if (response instanceof Array) {
      // support list of objects
      const ret = new Array(response.length);
      for (let i = 0; i < response.length; ++i) {
        ret[i] = object.unwrapQObject(response[i]);
      }
      return ret;
    }
    if (!response
      || !response['__QObject*__']
      || response.id === undefined) {
      return response;
    }

    const objectId = response.id;
    if (webChannel.objects[objectId]) {
      return webChannel.objects[objectId];
    }

    if (!response.data) {
      console.error('Cannot unwrap unknown QObject ' + objectId + ' without data.');
      return;
    }

    const qObject = new QObject(objectId, response.data, webChannel);
    qObject.destroyed.connect(function () {
      if (webChannel.objects[objectId] === qObject) {
        delete webChannel.objects[objectId];
        // reset the now deleted QObject to an empty {} object
        // just assigning {} though would not have the desired effect, but the
        // below also ensures all external references will see the empty map
        // NOTE: this detour is necessary to workaround QTBUG-40021
        const propertyNames = [];
        for (const propertyName of Object.keys(qObject)) {
          propertyNames.push(propertyName);
        }
        for (const idx of Object.keys(propertyNames)) {
          delete qObject[propertyNames[idx]];
        }
      }
    });
    // here we are already initialized, and thus must directly unwrap the properties
    qObject.unwrapProperties();
    return qObject;
  };

  this.unwrapProperties = function () {
    for (const propertyIdx of Object.keys(object.__propertyCache__)) {
      object.__propertyCache__[propertyIdx] = object.unwrapQObject(object.__propertyCache__[propertyIdx]);
    }
  };

  function addSignal(signalData, isPropertyNotifySignal) {
    const signalName = signalData[0];
    const signalIndex = signalData[1];
    object[signalName] = {
      connect: function (callback) {
        if (typeof (callback) !== 'function') {
          console.error('Bad callback given to connect to signal ' + signalName);
          return;
        }

        object.__objectSignals__[signalIndex] = object.__objectSignals__[signalIndex] || [];
        object.__objectSignals__[signalIndex].push(callback);

        if (!isPropertyNotifySignal && signalName !== 'destroyed') {
          // only required for "pure" signals, handled separately for properties in propertyUpdate
          // also note that we always get notified about the destroyed signal
          webChannel.exec({
            type: QWebChannelMessageTypes.connectToSignal,
            object: object.__id__,
            signal: signalIndex
          });
        }
      },
      disconnect: function (callback) {
        if (typeof (callback) !== 'function') {
          console.error('Bad callback given to disconnect from signal ' + signalName);
          return;
        }
        object.__objectSignals__[signalIndex] = object.__objectSignals__[signalIndex] || [];
        const idx = object.__objectSignals__[signalIndex].indexOf(callback);
        if (idx === -1) {
          console.error('Cannot find connection of signal ' + signalName + ' to ' + callback.name);
          return;
        }
        object.__objectSignals__[signalIndex].splice(idx, 1);
        if (!isPropertyNotifySignal && object.__objectSignals__[signalIndex].length === 0) {
          // only required for "pure" signals, handled separately for properties in propertyUpdate
          webChannel.exec({
            type: QWebChannelMessageTypes.disconnectFromSignal,
            object: object.__id__,
            signal: signalIndex
          });
        }
      }
    };
  }

  /**
   * Invokes all callbacks for the given signalname. Also works for property notify callbacks.
   */
  function invokeSignalCallbacks(signalName, signalArgs) {
    const connections = object.__objectSignals__[signalName];
    if (connections) {
      connections.forEach(function (callback) {
        callback.apply(callback, signalArgs);
      });
    }
  }

  this.propertyUpdate = function (signals, propertyMap) {
    // update property cache
    for (const propertyIndex of Object.keys(propertyMap)) {
      const propertyValue = propertyMap[propertyIndex];
      object.__propertyCache__[propertyIndex] = propertyValue;
    }

    for (const signalName of Object.keys(signals)) {
      // Invoke all callbacks, as signalEmitted() does not. This ensures the
      // property cache is updated before the callbacks are invoked.
      invokeSignalCallbacks(signalName, signals[signalName]);
    }
  };

  this.signalEmitted = function (signalName, signalArgs) {
    invokeSignalCallbacks(signalName, this.unwrapQObject(signalArgs));
  };

  function addMethod(methodData) {
    const methodName = methodData[0];
    const methodIdx = methodData[1];
    object[methodName] = function () {
      const args = [];
      let callback;
      for (let i = 0; i < arguments.length; ++i) {
        const argument = arguments[i];
        if (typeof argument === 'function') {
          callback = argument;
        } else if (argument instanceof QObject && webChannel.objects[argument.__id__] !== undefined) {
          args.push({
            id: argument.__id__
          });
        } else {
          args.push(argument);
        }
      }

      webChannel.exec({
        type: QWebChannelMessageTypes.invokeMethod,
        object: object.__id__,
        method: methodIdx,
        args: args
      }, function (response) {
        if (response !== undefined) {
          const result = object.unwrapQObject(response);
          if (callback) {
            (callback)(result);
          }
        }
      });
    };
  }

  function bindGetterSetter(propertyInfo) {
    const propertyIndex = propertyInfo[0];
    const propertyName = propertyInfo[1];
    const notifySignalData = propertyInfo[2];
    // initialize property cache with current value
    // NOTE: if this is an object, it is not directly unwrapped as it might
    // reference other QObject that we do not know yet
    object.__propertyCache__[propertyIndex] = propertyInfo[3];

    if (notifySignalData) {
      if (notifySignalData[0] === 1) {
        // signal name is optimized away, reconstruct the actual name
        notifySignalData[0] = propertyName + 'Changed';
      }
      addSignal(notifySignalData, true);
    }

    Object.defineProperty(object, propertyName, {
      configurable: true,
      get: function () {
        const propertyValue = object.__propertyCache__[propertyIndex];
        if (propertyValue === undefined) {
          // This shouldn't happen
          console.warn('Undefined value in property cache for property "' + propertyName + '" in object ' + object.__id__);
        }

        return propertyValue;
      },
      set: function (value: any) {
        if (value === undefined) {
          console.warn('Property setter for ' + propertyName + ' called with undefined value!');
          return;
        }
        object.__propertyCache__[propertyIndex] = value;
        let valueToSend = value;
        if (valueToSend instanceof QObject && webChannel.objects[valueToSend.__id__] !== undefined) {
          valueToSend = { id: valueToSend.__id__ };
        }
        webChannel.exec({
          type: QWebChannelMessageTypes.setProperty,
          object: object.__id__,
          property: propertyIndex,
          value: valueToSend
        });
      }
    });

  }

  // ----------------------------------------------------------------------

  data.methods.forEach(addMethod);

  data.properties.forEach(bindGetterSetter);

  data.signals.forEach(function (signal) { addSignal(signal, false); });

  // of Object.keys(data.enums)
  for (const name in data.enums) {
    object[name] = data.enums[name];
  }
}
