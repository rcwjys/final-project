import time
import board
import adafruit_dht
import requests

# Konfigurasi
DHT_PIN = board.D4  # Pin GPIO di Raspberry Pi
NODE_URL = "http://localhost:3000/create"  # Sesuaikan dengan endpoint Node.js
ID_AREA = 1  # ID area sensor, bisa diubah sesuai kebutuhan

# Inisialisasi sensor
dhtDevice = adafruit_dht.DHT11(DHT_PIN)

def read_sensor():
    """Membaca data dari DHT11"""
    while True:
        try:
            suhu = dhtDevice.temperature
            kelembapan = dhtDevice.humidity

            if suhu is not None and kelembapan is not None:
                return suhu, kelembapan

            print("Data sensor kosong, coba lagi...")
            time.sleep(2)
        except RuntimeError as e:
            print(f"Error membaca sensor: {e}, coba lagi...")
        time.sleep(2)  # Tunggu sebelum baca ulang

def tentukan_keadaan_aksi(suhu, kelembapan):
    """Menentukan keadaan dan aksi sesuai aturan"""
    if 26 <= suhu <= 28 and 80 <= kelembapan <= 90:
        keadaan = "Normal"
        aksi = "Tidak Ada Aksi"
    elif suhu > 28 and kelembapan < 80:
        keadaan = "Suhu Tinggi dan Kelembapan Rendah"
        aksi = "Penyiraman"
    elif suhu < 26 and kelembapan > 90:
        keadaan = "Suhu Rendah dan Kelembapan Tinggi"
        aksi = "Nyalakan Lampu"
    elif suhu < 26 and kelembapan < 80:
        keadaan = "Suhu Rendah dan Kelembapan Rendah"
        aksi = "Tidak Ada Aksi"
    elif suhu > 28 and kelembapan < 80:
        keadaan = "Suhu Tinggi dan Kelembapan Rendah"
        aksi = "Tidak Ada Aksi"
    elif 26 <= suhu <= 28 and kelembapan < 80:
        keadaan = "Suhu Normal dan Kelembapan Rendah"
        aksi = "Tidak Ada Aksi"
    elif suhu < 26 and 80 <= kelembapan <= 90:
        keadaan = "Suhu Rendah dan Kelembapan Normal"
        aksi = "Tidak Ada Aksi"

    return keadaan, aksi

def send_to_server(suhu, kelembapan, keadaan, aksi):

    data = {
        "suhu": suhu,
        "kelembapan": kelembapan,
        "keadaan": keadaan,
        "aksi": aksi,
        "id_area": ID_AREA
    }

    try:
        response = requests.post(NODE_URL, json=data, timeout=5)
        if response.status_code == 200:
            print("Data berhasil dikirim ke server!")
        else:
            print(f"Gagal mengirim data! Status: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Error request: {e}")

if __name__ == "__main__":
    #while True:
        suhu, kelembapan = read_sensor()
        keadaan, aksi = tentukan_keadaan_aksi(suhu, kelembapan)
        if suhu is not None and kelembapan is not None:
            send_to_server(suhu, kelembapan, keadaan, aksi)
        #time.sleep(1800)  # 30 menit
        # time.sleep(60)  # Untuk testing, bisa diganti ke 30 menit (1800 detik) saat deploy