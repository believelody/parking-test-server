import express from "express";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from "../model/User.mjs";

const router = express.Router();

// const alreadyExist = res => res.status(401).json('This user already exists')
const errorHandled = (res, errors, status) => res.status(status).json(errors)
const internalError = res => res.status(500).json('Something wrong!')

router.post("/login", async (req, res) => {
  try {
    let errors = {};
    const { email, password } = req.body
    const user = await User.findOne({ where: { email }})
    if (!user) {
      errors.email = 'User not found'
      return errorHandled(res, errors, 404)
    }
    else {
      let match = await bcrypt.compare(password, user.password)
      if (!match) {
        errors.password = 'Incorrect password'
        return errorHandled(res, errors, 401)
      }
      else {
        const payload = { id: user.id, name: user.name }
        const token = await jwt.sign(payload, 'yeswecan', { expiresIn: 3600 * 24 })
        return res.json({ success: true, token: `Bearer ${token}`})
      }
    }
  } catch (error) {
    console.log(error)
    return internalError(res)
  }
});

router.post("/register", async (req, res) => {  
  try {
    let errors = {};
    console.log(req.body)
    const { name, email, password, car } = req.body
    const user = await User.findOne({ where: {email}})
    if (user) {
      errors.email = 'This email already exists'
      return errorHandled(res, errors, 401)
    }
    else {
      let salt = await bcrypt.genSalt(10)
      let hash = await bcrypt.hash(password, salt)
      const newUser = { name, email, password: hash, car, role: email === 'believelody@gmail.com' ? 'admin' : 'public' }
      await User.create(newUser)
      return res.json({msg: 'User successfully created'})
    }
  } catch (error) {
    console.log(error)
    return internalError(res)
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll()
    return res.json(users)
  } catch (error) {
    return internalError(res)
  }
})

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (user)
      return res.json(user)
    else
      return notFound(res, {notFound: 'This user doesn\'t exist'}, 404)
  } catch (error) {
    return internalError(res)
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.param
    const data = req.body
    const user = await User.findbyPl(id)
    if (user) {
      await user.update(data)
      return res.status(200).json('User info successfully updated')
    }
    else {
      return notFound(res, { notFound: 'This user doesn\'t exist' }, 404)
    }
  } catch (error) {
    return internalError(res)
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = User.findByPk(req.param.id)
    if (user) {
      await user.destroy()
      return res.status(200).json('User successfully deleted')
    }
    else {
      return notFound(res, { notFound: 'This user doesn\'t exist' }, 404)
    }
  } catch (error) {
    return internalError(res)
  }
})

export default router;
