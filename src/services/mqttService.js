import init from "react_native_mqtt";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const MQTT_HOST = "broker.emqx.io";
export const MQTT_PORT = 8083;
export const MQTT_PATH = "/mqtt";

export const TELEMETRY_TOPIC = "amansense/farm/demo/telemetry";
export const COMMAND_TOPIC = "amansense/farm/demo/commands";
export const PUMP_STATUS_TOPIC = "amansense/farm/demo/pump/status";

let mqttClient = null;

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});

export const connectMqttClient = ({
  onConnectionChange,
  onTelemetry,
  onPumpStatus,
  onError,
} = {}) => {
  const clientId = `amansense-mobile-${Math.floor(Math.random() * 1000000)}`;

  mqttClient = new Paho.MQTT.Client(
    MQTT_HOST,
    MQTT_PORT,
    MQTT_PATH,
    clientId,
  );

  mqttClient.onConnectionLost = (responseObject) => {
    console.log(
      "MQTT connection lost:",
      responseObject?.errorMessage,
    );

    if (onConnectionChange) {
      onConnectionChange("disconnected");
    }

    if (responseObject?.errorCode !== 0 && onError) {
      onError({
        message:
          responseObject?.errorMessage || "MQTT connection lost",
      });
    }
  };

  mqttClient.onMessageArrived = (message) => {
    try {
      const payload = JSON.parse(message.payloadString);

      if (message.destinationName === TELEMETRY_TOPIC) {
        console.log("MQTT telemetry received:", payload);

        if (onTelemetry) {
          onTelemetry(payload);
        }

        return;
      }

      if (message.destinationName === PUMP_STATUS_TOPIC) {
        console.log("MQTT pump status received:", payload);

        if (onPumpStatus) {
          onPumpStatus(payload);
        }

        return;
      }
    } catch (error) {
      console.log("MQTT message parse error:", error);

      if (onError) {
        onError(error);
      }
    }
  };

  mqttClient.connect({
    useSSL: false,
    timeout: 10,
    reconnect: true,

    onSuccess: () => {
      console.log("MQTT connected:", clientId);

      if (onConnectionChange) {
        onConnectionChange("connected");
      }

      mqttClient.subscribe(TELEMETRY_TOPIC, {
        qos: 0,
        onSuccess: () => {
          console.log("Subscribed to:", TELEMETRY_TOPIC);
        },
        onFailure: (error) => {
          console.log("MQTT telemetry subscribe failed:", error);
        },
      });

      mqttClient.subscribe(PUMP_STATUS_TOPIC, {
        qos: 0,
        onSuccess: () => {
          console.log("Subscribed to:", PUMP_STATUS_TOPIC);
        },
        onFailure: (error) => {
          console.log("MQTT pump status subscribe failed:", error);
        },
      });
    },

    onFailure: (error) => {
      console.log("MQTT connection failed:", error);

      if (onConnectionChange) {
        onConnectionChange("error");
      }

      if (onError) {
        onError({
          message: error?.errorMessage || "MQTT connection failed",
        });
      }
    },
  });

  return mqttClient;
};

export const disconnectMqttClient = () => {
  if (mqttClient) {
    mqttClient.disconnect();
    mqttClient = null;
  }
};

export const publishPumpCommand = (commandPayload) => {
  if (!mqttClient || !mqttClient.isConnected()) {
    console.log(
      "MQTT client is not connected. Cannot publish command.",
    );
    return false;
  }

  const message = new Paho.MQTT.Message(
    JSON.stringify(commandPayload),
  );
  message.destinationName = COMMAND_TOPIC;
  message.qos = 0;

  mqttClient.send(message);

  console.log("Pump command published:", commandPayload);

  return true;
};
