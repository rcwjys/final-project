import os
import subprocess
import pymysql

# Konfigurasi database
DB_HOST = "localhost"
DB_USER = "avnadmin"
DB_PASSWORD = ""
DB_NAME = "defaultdb"

# Path aplikasi Node.js
NODE_APP_PATH = "/home/pi/Project/final-project/app.js"

# Fungsi cek data baru
def check_new_data():
    try:
        connection = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
        cursor = connection.cursor()
        
        # Cek data baru di suhu_kelembapan
        cursor.execute("SELECT COUNT(*) FROM suhu_kelembapan WHERE timestamp >= NOW() - INTERVAL 1 MINUTE")
        suhu_count = cursor.fetchone()[0]
        
        # Cek data baru di foto
        cursor.execute("SELECT COUNT(*) FROM foto WHERE timestamp >= NOW() - INTERVAL 1 MINUTE")
        foto_count = cursor.fetchone()[0]
        
        connection.close()
        
        return suhu_count > 0 or foto_count > 0
    
    except Exception as e:
        print("Error cek data:", e)
        return False

# Fungsi cek apakah Node.js sedang berjalan
def is_node_running():
    result = subprocess.run(["pgrep", "-f", "node"], stdout=subprocess.PIPE)
    return result.stdout.strip() != b""

# Fungsi jalankan Node.js
def start_node():
    subprocess.Popen(["node", NODE_APP_PATH], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("Node.js dijalankan")

# Fungsi matikan Node.js
def stop_node():
    subprocess.run(["pkill", "-f", "node"])
    print("Node.js dimatikan")

# Main process
if __name__ == "__main__":
    if check_new_data():
        if not is_node_running():
            start_node()
    else:
        if is_node_running():
            stop_node()
