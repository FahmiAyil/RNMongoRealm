import {ObjectId} from 'bson';

class User {
  constructor({name, id = new ObjectId()}) {
    this._id = id;
    this.name = name;
  }

  static schema = {
    name: 'User',
    properties: {
      _id: 'objectId',
      name: 'string',
    },
    primaryKey: '_id',
  };
}

export {User};
