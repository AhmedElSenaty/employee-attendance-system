import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

type Placement = 'top' | 'bottom' | 'left' | 'right';
type TriggerType = 'hover' | 'click' | 'none';

interface TooltipProps {
  placement?: Placement;
  triggerType?: TriggerType;
  content: React.ReactNode;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  placement = 'top',
  triggerType = 'hover',
  content,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const targetRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const show = () => triggerType !== 'none' && setIsVisible(true);
  const hide = () => triggerType !== 'none' && setIsVisible(false);
  const toggle = () => triggerType === 'click' && setIsVisible((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !targetRef.current?.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };
    if (triggerType === 'click') {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [triggerType]);

  useEffect(() => {
    if (isVisible && targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipEl = tooltipRef.current;

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = targetRect.top - tooltipEl.offsetHeight - 8;
          left = targetRect.left + targetRect.width / 2 - tooltipEl.offsetWidth / 2;
          break;
        case 'bottom':
          top = targetRect.bottom + 8;
          left = targetRect.left + targetRect.width / 2 - tooltipEl.offsetWidth / 2;
          break;
        case 'left':
          top = targetRect.top + targetRect.height / 2 - tooltipEl.offsetHeight / 2;
          left = targetRect.left - tooltipEl.offsetWidth - 8;
          break;
        case 'right':
          top = targetRect.top + targetRect.height / 2 - tooltipEl.offsetHeight / 2;
          left = targetRect.right + 8;
          break;
      }

      setCoords({ top, left });
    }
  }, [isVisible, placement]);

  const arrowPosition = {
    top: 'bottom-[-6px] left-1/2 -translate-x-1/2',
    bottom: 'top-[-6px] left-1/2 -translate-x-1/2 rotate-180',
    left: 'top-1/2 right-[-6px] -translate-y-1/2 -rotate-90',
    right: 'top-1/2 left-[-6px] -translate-y-1/2 rotate-90',
  };

  return (
    <>
      <div
        ref={targetRef}
        onMouseEnter={triggerType === 'hover' ? show : undefined}
        onMouseLeave={triggerType === 'hover' ? hide : undefined}
        onClick={toggle}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible &&
        ReactDOM.createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-50"
            style={{ top: coords.top, left: coords.left }}
          >
            <div className="relative px-3 py-1 text-xs text-white bg-black rounded-md shadow-md max-w-xs text-center">
              {content}
              <div
                className={clsx(
                  'absolute w-3 h-3 bg-black rotate-45',
                  arrowPosition[placement]
                )}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
