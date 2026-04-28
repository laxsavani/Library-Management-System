const { User, BorrowRecord, Book, Fine, RoleData, Role } = require('../models');

const getAllStudents = async (req, res) => {
    const studentRole = await Role.findOne({ where: { role_name: 'student' } });
    if (!studentRole) {
        return res.status(404).json({
            success: false,
            message: 'Student role not found'
        });
    }

    const studentRoleData = await RoleData.findAll({ where: { role_id: studentRole.id } });
    const studentIds = studentRoleData.map((rd) => rd.user_id);

    const students = await User.findAll({
        where: { id: studentIds },
        attributes: { exclude: ['password'] },
        include: [
            {
                model: BorrowRecord,
                as: 'borrowRecords',
                include: [{ model: Book, as: 'book', attributes: ['id', 'title', 'author'] }],
            },
        ],
    });

    res.status(200).json({
        success: true,
        message: 'Students fetched successfully',
        data: students
    });
}

const getStudentById = async (req, res) => {
    try {
        const studentRole = await Role.findOne({ where: { role_name: 'student' } });
        const student = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: BorrowRecord,
                    as: 'borrowRecords',
                    include: [{ model: Book, as: 'book', attributes: ['id', 'title', 'author'] }],
                }
            ],
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const isStudent = await RoleData.findOne({
            where: { user_id: student.id, role_id: studentRole.id }
        });

        if (!isStudent) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. This user is not a student.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student fetched successfully',
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching student',
            error: error.message
        });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const studentRole = await Role.findOne({ where: { role_name: 'student' } });
        const student = await User.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const isStudent = await RoleData.findOne({
            where: { user_id: student.id, role_id: studentRole.id }
        });

        if (!isStudent) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only students can be deleted through this endpoint.'
            });
        }

        await student.destroy();

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting student',
            error: error.message
        });
    }
}

module.exports = {
    getAllStudents,
    getStudentById,
    deleteStudent
};