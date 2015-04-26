'use strict';

module.exports = {
    db: {
        username: "root",
        password: "root",
        database: "scheduler_development",
        options: {
            host: "127.0.0.1",
            dialect: "mysql",
            logging: console.log
        }
    }
};