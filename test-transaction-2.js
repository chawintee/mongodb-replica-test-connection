async function commitWithRetry(session) {
    try {
      await session.commitTransaction();
      console.log('Transaction committed.');
    } catch (error) {
      if (error.hasErrorLabel('UnknownTransactionCommitResult')) {
        console.log('UnknownTransactionCommitResult, retrying commit operation ...');
        await commitWithRetry(session);
      } else {
        console.log('Error during commit ...');
        throw error;
      }
    }
  }
  async function runTransactionWithRetry(txnFunc, client, session) {
    try {
      await txnFunc(client, session);
    } catch (error) {
      console.log('Transaction aborted. Caught exception during transaction.');
      // If transient error, retry the whole transaction
      if (error.hasErrorLabel('TransientTransactionError')) {
        console.log('TransientTransactionError, retrying transaction ...');
        await runTransactionWithRetry(txnFunc, client, session);
      } else {
        throw error;
      }
    }
  }
  async function updateEmployeeInfo(client, session) {
    session.startTransaction({
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority' },
      readPreference: 'primary'
    });
    const employeesCollection = client.db('hr').collection('employees');
    const eventsCollection = client.db('reporting').collection('events');
    await employeesCollection.updateOne(
      { employee: 3 },
      { $set: { status: 'Inactive' } },
      { session }
    );
    await eventsCollection.insertOne(
      {
        employee: 3,
        status: { new: 'Inactive', old: 'Active' }
      },
      { session }
    );
    try {
      await commitWithRetry(session);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }
  return client.withSession(session =>
    runTransactionWithRetry(updateEmployeeInfo, client, session)
  );
  