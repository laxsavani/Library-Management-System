const { RoleData, Role } = require('../models');

const rbac = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      const roleData = await RoleData.findOne({
        where: { user_id: userId },
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['role_name'],
          },
        ],
      });

      if (!roleData || !roleData.role) {
        return res.status(403).json({ message: 'No role assigned. Access forbidden.' });
      }

      const userRole = roleData.role.role_name;
      req.userRole = userRole;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: `Access forbidden. Required roles: ${allowedRoles.join(', ')}. Your role: ${userRole}`,
        });
      }

      next();
    } catch (err) {
      console.error('RBAC Error:', err);
      return res.status(500).json({ message: 'Role check failed.', error: err.message });
    }
  };
};

module.exports = rbac;