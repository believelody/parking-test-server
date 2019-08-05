import express from "express";
import Spot from "../model/Spot.mjs";

const router = express.Router();

const notFound = res => notFound(res)
const internalError = res => res.status(500).json('Something wrong!')

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
    const spot = await Spot.findByPk(req.body.id)

    if (spot) {
      const { userId } = req.body
      await spot.update({ userId })
      return res.json(`Spot °${spot.number} on floor ${spot.floor} is now assigned`)
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
    const spot = Spot.findOne({ where: {number, floor}})
    if (spot) {
      return res.status(403).json('This spot already exists')
    } else {
      await Spot.create(req.body)
      return res.json()      
    }
  } catch (error) {
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
