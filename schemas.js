import {ObjectId} from 'bson';

class Task {
  constructor({
    name,
    partition,
    category,
    assignee,
    status = Task.STATUS_OPEN,
    id = new ObjectId(),
  }) {
    this._partition = partition;
    this._id = id;
    this.name = name;
    this.status = status;
    this.category = category;
    this.assignee = assignee;
  }

  static STATUS_OPEN = 'Open';
  static STATUS_IN_PROGRESS = 'InProgress';
  static STATUS_COMPLETE = 'Complete';

  static schema = {
    name: 'Task',
    properties: {
      _id: 'objectId',
      _partition: 'string',
      name: 'string',
      category: 'Category',
      status: 'string',
      assignee: 'objectId?',
    },
    primaryKey: '_id',
  };
}

class Category {
  constructor({name, partition, id = new ObjectId()}) {
    this._partition = partition;
    this._id = id;
    this.name = name;
  }

  static schema = {
    name: 'Category',
    properties: {
      _id: 'objectId',
      _partition: 'string',
      name: 'string',
    },
    primaryKey: '_id',
  };
}

export {Task, Category};
