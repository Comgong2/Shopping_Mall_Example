const crypto = require('crypto'),
  models = require('../../database/models');

function register (userid, password, phone, address) {
  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashed_password = crypto.createHash("sha512").update(password + salt).digest("hex");

  return new Promise((resolve, reject) => {
    models.User.create({
      userid: userid,
      password_hash: hashed_password,
      salt: salt,
      phone: phone,
      address: address,
      attributes: ['userid'],
    }).then(userid => {
      console.log('데이터 추가 완료');
  
      resolve(userid);
    }).catch(err => {
      reject(err);
    });
  });

}

function login (userid, password) {
  return new Promise((resolve, reject) => {
    models.User.findOne({
      where: {userid: userid},
      attributes: ['userid', 'password_hash', 'salt']
    }).then(userInfo => {
      if (userInfo === null) reject('No such user')
      let hashed_password = crypto.createHash("sha512").update(password + userInfo.salt).digest("hex");
      if (userInfo.password_hash !== hashed_password) reject('Wrong password')
  
      resolve(userInfo.userid);
    }).catch(err => {
      reject(err);
    });
  });
  
}

function isUseridExist (userid) {
  return new Promise((resolve, reject) => {
    models.User.findAll({
      where: {userid: userid},
      attributes: ['userid']
    }).then(userid => {
      console.log(userid)
      resolve(userid); //사용자가 존재하면 error (기존과 반대)
    }).catch(err => {
      reject(err); // 사용자가 없어야지 success
    })
  })
}

function isPhoneExist (phone) {
  return new Promise((resolve, reject) => {
    models.User.findAll({
      where: {phone: phone},
      attributes: ['phone']
    }).then(phone => {
      console.log(phone)
      resolve(phone); //사용자가 존재하면 error (기존과 반대)
    }).catch(err => {
      reject(err); // 사용자가 없어야지 success
    })
  })
}

module.exports = { register, login, isUseridExist, isPhoneExist };