const router = require('express').Router();

// PHASE 3 - IMPORT RESTORE
// GET /api/restore-user
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

// // PHASE 1 - TEST API ROUTER
// router.post('/test', function(req, res) {
//     res.json({ requestBody: req.body });
//   });

// // PHASE 3 - TEST AUTH
// // GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//       where: {
//         username: 'Demo-lition'
//       }
//     });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

// // PHASE 3 - RESTORE USER
// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// // GET /api/require-auth
// const { requireAuth } = require('../../utils/auth.js');
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

module.exports = router;