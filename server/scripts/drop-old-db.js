const mongoose = require('mongoose');

(async () => {
  try {
    const adminUri = process.env.MONGO_ADMIN_URI || 'mongodb://localhost:27017/admin';
    const client = await mongoose.createConnection(adminUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).asPromise();

    const adminDb = client.db.admin();
    const dbs = await adminDb.listDatabases();
    const names = dbs.databases.map(d => d.name);
    console.log('Databases:', names);

    if (!names.includes('jobsnap')) {
      console.log('No old "jobsnap" database found. Nothing to drop.');
      await client.close();
      process.exit(0);
    }

    // Connect directly to the jobsnap DB and drop it
    const dropConn = await mongoose.createConnection('mongodb://localhost:27017/jobsnap', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).asPromise();

    const result = await dropConn.dropDatabase();
    console.log('Dropped jobsnap database:', result);
    await dropConn.close();
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error('Error dropping jobsnap database:', err.message);
    process.exit(1);
  }
})();


