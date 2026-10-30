# The Thirsty Cloud: Jejak Air AI & Integritas Publik 🌊🤖

> **Platform Eksperimen & Literasi Digital Pelajar Indonesia**: Memahami jejak air, energi, dan dampak ekologis komputasi kecerdasan buatan (AI) di Indonesia, serta mengawal hak konstitusional warga negara atas air bersih (Pasal 33 UUD 1945 & SDG 16).

---

## 🌟 Fitur Utama

1. **Laboratorium Mikro Pelajar**:
   - Pembanding 3 tipe beban AI: *Text Chat Ringan*, *Deep Research / Koding*, dan *AI Image / Poster Generator* (~10–30x lebih boros air & listrik).
   - Mode Rekayasa Prompt: *Prompt Bertele-tele* vs *Prompt Hijau (One-Shot)*.
   - Tombol penguji: **"Tumpuk 1 Sesi Nugas (20 Chat + Gambar)"** yang seketika menguras botol 600 ml.
2. **Kalkulator Skala Satu Angkatan Sekolah**:
   - Slider interaktif jumlah siswa, chat harian, gambar mingguan, dan durasi belajar.
   - Piktograf matriks galon Aqua 19 Liter & ekuivalensi jatah air keluarga di pesisir Pantura / Batam.
   - Mode simulasi pendingin siklus tertutup (*Closed-Loop Cooling*).
3. **Segitiga Dampak Lingkungan AI**:
   - Komparasi 3 pilar: Jejak Air (Evaporasi DAS), Beban Listrik & Emisi (PLTU Batubara Indonesia), serta Limbah Elektronik (*hardware churn* GPU 3–5 tahun).
4. **Pipa Regional & Simulator Regulator Kebijakan (PKn)**:
   - Investigasi dua titik panas data center nasional: **Koridor Cikarang (Bekasi)** vs **Nongsa Digital Park (Batam)**.
   - Uji 4 skenario regulasi negara dengan trade-off air vs listrik vs transparansi meteran SIPA.
   - Modul edukasi Pasal 33 Ayat (3) UUD 1945 & Putusan MK No. 85/PUU-XI/2013 serta SDG 16.
5. **Aksi Pelajar & Instagram Story Generator**:
   - 4 Jurus *Green Prompting* praktis untuk siswa.
   - Generator gambar vertikal 9:16 (1080x1920) siap unggah ke Instagram Story / Status WA berbasis client-side HTML5 Canvas tanpa server.
   - Tombol salin template teks WhatsApp untuk grup kelas.
6. **Transparansi Data & Berkas Riset**:
   - Referensi studi ilmiah (*Shaolei Ren - UC Riverside*, *Sasha Luccioni - Hugging Face/CMU*, regulasi Uni Eropa, Bappenas).
   - Akses langsung unduh poster infografis dan makalah PDF asli kelompok.

---

## 🚀 Menjalankan Proyek Secara Lokal

Pastikan Node.js (v18+) sudah terpasang di komputermu:

```bash
# 1. Pasang dependensi
npm install

# 2. Jalankan development server
npm run dev
```

Buka URL lokal yang muncul (biasanya `http://localhost:5173`) di browser atau HP.

---

## 📦 Build File Mandiri (Single-File Offline)

Proyek ini telah dikonfigurasi dengan `vite-plugin-singlefile`:

```bash
npm run build
```

Hasil build akan menghasilkan berkas tunggal `the_thirsty_cloud_app.html` dan `dist/index.html`. Berkas ini dapat dibuka langsung di browser mana pun tanpa server, sangat cocok untuk dibagikan via WhatsApp, Google Drive, atau flashdisk kelas.

---

## 🌐 Cara Deploy Gratis ke Internet

Agar siswa dan guru dapat membukanya lewat tautan daring di ponsel mereka:

### Opsi A: Deploy ke Vercel (Paling Direkomendasikan - 1 Menit)
1. Push repositori ini ke akun GitHub kamu.
2. Buka [vercel.com](https://vercel.com) dan hubungkan akun GitHub.
3. Impor repositori ini, klik **Deploy**. Vercel akan otomatis mengenali Vite dan memberikan link gratis berdomain `.vercel.app`.

### Opsi B: Deploy ke Netlify
1. Buka [netlify.com](https://netlify.com).
2. Tarik folder `dist/` hasil build langsung ke dasbor Netlify Drop, atau hubungkan lewat GitHub dengan Build command `npm run build` dan Publish directory `dist`.

---

## 📚 Dasar Ilmiah & Regulasi

- **Shaolei Ren, Pengfei Li, et al. (2023)**: *Making AI Less "Thirsty": Uncovering and Addressing the Secret Water Footprint of AI Models*.
- **Alexandra Sasha Luccioni et al. (2023)**: *Estimating the Carbon and Water Footprint of Generative AI*.
- **European Union Energy Efficiency Directive (EU) 2023/1791**.
- **Pasal 33 Ayat (3) UUD 1945 & Putusan Mahkamah Konstitusi No. 85/PUU-XI/2013**.
- **Bappenas (2020)**: *Kajian Kerentanan Sumber Daya Air Pulau Jawa*.

---

*Civics Project Group 2 // Universitas Telkom // Kampanye Literasi AI Hijau Siswa SMA*
