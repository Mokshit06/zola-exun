const dotenv = require('dotenv-flow');
const connectToDB = require('./config/database');

dotenv.config();

const server = require('./server');

async function main() {
  await connectToDB();
  const port = process.env.PORT || 5000;

  server.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
}

main();
