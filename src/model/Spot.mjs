import Sequelize from 'sequelize'
import sequelize from '../db'
import User from './User.mjs';

const Spot = sequelize.define('spot', {
  number: { type: Sequelize.INTEGER, allowNull: false },
  floor: { type: Sequelize.INTEGER, allowNull: false },
  occupancy: { type: Sequelize.BOOLEAN, defaultValue: false },
  occupied: { type: Sequelize.STRING, allowNull: false },
})

export default Spot