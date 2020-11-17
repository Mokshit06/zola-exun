const mongoose = require('mongoose');

async function connectToDB() {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log(`Database connected on ${conn.connection.host}`);
  } catch (error) {
    console.log('Error connecting to database');
    console.error(error);

    process.exit(1);
  }
}

module.exports = connectToDB;
