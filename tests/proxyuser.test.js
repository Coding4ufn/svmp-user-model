/*
 * Copyright 2014 The MITRE Corporation, All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this work except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * author Dave Bryson
 *
 */
'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose');

// Load User
var ProxyUser = require('..');

describe('ProxyUser Tests:', function () {

    before(function (done) {

        if (!mongoose.connection.db) {
            var dbname = 'mongodb://localhost/svmp_commmon_test_db';
            mongoose.connect(dbname);
        }

        var approvedUser = new ProxyUser({
            username: 'bob',
            password: 'bobbobbob',
            email: 'bob@here.com',
            approved: true
        });

        var pendingUser = new ProxyUser({
            username: 'carl',
            password: 'carlcarlcarl',
            email: 'carl@here.com',
            roles: ['admin']
        });

        approvedUser.save(function (e, o) {
            pendingUser.save(function (e1, o1) {
                done();
            })
        })
    });

    describe('Read Users', function () {
        it('should have 2 users', function (done) {
            return ProxyUser.listAllUsers().then(function (r) {
                r.length.should.be.exactly(2);
                done();
            });
        });

        it('should be 1 approved user', function (done) {
            return ProxyUser.listApprovedUsers()
                .then(function (r) {
                    r.length.should.be.exactly(1);
                    done();
                });
        });

        it('should be 1 pending users', function (done) {
            return ProxyUser.listPendingUsers()
                .then(function (r) {
                    r.length.should.be.exactly(1);
                    done();
                });
        });

        it('should find user by username', function (done) {
            return ProxyUser.findUser('bob').then(function (r) {
                r.email.should.equal('bob@here.com');
                done();
            })
        });
    });

    describe('Creating/Update Users', function () {
        it('should fail email validation', function (done) {
            return ProxyUser.create({username: 'dave', password: 'davedavedave'})
                .then(function (r) {
                    (r === null).should.be.true;
                    done();
                }, function (err) {
                    err.errors.email.message.should.equal('Please enter your email address');
                    done();
                });
        });

        it('should fail on duplicate username', function (done) {
            return ProxyUser.create({username: 'bob', password: 'kdkdkdkdkdk', email: 'bbb@here.com'})
                .then(function (r) {
                }, function (err) {
                    should.exist(err);
                    done();
                });
        });

        it('should require a password with at least 8 characters', function (done) {
            return ProxyUser.create({username: 'tim', password: 'aa', email: 'tim@here.com'})
                .then(function (ok) {
                }, function (err) {
                    err.errors.password.message.should.equal('Password should be at least 8 characters');
                    done();
                });
        });

        it('should update a User', function (done) {
            return ProxyUser.create({username: 'jim', password: 'usususususu', email: 'jim@here.com'}, function (err, u1) {
                u1.should.be.ok;
                u1.device_type = 'nexus7';
                u1.save(function (err1, u2) {
                    u2.device_type.should.equal('nexus7');
                    u2.created.should.be.an.instanceOf(Date);
                    done();
                });
            });
        });
    });

    describe('Authentication', function () {
        it('should authenticate a valid user', function (done) {
            return ProxyUser.findUser('bob').then(function (u) {
                u.authenticate('bobbobbob').should.be.true;
                done();
            });
        });

        it('should fail authentication on bad password', function (done) {
            return ProxyUser.findUser('bob').then(function (u) {
                u.authenticate('aaaaaaa').should.be.false;
                done();
            })
        });
    });

    describe('Check User role', function () {
        it('should get user role', function (done) {
            return ProxyUser.findUser('bob').then(function (u) {
                u.getRole().should.be.equal('user');
                u.isAdmin().should.be.false;
                done();
            });
        });

        it('should handle isAdmin()', function(done) {
           return ProxyUser.findUser('carl').then(function(u){
               u.isAdmin().should.be.true;
               done();
           });
        });
    });

    after(function (done) {
        ProxyUser.remove().exec().then(function () {
            if (mongoose.connection) {
                mongoose.connection.close();
            }
            done();
        });
    });
});