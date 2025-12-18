interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

export class AnalyticsService {
  private events: AnalyticsEvent[] = [];

  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date()
    };

    this.events.push(analyticsEvent);
    console.log('Analytics:', analyticsEvent);

    // In production, send to analytics service
    // this.sendToAnalytics(analyticsEvent);
  }

  // User events
  trackLogin(userId: string) {
    this.track('user_login', { userId });
  }

  trackRegistration(userId: string) {
    this.track('user_registration', { userId });
  }

  // Problem events
  trackProblemStart(problemId: string, difficulty: string) {
    this.track('problem_started', { problemId, difficulty });
  }

  trackProblemComplete(problemId: string, data: {
    timeSpent: number;
    attempts: number;
    hintsUsed: number;
    xpEarned: number;
  }) {
    this.track('problem_completed', { problemId, ...data });
  }

  trackHintUsed(problemId: string, hintIndex: number) {
    this.track('hint_used', { problemId, hintIndex });
  }

  // Course events
  trackCourseEnroll(courseId: string) {
    this.track('course_enrolled', { courseId });
  }

  trackChapterComplete(courseId: string, chapterId: string) {
    this.track('chapter_completed', { courseId, chapterId });
  }

  // Achievement events
  trackAchievementUnlock(achievementId: string) {
    this.track('achievement_unlocked', { achievementId });
  }

  trackLevelUp(newLevel: number) {
    this.track('level_up', { level: newLevel });
  }

  trackStreakMilestone(days: number) {
    this.track('streak_milestone', { days });
  }

  private async sendToAnalytics(event: AnalyticsEvent) {
    // Implement actual analytics sending
    // Example: Google Analytics, Mixpanel, etc.
  }

  getEvents() {
    return this.events;
  }

  clearEvents() {
    this.events = [];
  }
}

export const analyticsService = new AnalyticsService();