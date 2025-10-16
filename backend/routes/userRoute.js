import express from "express";
import multer from 'multer';
import path from 'path';
import { Login, Register, bookmark, follow, getMyProfile, getOtherUsers, logout, unfollow, googleAuth, googleAuthStart, googleAuthCallback, me } from "../controllers/userController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();

// Reuse a local upload storage for profile images
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(process.cwd(), 'backend', 'uploads'));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	}
});
const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		if (!file.mimetype.startsWith('image/')) {
			return cb(new Error('Only image files are allowed'));
		}
		cb(null, true);
	}
});

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/google").post(googleAuth);
router.route("/google/start").get(googleAuthStart);
router.route("/google/callback").get(googleAuthCallback);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, me);
router.route("/bookmark/:id").put(isAuthenticated, bookmark)
router.route("/profile/:id").get(isAuthenticated, getMyProfile);
router.route("/otheruser/:id").get(isAuthenticated, getOtherUsers);
router.route("/follow/:id").post(isAuthenticated, follow);
router.route("/unfollow/:id").post(isAuthenticated, unfollow);
// upload avatar
router.route("/avatar").post(isAuthenticated, upload.single('avatar'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded' });
		}
		const relative = `/uploads/${req.file.filename}`;
		const updated = await (await import('../models/userSchema.js')).User.findByIdAndUpdate(
			req.user,
			{ $set: { avatar: relative } },
			{ new: true }
		).select('-password');
		return res.status(200).json({ message: 'Profile photo updated', user: updated, success: true });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Failed to update avatar' });
	}
});
// upload banner (header)
router.route("/banner").post(isAuthenticated, upload.single('banner'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded' });
		}
		const relative = `/uploads/${req.file.filename}`;
		const updated = await (await import('../models/userSchema.js')).User.findByIdAndUpdate(
			req.user,
			{ $set: { banner: relative } },
			{ new: true }
		).select('-password');
		return res.status(200).json({ message: 'Header updated', user: updated, success: true });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Failed to update header' });
	}
});
// update bio
router.route("/bio").post(isAuthenticated, async (req, res) => {
	try {
		const { bio } = req.body;
		const updated = await (await import('../models/userSchema.js')).User.findByIdAndUpdate(
			req.user,
			{ $set: { bio: (bio || '').toString().slice(0, 160) } },
			{ new: true }
		).select('-password');
		return res.status(200).json({ message: 'Bio updated', user: updated, success: true });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Failed to update bio' });
	}
});
// update location
router.route("/location").post(isAuthenticated, async (req, res) => {
	try {
		const { location } = req.body;
		const updated = await (await import('../models/userSchema.js')).User.findByIdAndUpdate(
			req.user,
			{ $set: { location: (location || '').toString().slice(0, 50) } },
			{ new: true }
		).select('-password');
		return res.status(200).json({ message: 'Location updated', user: updated, success: true });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Failed to update location' });
	}
});

export default router;