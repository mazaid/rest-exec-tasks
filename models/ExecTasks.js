'use strict';

var Abstract = require('./Abstract');

class ExecTasks extends Abstract {

    constructor(db) {
        super(db);

        this._collectionName = 'execTasks';

        this._indexes = [
            {
                fields: {
                    creationDate: -1
                },
                options: {
                    name: 'creationDate',
                    unique: false,
                    background: true
                }
            }
        ];
    }

}

module.exports = ExecTasks;
