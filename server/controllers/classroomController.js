import Classroom from '../models/Classroom.js';
import User from '../models/User.js';

// @desc    Create a new classroom
// @route   POST /api/classrooms
// @access  Private/Teacher
export const createClassroom = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const classroom = await Classroom.create({
            name,
            description,
            teacher: req.user._id
        });

        // Add classroom to teacher's record
        await User.findByIdAndUpdate(req.user._id, {
            $push: { classrooms: classroom._id }
        });

        res.status(201).json({
            success: true,
            data: classroom
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Join a classroom via invite code
// @route   POST /api/classrooms/join
// @access  Private
export const joinClassroom = async (req, res, next) => {
    try {
        const { inviteCode } = req.body;

        const classroom = await Classroom.findOne({ inviteCode, isActive: true });

        if (!classroom) {
            return res.status(404).json({
                success: false,
                message: 'Invalid or inactive invite code'
            });
        }

        // Check if student already joined
        if (classroom.students.includes(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: 'You have already joined this classroom'
            });
        }

        // Add student to classroom
        classroom.students.push(req.user._id);
        await classroom.save();

        // Add classroom to student's record
        await User.findByIdAndUpdate(req.user._id, {
            $push: { classrooms: classroom._id }
        });

        res.status(200).json({
            success: true,
            data: classroom
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get teacher's classrooms
// @route   GET /api/classrooms
// @access  Private/Teacher
export const getMyClassrooms = async (req, res, next) => {
    try {
        const classrooms = await Classroom.find({ teacher: req.user._id })
            .populate('students', 'displayName username totalXP level');

        res.status(200).json({
            success: true,
            count: classrooms.length,
            data: classrooms
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get individual classroom stats
// @route   GET /api/classrooms/:id/stats
// @access  Private/Teacher
export const getClassroomStats = async (req, res, next) => {
    try {
        const classroom = await Classroom.findById(req.params.id)
            .populate('students', 'displayName username totalXP level problemsSolved history');

        if (!classroom) {
            return res.status(404).json({
                success: false,
                message: 'Classroom not found'
            });
        }

        // Basic authorization: Only teacher of the classroom can see stats
        if (classroom.teacher.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to view these stats'
            });
        }

        // Calculate aggregate stats
        const totalStudents = classroom.students.length;
        let totalXP = 0;
        let totalProblemsSolved = 0;

        classroom.students.forEach(student => {
            totalXP += student.totalXP;
            totalProblemsSolved += student.problemsSolved;
        });

        const aggregate = {
            totalStudents,
            averageXP: totalStudents > 0 ? (totalXP / totalStudents).toFixed(2) : 0,
            totalProblemsSolved,
            averageProblems: totalStudents > 0 ? (totalProblemsSolved / totalStudents).toFixed(2) : 0
        };

        res.status(200).json({
            success: true,
            data: {
                classroom: {
                    name: classroom.name,
                    inviteCode: classroom.inviteCode
                },
                aggregate,
                students: classroom.students
            }
        });
    } catch (error) {
        next(error);
    }
};
