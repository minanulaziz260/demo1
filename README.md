# Serenity Blossom – Digital Wedding Invitation

Hasil Reverse Engineering (REA) website undangan digital dari Vitopia:
`https://vitopia.co/templates/preview/serenity-blossom`

## 🌟 Fitur & Kelengkapan
1. **Full Offline & Standalone**:
   - Seluruh aset (16+ gambar resolusi tinggi, 2 video MP4, 1 audio latar MP3, file CSS Tailwind & Resolver, library GSAP animasi) tersimpan secara lokal di folder `assets/`.
   - Tidak memerlukan server backend atau koneksi internet untuk melihat seluruh tampilan undangan.

2. **Tata Letak Responsif (Split-Screen & Mobile)**:
   - **Desktop (Layar Lebar)**: Tata letak *split-page* elegan dengan cover mempelai (Ishak & Salma) tetap di sisi kiri, dan konten bagian undangan bergulir di sisi kanan.
   - **Mobile (Smartphone)**: Tata letak vertikal penuh dengan cover awal, tombol "Open Invitation", dan transisi halus saat digulir ke bawah.

3. **12 Bagian Lengkap**:
   - **Cover**: Judul, nama mempelai (Ishak & Salma), nama penerima tamu, dan tombol buka undangan.
   - **Opening**: Video sinematik latar belakang dan nama mempelai.
   - **Quotes**: Kutipan ayat suci Al-Qur'an (Surat Ar-Rum: 21).
   - **Couple**: Profil kedua mempelai dengan ornamen bunga bergerak (*wave animation*) dan tautan media sosial.
   - **Slideshow**: Galeri foto transisi otomatis.
   - **Event / Save The Date**: Penghitung waktu mundur (*live countdown timer*) menuju hari pernikahan, detail acara akad & resepsi di UpperHills Convention Hall, dan tombol Google Maps.
   - **Tanda Kasih (Gift)**: Rekening bank BRI dengan tombol **Salin No. Rekening** (*click to copy*) instan beserta konfirmasi via WhatsApp.
   - **Our Moment (Gallery)**: Video teaser dan grid galeri foto momen pre-wedding.
   - **Love Story**: Garis waktu perjalanan cinta (Pertemuan, Pendekatan, Lamaran, Menikah).
   - **RSVP Interaktif**: Formulir konfirmasi kehadiran tamu yang dapat diisi dan disimpan otomatis ke *local storage*.
   - **Wishes & Doa Restu**: Buku tamu interaktif yang telah terisi ucapan dan dapat menerima ucapan baru secara langsung.
   - **Thanks**: Ungkapan terima kasih dari keluarga besar kedua mempelai.

4. **Pemutar Musik Latar (*Background Music*)**:
   - Lagu: **ANDMESH - ANUGERAH TERINDAH**
   - Tombol piringan hitam (*vinyl disc*) interaktif di pojok kiri bawah yang berputar saat musik diputar dan dapat dijeda/diputar kembali kapan saja.

## 🚀 Cara Menjalankan
Cukup ekstrak file ZIP dan buka file `index.html` langsung di browser favorit Anda (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, dll).
Anda juga dapat menjalankannya melalui server lokal jika diinginkan:
```bash
python3 -m http.server 8000
```
Lalu buka `http://localhost:8000` pada browser.
