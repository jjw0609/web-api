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

  const startAnimation = () => {
    const emoji = emojiRef.current;
    if (!emoji) return;

    // Reset previous animation effects and styles
    emoji.getAnimations().forEach((ani) => ani.cancel());

    const rollingAnimation = emoji.animate(
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
        endDelay: 2000,
      },
    );
    rollingAnimationRef.current = rollingAnimation;
    fadeAnimationRef.current = null;

    // When the first animation ends, start the second animation
    rollingAnimation.onfinish = () => {
      if (rollingAnimation.playbackRate > 0) {
        const fadeAnimation = emoji.animate(
          [
            {
              opacity: 1,
              // transform: 'translateX(200px) rotate(1.3turn)',
            },
            {
              opacity: 0.1,
              // transform: 'translateX(200px) rotate(1.3turn)',
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
        fadeAnimationRef.current = fadeAnimation;
        rollingAnimationRef.current = null;
      }
    };
  };

  const handleEasingChange = () => {
    if (rollingAnimationRef.current) {
      // https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/composite
      console.log(rollingAnimationRef.current.effect);
      rollingAnimationRef.current.effect?.updateTiming({
        easing: 'linear',
      });
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
    if (anim) {
      // anim.reverse();
      anim.playbackRate *= -1;
    }
  };

  return (
    <>
      <div className="container">
        <div ref={emojiRef} className="emoji">
          🤣
        </div>
        <div className="button-container">
          <button onClick={startAnimation}>start</button>
          <button onClick={handleEasingChange}>
            easing(linear)
          </button>
          <button onClick={handleStop}>stop</button>
          <button onClick={handleResume}>resume</button>
          <button onClick={handleReverse}>reverse</button>
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
