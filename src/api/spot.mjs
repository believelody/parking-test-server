import express from "express";
import Spot from "../model/Spot.mjs";

const router = express.Router();

const notFound = res => res.status(404).json('Spot not found')
const internalError = res => res.status(500).json({msg: 'Something wrong!'})

router.get("/free", async (req, res) => {
  try {
    const spots = await Spot.findAll({
      where: { occupancy: false }
    })
    return res.json(spots)
  } catch (error) {
    return internalError(res)
  }
});

router.get("/search-by-user", async (req, res) => {
  try {
    const spot = await Spot.findOne({ where: { userId: req.query.user }})
    if (spot) {
      return res.json(spot)
    }
    else {
      return notFound(res)
    }
  } catch (error) {
    return internalError(res)
  }
});

router.put('/assign/:id', async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.id)
    console.log(spot)
    if (spot) {
      const { userId } = req.body
      await spot.update({ userId, occupancy: userId ? true : false, occupied: userId ? "yes" : "no" })
      return res.json({
        msg: userId ? `Spot °${spot.number} on floor ${spot.floor} is now assigned` : `Spot °${spot.number} is now free`
      })
    }
    else {
      return notFound(res)
    }
  } catch (error) {
    return internalError(res)
  }
})

router.get('/', async (req, res) => {
  try {
    const spots = await Spot.findAll()
    return res.json(spots)
  } catch (error) {
    return internalError(res)
  }
})

router.get("/:id", async (req, res) => {
  try {
    const spot = await Spot.findBypl(req.param.id)
    if (spot) {
      return res.json(spot)
    }
    else {
      return notFound(res)
    }
  } catch (error) {
    return internalError(res)
  }
});

router.post("/", async (req, res) => {
  try {
    const { number, floor } = req.body
    const spot = await Spot.findOne({ where: {number, floor}})
    if (spot) {
      return res.status(403).json({msg: 'This spot already exists'})
    } else {
      await Spot.create({ number, floor, occupancy: false, occupied: 'no' })
      return res.json({msg: 'Spot successfully created'})      
    }
  } catch (error) {
    console.log(error)
    return internalError(res)
  }
});

router.put("/:id", async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.param.id)
    if (spot) {
      const { userId } = req.body
      await spot.update({ where: { userId }})
      return res.json()
    }
    else {
      return notFound(res)
    }
  } catch (error) {
    return internalError(res)
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.param.id)
    if (spot) {
      await spot.destroy()
      return res.json('Spot successfully deleted')
    }
    else {
      return notFound(res)
    }
  } catch (error) {
    return internalError(res)
  }
});

export default router;
