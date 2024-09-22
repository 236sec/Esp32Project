from machine import Pin,PWM,ADC,I2C
from time import sleep
import ujson
import json
import ssd1306
import network
from umqtt.simple import MQTTClient
WIFI_SSID = 'Realme'
WIFI_PASS = '88888888'
MQTT_BROKER = 'iot.cpe.ku.ac.th'
MQTT_USER 'b6510503841'
MQTT_PASS = 'sompon.o@ku.th'
TOPIC_PREFIX = 'b6510503841'



def connect_wifi():
    mac = ':'.join(f'{b:02X}' for b in wifi.config('mac'))
    print(f'WiFi MAC address is {mac}')
    wifi.active(True)
    print(f'Connecting to WiFi {WIFI_SSID}.')
    display.fill(0)
    display.text(f'Connecting to WiFi {WIFI_SSID}.',5,30,1)
    display.show()
    wifi.connect(WIFI_SSID, WIFI_PASS)
    while not wifi.isconnected():
        print('.', end='')
        sleep(0.5)
    print('WiFi connected.')
    display.fill(0)
    display.text('WiFi connected.',5,30,1)
    display.show()
    
def mqtt_callback(topic, payload):
    n = None
    msg = json.loads(payload.decode())
    lat,lng = msg['lat'],msg['lng']
    lat,lng = float(lat),float(lng)
    bus_detect = Bus(1,lat,lng)
    print("cur_busloaction:",bus_detect.cur_busstop)
    if bus_detect.cur_busstop < busstop_cur.no:
        n = abs(bus_detect.cur_busstop-busstop_cur.no)
    elif bus_detect.cur_busstop > busstop_cur.no:
        n = BusStop.all_busstop[-1].no - bus_detect.cur_busstop + busstop_cur.no
    elif bus_detect.cur_busstop == busstop_cur.no:
        print(busstop_cur.no)
        print(bus_detect.cur_busstop)
        n=0
    if n != None:
        display.fill(0)
        display.text(f' bus stop {n}',5,30,1)
        display.text(f'approximate time {n*4}',1,40,1)
        display.text(f'{n*4}',1,50,1)
        display.show()
        sleep(5)
            

def connect_mqtt():
    display.fill(0)
    display.text('Connecting MQTT',5,30,1)
    display.text(f'at {MQTT_BROKER}.',5,50,1)
    display.show()
    mqtt.connect()
    mqtt.set_callback(mqtt_callback)
    mqtt.subscribe(TOPIC_DISPLAY_TEXT)
    display.fill(0)
    display.text('MQTT broker connected.',5,30,1)
    display.show()


#set up display
i2c = I2C(0, scl=Pin(47), sda=Pin(48))
display = ssd1306.SSD1306_I2C(128, 64, i2c)
display.fill(0)
TOPIC_DISPLAY_TEXT = f'{TOPIC_PREFIX}/bus/1/location'



#set uo wifi
wifi = network.WLAN(network.STA_IF)
mqtt = MQTTClient(client_id='displayoledesp32',
                  server=MQTT_BROKER,
                  user=MQTT_USER,
                  password=MQTT_PASS)
connect_wifi()
connect_mqtt()
#set up display after mqtt connected
display.fill(0)
display.text(' bus stop',5,30,1)
display.text('approximate time',1,40,1)
display.show()

all_busstop = [{
        'no': 1,
        'lat': 13.846753,
        'lng': 100.564628
    },
    {
        'no': 2,
            'lat': 13.848469,
            'lng': 100.565564
    },{
        'no': 3,
        'lat': 13.847645,
        'lng': 100.567023
    },  {
        'no': 4,
        'lat': 13.847089,
        'lng': 100.568160
    }, {
        'no': 5,
            'lat': 13.846568,
            'lng': 100.570435
    }, {
        'no': 6,
            'lat': 13.843550,
            'lng': 100.570038
    }, {
        'no': 7,
            'lat': 13.845078,
            'lng': 100.567091
    }]

class BusStop():
    all_busstop = []
    def __init__(self,no,lat,lng):
        self.no = int(no)
        self.lat = float(lat)
        self.lng = float(lng)
        BusStop.all_busstop.append(self)


class Bus():
    all_bus = []
    def __init__(self,no,lat,lng):
        self.no = int(no)
        self.lat = float(lat)
        self.lng = float(lng)
        self.cur_busstop = find_closset(lat,lng)
        Bus.all_bus.append(self)


def create_busstop(buss):
    for bus in buss:
        BusStop(bus['no'],bus['lat'],bus['lng'])
        
create_busstop(all_busstop)

def find_closset(lat,lng):
    distance = {}
    for busstop in BusStop.all_busstop :
        dis = ((lng - busstop.lng)**2 + (lat - busstop.lat)**2)**(1/2)
        distance[busstop.no] = dis
    clo_dis = min(distance.values())
    for busstop in distance.keys():
        if distance[busstop] == clo_dis:
            return busstop 

#set the current busstop location here
busstop_cur = BusStop.all_busstop[0]

while True:
    #check_msg to when message come will call callback function
    mqtt.check_msg()

