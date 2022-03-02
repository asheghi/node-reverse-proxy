const {comparePassword, hashPassword} = require("../../lib/common-utils");
const {db} = require("../../lib/database");


module.exports.AuthService = {};
module.exports.AuthService.login = async (email, password) => {
  const user = db.users.find(it => it.email === email)
  if (user) {
    const result = comparePassword(user.password, password);
    return result ? user : null;
  }
  await new Promise((r) => {
    setTimeout(r, 500 + (Math.random() * 500));
  });
  return null;
};
module.exports.AuthService.setupAdminUser = async (email, password) => {
  const [hasSetup] = db.users;
  if (hasSetup) return false;

  return db.users.push({
    data: {
      email,
      password: hashPassword(password),
    },
  });
};
