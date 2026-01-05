import Clan from '../models/Clan.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

// @desc    Create a new clan
// @route   POST /api/clans
// @access  Private
export const createClan = async (req, res, next) => {
    try {
        const { name, description, insignia, privacy } = req.body;

        // Check if user is already in a clan (optional, but recommended)
        // For simplicity, we'll check it in the join logic too

        const clan = await Clan.create({
            name,
            description,
            insignia,
            privacy,
            leader: req.user._id,
            members: [req.user._id]
        });

        await Activity.log(req.user._id, 'CLAN_JOINED', `created a new clan: ${clan.name}`, { clanName: clan.name });

        res.status(201).json({
            success: true,
            data: clan
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Clan name already taken' });
        }
        next(error);
    }
};

// @desc    Get all clans (with search/pagination)
// @route   GET /api/clans
// @access  Private
export const getClans = async (req, res, next) => {
    try {
        const clans = await Clan.find()
            .sort({ totalXP: -1 })
            .limit(20)
            .populate('leader', 'displayName username');

        res.status(200).json({
            success: true,
            count: clans.length,
            data: clans
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Join a clan
// @route   POST /api/clans/:id/join
// @access  Private
export const joinClan = async (req, res, next) => {
    try {
        const clan = await Clan.findById(req.params.id);

        if (!clan) {
            return res.status(404).json({ success: false, message: 'Clan not found' });
        }

        // Check if user is already a member
        if (clan.members.includes(req.user._id)) {
            return res.status(400).json({ success: false, message: 'Already a member of this clan' });
        }

        // Check if user is in another clan (logic to be strictly enforced if needed)

        clan.members.push(req.user._id);
        await clan.save();

        await Activity.log(req.user._id, 'CLAN_JOINED', `joined the clan ${clan.name}!`, { clanName: clan.name });

        res.status(200).json({
            success: true,
            data: clan
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Leave a clan
// @route   POST /api/clans/:id/leave
// @access  Private
export const leaveClan = async (req, res, next) => {
    try {
        const clan = await Clan.findById(req.params.id);

        if (!clan) {
            return res.status(404).json({ success: false, message: 'Clan not found' });
        }

        // Remove member
        clan.members = clan.members.filter(m => m.toString() !== req.user._id.toString());

        // If leader leaves, reassign or dissolve (simplified: dissolved if last member)
        if (clan.members.length === 0) {
            await Clan.findByIdAndDelete(req.params.id);
            return res.status(200).json({ success: true, message: 'Clan dissolved' });
        }

        if (clan.leader.toString() === req.user._id.toString()) {
            clan.leader = clan.members[0];
        }

        await clan.save();

        res.status(200).json({
            success: true,
            message: 'Successfully left the clan'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single clan details with members
// @route   GET /api/clans/:id
// @access  Private
export const getClanDetails = async (req, res, next) => {
    try {
        const clan = await Clan.findById(req.params.id)
            .populate('members', 'displayName username avatar totalXP level')
            .populate('leader', 'displayName username avatar');

        if (!clan) {
            return res.status(404).json({ success: false, message: 'Clan not found' });
        }

        res.status(200).json({
            success: true,
            data: clan
        });
    } catch (error) {
        next(error);
    }
};
