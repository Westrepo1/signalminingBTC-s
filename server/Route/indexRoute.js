const express = require("express");

const router = express.Router();

const { homePage, aboutPage, contactPage, affliatePage, licensePage, faqPage, termsPage, startguidePage, registerPage, loginPage, register_post, login_post, loginAdmin, logout_get } = require("../controllers/userController");
const { loginAdmin_post } = require("../controllers/adminController");

router.get("/", homePage);

router.get("/about", aboutPage);

router.get("/contact", contactPage);

router.get("/faqs", faqPage);

router.get("/terms-condition", termsPage)

router.get("/services", startguidePage);

router.get("/terms", affliatePage);

router.get("/company-license", licensePage)

router.get("/register", registerPage);
router.post('/register',register_post);

router.get("/login", loginPage);
router.post('/login',login_post);

router.get('/loginAdminses', loginAdmin);
router.post('/loginAdmin', loginAdmin_post)

router.get('/logout', logout_get)









module.exports = router;
