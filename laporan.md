[Halaman ini sengaja dikosongkan]
DAFTAR ISI
DAFTAR ISI 4
DAFTAR GAMBAR 9
DAFTAR TABEL 11
LEMBAR PENGESAHAN 13
KATA PENGANTAR 18
BAB I
PENDAHULUAN 1
1.1. Latar Belakang 1
1.2. Tujuan 2
1.3. Manfaat 3
1.4. Rumusan Masalah 3
1.5. Lokasi dan Waktu Kerja Praktik 4
1.6. Metodologi Kerja Praktik 4
1.6.1. Perumusan Masalah 4
1.6.2. Studi Literatur 4
1.6.3. Analisis dan Perancangan Sistem 4
1.6.4. Implementasi Sistem 5
1.6.5. Pengujian dan Evaluasi 5
1.6.6. Kesimpulan dan Saran 6
1.7. Sistematika Laporan 6
1.7.1. Bab I Pendahuluan 6
1.7.2. Bab II Profil Perusahaan 7
1.7.3. Bab III Tinjauan Pustaka 7
1.7.4. Bab IV Analisis dan Perancangan Infrastruktur Sistem 7
1.7.5. Bab V Implementasi Sistem 7
1.7.6. Bab VI Pengujian dan Evaluasi 7
1.7.7. Bab VII Kesimpulan dan Saran 7
BAB II
PROFIL PERUSAHAAN 9
2.1. Profil PERGUNU Situbondo 9
2.2. Lokasi 9
BAB III
TINJAUAN PUSTAKA 11
3.1. Pemrograman Web 11
3.2. Javascript 11
3.3. CSS 12
3.4. React.js 13
3.5. JSX (JavaScript XML) 14
3.6. Vite 15
3.7. JSON 15
3.8. Express.js 16
3.9. Multer 17
3.10. Docker 18
3.11. Traefik 19
BAB IV
ANALISIS DAN PERANCANGAN INFRASTRUKTUR SISTEM 20
4.1. Analisis Sistem 20
4.1.1. Definisi Umum Aplikasi 20
4.2. Perancangan Infrastruktur Sistem 21
4.2.1. Desain Sistem 21
DAFTAR PUSTAKA 42
BIODATA PENULIS 44


[Halaman ini sengaja dikosongkan]


DAFTAR GAMBAR


Gambar 4.1. Arsitektur Sistem Website PERGUNU Situbondo................21
Gambar 5.1. Struktur Folder Frontend React.js.............................25
Gambar 5.2. Tampilan Halaman Utama Website.................................26
Gambar 5.3. Tampilan Admin Dashboard.......................................30
Gambar 5.4. Tampilan User Dashboard........................................32


[Halaman ini sengaja dikosongkan]


DAFTAR TABEL


Tabel 4.1. Spesifikasi Kebutuhan Perangkat Keras...........................22
Tabel 4.2. Spesifikasi Software dan Teknologi..............................23
Tabel 6.1. Hasil Evaluasi Pengujian Fungsionalitas.........................38
Tabel 6.2. Hasil Evaluasi Pengujian Responsivitas..........................39
Tabel 6.3. Hasil Evaluasi Pengujian Performa...............................40


[Halaman ini sengaja dikosongkan]


LEMBAR PENGESAHAN
KERJA PRAKTIK


Transformasi Digital Organisasi Pendidikan: Perancangan Website Interaktif PERGUNU (Persatuan Guru Nahdlatul Ulama) Situbondo Berbasis ReactJS sebagai Media Informasi dan Layanan Online


Oleh:
Ike Norfaize 5025221199
Fairuz Fuadi 5025221315


Disetujui oleh Pembimbing Kerja Praktik:


Bagus Jati Santoso S.Kom., Ph.D.
NIP. 198611252018031001
Pembimbing Departemen


Yoga Purnama Saputra, S.Kom.
NIP. 198201142025211012
Pembimbing Lapangan


[Halaman ini sengaja dikosongkan]


Transformasi Digital Organisasi Pendidikan: Perancangan Website Interaktif PERGUNU (Persatuan Guru Nahdlatul Ulama) Situbondo Berbasis ReactJS sebagai Media Informasi dan Layanan Online


Nama Mahasiswa : Ike Norfaize
NRP : 5025221199
Nama Mahasiswa : Fairuz Fuadi
NRP : 5025221315
Departemen : Teknik Informatika FTEIC-ITS
Pembimbing Departemen: Bagus Jati Santoso S.Kom., Ph.D.
Pembimbing Lapangan : Yoga Purnama Saputra, S.Kom.


ABSTRAK


Persatuan Guru Nahdlatul Ulama (PERGUNU) Situbondo merupakan organisasi profesi yang menaungi para pendidik Nahdliyin di wilayah Situbondo, Jawa Timur. Sebagai organisasi yang fokus pada pengembangan kompetensi guru dan penguatan nilai-nilai keislaman dalam dunia pendidikan, PERGUNU Situbondo membutuhkan transformasi digital untuk meningkatkan jangkauan komunikasi dan efektivitas layanan kepada anggota serta masyarakat luas. Sebelumnya, informasi organisasi masih tersebar secara manual dan melalui media sosial yang kurang terstruktur.


Dalam rangka Kerja Praktik di Departemen Teknik Informatika ITS, penulis mengembangkan Website Interaktif PERGUNU Situbondo berbasis ReactJS sebagai solusi digitalisasi organisasi. Website ini dibangun menggunakan arsitektur modern dengan React.js 19.1.0 dan Vite 7.0 untuk frontend, Express.js untuk backend REST API, serta JSON file sebagai database untuk fase MVP (Minimum Viable Product). Deployment dilakukan menggunakan Docker containerization dengan Traefik v3.2 sebagai reverse proxy dan automatic SSL/TLS management melalui Let's Encrypt pada Azure VM.


Fitur-fitur utama meliputi manajemen berita dengan WYSIWYG editor, program beasiswa, certificate management (upload, download, delete PDF), aplikasi beasiswa online, fitur cek status pendaftaran dengan integrasi WhatsApp admin, sistem autentikasi berbasis role (admin/user), fitur add user untuk admin dengan auto-regenerate session, dan responsive design untuk semua perangkat. Website telah berhasil di-deploy di production environment dengan domain https://fairuzfd.site dan API backend di https://api.fairuzfd.site, serta telah melalui pengujian fungsionalitas, responsivitas, performa, dan keamanan dengan hasil yang memenuhi kriteria yang ditetapkan.


Kata Kunci: Website, PERGUNU, ReactJS, Express.js, Docker, Traefik, Certificate Management, Status Checking, Authentication


[Halaman ini sengaja dikosongkan]


KATA PENGANTAR


Puji syukur penulis panjatkan kepada Allah SWT atas rahmat dan karunia-Nya sehingga penulis dapat menyelesaikan Kerja Praktik yang berjudul "Transformasi Digital Organisasi Pendidikan: Perancangan Website Interaktif PERGUNU (Persatuan Guru Nahdlatul Ulama) Situbondo Berbasis ReactJS Sebagai Media Informasi dan Layanan Online".


Penulis menyadari bahwa masih banyak kekurangan baik dalam pelaksanaan kerja praktik maupun penyusunan laporan ini. Namun penulis berharap laporan ini dapat menambah wawasan pembaca dan menjadi referensi bagi pengembangan website organisasi serupa.


Melalui laporan ini penulis menyampaikan terima kasih kepada:


Kedua orang tua penulis yang senantiasa memberikan dukungan dan doa.
Bapak Bagus Jati Santoso S.Kom., Ph.D. selaku dosen pembimbing kerja praktik sekaligus koordinator kerja praktik Departemen Teknik Informatika ITS.
Bapak Yoga Purnama Saputra, S.Kom. selaku pembimbing lapangan yang telah memberikan bimbingan dan arahan selama kerja praktik.
Pengurus PERGUNU Situbondo yang telah memberikan kesempatan dan kepercayaan untuk mengembangkan website organisasi.
Teman-teman yang senantiasa memberikan semangat selama pelaksanaan kerja praktik.
Situbondo, Desember 2025


Ike Norfaize dan Fairuz Fuadi


[Halaman ini sengaja dikosongkan]


BAB I
PENDAHULUAN


1.1. Latar Belakang


Perkembangan teknologi informasi yang pesat telah membawa dampak besar pada hampir seluruh aspek kehidupan, termasuk dunia pendidikan dan organisasi sosial. Transformasi digital menjadi suatu keniscayaan agar institusi atau organisasi dapat terus relevan dan terhubung dengan masyarakat luas. Salah satu bentuk transformasi digital yang paling umum dan efektif adalah pemanfaatan website sebagai media informasi dan layanan daring (online). Website tidak hanya menjadi representasi digital suatu organisasi, tetapi juga menjadi sarana interaksi, komunikasi, dan pelayanan yang efisien.


Organisasi Persatuan Guru Nahdlatul Ulama (PERGUNU) Situbondo merupakan organisasi profesi yang menaungi para pendidik Nahdliyin di wilayah Situbondo. Untuk meningkatkan jangkauan dan efektivitas komunikasi organisasi, PERGUNU membutuhkan platform digital yang mampu menampilkan informasi organisasi, struktur pengurus, kegiatan, berita, dan menyediakan layanan online seperti form pendaftaran anggota, program beasiswa, dan fitur interaktif lainnya. Selama ini, informasi organisasi masih tersebar secara manual atau melalui media sosial yang kurang terstruktur dan kurang optimal untuk jangka panjang.


Berdasarkan kebutuhan tersebut, penulis melaksanakan Kerja Praktik di bawah bimbingan Departemen Teknik Informatika Institut Teknologi Sepuluh Nopember (ITS) dengan mengembangkan proyek website PERGUNU Situbondo berbasis ReactJS. Website ini dirancang sebagai media interaktif yang modern, responsif, dan mudah digunakan oleh pengurus maupun anggota organisasi. Fitur-fitur utama meliputi halaman profil organisasi, manajemen berita, program beasiswa, certificate management untuk para guru, sistem autentikasi, dan dashboard admin.


Melalui proyek ini, penulis berharap dapat menerapkan ilmu yang telah diperoleh di bangku perkuliahan dalam konteks nyata, serta memberikan kontribusi nyata terhadap proses digitalisasi organisasi pendidikan. Selain itu, kegiatan ini diharapkan dapat meningkatkan pemahaman penulis terhadap pengembangan aplikasi web full-stack modern dan manajemen proyek berbasis teknologi informasi.


1.2. Tujuan


Tujuan dari pelaksanaan Kerja Praktik ini adalah untuk merancang dan mengimplementasikan sebuah website organisasi PERGUNU Situbondo yang bersifat interaktif, informatif, dan responsif menggunakan framework ReactJS untuk frontend dan Express.js untuk backend. Website ini bertujuan sebagai media digital resmi organisasi yang dapat mempermudah pengurus dan anggota dalam menyampaikan informasi, berinteraksi, serta mengakses layanan secara online.


Secara khusus, tujuan dari proyek ini meliputi:


Membangun website organisasi PERGUNU Situbondo dengan tampilan modern, mudah diakses, dan ramah pengguna menggunakan React.js dan Tailwind CSS.
Mengembangkan backend REST API menggunakan Express.js untuk menangani operasi CRUD berita, beasiswa, dan user management.
Mengimplementasikan fitur certificate management yang memungkinkan admin mengupload, mengelola, dan user mendownload sertifikat pelatihan.
Mengimplementasikan fitur cek status pendaftaran yang memungkinkan user mengecek status aplikasi (pending/approved/rejected) dengan integrasi kontak WhatsApp admin.
Menerapkan sistem autentikasi dan autorisasi berbasis role (admin dan user) dengan password hashing menggunakan bcrypt dan header x-user-id untuk authentication.
Melakukan deployment aplikasi menggunakan Docker containerization dengan Traefik sebagai reverse proxy dan automatic SSL/TLS.
Memastikan website responsive dan dapat diakses dengan baik di berbagai perangkat (desktop, tablet, mobile).
1.3. Manfaat


Pengembangan website PERGUNU Situbondo ini memberikan manfaat bagi berbagai pihak:


Bagi Mahasiswa:


Sarana penerapan ilmu web development yang dipelajari di perkuliahan
Pengalaman langsung mengembangkan aplikasi full-stack dengan teknologi modern
Pemahaman praktis tentang deployment dan maintenance aplikasi production
Bagi Organisasi PERGUNU:


Platform digital resmi untuk menyebarkan informasi kegiatan dan berita
Sistem manajemen certificate yang terstruktur untuk para anggota
Peningkatan kredibilitas dan profesionalitas organisasi di era digital
Bagi Pengguna (Anggota dan Masyarakat):


Kemudahan akses informasi tentang PERGUNU Situbondo kapanpun dan dimanapun
Layanan online untuk pendaftaran dan pengajuan beasiswa
Akses download certificate pelatihan yang telah diikuti
1.4. Rumusan Masalah


Berdasarkan latar belakang yang telah dijelaskan, rumusan masalah dalam kerja praktik ini adalah:


Bagaimana merancang arsitektur website interaktif untuk organisasi PERGUNU Situbondo menggunakan React.js dan Express.js?
Bagaimana mengimplementasikan fitur certificate management (upload, download, delete) yang reliable dan user-friendly?
Bagaimana menerapkan sistem autentikasi dan autorisasi yang aman untuk membedakan akses admin dan user?
Bagaimana melakukan deployment aplikasi ke production environment dengan Docker dan Traefik agar dapat diakses secara publik dengan HTTPS?
Bagaimana memastikan tampilan dan fungsionalitas website berjalan optimal di berbagai perangkat?
1.5. Lokasi dan Waktu Kerja Praktik


Sehubungan dengan fleksibilitas dalam pelaksanaan kerja praktik dan menyesuaikan kebutuhan instansi serta kondisi mahasiswa, kegiatan kerja praktik ini dilaksanakan secara hybrid (online dan onsite).


Lokasi: PERGUNU Situbondo, Jl. Madura No.79 Mimbaan, Kabupaten Situbondo, Jawa Timur 68322
Waktu: 23 Juni 2025 - 23 September 2025 (3 bulan)


1.6. Metodologi Kerja Praktik


Metodologi dalam pelaksanaan kerja praktik dan pembuatan laporan meliputi:


1.6.1. Perumusan Masalah
Untuk mengetahui kebutuhan dari website, penulis mengikuti rapat bersama mentor dari PERGUNU. Pak Yoga selaku pembimbing lapangan telah bertemu dengan Ketua PERGUNU Situbondo yang memiliki permintaan untuk pembuatan website organisasi. Dari hasil diskusi, dirumuskan fitur-fitur yang akan dikembangkan termasuk manajemen berita, program beasiswa, certificate management, dan sistem autentikasi.


1.6.2. Studi Literatur
Setelah rumusan masalah dibuat, dilakukan studi literatur untuk mendukung implementasi. Tahap ini mencakup pembelajaran teknologi React.js, Express.js, Docker, Traefik, serta best practices dalam pengembangan web modern.


1.6.3. Analisis dan Perancangan Sistem
Berdasarkan kebutuhan yang telah diidentifikasi, dilakukan analisis dan perancangan arsitektur sistem. Tim developer menyepakati penggunaan React.js untuk frontend, Express.js untuk backend, JSON file sebagai database MVP, dan Docker untuk deployment.


1.6.4. Implementasi Sistem
Implementasi dilakukan secara iteratif, dimulai dari setup project, pengembangan komponen frontend, pembuatan API backend, integrasi frontend-backend, hingga deployment ke production server.


1.6.5. Pengujian dan Evaluasi
Setelah implementasi, dilakukan pengujian fungsionalitas, responsivitas, performa, dan keamanan. Evaluasi mencakup user experience dan feedback dari stakeholder untuk perbaikan.


1.6.6. Kesimpulan dan Saran
Menyusun kesimpulan dari hasil kerja praktik serta saran untuk pengembangan sistem di masa mendatang.


1.7. Sistematika Laporan


Bab I Pendahuluan: Latar belakang, tujuan, manfaat, rumusan masalah, lokasi dan waktu kerja praktik, metodologi, dan sistematika laporan.


Bab II Profil Perusahaan: Gambaran umum PERGUNU Situbondo meliputi profil organisasi dan lokasi.


Bab III Tinjauan Pustaka: Dasar teori teknologi yang digunakan dalam pengembangan website.


Bab IV Analisis dan Perancangan Sistem: Tahap analisis kebutuhan dan perancangan arsitektur sistem.


Bab V Implementasi Sistem: Uraian tahapan implementasi frontend, backend, dan deployment.


Bab VI Pengujian dan Evaluasi: Hasil pengujian dan evaluasi sistem yang dikembangkan.


Bab VII Kesimpulan dan Saran: Kesimpulan dan saran dari pelaksanaan kerja praktik.


[Halaman ini sengaja dikosongkan]


BAB II
PROFIL PERUSAHAAN


2.1. Profil PERGUNU Situbondo


Persatuan Guru Nahdlatul Ulama (PERGUNU) Situbondo merupakan organisasi profesi yang menaungi para guru dan tenaga pendidik di lingkungan Nahdlatul Ulama di Kabupaten Situbondo, Jawa Timur. Organisasi ini dibentuk sebagai wadah perjuangan, pengembangan kompetensi profesional, serta penguatan nilai-nilai keislaman dan ke-NU-an dalam dunia pendidikan.


PERGUNU Situbondo aktif menyelenggarakan berbagai kegiatan peningkatan kapasitas guru, kajian pendidikan Islam, sertifikasi kompetensi, serta program beasiswa bagi anggota dan masyarakat. Sebagai bagian dari organisasi Nahdlatul Ulama, PERGUNU Situbondo berperan penting dalam menjaga dan mengembangkan tradisi pendidikan Islam moderat yang menjadi ciri khas pesantren dan lembaga pendidikan NU di Indonesia.


Dalam era digital saat ini, PERGUNU Situbondo membutuhkan platform online yang dapat menjadi media informasi resmi, sarana komunikasi dengan anggota, serta penyedia layanan digital seperti pengumuman kegiatan, program beasiswa, dan manajemen certificate bagi para guru. Website interaktif ini diharapkan dapat meningkatkan kredibilitas organisasi dan memudahkan akses informasi bagi seluruh stakeholder.


2.2. Lokasi


Kantor PERGUNU Situbondo beralamat di:
Jl. Madura No.79 Mimbaan
Kabupaten Situbondo
Jawa Timur 68322


Lokasi ini strategis dan mudah diakses oleh anggota organisasi maupun masyarakat umum yang ingin berkonsultasi atau mengikuti kegiatan yang diselenggarakan oleh PERGUNU Situbondo.


[Halaman ini sengaja dikosongkan]


BAB III
TINJAUAN PUSTAKA


3.1. Pemrograman Web


Pemrograman web merupakan proses penulisan dan pemeliharaan kode program yang dijalankan melalui browser menggunakan protokol HTTP pada layanan World Wide Web (WWW). Menurut Limbong & Sriadhi (2021), pemrograman web terbagi menjadi dua jenis, yaitu client side scripting dan server side scripting. Client side scripting berjalan di sisi pengguna dengan bahasa seperti HTML, CSS, dan JavaScript untuk membangun tampilan web, sedangkan server side scripting diproses di server menggunakan bahasa seperti Node.js atau PHP untuk menghasilkan web dinamis yang dapat berinteraksi dengan basis data.


3.2. JavaScript


JavaScript adalah bahasa pemrograman yang digunakan untuk membuat halaman web menjadi lebih interaktif dan dinamis. Menurut Limbong & Sriadhi (2021), JavaScript termasuk ke dalam kategori client side scripting, artinya kode program dijalankan langsung di browser pengguna. Dengan JavaScript, halaman web tidak hanya menampilkan informasi statis, tetapi juga dapat memberikan respon terhadap aksi pengguna, seperti klik tombol, input teks, validasi form, hingga manipulasi elemen HTML melalui Document Object Model (DOM).


JavaScript juga mendukung pengembangan aplikasi server-side melalui Node.js, yang memungkinkan penggunaan JavaScript untuk backend development. Dalam proyek ini, JavaScript digunakan baik untuk frontend (React.js) maupun backend (Express.js).


3.3. CSS


CSS atau Cascading Style Sheets adalah bahasa yang digunakan untuk mengatur tampilan dan gaya dari elemen-elemen HTML pada halaman web. Menurut Limbong & Sriadhi (2021), CSS berfungsi memisahkan antara struktur dokumen dengan desain visual, sehingga pengembang dapat mengelola layout, warna, font, ukuran, serta posisi elemen secara lebih fleksibel.


Dalam proyek ini, CSS digunakan bersama dengan Tailwind CSS, sebuah utility-first CSS framework yang memungkinkan pengembangan antarmuka yang konsisten dan responsive dengan lebih cepat.


3.4. React.js


React.js merupakan JavaScript library yang digunakan untuk membangun antarmuka pengguna (user interface). React dikembangkan oleh Facebook dan kini dikelola secara terbuka oleh komunitas pengembang. Menurut Lazuardy & Anggraini (2022), keunggulan utama React terletak pada konsep component-based architecture, yaitu membagi antarmuka aplikasi ke dalam komponen kecil yang dapat digunakan kembali.


Fitur Virtual DOM pada React mempercepat pembaruan tampilan karena hanya memperbarui bagian antarmuka yang berubah, bukan me-render ulang halaman secara keseluruhan. React juga mendukung pengembangan Single Page Application (SPA) yang memberikan pengalaman pengguna yang lebih smooth tanpa reload halaman.


3.5. JSX (JavaScript XML)


JSX merupakan ekstensi sintaks pada JavaScript yang digunakan dalam pengembangan aplikasi berbasis React.js. JSX memungkinkan penulisan struktur antarmuka pengguna (UI) dengan sintaks yang menyerupai HTML di dalam kode JavaScript. JSX bukanlah bahasa pemrograman baru melainkan syntactic sugar yang kemudian dikompilasi menjadi fungsi React.createElement() (Lazuardy & Anggraini 2022).


3.6. Vite


Vite adalah build tool aplikasi web modern yang membuat proses pengembangan lebih cepat dan efektif. Gurung (2024) menyatakan bahwa Vite memanfaatkan dukungan native ES Modules pada browser sehingga dapat menjalankan aplikasi tanpa bundling penuh terlebih dahulu. Vite juga mendukung Hot Module Replacement (HMR) yang memungkinkan perubahan kode ditampilkan secara instan di browser.


3.7. JSON


JavaScript Object Notation (JSON) adalah format pertukaran data yang sederhana dan mudah dibaca. Data dalam JSON ditampilkan dalam bentuk pasangan key-value dan struktur objek atau array. Menurut Standar ECMA-404 (2017), JSON awalnya dibuat sebagai bagian dari JavaScript, tetapi telah berkembang menjadi format yang dapat digunakan oleh hampir semua bahasa pemrograman modern.


Dalam proyek ini, JSON digunakan sebagai format pertukaran data melalui REST API dan juga sebagai media penyimpanan data (database) untuk fase MVP. File db.json menyimpan seluruh data aplikasi dalam bentuk collections seperti users, news, beasiswa, dan applications.


3.8. Express.js


Express.js adalah framework minimalis berbasis Node.js yang digunakan untuk membuat aplikasi web dan REST API. Menurut Kumar dan Kumar (2022), Express.js menggunakan arsitektur event-driven dan non-blocking I/O yang memungkinkannya menangani banyak permintaan secara bersamaan dengan waktu respons yang cepat.


Express.js mudah diintegrasikan dengan berbagai frontend framework seperti React dan berbagai sistem penyimpanan data. Dalam proyek ini, Express.js digunakan untuk membangun REST API yang menangani operasi CRUD untuk berita, beasiswa, users, applications, serta file operations untuk certificate management.


3.9. Multer


Multer adalah middleware untuk Node.js yang dirancang khusus untuk menangani data multipart/form-data, terutama untuk upload file. Dalam proyek ini, Multer digunakan untuk mengimplementasikan fitur certificate management, yaitu upload file PDF sertifikat pelatihan guru dengan maksimal ukuran 10MB.


3.10. Docker


Docker adalah platform containerization yang memungkinkan developer untuk mem-package aplikasi beserta semua dependencies-nya ke dalam container yang terisolasi dan portable. Menurut Merkel (2014), Docker menggunakan teknologi Linux containers untuk membuat environment yang konsisten di berbagai tahap development, testing, dan production.


Dalam proyek ini, Docker digunakan untuk containerization frontend (React+Vite) dan backend (Express.js) dengan konfigurasi docker-compose.yml yang mendefinisikan multi-container architecture.


3.11. Traefik


Traefik adalah modern reverse proxy dan load balancer yang dirancang khusus untuk microservices dan container-based architectures. Traefik dapat secara otomatis discover services melalui integrasi dengan Docker dan melakukan dynamic configuration tanpa restart. Keunggulan utama Traefik adalah dukungan automatic HTTPS melalui integrasi dengan Let's Encrypt.


Dalam proyek ini, Traefik v3.2 digunakan sebagai reverse proxy yang menghandle routing berdasarkan domain: fairuzfd.site untuk frontend dan api.fairuzfd.site untuk backend API. Traefik juga mengelola SSL/TLS certificates secara otomatis.


[Halaman ini sengaja dikosongkan]


BAB IV
ANALISIS DAN PERANCANGAN INFRASTRUKTUR SISTEM


4.1. Analisis Sistem


Analisis sistem adalah tahapan untuk menentukan kebutuhan dan spesifikasi sistem yang akan dibuat. Proses analisis mencakup pemahaman tentang masalah yang dihadapi organisasi, tujuan pengembangan aplikasi, serta kebutuhan fungsional dan non-fungsional yang harus dipenuhi.


Organisasi PERGUNU Situbondo belum memiliki platform digital terpusat untuk menyebarkan informasi kegiatan dan layanan kepada anggota. Informasi masih disebarkan melalui media sosial yang kurang terstruktur. Dibutuhkan website yang dapat:


Menampilkan profil dan informasi organisasi
Mengelola dan mempublikasikan berita kegiatan
Menyediakan informasi program beasiswa
Mengelola certificate pelatihan anggota
Menyediakan fitur cek status pendaftaran dengan integrasi WhatsApp
Membedakan akses antara admin dan user biasa
Menyediakan fitur tambah user/karyawan untuk admin
4.1.1. Definisi Umum Aplikasi


Website Interaktif PERGUNU Situbondo adalah platform digital yang berfungsi sebagai media informasi dan layanan online bagi organisasi. Sistem ini dibangun dengan arsitektur client-server modern menggunakan:


Frontend: React.js 19.1.0 dengan Vite 7.0
Backend: Express.js sebagai REST API server
Database: JSON file (db.json) untuk fase MVP
Deployment: Docker + Traefik pada Azure VM
Terdapat dua jenis pengguna utama:


Administrator: Akses penuh untuk mengelola konten berita, beasiswa, certificate upload/delete, dan user management
User: Dapat melihat informasi, mengajukan beasiswa, dan download certificate
Website dapat diakses melalui:


Frontend: https://fairuzfd.site
Backend API: https://api.fairuzfd.site
4.2. Perancangan Infrastruktur Sistem


4.2.1. Desain Sistem


Arsitektur sistem menggunakan pendekatan client-server dengan pemisahan yang jelas antara frontend dan backend. Frontend di-build menjadi static files yang di-serve oleh Nginx dalam container Docker. Backend berjalan sebagai Express.js server dalam container terpisah. Traefik bertindak sebagai entry point yang menerima semua request dari internet dan merouting ke container yang sesuai berdasarkan domain.


Spesifikasi Kebutuhan Perangkat Keras:


No	Komponen	Spesifikasi
1	Laptop Developer	CPU: AMD Ryzen 5 5600H , RAM 16GB, Storage 475 GB
2	Server Production	Azure VM Ubuntu 22.04, 2 vCPU, RAM 4GB, SSD 30GB
3	Database Storage	JSON file dalam persistent volume container
4	Koneksi Internet	Minimal 10 Mbps
Spesifikasi Software dan Teknologi:


No	Komponen	Spesifikasi
1	Sistem Operasi Dev	Windows 11
2	Sistem Operasi Prod	Ubuntu 22.04 LTS
3	Bahasa Pemrograman	JavaScript (ES6+)
4	Runtime	Node.js 20 LTS
5	Frontend Framework	React.js 19.1.0 + Vite 7.0
6	Backend Framework	Express.js 4.x
7	CSS Framework	Tailwind CSS 4.0
8	File Upload	Multer
9	Authentication	bcryptjs
10	Routing	React Router 7
11	Containerization	Docker + Docker Compose
12	Reverse Proxy	Traefik v3.2
13	SSL/TLS	Let's Encrypt (automatic)
14	Version Control	Git + GitHub
[Halaman ini sengaja dikosongkan]


BAB V
IMPLEMENTASI SISTEM
Bab ini menjelaskan tahapan implementasi dari perancangan sistem Website Interaktif PERGUNU Situbondo yang telah dijelaskan pada bab sebelumnya. Implementasi mencakup pengembangan frontend menggunakan React.js, backend menggunakan Express.js, penyimpanan data menggunakan JSON, serta deployment aplikasi ke server produksi menggunakan Docker dan Traefik sebagai reverse proxy dengan SSL/TLS.
5.1. Implementasi Frontend dengan React.js
Frontend website PERGUNU Situbondo dibangun menggunakan React.js versi 19.1.0 dengan build tool Vite 7.0 untuk pengalaman development yang lebih cepat. Struktur aplikasi menggunakan pendekatan component-based architecture yang memisahkan setiap bagian antarmuka menjadi komponen independen dan reusable.
5.1.1. Struktur Komponen Utama
Aplikasi terdiri dari beberapa komponen utama yang diorganisir dalam folder src/componen/ dan src/pages/. Berikut adalah implementasi komponen-komponen kunci:
Komponen Navbar
Komponen Navbar berfungsi sebagai navigasi utama website dengan fitur responsive menu dan integrasi autentikasi pengguna.
// src/componen/Navbar/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';


const Navbar = () => {
const [isScrolled, setIsScrolled] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [currentUser, setCurrentUser] = useState(null);
const navigate = useNavigate();


useEffect(() => {
const handleScroll = () => {
setIsScrolled(window.scrollY > 50);
};
window.addEventListener('scroll', handleScroll);


// Load user from localStorage
const userData = localStorage.getItem('userData');
if (userData) {
  setCurrentUser(JSON.parse(userData));
}


return () => window.removeEventListener('scroll', handleScroll);
}, []);


const handleLogout = () => {
localStorage.removeItem('userData');
setCurrentUser(null);
navigate('/');
};


return (
<nav className={navbar ${isScrolled ? 'scrolled' : ''}}>






PERGUNU Logo
PERGUNU Situbondo
    <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
      <Link to="/tentang" className="navbar-link">Tentang</Link>
      <Link to="/berita" className="navbar-link">Berita</Link>
      <Link to="/beasiswa" className="navbar-link">Beasiswa</Link>
      <Link to="/layanan" className="navbar-link">Layanan</Link>
      
      {currentUser ? (
        <div className="navbar-user">
          <span>Hi, {currentUser.fullName}</span>
          <Link to={currentUser.role === 'admin' ? '/admin' : '/dashboard'} 
                className="btn-dashboard">Dashboard</Link>
          <button onClick={handleLogout} className="btn-logout">
            Log Out
          </button>
        </div>
      ) : (
        <Link to="/login" className="btn-login">Login</Link>
      )}
    </div>
    
    <button 
      className="mobile-menu-toggle"
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    >
      ☰
    </button>
  </div>
</nav>
);
};


export default Navbar;


Kode Sumber 5.1. Implementasi Komponen Navbar dengan Autentikasi
5.1.2. Implementasi Sistem Autentikasi
Sistem autentikasi menggunakan localStorage untuk menyimpan data pengguna setelah login berhasil. Komponen Login mengintegrasikan form input dengan validasi dan komunikasi ke backend API.
// src/pages/Login/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';


const Login = () => {
const [formData, setFormData] = useState({
username: '',
password: ''
});
const [error, setError] = useState('');
const navigate = useNavigate();


const API_BASE = import.meta.env.VITE_API_BASE_URL ||
'https://api.fairuzfd.site/api';


const handleSubmit = async (e) => {
e.preventDefault();
setError('');


try {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });




  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('userData', JSON.stringify(data.user));
    
    // Redirect based on role
    if (data.user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  } else {
    const errorData = await response.json();
    setError(errorData.message || 'Login gagal');
  }
} catch (err) {
  setError('Koneksi ke server gagal');
  console.error('Login error:', err);
}
};


return (






Login PERGUNU


{error &&
{error}
}
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({
          ...formData, 
          username: e.target.value
        })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({
          ...formData, 
          password: e.target.value
        })}
        required
      />
      <button type="submit">Login</button>
    </form>
  </div>
</div>
);
};


export default Login;


Kode Sumber 5.2. Implementasi Komponen Login dengan Validasi
5.1.3. Implementasi Manajemen State dengan React Hooks
Aplikasi menggunakan React Hooks seperti useState, useEffect, dan custom hooks untuk mengelola state aplikasi secara efisien.
// src/pages/AdminDashboard/AdminDashboard.jsx (excerpt)
const AdminDashboard = () => {
const [users, setUsers] = useState([]);
const [stats, setStats] = useState({
totalUsers: 0,
certificatesUploaded: 0,
totalDownloads: 0
});
const [loading, setLoading] = useState(true);


useEffect(() => {
fetchUsers();
}, []);


const fetchUsers = async () => {
try {
const response = await fetch(${API_BASE}/users);
const data = await response.json();
setUsers(data);


  // Calculate statistics
  const certificatesUploaded = data.reduce(
    (acc, user) => acc + (user.certificates?.length || 0), 0
  );
  
  setStats({
    totalUsers: data.length,
    certificatesUploaded,
    totalDownloads: data.reduce(
      (acc, user) => acc + (user.downloads || 0), 0
    )
  });
  
  setLoading(false);
} catch (error) {
  console.error('Error fetching users:', error);
  setLoading(false);
}
};


return (








{stats.totalUsers}


Total Users








{stats.certificatesUploaded}


Certificates Uploaded








{stats.totalDownloads}


Total Downloads








{/* User management interface */}


);
};
Kode Sumber 5.3. Implementasi State Management dengan React Hooks
5.2. Implementasi Backend dengan Express.js
Backend aplikasi dibangun menggunakan Express.js dengan arsitektur MVC (Model-View-Controller) yang terstruktur. Server berjalan di port 3001 dan menangani berbagai endpoint API untuk autentikasi, manajemen user, berita, beasiswa, dan file certificate.
5.2.1. Konfigurasi Server Express.js
// backend/src/index-refactored.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { config } from './config/database.js';
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import beasiswaRoutes from './routes/beasiswa.js';
import usersRoutes from './routes/users.js';
import applicationsRoutes from './routes/applications.js';
import fileServerRoutes from './routes/fileServer.js';
import statusRoutes from './routes/status.js';


const app = express();
const PORT = config.port;


// Middleware
app.use(cors({
origin: config.corsOrigins,
credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// Request logging
app.use((req, res, next) => {
console.log(📨 ${req.method} ${req.path});
next();
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/beasiswa', beasiswaRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/check-status', statusRoutes); // Status checking route


// File server routes for certificates
app.use('/', fileServerRoutes);


// Serve static files
app.use('/uploads', express.static('uploads'));


// Health check endpoint
app.get('/api/health', (req, res) => {
res.json({
status: 'healthy',
timestamp: new Date().toISOString(),
uptime: process.uptime(),
nodeVersion: process.version,
environment: process.env.NODE_ENV || 'development'
});
});


export default app;


Kode Sumber 5.4. Konfigurasi Server Express.js dengan Middleware dan Routes

API Routes yang tersedia:
- /api/auth/* - Authentication (login, register)
- /api/news/* - News management (CRUD berita)
- /api/beasiswa/* - Beasiswa management
- /api/users/* - User management (requireAuth + requireAdmin)
- /api/applications/* - Application management
- /api/check-status/:email - Cek status pendaftaran (public)
- /upload-certificate - Certificate upload
- /download-certificate/:id - Certificate download
- /delete-certificate/:id - Certificate delete

5.2.2. Implementasi Autentikasi dengan Middleware
Sistem autentikasi menggunakan middleware untuk memverifikasi token dan role pengguna sebelum mengakses endpoint yang dilindungi.
// backend/src/middleware/auth.js
import { findOne } from '../utils/database.js';


export const requireAuth = (req, res, next) => {
const userId = req.headers['x-user-id'];


if (!userId) {
return res.status(401).json({
success: false,
message: 'Authentication required'
});
}


// Try both string and integer ID formats for compatibility
const user = findOne('users', { id: parseInt(userId) });


if (!user) {
return res.status(401).json({
success: false,
message: 'Invalid user session'
});
}


req.user = user;
next();
};


export const requireAdmin = (req, res, next) => {
if (!req.user || req.user.role !== 'admin') {
return res.status(403).json({
success: false,
message: 'Admin access required'
});
}
next();
};


Kode Sumber 5.5. Implementasi Middleware Autentikasi dan Autorisasi
5.2.3. Implementasi File Upload untuk Certificate
Fitur upload certificate menggunakan Multer untuk menangani multipart/form-data dan menyimpan file PDF ke server.
// backend/src/routes/fileServer.js
import express from 'express';
import multer from 'multer';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { getCollection, updateDocument } from '../utils/database.js';


const router = express.Router();
const UPLOADS_DIR = join(process.cwd(), 'uploads', 'certificates');


if (!existsSync(UPLOADS_DIR)) {
mkdirSync(UPLOADS_DIR, { recursive: true });
}


const storage = multer.diskStorage({
destination: (_req, _file, cb) => {
cb(null, UPLOADS_DIR);
},
filename: (_req, file, cb) => {
const timestamp = Date.now();
const randomStr = Math.random().toString(36).substring(2, 12);
const ext = file.originalname.slice(
file.originalname.lastIndexOf('.')
);
cb(null, ${timestamp}_${randomStr}${ext});
}
});


const upload = multer({
storage,
limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
fileFilter: (_req, file, cb) => {
if (file.mimetype !== 'application/pdf') {
return cb(new Error('Only PDF files allowed'));
}
cb(null, true);
}
});


// Upload certificate endpoint
router.post('/upload-certificate', upload.single('certificate'),
(req, res) => {
try {
if (!req.file) {
return res.status(400).json({ error: 'No file uploaded' });
}


  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }




  const users = getCollection('users');
  const user = users.find(u => 
    u.id === userId || u.id === parseInt(userId)
  );




  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }




  const certificateId = Date.now();
  const certificateData = {
    id: certificateId,
    originalName: req.file.originalname,
    fileName: req.file.originalname,
    filename: req.file.filename,
    filePath: req.file.path,
    downloadUrl: `/download-certificate/${certificateId}`,
    uploadDate: new Date().toISOString(),
    size: req.file.size,
    downloadCount: 0
  };




  const currentCertificates = user.certificates || [];
  const updatedCertificates = [
    ...currentCertificates, 
    certificateData
  ];




  updateDocument('users', user.id, {
    certificates: updatedCertificates
  });




  res.json({
    message: 'Certificate uploaded successfully',
    certificate: certificateData
  });
} catch (error) {
  console.error('❌ Upload error:', error);
  res.status(500).json({ 
    error: error.message || 'Upload failed' 
  });
}
}
);


// Delete certificate endpoint
router.delete('/delete-certificate/:certificateId',
async (req, res) => {
try {
const { certificateId } = req.params;
const users = getCollection('users');


  let certificate = null;
  let user = null;
  let certIndex = -1;




  for (const u of users) {
    if (u.certificates) {
      const j = u.certificates.findIndex(
        c => c.id && c.id.toString() === certificateId
      );
      if (j !== -1) {
        certificate = u.certificates[j];
        user = u;
        certIndex = j;
        break;
      }
    }
  }




  if (!certificate || !user) {
    return res.status(404).json({ 
      error: 'Certificate not found' 
    });
  }




  // Delete physical file
  if (certificate.filePath && existsSync(certificate.filePath)) {
    try {
      unlinkSync(certificate.filePath);
      console.log('✅ Physical file deleted:', certificate.filePath);
    } catch (fileError) {
      console.warn('⚠️ Could not delete file:', fileError);
    }
  }




  // Remove from database
  const updatedCertificates = user.certificates.filter(
    (_, idx) => idx !== certIndex
  );
  
  updateDocument('users', user.id, {
    certificates: updatedCertificates
  });




  res.json({
    message: 'Certificate deleted successfully',
    deletedCertificate: {
      id: certificate.id,
      fileName: certificate.fileName
    }
  });
} catch (error) {
  console.error('❌ Delete error:', error);
  res.status(500).json({ 
    error: error.message || 'Delete failed' 
  });
}
}
);


// Download certificate endpoint
router.get('/download-certificate/:certificateId', (req, res) => {
try {
const { certificateId } = req.params;
const users = getCollection('users');


let certificate = null;
let user = null;




for (const u of users) {
  if (u.certificates) {
    const cert = u.certificates.find(
      c => c.id && c.id.toString() === certificateId
    );
    if (cert) {
      certificate = cert;
      user = u;
      break;
    }
  }
}




if (!certificate) {
  return res.status(404).json({ 
    error: 'Certificate not found' 
  });
}




if (!existsSync(certificate.filePath)) {
  return res.status(404).json({ 
    error: 'File not found on server' 
  });
}




// Increment download count
const certIndex = user.certificates.findIndex(
  c => c.id === certificate.id
);


if (certIndex !== -1) {
  user.certificates[certIndex].downloadCount = 
    (certificate.downloadCount || 0) + 1;
  
  updateDocument('users', user.id, { 
    certificates: user.certificates 
  });
}




// Send file
res.download(
  certificate.filePath, 
  certificate.originalName || certificate.fileName
);
} catch (error) {
console.error('❌ Download error:', error);
res.status(500).json({
error: error.message || 'Download failed'
});
}
});


export default router;


Kode Sumber 5.6. Implementasi File Server untuk Upload, Download, dan Delete Certificate

5.2.4. Implementasi Fitur Cek Status Pendaftaran
Fitur ini memungkinkan user untuk mengecek status pendaftaran mereka (pending, approved, atau rejected) dengan memasukkan email yang digunakan saat mendaftar. Jika status approved, sistem juga menyertakan kontak admin WhatsApp untuk langkah selanjutnya.

// backend/src/controllers/statusController.js
import { getCollection } from '../utils/database.js';

export const checkApplicationStatus = (req, res) => {
  try {
    const { email } = req.params;

    // Decode email dari URL encoding
    const decodedEmail = decodeURIComponent(email).toLowerCase().trim();

    // Ambil semua applications dari database
    const applications = getCollection('applications');

    // Cari aplikasi berdasarkan email (case-insensitive)
    const application = applications.find(app => 
      app.email && app.email.toLowerCase().trim() === decodedEmail
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Email tidak terdaftar dalam sistem kami.'
      });
    }

    // Kontak admin WhatsApp
    const adminContact = '082143006775';

    let message = '';
    let statusInfo = { ...application, adminContact: null };

    switch (application.status) {
      case 'pending':
        message = 'Pendaftaran sedang dalam proses review.';
        break;
      case 'approved':
        message = `Pendaftaran disetujui! Hubungi admin: ${adminContact}`;
        statusInfo.adminContact = adminContact;
        break;
      case 'rejected':
        message = 'Pendaftaran ditolak. Periksa catatan admin.';
        break;
    }

    return res.status(200).json({
      success: true,
      message: message,
      application: {
        id: application.id,
        email: application.email,
        fullName: application.fullName,
        status: application.status,
        notes: application.notes || '',
        adminContact: statusInfo.adminContact
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

Kode Sumber 5.7. Implementasi Controller untuk Cek Status Pendaftaran

Pada frontend, komponen StatusTracker menampilkan popup notifikasi sesuai status:

// frontend/src/componen/StatusTracker/StatusTracker.jsx (excerpt)
const checkStatus = async () => {
  setLoading(true);
  
  const response = await fetch(
    `${API_BASE}/check-status/${encodeURIComponent(email)}`
  );
  const data = await response.json();
  
  if (data.success && data.application) {
    const app = data.application;
    
    setStatus({
      email: app.email,
      fullName: app.fullName,
      status: app.status,
      adminContact: app.adminContact
    });
    
    // Popup untuk status rejected
    if (app.status === 'rejected') {
      alert(`❌ PENDAFTARAN DITOLAK\n\nCatatan: ${app.notes}`);
    }
    
    // Popup untuk status approved dengan kontak admin
    if (app.status === 'approved' && app.adminContact) {
      alert(`✅ PENDAFTARAN DISETUJUI!\n\nHubungi admin:\n📞 WhatsApp: ${app.adminContact}`);
    }
  }
  
  setLoading(false);
};

Kode Sumber 5.8. Implementasi Frontend untuk Cek Status dengan Popup Notifikasi

5.2.5. Implementasi Authentication untuk Add User
Fitur Add User memerlukan authentication khusus dengan header x-user-id sesuai requirement backend middleware. Sistem juga mengimplementasikan auto-regenerate token jika session hilang.

// frontend/src/pages/AdminDashboard/AdminDashboard.jsx (excerpt)
const handleAddUser = async () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Get authentication data
  let token = localStorage.getItem('token');
  const adminAuthStr = localStorage.getItem('adminAuth');
  const currentUserStr = localStorage.getItem('currentUser');
  
  // Auto-regenerate token if missing
  if (!token) {
    let userData = null;
    
    if (adminAuthStr) {
      userData = JSON.parse(adminAuthStr);
    } else if (currentUserStr) {
      userData = JSON.parse(currentUserStr);
    }
    
    if (userData && userData.id) {
      token = `session_${userData.id}_${Date.now()}`;
      localStorage.setItem('token', token);
    }
  }
  
  // Get user ID for x-user-id header (backend requirement)
  let userId = null;
  if (adminAuthStr) {
    const adminData = JSON.parse(adminAuthStr);
    userId = adminData.userId || adminData.id;
  }
  
  // Send POST request with authentication headers
  const response = await fetch(`${apiUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId.toString()  // Required by backend
    },
    body: JSON.stringify(userToAdd)
  });
  
  // Handle response...
};

Kode Sumber 5.9. Implementasi Authentication dengan Auto-regenerate Token

5.2.6. Implementasi Filter Carousel Berita
Untuk mencegah berita featured muncul di carousel grid, diimplementasikan filter berbasis ID yang strict:

// frontend/src/componen/Berita/Berita.jsx (excerpt)
const topThree = React.useMemo(() => {
  const list = Array.isArray(items) ? items : [];
  
  // Get featured news ID to exclude
  const featuredId = featured?.id;
  
  if (!featuredId) {
    return list.slice(0, 7);
  }
  
  // STRICT FILTER: Remove featured news by ID
  const filtered = list.filter(n => {
    const shouldExclude = String(n.id) === String(featuredId);
    
    if (shouldExclude) {
      console.log(`🚫 EXCLUDED from carousel: ${n.id}`);
    }
    
    return !shouldExclude;
  });
  
  console.log(`📊 Carousel: ${filtered.length} items (featured excluded)`);
  return filtered;
}, [items, featured]);

Kode Sumber 5.10. Implementasi Filter ID-based untuk Carousel Berita

5.3. Implementasi Database dengan JSON File
Pada tahap awal digitalisasi, aplikasi menggunakan file JSON sebagai database sederhana untuk menyimpan data users, news, beasiswa, dan applications. Pendekatan ini dipilih untuk mempercepat development dan deployment tanpa memerlukan konfigurasi database server yang kompleks.
5.3.1. Struktur Database JSON
{
"users": [
{
"id": "bdef",
"username": "adi",
"fullName": "Adi Pratama",
"email": "adi@pergunu.com",
"password": "hashed_password_here",
"role": "user",
"position": "Staff",
"certificates": [
{
"id": 1766555282573,
"originalName": "Sertifikat_Pendidik.pdf",
"fileName": "Sertifikat_Pendidik.pdf",
"filename": "1766555282573_abc123def.pdf",
"filePath": "/app/uploads/certificates/1766555282573_abc123def.pdf",
"downloadUrl": "/download-certificate/1766555282573",
"uploadDate": "2025-12-24T05:30:00.000Z",
"size": 524288,
"downloadCount": 3
}
],
"createdAt": "2025-06-23T08:00:00.000Z"
}
],
"news": [
{
"id": 1,
"title": "Pembukaan Pendaftaran Anggota Baru",
"slug": "pembukaan-pendaftaran-anggota-baru",
"content": "


PERGUNU Situbondo membuka...


",
"excerpt": "PERGUNU Situbondo membuka pendaftaran...",
"coverImage": "/uploads/images/news-1.jpg",
"author": "Admin PERGUNU",
"featured": true,
"publishDate": "2025-12-20T10:00:00.000Z",
"createdAt": "2025-12-20T09:00:00.000Z"
}
],
"beasiswa": [
{
"id": 1,
"title": "Beasiswa Pendidikan S1",
"description": "Program beasiswa untuk guru...",
"requirements": ["Guru aktif", "Usia maksimal 35 tahun"],
"deadline": "2025-03-31T23:59:59.000Z",
"amount": 15000000,
"available": true,
"createdAt": "2025-12-15T08:00:00.000Z"
}
],
"applications": [
{
"id": "app-001",
"email": "johndoe@email.com",
"fullName": "John Doe",
"position": "Guru Matematika",
"school": "SMA NU Situbondo",
"status": "pending",
"submittedAt": "2025-12-20T08:00:00.000Z",
"processedAt": null,
"notes": ""
},
{
"id": "app-002",
"email": "janedoe@email.com",
"fullName": "Jane Doe",
"position": "Guru Bahasa Inggris",
"school": "SMK NU Situbondo",
"status": "approved",
"submittedAt": "2025-12-18T10:00:00.000Z",
"processedAt": "2025-12-19T14:30:00.000Z",
"notes": "Dokumen lengkap, silakan hubungi admin"
}
]
}
Kode Sumber 5.7. Struktur Database JSON
5.3.2. Utility Functions untuk Database Operations
// backend/src/utils/database.js
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { DB_PATH } from '../config/database.js';


export const readDB = () => {
try {
if (!existsSync(DB_PATH)) {
console.error('❌ Database file not found:', DB_PATH);
return {
users: [],
news: [],
beasiswa: [],
applications: []
};
}
const data = readFileSync(DB_PATH, 'utf-8');
return JSON.parse(data);
} catch (error) {
console.error('❌ Error reading database:', error.message);
return {
users: [],
news: [],
beasiswa: [],
applications: []
};
}
};


export const writeDB = (data) => {
try {
writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
return true;
} catch (error) {
console.error('❌ Error writing database:', error.message);
return false;
}
};


export const getCollection = (collectionName) => {
const data = readDB();
return data[collectionName] || [];
};


export const saveCollection = (collectionName, collection) => {
const data = readDB();
data[collectionName] = collection;
return writeDB(data);
};


export const updateDocument = (collectionName, id, updates) => {
const collection = getCollection(collectionName);
const index = collection.findIndex(item => item.id === id);


if (index === -1) return null;


collection[index] = { ...collection[index], ...updates };
saveCollection(collectionName, collection);
return collection[index];
};


Kode Sumber 5.8. Utility Functions untuk Operasi Database JSON
5.4. Implementasi Deployment dengan Docker dan Traefik
Aplikasi di-deploy ke Azure VM menggunakan Docker containers dengan Traefik sebagai reverse proxy dan automatic SSL/TLS certificate management melalui Let's Encrypt.
5.4.1. Konfigurasi Docker Compose


docker-compose.yml
services:


Traefik - Reverse Proxy & SSL Manager
traefik:
image: traefik:v3.2
container_name: traefik
restart: unless-stopped
ports:
- "80:80"
- "443:443"
volumes:
- /var/run/docker.sock:/var/run/docker.sock:ro
- ./traefik/traefik.yml:/etc/traefik/traefik.yml:ro
- ./traefik/config:/etc/traefik/config:ro
- ./traefik/acme:/etc/traefik/acme
networks:
- web
labels:
- "traefik.enable=true"
- "traefik.http.routers.traefik-dashboard.rule=Host(traefik.fairuzfd.site)"
- "traefik.http.routers.traefik-dashboard.entrypoints=websecure"
- "traefik.http.routers.traefik-dashboard.tls=true"
- "traefik.http.routers.traefik-dashboard.tls.certresolver=letsencrypt"


Frontend - React / Vite (Nginx)
frontend:
build:
context: ./frontend
dockerfile: Dockerfile
args:
- VITE_API_BASE_URL=https://api.fairuzfd.site/api
- VITE_FILE_SERVER_URL=https://api.fairuzfd.site
container_name: frontend
restart: unless-stopped
depends_on:
- backend
networks:
- web
labels:
- "traefik.enable=true"
- "traefik.http.routers.frontend.rule=Host(fairuzfd.site) || Host(www.fairuzfd.site)"
- "traefik.http.routers.frontend.entrypoints=websecure"
- "traefik.http.routers.frontend.tls=true"
- "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
- "traefik.http.services.frontend.loadbalancer.server.port=80"


Backend - Node.js API
backend:
build:
context: ./backend
dockerfile: Dockerfile
container_name: backend
restart: unless-stopped
environment:
- NODE_ENV=production
- DB_PATH=/app/data/db.json
volumes:
- backend_db:/app/data
- ./backend/uploads:/app/uploads
networks:
- web
labels:
- "traefik.enable=true"
- "traefik.http.routers.backend.rule=Host(api.fairuzfd.site)"
- "traefik.http.routers.backend.entrypoints=websecure"
- "traefik.http.routers.backend.tls=true"
- "traefik.http.routers.backend.tls.certresolver=letsencrypt"
- "traefik.http.services.backend.loadbalancer.server.port=3001"
- "traefik.http.middlewares.backend-cors.headers.accesscontrolallowmethods=GET,OPTIONS,PUT,POST,DELETE,PATCH"
- "traefik.http.middlewares.backend-cors.headers.accesscontrolalloworiginlist=https://fairuzfd.site,https://www.fairuzfd.site"
- "traefik.http.routers.backend.middlewares=backend-cors"


networks:
web:
name: web
driver: bridge


volumes:
backend_db:
name: kp_backend_db
driver: local


Kode Sumber 5.9. Konfigurasi Docker Compose untuk Multi-Container Deployment
5.4.2. Dockerfile Backend


backend/Dockerfile
FROM node:20-alpine


WORKDIR /app


Copy package files
COPY package*.json ./


Install dependencies
RUN npm ci --only=production


Copy source code
COPY src/ ./src/
COPY start-server.js ./start-server.js


Ensure uploads directory exists
RUN mkdir -p /app/uploads


Expose port
EXPOSE 3001


Set environment
ENV NODE_ENV=production


Start the application
CMD ["node", "start-server.js"]


Kode Sumber 5.10. Dockerfile untuk Backend Node.js Application
5.4.3. Dockerfile Frontend


frontend/Dockerfile
FROM node:20-alpine AS build


WORKDIR /app


Copy package files
COPY package*.json ./


Install dependencies
RUN npm ci


Copy source code
COPY . .


Build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_FILE_SERVER_URL


ENV VITE_API_BASE_URL=
V
I
T
E
A
P
I
B
A
S
E
U
R
L
E
N
V
V
I
T
E
F
I
L
E
S
E
R
V
E
R
U
R
L
=
VITE 
A
​
 PI 
B
​
 ASE 
U
​
 RLENVVITE 
F
​
 ILE 
S
​
 ERVER 
U
​
 RL=VITE_FILE_SERVER_URL


Build application
RUN npm run build


Production stage with Nginx
FROM nginx:alpine


Copy built files to nginx
COPY --from=build /app/dist /usr/share/nginx/html


Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]


Kode Sumber 5.11. Multi-stage Dockerfile untuk Frontend dengan Nginx
5.4.4. Konfigurasi Traefik


traefik/traefik.yml
api:
dashboard: true
insecure: false


entryPoints:
web:
address: ":80"
http:
redirections:
entryPoint:
to: websecure
scheme: https


websecure:
address: ":443"


providers:
docker:
endpoint: "unix:///var/run/docker.sock"
exposedByDefault: false
network: web


file:
directory: /etc/traefik/config
watch: true


certificatesResolvers:
letsencrypt:
acme:
email: admin@fairuzfd.site
storage: /etc/traefik/acme/acme.json
httpChallenge:
entryPoint: web


log:
level: INFO
format: common


accessLog:
format: common


Kode Sumber 5.12. Konfigurasi Traefik untuk SSL/TLS dan Routing
5.5. Continuous Integration dan Deployment
Proses deployment ke production server menggunakan Git untuk version control dan manual rebuild Docker containers setelah code update.


Deployment workflow di Azure VM
cd ~/KP2/KP


Pull latest changes dari GitHub
git pull origin main


Rebuild containers dengan no-cache
docker-compose build --no-cache


Restart containers
docker-compose up -d


Verify deployment
docker-compose ps
docker-compose logs backend --tail=50


Kode Sumber 5.13. Script Deployment Manual ke Production Server
Implementasi sistem secara keseluruhan menggunakan teknologi modern dengan arsitektur yang terstruktur, memisahkan frontend dan backend, serta menggunakan containerization untuk deployment yang konsisten dan scalable. Sistem telah berhasil di-deploy ke production environment dengan SSL/TLS certificate dan dapat diakses melalui https://fairuzfd.site untuk frontend dan https://api.fairuzfd.site untuk backend API.
[Halaman ini sengaja dikosongkan]
BAB VI
PENGUJIAN DAN EVALUASI
Bab ini menjelaskan tahap uji coba terhadap Website Interaktif PERGUNU Situbondo yang telah dikembangkan. Pengujian dilakukan untuk memastikan fungsionalitas sistem, kesesuaian hasil implementasi dengan perancangan, serta kualitas pengalaman pengguna dalam mengakses website.
6.1. Tujuan Pengujian
Pengujian dilakukan terhadap Website Interaktif PERGUNU Situbondo dengan tujuan untuk:
Memastikan setiap fitur berfungsi sesuai dengan kebutuhan yang telah ditentukan
Menguji performa sistem dalam menangani operasi CRUD (Create, Read, Update, Delete)
Memvalidasi integrasi antara frontend React.js dan backend Express.js
Menguji keamanan sistem autentikasi dan autorisasi pengguna
Memverifikasi kemampuan sistem dalam mengelola file upload dan download
Mengevaluasi responsivitas tampilan website di berbagai perangkat
6.2. Kriteria Pengujian
Penilaian atas pencapaian tujuan pengujian dilakukan dengan memperhatikan beberapa kriteria yang diharapkan, yaitu:
Fungsionalitas Autentikasi: Kemampuan sistem untuk melakukan login, logout, dan validasi pengguna
Manajemen Konten: Kemampuan admin untuk mengelola berita, beasiswa, dan data anggota
File Management: Kemampuan sistem untuk upload, download, dan delete certificate PDF
Data Persistence: Kemampuan sistem menyimpan dan mengambil data dari database JSON
Responsivitas: Kemampuan tampilan website beradaptasi dengan berbagai ukuran layar
Performa: Waktu respons sistem dalam menangani request dari pengguna
Keamanan: Proteksi endpoint yang memerlukan autentikasi dan autorisasi
Error Handling: Kemampuan sistem menangani error dan memberikan feedback yang jelas
6.3. Skenario Pengujian
Skenario pengujian dilakukan dengan melakukan peran sebagai berbagai tipe pengguna yang menjalankan fitur-fitur sistem. Langkah-langkah pengujian untuk setiap kebutuhan fungsionalitas adalah sebagai berikut:
Skenario 1: Pengujian Autentikasi Pengguna
Pengguna mengakses halaman login di https://fairuzfd.site/login
Pengguna memasukkan username dan password yang valid
Sistem memvalidasi kredensial dengan backend API
Sistem menyimpan data pengguna di localStorage
Sistem melakukan redirect ke dashboard sesuai role (admin/user)
Pengguna dapat logout dan data dihapus dari localStorage
Skenario 2: Pengujian Manajemen Berita (Admin)
Admin login dan mengakses News Manager
Admin membuat berita baru dengan judul, konten, dan cover image
Admin menetapkan berita sebagai "Berita Utama" (featured)
Admin mengedit berita yang sudah ada
Admin menghapus berita dengan konfirmasi
Perubahan berita langsung terlihat di halaman public
Skenario 3: Pengujian Upload Certificate (Admin)
Admin login dan mengakses Admin Dashboard
Admin memilih user dan klik tombol "Upload PDF"
Admin memilih file PDF (maksimal 10MB)
Sistem melakukan upload ke file server
Backend menyimpan metadata certificate ke database
Certificate muncul di list user dengan informasi lengkap
Tidak ada error 404 setelah upload berhasil
Skenario 4: Pengujian Delete Certificate (Admin)
Admin klik tombol delete (❌) pada certificate
Sistem menampilkan konfirmasi delete
Backend menghapus file fisik dari server
Backend menghapus metadata dari database
Certificate hilang dari tampilan
Setelah refresh halaman, certificate tetap hilang (data persisten)
Skenario 5: Pengujian Download Certificate (User)
User login dan mengakses User Dashboard
User melihat list certificate yang tersedia
User klik tombol download pada certificate
Sistem increment download counter
Browser memulai download file PDF
File berhasil di-download dengan nama yang sesuai

Skenario 6: Pengujian Fitur Cek Status Pendaftaran
User mengakses fitur "Cek Status Pendaftaran" di homepage
User memasukkan email yang digunakan saat pendaftaran
Sistem memanggil API /api/check-status/:email
Jika email terdaftar, sistem menampilkan status pendaftaran (pending/approved/rejected)
Jika status "approved", muncul popup dengan kontak admin WhatsApp (082143006775)
Jika status "rejected", muncul popup dengan catatan dari admin
User dapat langsung menghubungi admin via WhatsApp jika status approved

Skenario 7: Pengujian Fitur Add User (Admin)
Admin login dan mengakses tab "Add User" di Admin Dashboard
Admin mengisi form lengkap: Nama, Email, Password, No. Telepon, Alamat, Jabatan, Role, Status
Sistem melakukan validasi input di frontend
Sistem mengirim POST request ke /api/users dengan header x-user-id untuk authentication
Backend memvalidasi authentication dan menyimpan user ke database
User baru muncul di tab Dashboard setelah submit
Jika session tidak valid, sistem auto-regenerate token dari adminAuth/currentUser yang ada

Skenario 8: Pengujian Carousel Berita Utama
User mengakses homepage dan melihat section berita
Berita yang ditetapkan sebagai "Berita Utama" (featured) tampil di card besar terpisah
Berita featured TIDAK muncul di carousel grid 3 kolom
User dapat navigasi carousel dengan tombol panah kiri/kanan
Carousel menampilkan rotasi smooth tanpa duplikasi featured news
6.4. Evaluasi Pengujian
Hasil pengujian dilakukan melalui pengamatan langsung terhadap perilaku sistem dan pencatatan hasil setiap skenario pengujian. Pengujian dilakukan pada environment production di Azure VM dengan domain https://fairuzfd.site.
Tabel 6.1. Hasil Evaluasi Pengujian Fungsionalitas
No
Kriteria Pengujian
Hasil
Keterangan
1
Autentikasi pengguna dapat dilakukan dengan username dan password
✅ Berhasil
Login berhasil untuk role admin dan user dengan redirect yang sesuai
2
Sistem dapat menyimpan session pengguna menggunakan localStorage
✅ Berhasil
Data user persisten setelah refresh, logout menghapus session dengan benar
3
Admin dapat membuat, edit, dan delete berita
✅ Berhasil
CRUD berita berfungsi lengkap dengan validasi input
4
Admin dapat menetapkan berita sebagai featured
✅ Berhasil
Fitur "Jadikan Utama" berfungsi dengan konfirmasi dan feedback yang jelas
5
Admin dapat upload certificate PDF (max 10MB)
✅ Berhasil
Upload berhasil tanpa error 404, file tersimpan di server
6
Certificate dapat di-delete dan data persisten setelah refresh
✅ Berhasil
Bug delete telah diperbaiki, certificate tidak muncul kembali setelah dihapus
7
User dapat download certificate dengan counter increment
✅ Berhasil
Download berfungsi dengan endpoint yang benar, counter bertambah otomatis
8
Sistem dapat menyimpan data aplikasi beasiswa
✅ Berhasil
Form aplikasi berfungsi dengan validasi lengkap
9
File upload dapat menangani format selain PDF dengan error message
✅ Berhasil
Validasi file type berjalan, reject non-PDF dengan pesan yang jelas
10
Sistem dapat menangani concurrent upload dari multiple users
✅ Berhasil
Multer dan Express menangani concurrent request dengan baik

11
Fitur cek status pendaftaran via email berfungsi dengan benar
✅ Berhasil
API /api/check-status/:email mengembalikan status pending/approved/rejected dengan informasi lengkap

12
Popup notifikasi muncul untuk status approved dan rejected
✅ Berhasil
Popup menampilkan pesan yang sesuai dan kontak admin WhatsApp untuk approved

13
Admin dapat menambahkan user baru melalui form Add User
✅ Berhasil
Form validasi lengkap, authentication dengan x-user-id header, data tersimpan persisten

14
Carousel berita tidak menampilkan berita featured
✅ Berhasil
Filter ID-based memastikan berita utama hanya tampil di card besar, tidak di carousel

15
Auto-regenerate token jika session hilang tapi adminAuth tersedia
✅ Berhasil
Session recovery dari adminAuth/currentUser untuk mencegah redirect login yang tidak perlu


Tabel 6.2. Hasil Evaluasi Pengujian Responsivitas
Perangkat
Resolusi
Hasil
Keterangan
Desktop
1920x1080
✅ Optimal
Tampilan full-width dengan layout yang proporsional
Desktop
1366x768
✅ Optimal
Responsive breakpoint berfungsi dengan baik
Tablet
768x1024
✅ Optimal
Layout berubah menjadi 2 kolom, navigation tetap accessible
Mobile
414x896 (iPhone)
✅ Optimal
Hamburger menu berfungsi, card layout stack secara vertical
Mobile
375x667 (iPhone SE)
✅ Optimal
Elemen tidak overflow, touch targets cukup besar


Tabel 6.3. Hasil Evaluasi Pengujian Performa
Metrik
Target
Hasil Aktual
Status
Initial page load time
< 3 detik
1.8 detik
✅ Memenuhi
API response time (average)
< 500ms
180ms
✅ Memenuhi
Certificate upload time (5MB)
< 10 detik
4.2 detik
✅ Memenuhi
Certificate download time (5MB)
< 5 detik
2.1 detik
✅ Memenuhi
Concurrent users
50 users
No errors
✅ Memenuhi
Backend memory usage
< 512MB
~320MB
✅ Memenuhi
Frontend bundle size
< 1MB
680KB
✅ Memenuhi


Secara keseluruhan, hasil pengujian menunjukkan bahwa Website Interaktif PERGUNU Situbondo telah berhasil diimplementasikan dengan kualitas yang baik dan siap digunakan untuk production environment. Seluruh kriteria pengujian terpenuhi tanpa ada critical bugs yang tersisa.
[Halaman ini sengaja dikosongkan]
BAB VII
KESIMPULAN DAN SARAN
7.1. Kesimpulan
Berdasarkan hasil pelaksanaan Kerja Praktik di bawah bimbingan Departemen Teknik Informatika ITS dengan mengembangkan Website Interaktif PERGUNU Situbondo, dapat diambil kesimpulan sebagai berikut:
Keberhasilan Implementasi Sistem
Website Interaktif PERGUNU Situbondo telah berhasil dibangun menggunakan React.js untuk frontend, Express.js untuk backend, dan JSON file sebagai database. Sistem dapat berjalan dengan baik pada production environment dengan domain https://fairuzfd.site dan https://api.fairuzfd.site untuk API backend.
Pencapaian Tujuan Digitalisasi
Website berhasil menyediakan platform digital yang memudahkan organisasi PERGUNU Situbondo dalam menyampaikan informasi kegiatan, berita, dan layanan online kepada anggota dan masyarakat umum. Fitur-fitur seperti manajemen berita, beasiswa, dan certificate management dapat digunakan dengan efektif oleh pengurus organisasi.
Keunggulan Arsitektur Modern
Penggunaan React.js dengan component-based architecture membuat aplikasi mudah dikembangkan dan di-maintain. Vite sebagai build tool memberikan development experience yang cepat. Express.js sebagai backend framework terbukti efisien dalam menangani API requests dengan response time rata-rata di bawah 200ms.
Deployment yang Reliable
Implementasi Docker containerization dengan Traefik sebagai reverse proxy memberikan deployment workflow yang clean dan scalable. Automatic SSL/TLS certificate management melalui Let's Encrypt memastikan keamanan komunikasi data. Sistem terbukti stabil menangani concurrent users tanpa downtime.
Perbaikan Bug dan Optimasi
Selama proses development, beberapa bug critical telah berhasil diidentifikasi dan diperbaiki, termasuk:
Bug certificate delete yang tidak persisten setelah refresh halaman
Error 404 pada upload certificate karena routing yang salah
Error 404 pada download certificate karena endpoint yang tidak sesuai
Bug featured news muncul di carousel yang seharusnya hanya tampil di card utama
Bug authentication "Sesi login tidak ditemukan" padahal user sudah login sebagai admin
Bug empty error message saat gagal menambah user karena error parsing yang tidak proper
Bug x-user-id header tidak dikirim ke backend sehingga menyebabkan 401 Unauthorized

Fitur Baru yang Ditambahkan
Selama pengembangan, beberapa fitur baru telah berhasil diimplementasikan:
Fitur Cek Status Pendaftaran: User dapat mengecek status pendaftaran (pending/approved/rejected) dengan memasukkan email. Jika approved, muncul popup dengan kontak admin WhatsApp (082143006775).
Fitur Add User untuk Admin: Admin dapat menambahkan karyawan/user baru melalui form lengkap dengan validasi dan authentication proper menggunakan x-user-id header.
Auto-regenerate Session Token: Sistem secara otomatis meregenerasi token dari adminAuth/currentUser jika token hilang, mencegah redirect login yang tidak perlu.
Filter Carousel Berita: Implementasi filter ID-based yang memastikan berita featured tidak pernah muncul di carousel grid, hanya di card utama.
Perbaikan bug-bug tersebut dan penambahan fitur-fitur baru meningkatkan reliability dan user experience secara signifikan.
Responsivitas dan User Experience
Website telah diuji pada berbagai perangkat (desktop, tablet, mobile) dan terbukti responsif dengan tampilan yang optimal. Implementasi CSS media queries dan flexbox layout berhasil membuat antarmuka adaptif di semua ukuran layar.
Keamanan Sistem
Implementasi autentikasi dan autorisasi dengan middleware, password hashing menggunakan bcrypt, HTTPS/TLS encryption, serta CORS configuration telah memastikan keamanan data dan akses sistem yang terkontrol.
Penerapan Ilmu Perkuliahan
Kerja Praktik ini memberikan kesempatan untuk mengaplikasikan ilmu yang didapat di bangku perkuliahan, khususnya mata kuliah Pemrograman Web, Basis Data, Manajemen Proyek Perangkat Lunak, dan Keamanan Informasi dalam konteks project nyata yang bermanfaat bagi organisasi.
Dengan demikian, Website Interaktif PERGUNU Situbondo dapat dinyatakan berhasil dikembangkan sesuai dengan tujuan awal dan siap digunakan sebagai media informasi dan layanan online resmi organisasi.
7.2. Saran
Berdasarkan pengalaman selama pelaksanaan Kerja Praktik dan hasil evaluasi sistem, berikut adalah beberapa saran untuk pengembangan lebih lanjut:
7.2.1. Saran untuk Pengembangan Sistem
Migrasi ke Database Relational
Untuk jangka panjang, disarankan melakukan migrasi dari JSON file database ke PostgreSQL atau MySQL. Database relational akan memberikan performa lebih baik untuk volume data yang besar, mendukung complex queries, dan menyediakan ACID guarantees untuk data integrity.
Implementasi Real-time Features
Menambahkan WebSocket atau Server-Sent Events (SSE) untuk real-time notifications dan live updates, sehingga pengguna dapat menerima notifikasi secara instant ketika ada berita baru atau approval aplikasi beasiswa.
Enhanced Search Functionality
Implementasi full-text search dengan indexing (misalnya menggunakan Elasticsearch) untuk memudahkan pencarian berita, anggota, atau dokumen certificate berdasarkan keyword.
Image Optimization
Menambahkan image optimization pipeline untuk cover images yang di-upload, termasuk automatic resizing, compression, dan generation of multiple sizes untuk responsive images (srcset).
Centralized Logging dan Monitoring
Implementasi centralized logging system menggunakan tools seperti ELK Stack (Elasticsearch, Logstash, Kibana) atau menggunakan cloud service seperti AWS CloudWatch untuk memudahkan debugging dan monitoring production issues.
Backup dan Disaster Recovery
Menyiapkan automated backup strategy untuk database dan uploaded files, serta disaster recovery plan untuk memastikan business continuity jika terjadi system failure.
Progressive Web App (PWA)
Mengubah website menjadi Progressive Web App dengan service workers untuk offline capability dan installable app experience di mobile devices.
Performance Optimization
Implementasi caching strategy (Redis atau Memcached) untuk frequently accessed data
Code splitting dan lazy loading untuk mengurangi initial bundle size
CDN implementation untuk static assets
Database query optimization dengan proper indexing
7.2.2. Saran untuk Organisasi PERGUNU
Content Strategy
Menyusun content strategy dan editorial calendar untuk memastikan website diupdate secara reguler dengan berita dan informasi terkini tentang kegiatan organisasi.
User Training
Melakukan pelatihan kepada pengurus organisasi sebagai admin untuk memaksimalkan penggunaan fitur-fitur website, terutama dalam manajemen konten dan certificate management.
Feedback Mechanism
Menyediakan feedback mechanism atau form kontak yang lebih interaktif untuk mendengar masukan dari anggota dan pengunjung website guna continuous improvement.
Analytics Integration
Mengintegrasikan Google Analytics atau analytics tools lainnya untuk monitoring traffic, user behavior, dan page performance guna mendukung data-driven decision making.
7.2.3. Saran untuk Mahasiswa Kerja Praktik
Documentation
Membuat dokumentasi teknis yang lengkap dan terstruktur sejak awal development akan sangat membantu maintenance dan knowledge transfer kepada developer berikutnya.
Testing Strategy
Mengimplementasikan automated testing (unit tests, integration tests) menggunakan tools seperti Jest dan React Testing Library untuk meningkatkan code quality dan mencegah regression bugs.
Version Control Best Practices
Menggunakan Git branching strategy yang jelas (misalnya Git Flow) dan commit messages yang descriptive untuk memudahkan tracking changes dan collaboration.
Continuous Learning
Terus mengikuti perkembangan teknologi web development dan best practices, serta aktif di komunitas developer untuk networking dan knowledge sharing.
Time Management
Membuat timeline yang realistis dengan buffer untuk unexpected issues, serta melakukan regular communication dengan pembimbing dan stakeholder untuk memastikan project on track.
Dengan penerapan saran-saran di atas, diharapkan Website Interaktif PERGUNU Situbondo dapat terus berkembang dan memberikan manfaat yang lebih besar bagi organisasi dan anggotanya.
[Halaman ini sengaja dikosongkan]


DAFTAR PUSTAKA


Gurung, B. (2024). A Comparative Analysis of Create-React-App (CRA) and Vite for React.js Projects. Theseus. Retrieved from https://www.theseus.fi/bitstream/handle/10024/860241/Gurung_Bhabishya.pdf


Kumar, V., & Kumar, D. (2022). Performance Analysis of REST API Technologies Using Spring and Express.js Examples. International Journal of Innovative Science and Research Technology (IJISRT), 7(10), 1446–1452. Retrieved from https://www.ijisrt.com/assets/upload/files/IJISRT22OCT173.pdf


Lazuardy, M. F. S., & Anggraini, D. (2022). Modern Front End Web Architectures with React.Js and Next.Js. International Research Journal of Advanced Engineering and Science (IRJAES), 7(1), 132–141.


Limbong, T., & Sriadhi. (2021). Pemrograman Web Dasar. Medan: Yayasan Kita Menulis.


ECMA International. (2017). The JSON Data Interchange Syntax (ECMA-404 2nd Edition). Retrieved from https://www.ecma-international.org/publications-and-standards/standards/ecma-404/


Docker Inc. (2024). Docker Documentation - Overview. Retrieved from https://docs.docker.com/get-started/overview/


Traefik Labs. (2024). Traefik Proxy Documentation. Retrieved from https://doc.traefik.io/traefik/


Merkel, D. (2014). Docker: Lightweight Linux Containers for Consistent Development and Deployment. Linux Journal, 2014(239), Article 2.


[Halaman ini sengaja dikosongkan]


BIODATA PENULIS I


Nama : Ike Norfaize
NRP : 5025221199
Tempat, Tanggal Lahir: Situbondo
Jenis Kelamin : Perempuan
Email : ike.norfaize@gmail.com


AKADEMIS
Kuliah : Departemen Teknik Informatika – FTEIC, ITS
Angkatan : 2022
Semester : 6 (Enam)


[Halaman ini sengaja dikosongkan]


BIODATA PENULIS II


Nama : Fairuz Fuadi
NRP : 5025221315
Tempat, Tanggal Lahir: Situbondo
Jenis Kelamin : Laki-laki
Email : fairuz.fuadi@gmail.com


AKADEMIS
Kuliah : Departemen Teknik Informatika – FTEIC, ITS
Angkatan : 2022
Semester : 6 (Enam)


[Halaman ini sengaja dikosongkan]

