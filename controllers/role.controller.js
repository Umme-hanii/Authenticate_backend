import Role from '../models/Role.js'

export const createRole = async (req, res, next) => {
  try {
    if (req.body.role && req.body.role !== '') {
      const newRole = await Role.create(req.body)
      return res.status(200).json(newRole)
    } else {
      return res.status(400).send('Bad Request')
    }
  } catch (error) {
    return res.status(500).send('Internal Server Error')
  }
}

export const updateRole = async (req, res) => {
  try {
    const roleId = req.params.id
    const updatedRole = await Role.findOne({ _id: roleId })
    if (updatedRole) {
      const newRole = await Role.findByIdAndUpdate(roleId, req.body, {
        new: true,
      })
      return res.status(200).json({ newRole })
    }
    res.status(404).send(`Role with id ${roleId} is not found`)
  } catch (error) {
    return res.status(400).send('Bad Request')
  }
}

export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find()
    if (roles) {
      res.status(200).json(roles)
    } else {
      res.status(404).send('Not Found')
    }
  } catch (error) {
    return res.status(400).send('Bad Request')
  }
}

export const getRole = async (req, res) => {
  try {
    const roleId = req.params.id
    const role = await Role.find({ _id: roleId })
    if (role) {
      return res.status(200).json(role)
    }
    res.status(404).send(`Role with ${roleId} is not found`)
  } catch (error) {
    return res.status(400).send('Bad Request')
  }
}

export const deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id
    const role = await Role.findOne({ _id: roleId })
    if (role) {
      const deletedRole = await Role.findByIdAndDelete(req.params.id)
      return res.status(200).json(deletedRole)
    }
    res.status(404).send(`Role with id ${roleId} is not found`)
  } catch (error) {
    return res.status(400).send('Bad Request')
  }
}
