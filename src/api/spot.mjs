import express from "express";
import Spot from "../model/Spot.mjs";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const spots = await Spot.findAll()
    return res.json(spots)
  } catch (error) {
    return res.status(500).json()
  }
})

router.get("/:id", async (req, res) => {
  try {
    const spot = await Spot.findBypl(req.param.id)
    if (spot) {
      return res.json(spot)
    }
  } catch (error) {
    return res.status(500).json()
  }
});

router.get("/search-free", async (req, res) => {
  try {
    const spots = await Spot.findAll({
      where: { isOccupied: false }
    })
    // const freeSpots = spots.filter(spot => !spot.isOccupied && spot).map(spot => spot)
    return res.json(spots)
  } catch (error) {
    return res.status(500).json()
  }
});

router.get("/search-by-user", async (req, res) => {
  try {
    const spot = await Spot.findOne({ where: { userId: req.query.user }})
    if (spot) {
      return res.json(spot)
    }
    else {
      return res.status(404).json('No spot found')
    }
  } catch (error) {
    return res.status(500).json()
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
    return res.status(500).json()
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
      return res.status(404).json('No spot found')
    }
  } catch (error) {
    return res.status(500).json()
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.param.id)
    if (spot) {
      await spot.destroy()
      return res.json()
    }
    else {
      return res.status(404).json('No spot found')
    }
  } catch (error) {
    return res.status(500).json()
  }
});

export default router;
