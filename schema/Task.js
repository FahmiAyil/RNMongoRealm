const Task = {
  name: 'Task',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    name: 'string',
    status: 'string',
  },
};

export default Task;
