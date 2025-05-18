
const express = require('express');

const router = express.Router();

const adminController = require('../controllers/adminController');

//************************************* */  Admin Dashboard  routes**********************//

router.get('/adminRoustes',adminController.adminPage );

router.get("/adminnavbarPage", adminController.adminNavbarPage)

router.get('/viewUser/:id',adminController.viewUser );

router.get('/editUser/:id',adminController.editUser );

router.put('/editUser/:id', adminController.editUser_post);

router.post('/generateOTP/:id', adminController.generateOTP);

// //************************************* */ All Deposits  routes**********************//

router.get('/allFunding',adminController.allDeposit );

router.get('/viewDeposit/:id',adminController.viewDeposit );

router.get('/editDeposit/:id',adminController.editDeposit);

router.put('/editDeposit/:id',adminController.editDeposit_post );

// //************************************* */ All Widthdrawals  routes**********************//

router.get('/allWidthdrawals',adminController.allWidthdrawal );

router.get('/viewWidthdrawals/:id',adminController.viewWidthdrawal );

router.get('/editWidthdrawals/:id',adminController.editWidthdrawal );
router.put('/editWidthdrawals/:id',adminController.editWidthdrawal_post );

// //************************************* */ All Verification routes**********************//
router.get('/allVerify',adminController.allVerification );
router.get('/viewVerify/:id',adminController.viewVerify);

// //************************************* */ All live trades routes**********************//
router.get("/allLivetrades", adminController.alllivetradePage)
router.get("/view-livetrade/:id", adminController.viewlivetradePage)
router.get("/edit-livetrade/:id", adminController.editlivetradePage)
router.put('/editlivetrade/:id',adminController.editLivetrade_post );

// //************************************* */ All Account Upgrades routes**********************//
router.get("/allPlan", adminController.allupgradesPage)
router.get("/viewUpgrade/:id", adminController.viewUprgadesPage)
router.get("/editUpgrade/:id", adminController.editUpgradesPage);
router.put('/editUpgrade/:id',adminController.editUpgrade_post );

// //************************************* */ All Tickets**********************//
router.get("/allSupport", adminController.allTTicketPage)
router.get("/viewTickets/:id", adminController.viewTicketPage)

// //************************************* */ All Copytrades**********************//
router.get("/allCopytrades", adminController.allCopytrades)
router.get("/viewCopytrades/:id", adminController.viewCopytrades)

//************************************* */ All Signal**********************//
router.get("/allSignal", adminController.allSignal)
router.get("/viewSignal/:id", adminController.viewSignal)

// //************************************* */ All Loans**********************//
router.get("/allLoan", adminController.allLoan)
router.get("/viewallLoan/:id", adminController.viewLoan)
router.get("/editLoan/:id", adminController.editLoanPage);
router.put("/editLoan/:id", adminController.editLoanPage_Post)


// //************************************* */ All Delete routes**********************//
router.delete('/deleteUser/:id', adminController.deletePage);
router.delete('/deleteDeposit/:id', adminController.deleteDeposit);
router.delete('/deleteWidthdrawal/:id', adminController.deleteWidthdraw)
router.delete('/deleteVerification/:id', adminController.deleteVerification)
router.delete("/deletelivetrade/:id", adminController.deleteLivetrade)
router.delete("/deleteUpgrade/:id", adminController.deleteUpgrade)

router.delete('/deleteCopy/:id', adminController.deleteCopy)
router.delete("/deleteLoan/:id", adminController.deleteLoan)
router.delete("/deleteSignal/:id", adminController.deleteSignal)

module.exports = router;
