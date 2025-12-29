export const askAi = async (question, context) => {
    // In a real scenario, this would call OpenAI, Anthropic, or Gemini API.
    // For now, we simulate a helpful response.

    console.log('AI Tutor receiving question:', question);
    console.log('Context:', context);

    // Simple mock logic for demonstration
    let response = "I'm your AI tutor. Could you please provide more details about the problem you're solving?";

    if (question.toLowerCase().includes('hint')) {
        response = "Try breaking down the problem into smaller parts. What's the first step you've tried?";
    } else if (question.toLowerCase().includes('explain')) {
        response = "The core concept here is related to " + (context.topic || "this topic") + ". Think about how it applies to the current variables.";
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        content: response,
        timestamp: new Date().toISOString(),
        suggestions: ["Can you give me another hint?", "Show me the solution", "Explain the concept"]
    };
};
