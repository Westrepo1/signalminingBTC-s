const express = require('express');
// const multer = require('multer');
const router = express.Router();

const userController = require('../controllers/userController');



router.get('/dashboard',userController.dashboardPage);

// router.get('/transfer/:id',userController.navbarPage);
// router.post('/transfer/:id',userController.navbarPage_Post );


router.get('/verify-account',userController.verifyPage);
router.get('/kyc-form', userController.kycPage)
router.post('/kyc-form/:id', userController.verifyPage_post);
// router.get('/paymentHistory/:id',userController.paymentHistoryPage);

//   Done *******************************//
router.get('/account-settings',userController.accountPage);
// router.post('/account-settings/:id',userController.editProfilePage_post);


router.get('/referuser',userController.affPage);

//   Done *******************************//
router.post('/livetrade/:id',userController.livePage_post);
router.get('/tradinghistory/:id', userController.tradingHistory)
//   Done *******************************//
router.get('/loan',userController.loanPage);
router.post('/loan/:id',userController.loanPage_post);
router.get('/viewloan/:id',userController.loanHistory);

//   Done *******************************//
router.get('/buy-copytrading', userController.copyPage);
router.post('/buy-copytrading/:id', userController.copyPage_post);
router.get('/buy-copytrading/:id', userController.copyHPage);


// done******************************//
router.get('/deposits', userController.depositPage);
router.post('/deposit/:id', userController.depositPage_post);
router.get('/depositHistory/:id',userController.depositHistory);

// done******************************//
router.get('/withdrawals/:id',userController.widthdrawPage);
router.post('/withdrawals/:id',userController.widthdrawPage_post);
router.get('/widthdrawHistory/:id',userController.widthdrawHistory);

// done******************************//
router.get('/signal', userController.signalPage)
router.post('/signal/:id', userController.signal_post)

// done******************************//
router.get('/buy-plan', userController.upgrade)
router.post('/buy-plan/:id', userController.upgrade_post)
router.get('/myplans/:id', userController.upgradeH_post)


// **********************TICKET *******************//
router.get('/support', userController.createTicket)
router.post('/support/:id', userController.createTicket_page)
// router.get('/my_t/:id', userController.mytickets)

module.exports = router;

