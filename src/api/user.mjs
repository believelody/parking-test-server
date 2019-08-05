import express from "express";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from "../model/User.mjs";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    let errors;
    const { email, password } = req.body
    const user = User.findOne({ where: { email }})
    if (!user) {
      errors.email = 'User not found'
      return res.status(400).json(errors)
    }
    else {
      let match = await bcrypt.compare(password, user.password)
      if (!match) {
        errors.password = 'Incorrect password'
        return res.status(400).json(errors)
      }
      else {
        const payload = { id: user.id, name: user.name }
        const token = await jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 * 24 })
        return res.json({ success: true, token: `Bearer ${token}`})
      }
    }
  } catch (error) {
    return res.status(500).json(error)
  }
});

router.post("/register", async (req, res) => {  
  try {
    let errors;
    const { name, email, password, car } = req.body
    const user = await User.findOne({ where: {email}})
    if (user) {
      errors.email = 'This email already exists'
      return res.status(400).json(errors)
    }
    else {
      let salt = await bcrypt.genSalt(10)
      let hash = await bcrypt.hash(password, salt)
      const newUser = { name, email, password: hash, car, role: email === 'believelody@gmail.com' ? 'admin' : 'public'}
      await User.create(newUser)
      return res.json()
    }
  } catch (error) {
    return res.status(500).json(error)
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll()
    return res.json(users)
  } catch (error) {
    return res.status(500).json(error)
  }
})

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.param.id)
    if (user)
      return res.json(user)
    else
      return res.status(400).json('User doesn\'t exist')
  } catch (error) {
    return res.status(500).json(error)
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.param
    const data = req.body
    const user = await User.findbyPl(id)
    if (user) {
      await user.update(data)
      return res.status(200).json()
    }
    else {
      return res.status(400).json('This user doesn\'t exists')
    }
  } catch (error) {
    return res.status(500).json(error)
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = User.findByPk(req.param.id)
    if (user) {
      await user.destroy()
      return res.status(200).json()
    }
    else {
      return res.status(400).json('This user doesn\'t exists')
    }
  } catch (error) {
    return res.status(500).json(error)
  }
})

export default router;
