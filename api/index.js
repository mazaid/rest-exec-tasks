module.exports = (config, models, di) => {

    return new Promise((resolve, reject) => {

        var A = {
            ExecTasks: require('./ExecTasks'),
            ExecTaskExecutor: require('./Executor'),
            RestApiClient: require('maf/Rest/Client'),
        };

        var api = {};

        api.execTasks = new A.ExecTasks({}, models, api);
        api.execTaskExecutor = new A.ExecTaskExecutor(di.logger, {}, api);
        api.rest = new A.RestApiClient();

        for (var name in api) {
            if (di.debug && api[name].setDebugger) {
                api[name].setDebugger(di.debug);
            }
        }

        api.createTest = () => {

            return new Promise((resolve, reject) => {
                api.execTasks.createTest()
                    .then(() => {
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });

        };

        resolve(api);
    });

};
