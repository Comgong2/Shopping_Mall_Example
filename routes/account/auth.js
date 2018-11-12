const express = require('express'),
  router = express.Router(),
  util = require('./auth.util');

router.get('/', (req, res) => {
  if (req.session.userid) return res.render('error', {error_message: '정상적인 접근이 아닙니다.', redirect_page: '/'});
  res.render('auth');
})

router.post('/register', (req, res) => {
  if (req.session.userid) return res.render('error', {error_message: '정상적인 접근이 아닙니다.', redirect_page: '/'});
  let body = req.body;

  util.register(body.userid, body.password, body.phone, body.address)
    .then(userid => {
      req.session.userid = userid;
      req.session.cart = []; // 수정 에정
      // res.status(200).json({result: 'ok'}); // for tdd;
      res.redirect('/');
    }).catch(err => {
      console.log(err);
      if (err.name === 'SequelizeUniqueConstraintError') return res.render('error', {error_message: '이미 존재하는 사용자입니다.', redirect_page: '/auth'});
      if (err.errors.ValidationErrorItem.message === 'Validation isEmail on userid failed') return res.render('error', {error_message: ' 사용자입니다.z', redirect_page: '/auth'});
      if (err.errors.ValidationErrorItem.message === 'Wrong Phone Number Type') return res.render('error', {error_message: '유효하지 않은 전화번호입니다.', redirect_page: '/auth'})
    });

});

router.post('/login', (req, res) => {
  if (req.session.userid) return res.render('error', {error_message: '정상적인 접근이 아닙니다.', redirect_page: '/'});
  let body = req.body;

  util.login(body.userid, body.password)
    .then(userid => {
      req.session.userid = userid;
      req.session.cart = []; // 수정 에정

      if (process.env.NODE_ENV === 'test') return res.status(200).json({result: 'ok', userid: req.session.userid});
      res.redirect('/');
    }).catch(err => {      console.error(err);
      if (err === 'Wrong password') return res.render('error', {error_message: '아이디나 비밀번호가 일치하지 않습니다.', redirect_page: '/auth'});
      if (err === 'No such user') return res.render('error', {error_message: '존재하지 않는 아이디입니다.', redirect_page: '/auth'});
    });
});

router.get('/logout', (req, res) => {
  if (!req.session.userid) return res.render('error', {error_message: '정상적인 접근이 아닙니다.', redirect_page: '/'});
  req.session.destroy((err) => {
    if (err) throw err;
  });
  res.redirect('/');
});

router.post('/validate/userid', (req, res) => {
  if (req.session.userid) return res.render('error', {error_message: '정상적인 접근이 아닙니다.', redirect_page: '/'});
  let userid = req.body.userid;

  let regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/;

  if (!userid.match(regex)) return res.send('올바른 이메일 형식이 아닙니다.');

  util.isUseridExist(userid)
    .then(userid => {
      if (userid.length < 1) return res.send('사용할 수 있는 아이디입니다.');
      res.send('사용할 수 없는 아이디입니다.');
    })
    .catch(err => {
      console.error(err);
    });
});

router.post('/validate/phone', (req, res) => {
  if (req.session.userid) return res.render('error', {error_message: '정상적인 접근이 아닙니다.', redirect_page: '/'});
  let phone = req.body.phone;

  let regex = /^\d{3}-\d{3,4}-\d{4}$/;

  if (!phone.match(regex)) return res.send('올바른 전화번호 형식이 아닙니다.');
  util.isPhoneExist(phone)
    .then(phone => {
      if (phone.length < 1) return res.send('사용할 수 있는 전화번호입니다.');
      res.send('사용할 수 없는 전화번호입니다.');
    })
    .catch(err => {
      console.error(err);
    });
});

module.exports = router;