import Problem from '../models/Problem.js';

// @desc    Get all problems
// @route   GET /api/problems
// @access  Public
export const getProblems = async (req, res, next) => {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    Get single problem
// @route   GET /api/problems/:id
// @access  Public
export const getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      res.status(404);
      throw new Error('Problem not found');
    }
    
    // Don't send the correct answer in the payload for security in a real app
    // But for this clone, we might handle validation on server
    const problemObj = problem.toObject();
    delete problemObj.correctAnswer;
    
    res.status(200).json(problemObj);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    Check Answer
// @route   POST /api/problems/:id/check
// @access  Public
export const checkAnswer = async (req, res, next) => {
  try {
    const { answer } = req.body;
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      res.status(404);
      throw new Error('Problem not found');
    }

    const isCorrect = problem.correctAnswer.toString().toLowerCase() === answer.toString().toLowerCase();

    res.status(200).json({
      correct: isCorrect,
      correctAnswer: isCorrect ? problem.correctAnswer : undefined, // Only show if correct? Or always show? 
      explanation: isCorrect ? "Great job!" : "Try again." // Placeholder for explanation field
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};
