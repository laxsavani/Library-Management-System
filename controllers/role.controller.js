const { Role, RoleData, User } = require('../models');

const getAllRoles = async (req, res) => {
    try {
        const roles = await RoleData.findAll({
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'role_name']
                },
            ]
        });
        return res.status(200).json({
            success: true,
            message: 'Roles fetched successfully',
            data: roles
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const assignRole = async (req, res) => {
    try {
        const { user_id, role_id } = req.body;
        if (!user_id || !role_id) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            })
        }

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const role = await Role.findByPk(role_id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            })
        }

        const existing = await RoleData.findOne({
            where: {
                user_id: user_id
            }
        });

        if (existing) {
            if (existing.role_id === role_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Role already assigned'
                });
            }

            await RoleData.destroy({
                where: {
                    user_id: user_id
                }
            });
        }

        const roleData = await RoleData.create({
            user_id: user_id,
            role_id: role_id
        });

        return res.status(200).json({
            success: true,
            message: existing ? 'Role updated successfully' : 'Role assigned successfully',
            data: roleData
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getAllRoles,
    assignRole
}