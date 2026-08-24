const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/inquiry', (req, res) => {
  const { companyName, email, destination, product, message } = req.body;
  
  console.log('--- New Export Inquiry Received ---');
  console.log(`Company: ${companyName}`);
  console.log(`Email: ${email}`);
  console.log(`Destination: ${destination}`);
  console.log(`Product: ${product}`);
  console.log(`Message: ${message}`);
  console.log('-----------------------------------');

  // In a real application, you would save this to a database or send an email here.

  res.status(200).json({ success: true, message: 'Inquiry received successfully.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
