const router = require('express').Router();

// PHASE 1 - TEST API ROUTER
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });





module.exports = router;