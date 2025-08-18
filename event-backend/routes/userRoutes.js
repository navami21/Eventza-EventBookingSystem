const express=require('express')
const router=express.Router()
require('dotenv').config()
const User=require('../model/userData')
const generateToken=require('../utils/generateToken')
const {protect,adminOnly}=require('../middleware/auth')
const bcrypt=require('bcrypt')

//user signup
router.post('/signup',async(req,res)=>{
    const {name,email,password, securityQuestion, securityAnswer}=req.body;
    
    try{
        const exists=await User.findOne({email});
        if(exists) return res.status(400).json({message:'Email already registered'})
        const user=await User.create({name,email,password,role:'user',securityQuestion,securityAnswer})
        const token=generateToken(user);
        res.status(201).json({token,user:{id:user._id,name:user.name,role:user.role}})
    } catch(err){
        res.status(500).send({message:err.message})
    }
})
// Controller signup (will be pending approval)
router.post('/controller/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const controller = await User.create({ name, email, password, role: 'controller', approved: false });

    res.status(201).json({ message: 'Signup successful. Awaiting admin approval.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unified login for all roles
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Controllers must be approved by the admin
    if (user.role === 'controller' && !user.approved) {
      return res.status(403).json({ message: 'Controller not approved yet' });
    }

    const token = generateToken(user);
    res.json({
      token,
        role: user.role
      
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
const crypto = require('crypto');
const nodemailer = require('nodemailer');

router.post('/forgot-password/request', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 3600000; 

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
      to: email,
      subject: 'Password Reset',
      html: `Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/forgot-password/reset', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    const user = await User.findOne({ 
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() } // token not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    user.password =newPassword;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.json({ message: 'Password reset successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




// Get all controllers who are not yet approved
router.get('/pending-controllers', protect, adminOnly, async (req, res) => {
  try {
    const pendingControllers = await User.find({ role: 'controller', approved: false });
    res.json(pendingControllers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// POST request to approve a controller
router.post('/approve-controller/:id', protect, adminOnly, async (req, res) => {
  try {
    const controller = await User.findById(req.params.id);

    if (!controller || controller.role !== 'controller') {
      return res.status(404).json({ message: 'Controller not found' });
    }

    controller.approved = true;
    await controller.save();

    res.json({ message: 'Controller approved successfully', controller: {
      id: controller._id,
      name: controller.name,
      email: controller.email,
      approved: controller.approved
    }});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/controllers', protect, adminOnly, async (req, res) => {
  try {
    const controllers = await User.find(
      { role: 'controller', approved: true },
      '_id name email' // return only necessary fields
    );
    res.json(controllers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Reject controller request (delete user)
router.delete('/reject-controller/:id', protect, adminOnly, async (req, res) => {
  try {
    const controller = await User.findById(req.params.id);
    if (!controller || controller.role !== 'controller' || controller.approved) {
      return res.status(404).json({ message: 'Controller not found or already approved' });
    }

    await controller.deleteOne();
    res.json({ message: 'Controller rejected and removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports=router