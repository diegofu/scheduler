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
    },
    google: {
        clientID: process.env.GOOGLE_ID || '188872170464-q44fr43ptithd868f76g0d3jkbq0r7up.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_SECRET || 'ExWGEoFy7bPG81IV7FiFJVcC',
        callbackURL: '/auth/google/callback'
    },
};