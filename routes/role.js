import express from 'express'
import {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole,
  getRole,
} from '../controllers/role.controller.js'

const router = express.Router()

router.route('/').post(createRole).get(getAllRoles)
router.route('/:id').put(updateRole).delete(deleteRole).get(getRole)

export default router
