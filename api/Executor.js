'use strict';

var ErrorCodes = {
    NOT_FOUND: 'notFound'
};

var createError = require('mazaid-error');
var ExecTask = require('mazaid-exec-task');
var exec = require('mazaid-exec');

class Executor {

    constructor(logger, config, api) {

        this.ErrorCodes = ErrorCodes;

        this._logger = logger;
        this._config = config;
        this._api = api;
    }

    exec(id) {

        this._exec(id)
            .then((result) => {
                this._logger.info(`task id = ${id} finished success`);
            })
            .catch((error) => {
                this._logger.error(`task id = ${id} finished with error = ${error.message}`);
            });
    }

    _exec(id) {

        return new Promise((resolve, reject) => {
            var task, rawTask, timeout, timeouted = false;

            this._api.execTasks.getById(id)
                .then((_rawTask) => {

                    if (!_rawTask) {
                        throw createError(`task id = ${id} not found`, ErrorCodes.NOT_FOUND);
                    }

                    rawTask = _rawTask;

                    task = new ExecTask(rawTask);

                    timeout = setTimeout(() => {
                        timeouted = true;

                        task.finished();

                        var data = {
                            status: 'finished',
                            finishDate: task.finishDate,
                            result: {
                                code: 1,
                                error: `timeout exceed ${task.timeout}s`
                            }
                        };

                        this._update(id, data)
                            .then(() => {
                                reject(createError('timeout exceed'));
                            })
                            .catch((error) => {
                                this._logger.error(error);
                                reject(createError('timeout exceed'));
                            });


                    }, task.timeout * 1000);

                    task.queued();

                    return this._update(id, {status: 'queued', queuedDate: task.queuedDate});
                })
                .then(() => {
                    task.started();
                    return this._update(id, {status: 'started', startDate: task.startDate});
                })
                .then(() => {
                    return exec(task);
                })
                .then((task) => {

                    if (timeouted) {
                        throw createError('task timeout', 'timeout');
                    }

                    clearTimeout(timeout);

                    task.finished();

                    return this._update(id, {
                        status: 'finished',
                        finishDate: task.finishDate,
                        result: task.result
                    });
                })
                .then(() => {
                    resolve(task);
                })
                .catch((error) => {

                    if (error.code === 'timeout') {
                        return;
                    }

                    task.finished();

                    var data = {
                        status: 'finished',
                        finishDate: task.finishDate,
                        result: {
                            code: 1,
                            error: error.message
                        }
                    };

                    this._update(id, data)
                        .then(() => {
                            reject(error);
                        })
                        .catch((updateError) => {
                            this._logger.error(updateError);
                            reject(error);
                        });

                });
        });

    }

    _update(id, data) {
        return this._api.execTasks.updateById(id, data);
    }


}

module.exports = Executor;
