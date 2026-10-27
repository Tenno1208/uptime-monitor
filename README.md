# ⚡ System Monitor Center

Aplikasi pemantau ketersediaan website (*uptime monitor*) real-time yang dibangun dengan **Next.js App Router** dan **Tailwind CSS**. Dilengkapi dengan notifikasi otomatis ke **Telegram**, halaman **Public Status Page**, fitur **Export CSV/PDF**, dan **Dynamic SVG Badges**.

![Public Status Badge](https://img.shields.io/badge/Status-Operational-emerald?style=for-the-badge&logo=vercel)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-blue?style=for-the-badge&logo=tailwindcss)

---

## 🚀 Fitur Utama

- ** Real-time Live Pinger:** Mengecek status HTTP, latensi (*ping ms*), sertifikat SSL, dan signature server secara paralel tanpa data dummy.
- **🚨 Telegram Bot Alerts:** Menerima notifikasi darurat instan di HP jika website mengalami *downtime*, *timeout*, atau *error 500/404*.
- **📊 Public Status Page (`/status`):** Halaman status transparan untuk pengguna publik dengan countdown auto-refresh 15 detik dan visual bar riwayat 24 pengecekan.
- **📈 Export Data & Report:** Fitur unduh log pengecekan ke format **CSV** dan cetak laporan status ke **PDF**.
- **🏷️ Dynamic SVG Status Badges (`/api/badge`):** Badge status hidup yang bisa dipasang di file `README.md` repository GitHub lain.
- **🔍 Error Diagnostics:** Menampilkan penjelasan detail penyebab error saat website mengalami kendala (termasuk deteksi *Cold Start* pada Render Cloud).

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Alerting:** Telegram Bot API
- **Deployment:** Netlify / Vercel

---

## ⚙️ Cara Instalasi Lokal

1. **Clone Repository**
   ```bash
   git clone [https://github.com/USERNAME_KAMU/uptime-monitor.git](https://github.com/USERNAME_KAMU/uptime-monitor.git)
   cd uptime-monitor