'use strict';

var Abstract = require('./Abstract');

class ExecTasks extends Abstract {

    constructor(db) {
        super(db);

        this._collectionName = 'execTasks';

        this._indexes = [
            // {
            //     fields: {
            //         name: 1
            //     },
            //     options: {
            //         name: 'name',
            //         unique: true,
            //         background: true
            //     }
            // }
        ];
    }

}

module.exports = ExecTasks;
