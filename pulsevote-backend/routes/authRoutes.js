const express = require("express");
const { body } = require('express-validator');
const { register, login } = require("../controllers/authController");
const router = express.Router();

const emailChecks = body('email')
	.isEmail().withMessage('Email must be valid')
	.normalizeEmail();

const passwordChecks = body('password')
	.isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
	.matches(/[A-Za-z]/).withMessage('Password must include a letter')
	.matches(/\d/).withMessage('Password must include a number')
	.trim()
	.escape();

router.post('/register', [emailChecks, passwordChecks], register);

router.post(
	'/login',
	[
		emailChecks,
		body('password')
			.notEmpty().withMessage('Password is required')
			.trim()
			.escape()
	],
	login
);

module.exports = router;
