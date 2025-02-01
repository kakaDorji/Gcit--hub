const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');  // Add this
dotenv.config({ path: './config.env' });

const app = require('./app');

app.use(cors());  // Enable CORS

// Online DB connection
const DB = process.env.DATABASE;
mongoose.connect(DB)
  .then(() => console.log('DB connection successful'))
  .catch(error => console.log(error));

// Start server
const port = 4001;
app.listen(port, () => {
  console.log(`App running on port ${port}..`);
});
