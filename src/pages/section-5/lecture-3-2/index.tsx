import { useRef } from 'react';

export default function EmojiAnimation() {
  const emojiRef = useRef<HTMLDivElement>(null);
  const rollingAnimationRef = useRef<Animation | null>(
    null,
  );
  const fadeAnimationRef = useRef<Animation | null>(null);

  const getCurrentAnimation = () => {
    if (rollingAnimationRef.current) {
      return rollingAnimationRef.current;
    }
    if (fadeAnimationRef.current) {
      return fadeAnimationRef.current;
    }
    return null;
  };

  const startRolling = () => {
    const emoji = emojiRef.current;
    if (!emoji) return;

    // Reset previous animation effects and styles
    emoji.getAnimations().forEach((ani) => ani.cancel());

    const rollingKeyframes = new KeyframeEffect(
      emoji,
      [
        { transform: 'translateX(0) rotate(0)' },
        { transform: 'translateX(200px) rotate(1.3turn)' },
      ],
      {
        duration: 2000,
        direction: 'normal',
        easing: 'ease-in-out',
        iterations: 1,
        fill: 'forwards',
        // endDelay: 2000,
      },
    );
    const rollingAnimation = new Animation(
      rollingKeyframes,
      document.timeline,
    );
    rollingAnimationRef.current = rollingAnimation;
    fadeAnimationRef.current = null;

    // When the first animation ends, start the second animation
    rollingAnimation.onfinish = () => {
      if (rollingAnimation.playbackRate > 0) {
        const fadeKeyframes = new KeyframeEffect(
          emoji,
          [
            {
              opacity: 1,
            },
            {
              opacity: 0.1,
            },
          ],
          {
            duration: 2000,
            direction: 'normal',
            easing: 'ease-in-out',
            iterations: 1,
            fill: 'forwards',
          },
        );
        const fadeAnimation = new Animation(
          fadeKeyframes,
          document.timeline,
        );
        fadeAnimationRef.current = fadeAnimation;
        rollingAnimationRef.current = null;
        fadeAnimation.play();
      }
    };
    rollingAnimation.play();
  };

  const handleEasingChange = () => {
    const anim = getCurrentAnimation();
    if (
      anim &&
      anim.effect &&
      'updateTiming' in anim.effect
    ) {
      anim.effect.updateTiming({ easing: 'linear' });
    }
  };

  const handleStop = () => {
    const anim = getCurrentAnimation();
    anim?.pause();
  };

  const handleResume = () => {
    const anim = getCurrentAnimation();
    anim?.play();
  };

  const handleReverse = () => {
    const anim = getCurrentAnimation();
    anim?.reverse();
  };

  const handleProgress = () => {
    const anim = getCurrentAnimation();
    const timing = anim?.effect?.getComputedTiming();
    console.log('progress:', timing?.progress);
  };

  return (
    <>
      <div className="container">
        <div ref={emojiRef} className="emoji">
          🤣
        </div>
        <div className="button-container">
          <button onClick={startRolling}>start</button>
          <button onClick={handleEasingChange}>
            easing(linear)
          </button>
          <button onClick={handleStop}>stop</button>
          <button onClick={handleResume}>resume</button>
          <button onClick={handleReverse}>reverse</button>
          <button onClick={handleProgress}>progress</button>
        </div>
      </div>

      <style>
        {`
          .container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #fff;
          }
          
          .emoji {
            font-size: 64px;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
          }

          .button-container {
            margin-top: 32px;
            display: flex;
            gap: 10px;
          }
        `}
      </style>
    </>
  );
}
