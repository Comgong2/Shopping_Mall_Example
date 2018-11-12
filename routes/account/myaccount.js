const express = require('express'),
  router = express.Router(),
  formidable = require('formidable'),
  multiparty = require('multiparty'),
  path = require('path'),
  util = require('./myaccount.util');

router.get('/', (req, res) => {
  if (!req.session.userid) return res.render('error', {error_message: '로그인을 먼저 해주세요.', redirect_page: '/auth'});

  util.findUser(req.session.userid)
    .then(userInfo => {
      if (process.env.NODE_ENV === 'test') return res.status(200).json(userInfo);
      req.flash('status', false);
      userInfo.status = req.flash('status');
      res.render('myaccount', userInfo);
    })
});

router.post('/changePassword', (req, res) => {
  if (!req.session.userid) return res.render('error', {error_message: '로그인을 먼저 해주세요.', redirect_page: '/auth'});

  let body = req.body;
  if (body.new_password !== body.confirm_password) return res.redirect('/myaccount');
  util.changePassword(req.session.userid, body.old_password, body.new_password)
    .then(userInfo => {
      req.flash('status', '비밀번호가 변경되었습니다.');
      userInfo.status = req.flash('status');
      res.render('myaccount', userInfo);
    }).catch(errRenderData => {
      if (errRenderData.err === 'Wrong password') {
        req.flash('status', '기존 비밀번호가 틀립니다.');
        errRenderData.status = req.flash('status');
        res.render('myaccount', errRenderData);
      } 
    })
});

module.exports = router;