# Scheduler

An appointment booking system

### Tech

Scheduler uses a number of open source projects to work properly:
* Front End
 * [BackboneJS] - MV* JS frameowrk
 * [RequireJS] - awesome web-based text editor
 * [Twitter Bootstrap] - great UI boilerplate for modern web apps
 * [jQuery] - duh
* Backend
 * [node.js] - evented I/O for the backend
 * [Express] - fast node.js network app framework [@tjholowaychuk]
 * [SequelizeJS] - an easy-to-use multi sql dialect ORM for Node.js & io.js
 * [MySQL] - duh
* Other
 * [ChaiJS] - a BDD / TDD assertion library for node and the browser
 * [MochaJS] - a feature-rich JavaScript test framework running on node.js and the browser

### Installation

You need [nodemon], [MochaJS], [Bower] installed globally:

```sh
$ npm install -g nodemon mocha bower
```
You will also need [MySQL] installed and change  the db config accordingly inside /config/env/

### Run the App
```sh
$ git clone https://github.com/diegofu/scheduler scheduler
$ cd scheduler
$ npm start
```
### Test the App
```sh
$ NODE_ENV=test mocha app/tests
```

[node.js]:http://nodejs.org
[Twitter Bootstrap]:http://twitter.github.com/bootstrap/
[jQuery]:http://jquery.com
[express]:http://expressjs.com
[AngularJS]:http://angularjs.org
[BackboneJS]:http://backbonejs.org
[RequireJS]:http://requirejs.org
[SequelizeJS]:http://sequelizejs.com
[MySQL]:https://www.mysql.com/
[ChaiJS]:http://chaijs.com/
[MochaJS]:http://mochajs.org/
[nodemon]:http://nodemon.io/
[Bower]:http://bower.io/