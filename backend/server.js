const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Konfigurasi database dengan timezone
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rsgm_db',
  timezone: '+07:00', // Set timezone ke WIB
  dateStrings: true, // Mengembalikan tanggal sebagai string
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to the MySQL database.');

  // Set timezone ke WIB (UTC+7)
  db.query("SET time_zone = '+07:00'", (err) => {
    if (err) {
      console.error('Error setting timezone:', err);
    } else {
      console.log('Timezone set to WIB (UTC+7)');
    }
  });
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

// Helper untuk zona waktu lokal (WIB = UTC+7)
const toLocalDateTime = (date = new Date()) => {
  const offset = 7 * 60; // 7 jam dalam menit
  const localDate = new Date(date.getTime() + offset * 60 * 1000);
  return localDate.toISOString().slice(0, 19).replace('T', ' ');
};

const toLocalDate = (date = new Date()) => {
  const offset = 7 * 60; // 7 jam dalam menit
  const localDate = new Date(date.getTime() + offset * 60 * 1000);
  return localDate.toISOString().slice(0, 10);
};

// ==========================================================
// === PERBAIKAN UTAMA: Gunakan singkatan hari yang benar ===
// ==========================================================
const dayMapping = {
  0: 'Minggu', // Minggu tidak dipakai, tapi dijaga untuk konsistensi index
  1: 'Sen',
  2: 'Sel',
  3: 'Rab',
  4: 'Kam',
  5: 'Jum',
  6: 'Sab',
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diizinkan!'), false);
    }
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const poliCodeMapping = {
  'Gigi Umum': 'GU',
  Ortodonti: 'OR',
  'Gigi Anak': 'KA',
  Endodonti: 'EN',
  Prosthodonsia: 'PS',
  'Konservasi Gigi': 'KG',
  'Penyakit Mulut': 'PM',
  'Gigi Estetika dan Kosmetik': 'GK',
  Periodonsia: 'PR',
  'Radiologi Gigi dan Mulut': 'RG',
  'Gigi Geriatri': 'GT',
  'Bedah Mulut dan Maksilofasial': 'BM',
};

app.post('/api/pendaftaran', (req, res) => {
  const { nik, namaLengkap, jenisKelamin, tanggalLahir, alamat, noHandphone, poli, hariTujuan, jamTujuan, keluhan } = req.body;

  if (!hariTujuan || !poli) {
    return res.status(400).json({ message: 'Informasi poli dan tanggal tujuan tidak boleh kosong.' });
  }

  db.beginTransaction((err) => {
    if (err) {
      console.error('Gagal memulai transaksi:', err);
      return res.status(500).json({ message: 'Kesalahan pada server.' });
    }

    const dateObject = new Date(hariTujuan + 'T00:00:00');
    const dayIndex = dateObject.getDay();
    const hariSingkat = dayMapping[dayIndex]; // Ini akan menghasilkan 'Sen', 'Sel', dst.

    const queryCariDokter = "SELECT * FROM dokter WHERE spesialis = ? AND jadwal LIKE ? AND status = 'Aktif' LIMIT 1";

    db.query(queryCariDokter, [poli, `%${hariSingkat}%`], (err, dokterResults) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ message: 'Database error saat mencari dokter.', error: err }));
      }
      if (dokterResults.length === 0) {
        return db.rollback(() => res.status(404).json({ message: `Tidak ada dokter yang tersedia untuk poli ${poli} pada hari tersebut.` }));
      }
      const assignedDoctor = dokterResults[0];

      const proceedWithRegistration = (pasienId, noRekamMedis, statusPasien) => {
        const poliCode = poliCodeMapping[poli] || 'XX';
        const queryAntrian = 'SELECT COUNT(*) as count FROM pendaftaran WHERE poli_tujuan = ? AND DATE(tanggal_pendaftaran) = ? FOR UPDATE';

        db.query(queryAntrian, [poli, hariTujuan], (err, antrianResult) => {
          if (err) {
            return db.rollback(() => res.status(500).json({ message: 'Gagal menghitung antrian.', error: err }));
          }

          const nextNumber = antrianResult[0].count + 1;
          const nomorAntrian = `${poliCode}-${nextNumber.toString().padStart(3, '0')}`;

          // PERBAIKAN: Gunakan tanggal yang benar untuk pendaftaran
          const pendaftaranData = {
            pasien_id: pasienId,
            dokter_id: assignedDoctor.id,
            // tanggal_pendaftaran: hariTujuan, // Ini sudah dalam format YYYY-MM-DD
            jam_pemeriksaan: jamTujuan,
            poli_tujuan: poli,
            keluhan,
            status_pasien: statusPasien,
            nomor_antrian: nomorAntrian,
            created_at: toLocalDateTime(), // Waktu pembuatan dengan zona lokal
          };

          db.query('INSERT INTO pendaftaran SET ?', pendaftaranData, (err, result) => {
            if (err) {
              return db.rollback(() => {
                console.error('GAGAL INSERT PENDAFTARAN:', err);
                res.status(500).json({ message: 'Gagal menyimpan data pendaftaran.', error: err.sqlMessage });
              });
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => res.status(500).json({ message: 'Gagal menyelesaikan transaksi.', error: err }));
              }

              io.emit('pendaftaran_baru', { message: 'Satu pasien telah mendaftar!' });
              res.status(200).json({
                message: 'Pendaftaran berhasil!',
                data: { ...req.body, noRekamMedis, nomorAntrian, statusPasien, namaDokter: assignedDoctor.nama },
              });
            });
          });
        });
      };

      db.query('SELECT * FROM pasien WHERE nik = ?', [nik], (err, pasienResults) => {
        if (err) {
          return db.rollback(() => res.status(500).json({ message: 'Database error saat cek NIK.', error: err }));
        }

        if (pasienResults.length > 0) {
          proceedWithRegistration(pasienResults[0].id, pasienResults[0].no_rm, 'Pasien Terdaftar');
        } else {
          const noRekamMedis = `RM${Math.floor(100000 + Math.random() * 900000)}`;
          const pasienBaru = {
            nik,
            no_rm: noRekamMedis,
            nama_lengkap: namaLengkap,
            jenis_kelamin: jenisKelamin,
            tanggal_lahir: tanggalLahir,
            alamat,
            no_hp: noHandphone,
            tanggal_pendaftaran: toLocalDateTime(), // Gunakan zona waktu lokal
          };

          db.query('INSERT INTO pasien SET ?', pasienBaru, (err, result) => {
            if (err) {
              return db.rollback(() => {
                console.error('GAGAL INSERT PASIEN:', err);
                res.status(500).json({ message: 'Gagal menyimpan data pasien baru.', error: err.sqlMessage });
              });
            }
            proceedWithRegistration(result.insertId, noRekamMedis, 'Pasien Baru');
          });
        }
      });
    });
  });
});

// Endpoint Pesan (Tidak ada perubahan)
app.post('/api/pesan', (req, res) => {
  const { nama, email, pesan } = req.body;
  const now = new Date();
  const options = { timeZone: 'Asia/Jakarta' };
  const tanggal = now.toLocaleDateString('sv-SE', options); // Menghasilkan format YYYY-MM-DD
  const jam = now.toLocaleTimeString('en-GB', options);          // Format: HH:MM:SS

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
  db.query('SELECT *, DATE_FORMAT(tanggal_lahir, "%d/%m/%Y") as tanggal_lahir FROM dokter ORDER BY id ASC', (err, results) => {
    if (err) res.status(500).json({ message: 'Database error', error: err });
    else res.json(results);
  });
});

app.post('/api/dokter', upload.single('foto'), (req, res) => {
  const { nip } = req.body;

  db.query('SELECT id FROM dokter WHERE nip = ?', [nip], (err, results) => {
    if (err) {
      console.error('Database error saat cek NIP:', err);
      return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
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
        console.error('Gagal menambah dokter:', err);
        if (fotoPath) fs.unlinkSync(fotoPath);
        return res.status(500).json({ message: 'Gagal menyimpan data ke database.', error: err.sqlMessage });
      }
      res.status(201).json({ id: result.insertId, ...dataToInsert });
    });
  });
});

app.put('/api/dokter/:id', upload.single('foto'), (req, res) => {
  const { id } = req.params;
  const { nip } = req.body;

  db.query('SELECT foto FROM dokter WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Gagal mengambil data lama.' });

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
        console.error('Gagal memperbarui dokter:', err);
        return res.status(500).json({ message: 'Gagal memperbarui data di database.', error: err.sqlMessage });
      }
      res.status(200).json({ message: 'Data dokter berhasil diperbarui.' });
    });
  });
});

app.delete('/api/dokter/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT foto FROM dokter WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Gagal mengambil data untuk dihapus.' });

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


app.get('/api/pasien', (req, res) => {
  const query = 'SELECT *, DATE_FORMAT(tanggal_lahir, "%d/%m/%Y") as tanggal_lahir_formatted, DATE_FORMAT(tanggal_pendaftaran, "%d/%m/%Y") as tanggal_daftar_formatted FROM pasien';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    const formattedResults = results.map((p) => ({ ...p, tanggal_lahir: p.tanggal_lahir_formatted, tanggal_pendaftaran: p.tanggal_daftar_formatted }));
    res.status(200).json(formattedResults);
  });
});

app.put('/api/pasien/:id', (req, res) => {
  const { id } = req.params;
  const {
    nama_lengkap,
    tanggal_lahir,
    jenis_kelamin,
    alamat,
    no_hp,
    nik,
    tanggal_pendaftaran,
  } = req.body;

  // Helper untuk mengubah format tanggal DD/MM/YYYY kembali ke YYYY-MM-DD untuk MySQL
  const toMySQLDate = (dateStr) => {
    if (!dateStr || !dateStr.includes('/')) return dateStr; // Jika format sudah benar, kembalikan
    const parts = dateStr.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const dataToUpdate = {
    nama_lengkap,
    tanggal_lahir: toMySQLDate(tanggal_lahir),
    jenis_kelamin,
    alamat,
    no_hp,
    nik,
    // Pastikan format tanggal daftar juga benar
    tanggal_pendaftaran: toMySQLDate(tanggal_pendaftaran), 
  };

  const query = 'UPDATE pasien SET ? WHERE id = ?';

  db.query(query, [dataToUpdate, id], (err, result) => {
    if (err) {
      console.error('Gagal memperbarui data pasien:', err);
      return res.status(500).json({ message: 'Gagal memperbarui data di database.', error: err.sqlMessage });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pasien dengan ID tersebut tidak ditemukan.' });
    }
    res.status(200).json({ message: 'Data pasien berhasil diperbarui.' });
  });
});


// GET /api/riwayat (Endpoint yang dimodifikasi untuk daftar dengan filter)
app.get('/api/riwayat', (req, res) => {
  const { search, tanggal } = req.query;

  let query = `
      SELECT p.id_pendaftaran as id, 
             p.tanggal_pendaftaran as tanggal, 
             p.nomor_antrian, 
             ps.nama_lengkap as nama, 
             ps.nik, 
             p.poli_tujuan as poli,
             p.jam_pemeriksaan as jam_daftar, 
             p.status_pasien as status
      FROM pendaftaran p JOIN pasien ps ON p.pasien_id = ps.id
  `;

  const whereClauses = [];
  const queryParams = [];

  if (search) {
    whereClauses.push('(ps.nama_lengkap LIKE ? OR ps.nik LIKE ?)');
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  if (tanggal) {
    // PERBAIKAN: Gunakan DATE() untuk membandingkan tanggal saja, mengabaikan waktu
    whereClauses.push('DATE(p.tanggal_pendaftaran) = ?');
    queryParams.push(tanggal);
  }

  if (whereClauses.length > 0) {
    query += ' WHERE ' + whereClauses.join(' AND ');
  }

  query += ' ORDER BY p.tanggal_pendaftaran DESC, p.id_pendaftaran DESC';

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Database error saat mengambil riwayat:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json({ results });
  });
});

// GET /api/riwayat/:id (Endpoint BARU untuk detail)
app.get('/api/riwayat/:id', (req, res) => {
  const { id } = req.params;
  const query = `
      SELECT 
          p.*, 
          ps.nama_lengkap, ps.nik, ps.no_rm, ps.jenis_kelamin, ps.no_hp,
          d.nama as nama_dokter
      FROM pendaftaran p
      JOIN pasien ps ON p.pasien_id = ps.id
      JOIN dokter d ON p.dokter_id = d.id
      WHERE p.id_pendaftaran = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.status(200).json(results[0]);
  });
});

app.get('/api/pesan', (req, res) => {
  db.query('SELECT *, DATE_FORMAT(tanggal, "%d/%m/%Y") as tanggal_formatted FROM pesan ORDER BY id ASC', (err, results) => {
    if (err) res.status(500).send(err);
    else {
      const formatted = results.map((m) => ({ ...m, tanggal: m.tanggal_formatted }));
      res.json(formatted);
    }
  });
});

app.get('/api/dashboard/stats', (req, res) => {
  // Gunakan tanggal lokal untuk statistik
  const today = toLocalDate();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Perbaikan: Buat object Date dengan zona waktu lokal
  const localNow = new Date();
  const todayDayName = dayMapping[localNow.getDay()];

  const q1 = 'SELECT COUNT(*) as count FROM pendaftaran WHERE DATE(tanggal_pendaftaran) = ?';
  const q2 = 'SELECT COUNT(*) as count FROM pendaftaran WHERE MONTH(tanggal_pendaftaran) = ? AND YEAR(tanggal_pendaftaran) = ?';
  const q3 = "SELECT COUNT(*) as count FROM dokter WHERE status = 'Aktif'";
  const q4 = "SELECT COUNT(*) as count FROM dokter WHERE jadwal LIKE ? AND status = 'Aktif'";

  db.query(q1, [today], (e1, r1) => {
    db.query(q2, [currentMonth, currentYear], (e2, r2) => {
      db.query(q3, (e3, r3) => {
        db.query(q4, [`%${todayDayName}%`], (e4, r4) => {
          if (e1 || e2 || e3 || e4) return res.status(500).json({ message: 'Database query error' });
          res.json({
            pendaftaranHariIni: r1[0].count,
            pasienBulanIni: r2[0].count,
            dokterAktif: r3[0].count,
            jadwalHariIni: r4[0].count,
          });
        });
      });
    });
  });
});

app.get('/api/dashboard/pasien-hari-ini', (req, res) => {
  const today = toLocalDate();
  const query = `
        SELECT ps.nama_lengkap as nama, p.jam_pemeriksaan as jamDaftar, p.poli_tujuan as poli
        FROM pendaftaran p JOIN pasien ps ON p.pasien_id = ps.id
        WHERE DATE(p.tanggal_pendaftaran) = ? 
        ORDER BY p.jam_pemeriksaan ASC LIMIT 5
    `;
  db.query(query, [today], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
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
    if (err) return res.status(500).json({ message: 'Database error' });
    const chartData = [0, 0, 0, 0, 0, 0, 0];
    results.forEach((row) => {
      chartData[row.day - 1] = row.count;
    });
    res.json(chartData);
  });
});

// GET /api/jadwalharian?tanggal=...
app.get('/api/jadwalharian', (req, res) => {
  const { tanggal, spesialis, search } = req.query;
  if (!tanggal) {
    return res.status(400).json({ message: 'Parameter tanggal diperlukan.' });
  }

  // PERBAIKAN: Menggunakan getDay() dengan waktu tengah hari untuk menghindari masalah zona waktu
  const localDate = new Date(tanggal + 'T12:00:00');
  const shortDayName = ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][localDate.getDay()];

  let query = `
    SELECT 
        d.id as dokter_id, d.nama, d.nip, d.spesialis, d.jadwal,
        jh.id, COALESCE(jh.tanggal, ?) as tanggal, 
        COALESCE(jh.status, 'Hadir') as status,


        COALESCE(
            DATE_FORMAT(jh.jam_mulai, '%H:%i'), 
            CONCAT(TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(d.jadwal, '(', -1), '-', 1)), ':00')
        ) as jam_mulai,

 
        COALESCE(
            DATE_FORMAT(jh.jam_selesai, '%H:%i'),
            CONCAT(TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(d.jadwal, ')', 1), '-', -1)), ':00')
        ) as jam_selesai

    FROM dokter d
    LEFT JOIN jadwal_harian jh ON d.id = jh.dokter_id AND jh.tanggal = ?
    WHERE d.jadwal LIKE ? AND d.status = 'Aktif'
`;
  const queryParams = [tanggal, tanggal, `%${shortDayName}%`];

  if (spesialis) {
    query += ' AND d.spesialis = ?';
    queryParams.push(spesialis);
  }

  if (search) {
    query += ' AND (d.nama LIKE ? OR d.nip LIKE ?)';
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY d.nama;';

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Database error saat mengambil jadwal harian:', err);
      return res.status(500).json({ message: 'Kesalahan pada server.', error: err });
    }
    res.status(200).json(results);
  });
});

// POST /api/jadwalharian
app.post('/api/jadwalharian', (req, res) => {
  const { dokter_id, tanggal, jam_mulai, jam_selesai, status } = req.body;
  const newSchedule = { dokter_id, tanggal, jam_mulai, jam_selesai, status };

  // Gunakan klausa ON DUPLICATE KEY UPDATE untuk insert atau update
  const query = `
      INSERT INTO jadwal_harian (dokter_id, tanggal, jam_mulai, jam_selesai, status) 
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      jam_mulai = VALUES(jam_mulai), 
      jam_selesai = VALUES(jam_selesai), 
      status = VALUES(status);
  `;

  db.query(query, [dokter_id, tanggal, jam_mulai, jam_selesai, status], (err, result) => {
    if (err) {
      console.error('Gagal menyimpan jadwal:', err);
      return res.status(500).json({ message: 'Gagal menyimpan jadwal ke database.' });
    }
    res.status(201).json({ message: 'Jadwal berhasil disimpan', id: result.insertId });
  });
});

// PUT /api/jadwalharian/:id
app.put('/api/jadwalharian/:id', (req, res) => {
  const { id } = req.params;
  const { status, jam_mulai, jam_selesai } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Jadwal tidak ditemukan atau belum dibuat untuk hari ini. Silakan tambahkan terlebih dahulu.' });
  }

  db.query('UPDATE jadwal_harian SET status = ?, jam_mulai = ?, jam_selesai = ? WHERE id = ?', [status, jam_mulai, jam_selesai, id], (err, result) => {
    if (err) {
      console.error('Gagal memperbarui jadwal:', err);
      return res.status(500).json({ message: 'Gagal memperbarui jadwal di database.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Jadwal tidak ditemukan.' });
    }
    res.status(200).json({ message: 'Jadwal berhasil diperbarui.' });
  });
});

// PUT /api/jadwalharian/:id
app.put('/api/jadwalharian/:id', (req, res) => {
  const { id } = req.params;
  const { status, jam_mulai, jam_selesai } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Jadwal tidak ditemukan atau belum dibuat untuk hari ini. Silakan tambahkan terlebih dahulu.' });
  }

  db.query('UPDATE jadwal_harian SET status = ?, jam_mulai = ?, jam_selesai = ? WHERE id = ?', [status, jam_mulai, jam_selesai, id], (err, result) => {
    if (err) {
      console.error('Gagal memperbarui jadwal:', err);
      return res.status(500).json({ message: 'Gagal memperbarui jadwal di database.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Jadwal tidak ditemukan.' });
    }
    res.status(200).json({ message: 'Jadwal berhasil diperbarui.' });
  });
});

// DELETE /api/jadwalharian/:id
app.delete('/api/jadwalharian/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    // Jika tidak ada ID, berarti jadwal tersebut belum di-override dan tidak ada di database.
    // Anggap saja "penghapusan" berhasil karena jadwal kembali ke default.
    return res.status(200).json({ message: 'Jadwal default telah dipulihkan.' });
  }
  db.query('DELETE FROM jadwal_harian WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Gagal menghapus jadwal:', err);
      return res.status(500).json({ message: 'Gagal menghapus jadwal dari database.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Jadwal tidak ditemukan untuk dihapus.' });
    }
    res.status(200).json({ message: 'Jadwal berhasil dihapus dan dikembalikan ke default.' });
  });
});

const adminAccounts = [
  { email: 'fajarahmadkurniadi@gmail.com', password: 'adminrsgm123' },
  { email: 'fakhriskroep@gmail.com', password: 'adminrsgm123' },
  { email: 'admin123@gmail.com', password: 'adminrsgm123' },
];
app.post('/loginadmin', (req, res) => {
  const { email, password } = req.body;
  const admin = adminAccounts.find((acc) => acc.email === email && acc.password === password);
  if (admin) res.status(200).json({ message: 'Login successful' });
  else res.status(401).json({ message: 'Invalid email or password' });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
