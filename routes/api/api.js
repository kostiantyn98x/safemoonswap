const sql = require("../../config/mySql");

exports.userQuery = function(adminEmail) {
  return new Promise(function (resolve, reject) {
    sql.query(`SELECT * FROM admins where adminEmail = '${adminEmail}'`, function (err, results, fields) {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};