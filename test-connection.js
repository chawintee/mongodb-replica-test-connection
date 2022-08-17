  // For a replica set, include the replica set name and a seedlist of the members in the URI string; e.g.
  // const uri = 'mongodb://mongodb0.example.com:27017,mongodb1.example.com:27017/?replicaSet=myRepl'
  // For a sharded cluster, connect to the mongos instances; e.g.
  // const uri = 'mongodb://mongos0.example.com:27017,mongos1.example.com:27017/'
  const uri = ''
  const client = new MongoClient(uri);
  await client.connect()
  .then(client => {
    console.log("MongoDB connected");
    console.log(client);
  })
  .catch(error => {
    console.log("Have Error In Connnection");
    console.log(error);
  })
