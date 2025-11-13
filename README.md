## Decision Support System for Selecting SSD NVMe using Combination AHP and TOPSIS
<p style="text-align: justify">Proyek ini bertujuan membangun sistem pendukung keputusan dalam pemilihan SSD NVMe berdasarkan kriteria tertentu. Proyek ini menggabungkan dua metode Sistem Pendukung Keputusan Analytical Hierarcy Process (AHP) dan Technique for Order of Preference by Similarity to Ideal Solution (TOPSIS).</p>

<p style="text-aling: justify">Kriteria yang digunakan dalam rekomendasi pemilihan SSD NVMe meliputi:
<ul>
    <li>Interface</li>
    <li>Capacity</li>
    <li>NAND Type</li>
    <li>Read</li>
    <li>Write</li>
    <li>Price</li>
    <li>Warranty</li>
</ul>

<p style="text-align: justify">Sistem ini diimplementasi dalam bentuk website yang memungkinkan pengguna dapat mengakses melalui cross-platform seperti Android, ioS, dan Desktop </p>

## INSTALASI
Clone repository menggunakan terminal 
```bash
git clone https://github.com/alcamic/ssd-dss.git
```
Buat Virtual Environment Python ([pip](https://pip.pypa.io/en/stable/)) setelah melakukan Clone Repository.
```bash
python -m venv [name_virtual_environment]
```
Aktifkan Environment untuk download library dan menjalankan app.
```bash
[name_virtual_environment]/Scripts/activate
```
Download library yang sudah berada di ```requirements.txt```
```bash
pip install -r requirements.txt
```
## PENGGUNAAN
Jalankan ```app.py```
```bash
python app.py
```
## KONTRIBUSI
Proyek ini merupakan hasil kolabarosi kelompok 2 Sistem Pendukung Keputusan di **[Jurusan Teknik Informatika dan Komputer](https://www.jtikunm.com/)** **[Universitas Negeri Makassar](https://unm.ac.id/)**:

* [A. Ahmad Fadil](https://github.com/alcamic)
* Muhammad Agung
* Farrel Hadiputra Sutjianto