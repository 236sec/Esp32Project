from machine import UART
import time
import network
from umqtt.simple import MQTTClient
from math import floor
from micropyGPS import MicropyGPS

WIFI_SSID = 'Realme'
WIFI_PASS = '88888888'
SERVER_URL = 'iot.cpe.ku.ac.th'
USER_BRO = 'b6510503841'
PASS_BRO = 'sompon.o@ku.th'
TOPIC_GPS = 'b6510503841/bus/1/location'
RX_PIN = 18
TX_PIN = 17

#Create a UART object
my_gps = MicropyGPS()
gpsModule = UART(1, baudrate=9600, rx=RX_PIN, tx=TX_PIN) #choose your rx tx pin

def connect_wifi():
    mac = ':'.join(f'{b:02X}' for b in wifi.config('mac'))
    print(f'WiFi MAC address is {mac}')
    wifi.active(True)
    wifi.connect(WIFI_SSID, WIFI_PASS)
    while not wifi.isconnected():
        print('.', end='')
        time.sleep(0.5)
    print('WiFi connected.')

def mqtt_callback(topic, payload):
    pass
            

def connect_mqtt():
    print("Connecting MQTT")
    mqtt.connect()
    print("MQTT CONNECTED")
    mqtt.set_callback(mqtt_callback)
    
    
wifi = network.WLAN(network.STA_IF)
mqtt = MQTTClient(client_id='gpsEsp32',
                  server=SERVER_URL,
                  user=USER_BRO,
                  password=PASS_BRO)


connect_wifi()
connect_mqtt()


def loop():
    while True:
        if gpsModule.any():
            buf = gpsModule.readline()
            buf = buf.decode("utf-8")
            #get line that have gps data
            if 'G' not in buf:
                if 'M' in buf:
                    buf = buf.split(',')
                    #covert the to dd
                    lat,lng = int(buf[0:2])+ float(buf[2:])/60,int(buf[0:3])+float(buf[3:])
                    location = {
                        "lat": lat,
                        "lng": lng
                        }
                    #send to mqtt with json format
                    payload = json.dumps(location)
                    print(payload)
                    mqtt.publish(TOPIC_GPS,payload)
                    

            
def print_rawdata():
    '''USE THIS FUNCTION TO GET RAW DATA FROM GPS MODULE'''
    while True:
        if gpsModule.any():
            buf = gpsModule.readline()
            buf = buf.decode("utf-8")
            print(buf)
            
loop()
                

                
        
    