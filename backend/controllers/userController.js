import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        // basic validation
        if (!name || !username || !email || !password) {
            return res.status(401).json({
                message: "All fields are required.",
                success: false
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "User already exist.",
                success: false
            })
        }
        const hashedPassword = await bcryptjs.hash(password, 16);

        await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required.",
                success: false
            })
        };
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorect email or password",
                success: false
            });
        }
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });
        return res.status(201).cookie("token", token, { maxAge: 24*60*60*1000, httpOnly: true, sameSite: 'lax', path: '/' }).json({
            message: `Welcome back ${user.name}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = (req, res) => {
    return res.cookie("token", "", { maxAge: 0, path: '/', sameSite: 'lax' }).json({
        message: "user logged out successfully.",
        success: true
    })
}

export const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ message: 'Missing idToken', success: false });
        }
        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId) {
            return res.status(500).json({ message: 'Missing GOOGLE_CLIENT_ID on server', success: false });
        }
        const client = new OAuth2Client(clientId);
        const ticket = await client.verifyIdToken({ idToken, audience: clientId });
        const payload = ticket.getPayload();
        const email = payload?.email;
        const name = payload?.name || email?.split('@')[0] || 'User';
        const picture = payload?.picture || null;

        if (!email) {
            return res.status(401).json({ message: 'Unable to verify Google identity', success: false });
        }

        let user = await User.findOne({ email });
        if (!user) {
            // Create a username based on email; ensure uniqueness
            let base = (name || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 15) || 'user';
            let candidate = base;
            let i = 1;
            while (await User.findOne({ username: candidate })) {
                candidate = `${base}${i++}`.slice(0, 20);
            }
            const randomPass = await bcryptjs.hash(Math.random().toString(36).slice(2), 16);
            user = await User.create({
                name,
                username: candidate,
                email,
                password: randomPass,
                avatar: picture
            });
        }

        const tokenData = { userId: user._id };
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });
        return res
            .status(200)
            .cookie("token", token, { maxAge: 24*60*60*1000, httpOnly: true, sameSite: 'lax', path: '/' })
            .json({ message: `Welcome ${user.name}`, user, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Google auth failed', success: false });
    }
}

export const bookmark = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId);
        if (user.bookmarks.includes(tweetId)) {
            // remove
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Removed from bookmarks."
            });
        } else {
            // bookmark
            await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Saved to bookmarks."
            });
        }
    } catch (error) {
        console.log(error);
    }
};
export const getMyProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        return res.status(200).json({
            user,
        })
    } catch (error) {
        console.log(error);
    }
};

export const getOtherUsers = async (req,res) =>{ 
    try {
         const {id} = req.params;
         const otherUsers = await User.find({_id:{$ne:id}}).select("-password");
         if(!otherUsers){
            return res.status(401).json({
                message:"Currently do not have any users."
            })
         };
         return res.status(200).json({
            otherUsers
        })
    } catch (error) {
        console.log(error);
    }
}

export const follow = async(req,res)=>{
    try {
        const loggedInUserId = req.body.id; 
        const userId = req.params.id; 
        const loggedInUser = await User.findById(loggedInUserId);//patel
        const user = await User.findById(userId);//keshav
        if(!user.followers.includes(loggedInUserId)){
            await user.updateOne({$push:{followers:loggedInUserId}});
            await loggedInUser.updateOne({$push:{following:userId}});
        }else{
            return res.status(400).json({
                message:`User already followed to ${user.name}`
            })
        };
        return res.status(200).json({
            message:`${loggedInUser.name} just follow to ${user.name}`,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
export const unfollow = async (req,res) => {
    try {
        const loggedInUserId = req.body.id; 
        const userId = req.params.id; 
        const loggedInUser = await User.findById(loggedInUserId);//patel
        const user = await User.findById(userId);//keshav
        if(loggedInUser.following.includes(userId)){
            await user.updateOne({$pull:{followers:loggedInUserId}});
            await loggedInUser.updateOne({$pull:{following:userId}});
        }else{
            return res.status(400).json({
                message:`User has not followed yet`
            })
        };
        return res.status(200).json({
            message:`${loggedInUser.name} unfollow to ${user.name}`,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const googleAuthStart = async (req, res) => {
    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI;
        if (!clientId || !clientSecret || !redirectUri) {
            return res.status(500).json({ message: 'Missing Google OAuth env vars', success: false });
        }
        const returnTo = req.query.returnTo || `http://localhost:3000/`;
        const state = encodeURIComponent(returnTo);
        const oAuth2Client = new OAuth2Client({ clientId, clientSecret, redirectUri });
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: ['openid', 'email', 'profile'],
            include_granted_scopes: true,
            state
        });
        return res.redirect(url);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to start Google auth', success: false });
    }
}

export const googleAuthCallback = async (req, res) => {
    try {
        const code = req.query.code;
        const state = req.query.state ? decodeURIComponent(req.query.state) : `http://localhost:3000/`;
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI;
        if (!clientId || !clientSecret || !redirectUri) {
            return res.status(500).json({ message: 'Missing Google OAuth env vars', success: false });
        }
        if (!code) {
            return res.redirect(state);
        }
        const oAuth2Client = new OAuth2Client({ clientId, clientSecret, redirectUri });
        const { tokens } = await oAuth2Client.getToken(code);
        const idToken = tokens.id_token;
        if (!idToken) {
            return res.redirect(state);
        }
        const ticket = await oAuth2Client.verifyIdToken({ idToken, audience: clientId });
        const payload = ticket.getPayload();
        const email = payload?.email;
        const name = payload?.name || email?.split('@')[0] || 'User';
        const picture = payload?.picture || null;
        if (!email) {
            return res.redirect(state);
        }

        let user = await User.findOne({ email });
        if (!user) {
            let base = (name || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 15) || 'user';
            let candidate = base;
            let i = 1;
            while (await User.findOne({ username: candidate })) {
                candidate = `${base}${i++}`.slice(0, 20);
            }
            const randomPass = await bcryptjs.hash(Math.random().toString(36).slice(2), 16);
            user = await User.create({
                name,
                username: candidate,
                email,
                password: randomPass,
                avatar: picture
            });
        }

        const tokenData = { userId: user._id };
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { maxAge: 24*60*60*1000, httpOnly: true, sameSite: 'lax', path: '/' });
        return res.redirect(state);
    } catch (err) {
        console.error(err);
        // best effort: redirect back home
        const fallback = `http://localhost:3000/`;
        return res.redirect(fallback);
    }
}

export const me = async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found', success: false });
        return res.status(200).json({ user, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to fetch current user', success: false });
    }
}