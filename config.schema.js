var joi = require('joi');

module.exports = {
    host: joi.string().allow(null).default('localhost'),
    port: joi.number().default(8084),
    db: joi.object().default({
        dsl: 'mongodb://localhost:27017/mazaid'
    }).keys({
        dsl: joi.string().default('mongodb://localhost:27017/mazaid')
    }),
    nprof: joi.object().default({
        snapshotPath: '/data/tmp/mazaid/exec-tasks'
    }).keys({
        snapshotPath: joi.string().default('/data/tmp/mazaid/exec-tasks')
    })
};
