'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export default function EvasiveButton() {
  const [showYes, setShowYes] = useState(false);
  const [showNo, setShowNo] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleYesClick = () => {
    setShowYes(true);
  };

  const handleNoClick = () => {
    setShowNo(true);
  };

  const moveToRandomPosition = useCallback(
    (
      containerWidth: number,
      containerHeight: number,
      buttonWidth: number,
      buttonHeight: number,
    ) => {
      const PADDING = 10; // Padding for all edges
      const newX =
        PADDING + Math.random() * (containerWidth - buttonWidth - 2 * PADDING);
      const newY =
        PADDING +
        Math.random() * (containerHeight - buttonHeight - 2 * PADDING);
      return { x: newX, y: newY };
    },
    [],
  );

  const moveButton = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const PADDING = 10;

      if (noButtonRef.current && containerRef.current) {
        const buttonRect = noButtonRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        let mouseX, mouseY;
        if (e instanceof MouseEvent) {
          mouseX = e.clientX - containerRect.left;
          mouseY = e.clientY - containerRect.top;
        } else {
          mouseX = e.touches[0].clientX - containerRect.left;
          mouseY = e.touches[0].clientY - containerRect.top;
        }

        const buttonCenterX = noButtonPosition.x + buttonRect.width / 2;
        const buttonCenterY = noButtonPosition.y + buttonRect.height / 2;

        const distanceX = mouseX - buttonCenterX;
        const distanceY = mouseY - buttonCenterY;

        if (Math.abs(distanceX) < 50 && Math.abs(distanceY) < 50) {
          const randomPosition = moveToRandomPosition(
            containerRect.width,
            containerRect.height,
            buttonRect.width,
            buttonRect.height,
          );
          setNoButtonPosition(randomPosition);
        } else if (Math.abs(distanceX) < 100 && Math.abs(distanceY) < 100) {
          let newX = noButtonPosition.x - distanceX / 1.5;
          let newY = noButtonPosition.y - distanceY / 1.5;

          // Ensure the button stays within the container
          newX = Math.max(
            PADDING,
            Math.min(
              newX,
              containerRect.width - buttonRect.width - PADDING - 30,
            ),
          );
          newY = Math.max(
            PADDING,
            Math.min(newY, containerRect.height - buttonRect.height - PADDING),
          );

          setNoButtonPosition({ x: newX, y: newY });
        }
      }
    },
    [noButtonPosition, moveToRandomPosition],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', moveButton);
      container.addEventListener('touchstart', moveButton);
      container.addEventListener('touchmove', moveButton);
      return () => {
        container.removeEventListener('mousemove', moveButton);
        container.removeEventListener('touchstart', moveButton);
        container.removeEventListener('touchmove', moveButton);
      };
    }
  }, [moveButton]);

  // initial position
  useEffect(() => {
    if (containerRef.current && yesButtonRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const yesButtonRect = yesButtonRef.current.getBoundingClientRect();

      // Calculate initial position relative to the "Yes" button
      const initialX =
        yesButtonRect.left - containerRect.left + yesButtonRect.width + 4; // Add spacing
      const initialY = yesButtonRect.top - containerRect.top;

      setNoButtonPosition({ x: initialX, y: initialY });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100 overflow-hidden p-4"
    >
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Сосал?</h1>
      <div className="space-x-4 ml-[-80px]">
        <button
          ref={yesButtonRef}
          onClick={handleYesClick}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Да
        </button>
        <button
          ref={noButtonRef}
          style={{
            position: 'absolute',
            left: `${noButtonPosition.x}px`,
            top: `${noButtonPosition.y}px`,
            transition: 'transform 0.3s ease, left 0.2s ease, top 0.2s ease',
            transform: `rotate(${Math.random() * 10 - 5}deg) scale(1.1)`,
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          onClick={handleNoClick}
        >
          Нет
        </button>
      </div>
      {showYes && <p className="mt-8 text-xl text-gray-700">А я знал</p>}
      {showNo && <p className="mt-8 text-xl text-gray-700">Обоюнда...</p>}
    </div>
  );
}
