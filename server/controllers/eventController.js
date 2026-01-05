import Event from '../models/Event.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Private
export const getEvents = async (req, res, next) => {
    try {
        const now = new Date();
        const events = await Event.find()
            .sort({ startTime: 1 });

        // Dynamically update status for frontend convenience 
        // (In production, a cron job or background worker would handle this)
        const updatedEvents = events.map(event => {
            let status = event.status;
            if (now < event.startTime) status = 'upcoming';
            else if (now >= event.startTime && now <= event.endTime) status = 'active';
            else status = 'completed';
            return { ...event._doc, status };
        });

        res.status(200).json({
            success: true,
            count: updatedEvents.length,
            data: updatedEvents
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
export const registerForEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (event.status === 'completed') {
            return res.status(400).json({ success: false, message: 'Event has already ended' });
        }

        // Check if already registered
        const isRegistered = event.participants.some(p => p.user.toString() === req.user._id.toString());
        if (isRegistered) {
            return res.status(400).json({ success: false, message: 'Already registered for this event' });
        }

        event.participants.push({ user: req.user._id });
        await event.save();

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create an event (Admin only)
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res, next) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
};
