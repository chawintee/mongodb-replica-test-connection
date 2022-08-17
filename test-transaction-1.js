  // For a replica set, include the replica set name and a seedlist of the members in the URI string; e.g.
  // const uri = 'mongodb://mongodb0.example.com:27017,mongodb1.example.com:27017/?replicaSet=myRepl'
  // For a sharded cluster, connect to the mongos instances; e.g.
  // const uri = 'mongodb://mongos0.example.com:27017,mongos1.example.com:27017/'
  import { MongoClient } from 'mongodb'
  const uri = 'mongodb://usermongo:passmongo@localhost:27081/?replicaSet=replicaset1'
  const client = new MongoClient(uri);
  await client.connect();
  // Prereq: Create collections.
  await client
    .db('mydb1')
    .collection('foo')
    .insertOne({ abc: 0 }, { writeConcern: { w: 'majority' } })
    .then(result => console.log("mydb1 database, foo collection and abc:0 are create"))
    .catch(err => console.log(err));
  await client
    .db('mydb2')
    .collection('bar')
    .insertOne({ xyz: 0 }, { writeConcern: { w: 'majority' } })
    .then(result => console.log("mydb2 database, bar collection and abc:0 are create"))
    .catch(err => console.log(err));
  // Step 1: Start a Client Session
  const session = client.startSession();
  // Step 2: Optional. Define options to use for the transaction
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' }
  };
  // Step 3: Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
  // Note: The callback for withTransaction MUST be async and/or return a Promise.
  try {
    await session.withTransaction(async () => {
      const coll1 = client.db('mydb1').collection('foo');
      const coll2 = client.db('mydb2').collection('bar');
      // Important:: You must pass the session to the operations
      await coll1.insertOne({ abc: 1 }, { session });
      await coll2.insertOne({ xyz: 999 }, { session });
    }, transactionOptions);
  } finally {
    await session.endSession();
    await client.close();
  }