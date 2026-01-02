import Track from '../models/Track.js';

// @desc    Get all tracks
// @route   GET /api/tracks
// @access  Public
export const getTracks = async (req, res, next) => {
    try {
        const tracks = await Track.find().populate('courses');
        res.status(200).json(tracks);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single track
// @route   GET /api/tracks/:id
// @access  Public
export const getTrackById = async (req, res, next) => {
    try {
        const track = await Track.findById(req.params.id).populate('courses');
        if (!track) {
            return res.status(404).json({ message: 'Track not found' });
        }
        res.status(200).json(track);
    } catch (error) {
        next(error);
    }
};
