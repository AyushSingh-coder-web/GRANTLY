import confetti from 'canvas-confetti';

/**
 * Triggers a multi-stage celebratory confetti explosion when an application
 * transitions to 'Submitted' status.
 */
export const triggerSubmissionConfetti = () => {
  // Center-burst
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#635BFF', '#8B5CF6', '#14B8A6', '#10B981', '#F59E0B'],
    zIndex: 9999,
  });

  // Left cannon
  setTimeout(() => {
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 60,
      origin: { x: 0.1, y: 0.7 },
      colors: ['#635BFF', '#8B5CF6', '#3B82F6'],
      zIndex: 9999,
    });
  }, 200);

  // Right cannon
  setTimeout(() => {
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 60,
      origin: { x: 0.9, y: 0.7 },
      colors: ['#10B981', '#F59E0B', '#EC4899'],
      zIndex: 9999,
    });
  }, 350);
};
