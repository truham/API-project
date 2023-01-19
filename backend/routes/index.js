const express = require('express');
const router = express.Router();

// PHASE 1 - API ROUTES
const apiRouter = require('./api');


// PHASE 0
// // test route
// router.get('/hello/world', function(req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });

// Add a XSRF-TOKEN cookie // resets the token each visit/refresh
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

// PHASE 1 - API ROUTES
router.use('/api', apiRouter);

module.exports = router;