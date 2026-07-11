import json
import time
import threading
from datetime import datetime, timezone

import paho.mqtt.client as mqtt

from counterfit_connection import CounterFitConnection
from counterfit_shims_grove.adc import ADC


BROKER_HOST = "broker.emqx.io"
BROKER_PORT = 1883

DEVICE_ID = "aman-counterfit-soil-001"
TELEMETRY_TOPIC = "amansense/farm/demo/telemetry"
COMMAND_TOPIC = "amansense/farm/demo/commands"
PUMP_STATUS_TOPIC = "amansense/farm/demo/pump/status"

WET_READING = 300
DRY_READING = 900

pump_state = {
    "pumpStatus": "OFF",
    "mode": "MANUAL",
    "lastCommand": "NONE",
    "lastIrrigationStartedAt": None,
    "lastIrrigationEndedAt": None,
    "activeDurationSeconds": 0,
}


def clamp(value, minimum, maximum):
    return max(minimum, min(maximum, value))


def raw_to_moisture_percent(raw_value):
    moisture = ((DRY_READING - raw_value) / (DRY_READING - WET_READING)) * 100
    return round(clamp(moisture, 0, 100), 1)


def get_moisture_status(moisture_percent):
    if moisture_percent < 20:
        return "Very Dry"
    if moisture_percent < 35:
        return "Dry"
    if moisture_percent <= 60:
        return "Optimal"
    if moisture_percent <= 80:
        return "Wet"
    return "Over-Watered"


def now_utc():
    return datetime.now(timezone.utc).isoformat()


def build_pump_status_payload():
    return {
        "deviceId": DEVICE_ID,
        "actuatorType": "Virtual Relay-Controlled Irrigation Pump",
        "pumpStatus": pump_state["pumpStatus"],
        "mode": pump_state["mode"],
        "lastCommand": pump_state["lastCommand"],
        "lastIrrigationStartedAt": pump_state["lastIrrigationStartedAt"],
        "lastIrrigationEndedAt": pump_state["lastIrrigationEndedAt"],
        "activeDurationSeconds": pump_state["activeDurationSeconds"],
        "timestamp": now_utc(),
    }


def publish_pump_status(client):
    payload = build_pump_status_payload()
    client.publish(PUMP_STATUS_TOPIC, json.dumps(payload), qos=0)
    print("Pump status:", payload)


def stop_pump(client, command_name="STOP_IRRIGATION"):
    pump_state["pumpStatus"] = "OFF"
    pump_state["lastCommand"] = command_name
    pump_state["lastIrrigationEndedAt"] = now_utc()
    pump_state["activeDurationSeconds"] = 0
    publish_pump_status(client)


def start_pump_for_duration(client, duration_seconds):
    pump_state["pumpStatus"] = "ON"
    pump_state["lastCommand"] = "START_IRRIGATION"
    pump_state["lastIrrigationStartedAt"] = now_utc()
    pump_state["lastIrrigationEndedAt"] = None
    pump_state["activeDurationSeconds"] = duration_seconds
    publish_pump_status(client)

    def auto_stop():
        time.sleep(duration_seconds)
        if pump_state["pumpStatus"] == "ON":
            stop_pump(client, "AUTO_STOP_AFTER_DURATION")

    threading.Thread(target=auto_stop, daemon=True).start()


def on_connect(client, userdata, flags, rc):
    print("MQTT command listener connected with result code:", rc)
    client.subscribe(COMMAND_TOPIC)
    print("Subscribed to command topic:", COMMAND_TOPIC)


def on_message(client, userdata, message):
    try:
        payload = json.loads(message.payload.decode())
        print("Command received:", payload)

        command = payload.get("command")
        mode = payload.get("mode", "MANUAL")
        duration_seconds = int(payload.get("durationSeconds", 30))

        pump_state["mode"] = mode

        if command == "START_IRRIGATION":
            duration_seconds = clamp(duration_seconds, 5, 3600)
            start_pump_for_duration(client, duration_seconds)

        elif command == "STOP_IRRIGATION":
            stop_pump(client, "STOP_IRRIGATION")

        elif command == "SET_MODE":
            pump_state["lastCommand"] = "SET_MODE"
            publish_pump_status(client)

        else:
            print("Unknown command:", command)

    except Exception as error:
        print("Command handling error:", error)


def main():
    print("Connecting to CounterFit...")
    CounterFitConnection.init("127.0.0.1", 5000)

    adc = ADC()

    print("Connecting to MQTT broker...")
    client = mqtt.Client(client_id=DEVICE_ID)
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(BROKER_HOST, BROKER_PORT, 60)
    client.loop_start()

    print("Connected.")
    print(f"Publishing telemetry to topic: {TELEMETRY_TOPIC}")
    print(f"Publishing pump status to topic: {PUMP_STATUS_TOPIC}")
    print(f"Listening for commands on topic: {COMMAND_TOPIC}")
    print("Make sure CounterFit is running and Soil Moisture sensor is on Pin 0.")
    print("Press CTRL+C to stop.\n")

    try:
        while True:
            raw_soil_moisture = adc.read(0)
            soil_moisture_percent = raw_to_moisture_percent(raw_soil_moisture)
            moisture_status = get_moisture_status(soil_moisture_percent)

            telemetry_payload = {
                "deviceId": DEVICE_ID,
                "sensorType": "CounterFit Grove Capacitive Soil Moisture Sensor",
                "adcRange": "0-1023",
                "rawSoilMoisture": raw_soil_moisture,
                "soilMoisturePercent": soil_moisture_percent,
                "moistureStatus": moisture_status,
                "soilTemperature": 25.6,
                "airHumidity": 62,
                "tankLevel": 78,
                "pumpStatus": pump_state["pumpStatus"],
                "pumpMode": pump_state["mode"],
                "timestamp": now_utc(),
            }

            client.publish(TELEMETRY_TOPIC, json.dumps(
                telemetry_payload), qos=0)
            print("Published:", telemetry_payload)

            publish_pump_status(client)

            time.sleep(3)

    except KeyboardInterrupt:
        print("\nStopping publisher...")

    finally:
        client.loop_stop()
        client.disconnect()
        print("Disconnected.")


if __name__ == "__main__":
    main()
