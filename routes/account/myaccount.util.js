const crypto = require('crypto'),
  models = require('../../database/models');

function findUser (userid) {
  return new Promise((resolve, reject) => {
    models.User.findOne({
      where: { userid: userid },
      attributes: ['userid', 'phone', 'address']
    }).then(userInfo => {
      console.log(userInfo.userid+'찾음');
  
      let renderData = {
        userid: userInfo.userid,
        phone: userInfo.phone,
        address: userInfo.address
      }
  
      resolve(renderData);
    }).catch(err => {
      reject(err);
    })
  });
}

function changePassword (userid, oldPassword, newPassword) {
  return new Promise((resolve, reject) => {
    models.User.findOne({
      where: {userid: userid}
    }).then(userInfo => {
      let hashed_password = crypto.createHash("sha512").update(oldPassword + userInfo.salt).digest("hex");

      if (userInfo.password_hash !== hashed_password) {
        let errRenderData = {
          userid: userInfo.userid,
          phone: userInfo.phone,
          address: userInfo.address
        }
        errRenderData.err = 'Wrong password';
        reject(errRenderData);
      }
      
      let renderData = {
        userid: userInfo.userid,
        salt: userInfo.salt                                                                                                                                                                                            
      }
  
      return renderData;
    }).then(userInfo => {
      let newpassword_hash = crypto.createHash("sha512").update(newPassword + userInfo.salt).digest("hex");
  
      models.User.update({
        password_hash: newpassword_hash
      }, {
        where: {
          userid: userid
        }
      }).then(userInfo => {
        let renderData = {
          userid: userInfo.userid,
          phone: userInfo.phone,
          address: userInfo.address
        }
        resolve(renderData);
      }).catch(err => {
        reject(err);
      });
    });
  })
}

module.exports = { findUser, changePassword };