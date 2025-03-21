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
        except RuntimeError as e:
            print(f"Error membaca sensor: {e}, coba lagi...")
        time.sleep(2)  # Tunggu sebelum baca ulang

def tentukan_keadaan_aksi(suhu, kelembapan):
    """Menentukan keadaan dan aksi sesuai aturan"""
    if suhu <= 25.9:
        keadaan_suhu = "Rendah"
        aksi_suhu = "Nyalakan Lampu"
    elif 26 <= suhu <= 28:
        keadaan_suhu = "Normal"
        aksi_suhu = "-"
    else:
        keadaan_suhu = "Tinggi"
        aksi_suhu = "Penyiraman"

    if kelembapan <= 79.9:
        keadaan_kelembapan = "Rendah"
        aksi_kelembapan = "Siram"
    elif 80 <= kelembapan <= 90:
        keadaan_kelembapan = "Normal"
        aksi_kelembapan = "-"
    else:
        keadaan_kelembapan = "Tinggi"
        aksi_kelembapan = "Nyalakan Lampu"

    # Menentukan aksi berdasarkan kombinasi suhu & kelembapan
    if keadaan_suhu == "Rendah" and keadaan_kelembapan == "Tinggi":
        keadaan = "Suhu Rendah & Kelembapan Tinggi"
        aksi = "Nyalakan Lampu"
    elif keadaan_suhu == "Tinggi" and keadaan_kelembapan == "Rendah":
        aksi = "Penyiraman"
        keadaan = "Suhu Tinggi & Kelembapan Rendah"
    else:
        aksi = "Tidak Ada"
        keadaan = "Tidak Ada"

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
    while True:
        suhu, kelembapan = read_sensor()
        keadaan, aksi = tentukan_keadaan_aksi(suhu, kelembapan)
        if suhu is not None and kelembapan is not None:
            send_to_server(suhu, kelembapan, keadaan, aksi)
        time.sleep(1800)  # 30 menit
        # time.sleep(60)  # Untuk testing, bisa diganti ke 30 menit (1800 detik) saat deploy