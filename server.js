const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');



// Online DB connection
const DB = process.env.DATABASE_URL;
mongoose.connect(DB)
  .then(() => console.log('DB connection successful'))
  .catch(error => console.log(error));

// Start server
const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`App running on port ${port}..`);
});
