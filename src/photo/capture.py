import os
import time
import requests
from datetime import datetime

NODE_URL = "http://localhost:3000/upload_img"  # Sesuaikan dengan endpoint Node.js
ID_RAK = 1  # ID Rak tetap 1

def capture_photo():
    """Mengambil foto pakai libcamera dengan settingan yang kamu mau"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")  # Format: YYYYMMDD_HHMMSS
    photo_path = f"/home/pi/Project/final-project/data/{timestamp}.jpg"  # Path file

    print("Mengambil gambar dengan setting khusus...")
    os.system(f"libcamera-still -o {photo_path} --autofocus-mode continuous --shutter 400000 --gain 6 --ev 0 --denoise cdn_hq --awb auto")
    print(f"Gambar tersimpan di {photo_path}")
    return photo_path  # Kembalikan path file yang baru

def upload_photo(photo_path):
    """Mengirim foto ke server Node.js"""
    print("Mengirim gambar ke database...")
    with open(photo_path, "rb") as img:
        files = {"image": img}
        data = {"id_rak": ID_RAK}
        try:
            response = requests.post(NODE_URL, files=files, data=data, timeout=5)
            if response.status_code == 200:
                print("Gambar berhasil diupload!")
            else:
                print(f"Gagal upload, status code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Error upload: {e}")

if __name__ == "__main__":
    while True:
       photo_path = capture_photo()  # Ambil foto dan simpan pathnya
       time.sleep(5)  # Tunggu sebentar biar file tersimpan dengan baik
       upload_photo(photo_path)  # Upload ke database
       time.sleep(3600) # Tunggu 1 jam sebelum ambil foto lagi