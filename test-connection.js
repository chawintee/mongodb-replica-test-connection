  // For a replica set, include the replica set name and a seedlist of the members in the URI string; e.g.
  // const uri = 'mongodb://mongodb0.example.com:27017,mongodb1.example.com:27017/?replicaSet=myRepl'
  // For a sharded cluster, connect to the mongos instances; e.g.
  // const uri = 'mongodb://mongos0.example.com:27017,mongos1.example.com:27017/'
  import { MongoClient } from 'mongodb'
  const uri = 'mongodb://usermongo:passmongo@localhost:27081/?replicaSet=replicaset1'
  const client = new MongoClient(uri);
  await client.connect()
  .then(client => {
    console.log("MongoDB connected");
    // console.log(client);
    client.close()
  })
  .catch(error => {
    console.log("Have Error In Connnection");
    console.log(error);
  })
