const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Admin accounts
const adminAccounts = [
  { email: 'fajarahmadkurniadi@gmail.com', password: 'adminrsgm123' },
  { email: 'fakhriskroep@gmail.com', password: 'adminrsgm123' },
  { email: 'admin123@gmail.com', password: 'adminrsgm123' },
];

// Routes
app.post('/loginadmin', (req, res) => {
  const { email, password } = req.body;

  const admin = adminAccounts.find(
    (acc) => acc.email === email && acc.password === password
  );

  if (admin) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});