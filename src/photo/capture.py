import os
import time
import requests
from datetime import datetime

NODE_URL = "http://localhost:3000/upload_img"  # Sesuaikan dengan endpoint Node.js
ID_RAK = 3  # ID Rak tetap 1

def capture_photo():
    """Mengambil foto pakai libcamera dengan settingan yang kamu mau"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")  # Format: YYYYMMDD_HHMMSS
    photo_path = f"/home/raspberry/final-project/latest.jpg"  # Path file
    os.system(f"libcamera-still -o {photo_path} --width 1024 --height 768 --shutter 500000 --gain 8 --brightness 0.2 --contrast 1.2 --ev 1.5 --awb auto --metering average --denoise cdn_off --analoggain 5 --ro>    print("Mengambil gambar dengan setting khusus...")


    print(f"Gambar tersimpan di {photo_path}")
    return photo_path  # Kembalikan path file yang baru

def upload_photo(photo_path):
    """Mengirim foto ke server Node.js"""
    print("Mengirim gambar ke database...")
    with open(photo_path, "rb") as img:
        files = {"image": img}
        data = {"id_rak": ID_RAK}
        try:
#            headers = {"Content-Type": "multipart/form-data"}
            response = requests.post(NODE_URL, files=files, data=data, timeout=5)
            print(f"Response: {response.status_code} - {response.text}")
            if response.status_code == 200:
                print("Gambar berhasil diupload!")
            else:
                print(f"Gagal upload, status code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Error upload: {e}")
            print(f"Detail error: {type(e).__name__}")

if __name__ == "__main__":
       photo_path = capture_photo()  # Ambil foto dan simpan pathnya
       time.sleep(5)  # Tunggu sebentar biar file tersimpan dengan baik
       upload_photo(photo_path)  # Upload ke database