const dotenv = require('dotenv-flow');
const connectToDB = require('./config/database');

dotenv.config();

const app = require('./app');

async function main() {
  await connectToDB();
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
}

main();
