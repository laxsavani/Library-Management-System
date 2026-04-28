const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role, RoleData, OtpToken } = require('../models');
const { generateOtp } = require('../utils/otpGenerator');
const { sendWelcomeEmail, sendOtpEmail, sendPasswordResetEmail } = require('../utils/sendMail');
const { Op } = require('sequelize');
const { studentToken, resetToken } = require('../utils/token');
require('dotenv').config();


const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        const existingStudent = await User.findOne({ where: { email } });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Student already exists'
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashPassword
        });

        const studentRole = await Role.findOne({ where: { role_name: 'student' } });
        if (studentRole) {
            await RoleData.create({
                user_id: user.id,
                role_id: studentRole.id
            })
        }

        await sendWelcomeEmail(user);
        const token = studentToken(user);

        return res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            user,
            token
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            })
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        const token = studentToken(user);

        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const otp = generateOtp();
        const expires_at = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRE_MINUTES) || 10) * 60 * 1000);

        const [otpRecord, created] = await OtpToken.findOrCreate({
            where: { user_id: user.id },
            defaults: {
                otp,
                expires_at,
                is_used: false
            }
        });

        if (!created) {
            await otpRecord.update({
                otp,
                expires_at,
                is_used: false
            });
        }

        await sendOtpEmail(user, otp);

        return res.status(200).json({
            success: true,
            message: 'OTP sent to your email'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const otpRecord = await OtpToken.findOne({
            where: {
                user_id: user.id,
                otp,
                is_used: false,
                expires_at: { [Op.gt]: new Date() }
            }
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            })
        }

        otpRecord.is_used = true;
        await otpRecord.save();

        const token = resetToken(user);

        return res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { reset_token, new_password, confirm_password } = req.body;

        if (!reset_token || !new_password || !confirm_password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (new_password !== confirm_password) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(reset_token, process.env.JWT_SECRET);
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                message: 'Invalid reset token'
            });
        }

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        user.password = await bcrypt.hash(new_password, 10);
        await user.save();

        await sendPasswordResetEmail(user.email, user.name);

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
module.exports = {
    register,
    login,
    forgotPassword,
    verifyOtp,
    resetPassword
}