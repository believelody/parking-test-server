import Sequelize from 'sequelize'
import sequelize from '../db'
import Spot from './Spot.mjs';

const User = sequelize.define('user', {
  name: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, validate: { isEmail: true } },
  password: { type: Sequelize.STRING, allowNull: false },
  role: { type: Sequelize.STRING, defaultValue: 'public' },
  car: { type: Sequelize.STRING, allowNull: false }
})

export default User