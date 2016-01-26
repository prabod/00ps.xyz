'use strict';

exports.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
exports.mongodb = {
  uri: process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/oops'
};
exports.cryptoKey = 'k3yb0ardc4t';
