var joi = require('joi');
var _ = require('lodash');

module.exports = {

    resource: '/execTasks/:id',

    title: 'get exec task by id',

    methods: {

        GET: {
            title: 'get exec task by id',

            schema: {
                path: {
                    ':id': joi.string().required()
                }
            },

            onlyPrivate: false,

            callback: function (req, res) {
                var logger = req.di.logger;
                var api = req.di.api;

                api.execTasks.getById(req.params.id)
                    .then((task) => {
                        if (!task) {
                            throw api.execTasks.NotFoundError();
                        }

                        res.result(api.execTasks.clearSystemFields(task));
                    })
                    .catch((error) => {
                        var ec = {
                            execTasks: api.execTasks.ErrorCodes
                        };

                        if (!error.checkable) {
                            return res.logServerError(error);
                        }

                        error.checkChain(res.logServerError)
                            .ifEntity(api.execTasks.entityName)
                            .ifCode(ec.execTasks.NOT_FOUND, res.notFound)
                            .end()
                            .check();

                    });
            }
        }

    }
};
