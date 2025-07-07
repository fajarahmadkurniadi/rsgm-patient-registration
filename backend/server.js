const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rsgm_db'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to the MySQL database.');
});

// Helper untuk mengubah tanggal DD/MM/YYYY ke format YYYY-MM-DD
const toMySQLDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return null;
    if (dateStr.includes('-')) {
        return dateStr;
    }
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return null;
};

const dayMapping = {
    0: 'Ming', 1: 'Sen', 2: 'Sel', 3: 'Rab',
    4: 'Kam', 5: 'Jum', 6: 'Sab'
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diizinkan!'), false);
    }
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const poliCodeMapping = {
    "Gigi Umum": "GU", "Ortodonti": "OR", "Gigi Anak": "KA", "Endodonti": "EN",
    "Prosthodonsia": "PS", "Konservasi Gigi": "KG", "Penyakit Mulut": "PM",
    "Gigi Estetika dan Kosmetik": "GK", "Periodonsia": "PR", "Radiologi Gigi dan Mulut": "RG",
    "Gigi Geriatri": "GT", "Bedah Mulut dan Maksilofasial": "BM"
};

// Endpoint Pendaftaran (Dengan Perbaikan)
app.post('/api/pendaftaran', (req, res) => {
  const { nik, namaLengkap, jenisKelamin, tanggalLahir, alamat, noHandphone, poli, hariTujuan, jamTujuan, keluhan } = req.body;
  
  if (!hariTujuan) {
      return res.status(400).json({ message: 'Tanggal tujuan pendaftaran tidak boleh kosong.' });
  }

  const dateObject = new Date(hariTujuan + 'T00:00:00');
  const dayIndex = dateObject.getDay();
  const hariSingkat = dayMapping[dayIndex];

  if (!hariSingkat) {
    return res.status(400).json({ message: 'Tanggal tujuan tidak valid.' });
  }

  const queryCariDokter = "SELECT * FROM dokter WHERE spesialis = ? AND jadwal LIKE ? AND status = 'Aktif' LIMIT 1";
  
  db.query(queryCariDokter, [poli, `%${hariSingkat}%`], (err, dokterResults) => {
    if (err) return res.status(500).json({ message: 'Database error saat mencari dokter.', error: err });
    
    if (dokterResults.length === 0) return res.status(404).json({ message: `Tidak ada dokter yang tersedia untuk poli ${poli} pada hari ${dateObject.toLocaleDateString('id-ID', { weekday: 'long' })}.` });
    
    const assignedDoctor = dokterResults[0];

    db.query('SELECT * FROM pasien WHERE nik = ?', [nik], (err, pasienResults) => {
      if (err) return res.status(500).json({ message: 'Database error saat cek NIK.', error: err });

      const proceedToRegister = (pasienId, noRekamMedis, statusPasien) => {
        const poliCode = poliCodeMapping[poli] || 'XX';
        const queryAntrian = 'SELECT COUNT(*) as count FROM pendaftaran WHERE poli_tujuan = ? AND tanggal_pendaftaran = ?';
        
        db.query(queryAntrian, [poli, hariTujuan], (err, antrianResult) => {
          if (err) return res.status(500).json({ message: 'Gagal menghitung antrian.', error: err });

          const nextNumber = antrianResult[0].count + 1;
          const nomorAntrian = `${poliCode}-${nextNumber.toString().padStart(3, '0')}`;
          const pendaftaranData = {
            pasien_id: pasienId,
            dokter_id: assignedDoctor.id,
            tanggal_pendaftaran: hariTujuan,
            jam_pemeriksaan: jamTujuan,
            poli_tujuan: poli,
            keluhan,
            status_pasien: statusPasien,
            nomor_antrian: nomorAntrian,
          };

          db.query('INSERT INTO pendaftaran SET ?', pendaftaranData, (err) => {
            if (err) return res.status(500).json({ message: 'Gagal menyimpan data pendaftaran.', error: err });

            io.emit('pendaftaran_baru', { message: 'Satu pasien telah mendaftar!' });

            console.log(`Pendaftaran baru berhasil untuk pasien ID: ${pasienId}, No. Antrian: ${nomorAntrian}`);
            res.status(200).json({
              message: 'Pendaftaran berhasil!',
              data: { ...req.body, noRekamMedis, nomorAntrian, statusPasien, namaDokter: assignedDoctor.nama }
            });
          });
        });
      };

      if (pasienResults.length > 0) {
        proceedToRegister(pasienResults[0].id, pasienResults[0].no_rm, 'Pasien Terdaftar');
      } else {
        const noRekamMedis = `RM${Math.floor(100000 + Math.random() * 900000)}`;
        
        // --- PERBAIKAN FINAL ---
        // Mengubah `no_handphone` menjadi `no_hp` agar cocok dengan nama kolom di database Anda
        const pasienBaru = { 
            nik: nik, 
            no_rm: noRekamMedis, 
            nama_lengkap: namaLengkap, 
            jenis_kelamin: jenisKelamin, 
            tanggal_lahir: tanggalLahir, 
            alamat: alamat, 
            no_hp: noHandphone, // <-- NAMA FIELD DIPERBAIKI
            tanggal_pendaftaran: new Date()
        };
        
        db.query('INSERT INTO pasien SET ?', pasienBaru, (err, result) => {
          if (err) {
              console.error("DATABASE ERROR SAAT INSERT PASIEN:", err); 
              return res.status(500).json({ message: 'Gagal menyimpan data pasien baru.', error: err.sqlMessage || err.message });
          }
          proceedToRegister(result.insertId, noRekamMedis, 'Pasien Baru');
        });
      }
    });
  });
});


// Endpoint Pesan (Tidak ada perubahan)
app.post('/api/pesan', (req, res) => {
    const { nama, email, pesan } = req.body;
    const tanggal = new Date().toISOString().split('T')[0];
    const jam = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const newMessage = { tanggal, jam, nama, email, pesan };
    
    db.query('INSERT INTO pesan SET ?', newMessage, (err) => {
        if (err) return res.status(500).send(err);
        
        io.emit('pesan_baru', { message: `Pesan baru diterima dari ${nama}` });
        
        res.sendStatus(201);
    });
});

// =============================
// === API CRUD UNTUK DOKTER ===
// =============================

app.get('/api/dokter', (req, res) => { 
    db.query('SELECT *, DATE_FORMAT(tanggal_lahir, "%d/%m/%Y") as tanggal_lahir FROM dokter ORDER BY id DESC', (err, results) => { 
        if (err) res.status(500).json({ message: "Database error", error: err });
        else res.json(results); 
    }); 
});

app.post('/api/dokter', upload.single('foto'), (req, res) => {
    const { nip } = req.body;

    db.query('SELECT id FROM dokter WHERE nip = ?', [nip], (err, results) => {
      if (err) {
        console.error("Database error saat cek NIP:", err);
        return res.status(500).json({ message: "Terjadi kesalahan pada server." });
      }
      if (results.length > 0) {
        return res.status(409).json({ message: `Dokter dengan NIP ${nip} sudah terdaftar.` });
      }

      const dataToInsert = {
        nama: req.body.nama,
        spesialis: req.body.spesialis,
        nip: req.body.nip,
        tanggal_lahir: toMySQLDate(req.body.tanggal_lahir),
        jadwal: req.body.jadwal,
        no_str: req.body.no_str,
        no_hp: req.body.no_hp,
        alamat: req.body.alamat,
        status: req.body.status,
      };
      
      let fotoPath = null;
      if (req.file) {
          const oldPath = req.file.path;
          const newFileName = `${nip}-${Date.now()}${path.extname(req.file.originalname)}`;
          fotoPath = path.join(uploadsDir, newFileName);
          fs.renameSync(oldPath, fotoPath);
          dataToInsert.foto = `uploads/${newFileName}`;
      }

      db.query('INSERT INTO dokter SET ?', dataToInsert, (err, result) => {
          if (err) {
              console.error("Gagal menambah dokter:", err);
              if (fotoPath) fs.unlinkSync(fotoPath);
              return res.status(500).json({ message: "Gagal menyimpan data ke database.", error: err.sqlMessage });
          }
          res.status(201).json({ id: result.insertId, ...dataToInsert });
      });
    });
});

app.put('/api/dokter/:id', upload.single('foto'), (req, res) => {
    const { id } = req.params;
    const { nip } = req.body;

    db.query('SELECT foto FROM dokter WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal mengambil data lama." });

        const oldFotoPath = results[0]?.foto ? path.join(__dirname, results[0].foto) : null;
        
        const dataToUpdate = {
            nama: req.body.nama,
            spesialis: req.body.spesialis,
            nip: req.body.nip,
            tanggal_lahir: toMySQLDate(req.body.tanggal_lahir),
            jadwal: req.body.jadwal,
            no_str: req.body.no_str,
            no_hp: req.body.no_hp,
            alamat: req.body.alamat,
            status: req.body.status,
        };

        if (req.file) {
            const oldPath = req.file.path;
            const newFileName = `${nip}-${Date.now()}${path.extname(req.file.originalname)}`;
            const newPath = path.join(uploadsDir, newFileName);
            fs.renameSync(oldPath, newPath);
            dataToUpdate.foto = `uploads/${newFileName}`;

            if (oldFotoPath && fs.existsSync(oldFotoPath)) {
                fs.unlinkSync(oldFotoPath);
            }
        }

        db.query('UPDATE dokter SET ? WHERE id = ?', [dataToUpdate, id], (err) => {
            if (err) {
                console.error("Gagal memperbarui dokter:", err);
                return res.status(500).json({ message: "Gagal memperbarui data di database.", error: err.sqlMessage });
            }
            res.status(200).json({ message: "Data dokter berhasil diperbarui." });
        });
    });
});


app.delete('/api/dokter/:id', (req, res) => { 
    const { id } = req.params; 
    
    db.query('SELECT foto FROM dokter WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal mengambil data untuk dihapus." });
        
        db.query('DELETE FROM dokter WHERE id = ?', id, (err) => { 
            if (err) return res.status(500).json({ message: 'Gagal menghapus data dari database.' });

            if (results.length > 0 && results[0].foto) {
                const fotoPath = path.join(__dirname, results[0].foto);
                if (fs.existsSync(fotoPath)) {
                    fs.unlinkSync(fotoPath);
                }
            }
            res.status(200).json({ message: 'Data dokter berhasil dihapus.' });
        }); 
    });
});

// --- Sisa Endpoint Lainnya (Tidak Berubah) ---

app.get('/api/pasien', (req, res) => {
    const query = 'SELECT *, DATE_FORMAT(tanggal_lahir, "%d/%m/%Y") as tanggal_lahir_formatted, DATE_FORMAT(tanggal_pendaftaran, "%d/%m/%Y") as tanggal_daftar_formatted FROM pasien';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        const formattedResults = results.map(p => ({ ...p, tanggal_lahir: p.tanggal_lahir_formatted, tanggal_pendaftaran: p.tanggal_daftar_formatted }));
        res.status(200).json(formattedResults);
    });
});

app.get('/api/riwayat', (req, res) => {
    const query = `
        SELECT p.id_pendaftaran as id, DATE_FORMAT(p.tanggal_pendaftaran, "%d/%m/%Y") as tanggal,
        p.nomor_antrian, ps.nama_lengkap as nama, ps.nik, p.poli_tujuan as poli,
        p.jam_pemeriksaan as jam_daftar, p.status_pasien as status
        FROM pendaftaran p JOIN pasien ps ON p.pasien_id = ps.id
        ORDER BY p.tanggal_pendaftaran DESC, p.jam_pemeriksaan DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.status(200).json(results);
    });
});

app.get('/api/pesan', (req, res) => { db.query('SELECT *, DATE_FORMAT(tanggal, "%d/%m/%Y") as tanggal_formatted FROM pesan ORDER BY id DESC', (err, results) => { if (err) res.status(500).send(err); else { const formatted = results.map(m => ({...m, tanggal: m.tanggal_formatted})); res.json(formatted); } }); });

app.get('/api/dashboard/stats', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const todayDayName = dayMapping[new Date().getDay()]; // Menggunakan mapping yang konsisten

  const q1 = 'SELECT COUNT(*) as count FROM pendaftaran WHERE tanggal_pendaftaran = ?';
  const q2 = 'SELECT COUNT(*) as count FROM pendaftaran WHERE MONTH(tanggal_pendaftaran) = ? AND YEAR(tanggal_pendaftaran) = ?';
  const q3 = "SELECT COUNT(*) as count FROM dokter WHERE status = 'Aktif'";
  const q4 = "SELECT COUNT(*) as count FROM dokter WHERE jadwal LIKE ? AND status = 'Aktif'";

  db.query(q1, [today], (e1, r1) => {
    db.query(q2, [currentMonth, currentYear], (e2, r2) => {
      db.query(q3, (e3, r3) => {
        db.query(q4, [`%${todayDayName}%`], (e4, r4) => {
          if (e1 || e2 || e3 || e4) return res.status(500).json({ message: "Database query error" });
          res.json({
            pendaftaranHariIni: r1[0].count,
            pasienBulanIni: r2[0].count,
            dokterAktif: r3[0].count,
            jadwalHariIni: r4[0].count
          });
        });
      });
    });
  });
});

app.get('/api/dashboard/pasien-hari-ini', (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    const query = `
        SELECT ps.nama_lengkap as nama, p.jam_pemeriksaan as jamDaftar, p.poli_tujuan as poli
        FROM pendaftaran p JOIN pasien ps ON p.pasien_id = ps.id
        WHERE p.tanggal_pendaftaran = ? ORDER BY p.jam_pemeriksaan ASC LIMIT 5
    `;
    db.query(query, [today], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(results);
    });
});

app.get('/api/dashboard/kunjungan-mingguan', (req, res) => {
    const query = `
        SELECT DAYOFWEEK(tanggal_pendaftaran) as day, COUNT(*) as count
        FROM pendaftaran
        WHERE WEEK(tanggal_pendaftaran, 1) = WEEK(CURDATE(), 1) AND YEAR(tanggal_pendaftaran) = YEAR(CURDATE())
        GROUP BY DAYOFWEEK(tanggal_pendaftaran) ORDER BY DAYOFWEEK(tanggal_pendaftaran)
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        const chartData = [0, 0, 0, 0, 0, 0, 0];
        results.forEach(row => { chartData[row.day - 1] = row.count; });
        res.json(chartData);
    });
});

const adminAccounts = [
  { email: 'fajarahmadkurniadi@gmail.com', password: 'adminrsgm123' },
  { email: 'fakhriskroep@gmail.com', password: 'adminrsgm123' },
  { email: 'admin123@gmail.com', password: 'adminrsgm123' },
];
app.post('/loginadmin', (req, res) => {
  const { email, password } = req.body;
  const admin = adminAccounts.find(acc => acc.email === email && acc.password === password);
  if (admin) res.status(200).json({ message: 'Login successful' });
  else res.status(401).json({ message: 'Invalid email or password' });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});