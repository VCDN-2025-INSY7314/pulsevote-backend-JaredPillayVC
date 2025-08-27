const app = require('./app');
require('dotenv').config();
// const mongoose = require('mongoose'); // connect later when models are added

const PORT = process.env.PORT || 5000;

// Example future DB connect:
// mongoose.connect(process.env.MONGODB_URI).then(()=> console.log('Mongo connected'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
