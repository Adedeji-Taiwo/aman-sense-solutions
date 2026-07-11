import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  connectMqttClient,
  disconnectMqttClient,
  publishPumpCommand,
} from "../services/mqttService";
import { saveIrrigationEvent } from "../services/irrigationHistoryStorage";

const MqttTelemetryContext = createContext(null);

export const MqttTelemetryProvider = ({ children }) => {
  const [telemetry, setTelemetry] = useState(null);
  const [pumpStatus, setPumpStatus] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [lastError, setLastError] = useState("");

  const latestTelemetryRef = useRef(null);
  const lastSavedPumpEventRef = useRef("");

  useEffect(() => {
    latestTelemetryRef.current = telemetry;
  }, [telemetry]);

  useEffect(() => {
    connectMqttClient({
      onConnectionChange: setConnectionStatus,

      onTelemetry: (nextTelemetry) => {
        setTelemetry(nextTelemetry);
        latestTelemetryRef.current = nextTelemetry;
      },

      onPumpStatus: async (nextPumpStatus) => {
        setPumpStatus(nextPumpStatus);

        const eventSignature = [
          nextPumpStatus.pumpStatus,
          nextPumpStatus.lastCommand,
          nextPumpStatus.mode,
          nextPumpStatus.lastIrrigationStartedAt,
          nextPumpStatus.lastIrrigationEndedAt,
        ].join("-");

        if (lastSavedPumpEventRef.current === eventSignature) {
          return;
        }

        lastSavedPumpEventRef.current = eventSignature;

        const snapshot = latestTelemetryRef.current;

        try {
          await saveIrrigationEvent({
            ...nextPumpStatus,
            eventType: "PUMP_STATUS_UPDATE",
            soilMoisturePercent: snapshot?.soilMoisturePercent,
            rawSoilMoisture: snapshot?.rawSoilMoisture,
            moistureStatus: snapshot?.moistureStatus,
            tankLevel: snapshot?.tankLevel,
            estimatedWaterLiters: Math.round(
              (Number(nextPumpStatus.activeDurationSeconds || 0) / 60) * 18
            ),
          });
        } catch (error) {
          console.error("Unable to save irrigation event:", error);
        }
      },

      onError: (error) => {
        setLastError(error?.message || "MQTT connection error");
      },
    });

    return () => {
      disconnectMqttClient();
    };
  }, []);

  const sendPumpCommand = (commandPayload) => {
    return publishPumpCommand(commandPayload);
  };

  return (
    <MqttTelemetryContext.Provider
      value={{
        telemetry,
        pumpStatus,
        connectionStatus,
        lastError,
        sendPumpCommand,
      }}
    >
      {children}
    </MqttTelemetryContext.Provider>
  );
};

export const useMqttTelemetry = () => {
  const context = useContext(MqttTelemetryContext);

  if (!context) {
    throw new Error(
      "useMqttTelemetry must be used inside MqttTelemetryProvider"
    );
  }

  return context;
};