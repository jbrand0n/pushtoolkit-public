import { useState, useRef, useEffect } from 'react';

// Simple help circle icon component
function HelpCircleIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  );
}

export default function Tooltip({ content, position = 'top', children, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(position);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Check if tooltip goes off screen and adjust position
      let newPosition = position;

      // Check horizontal overflow
      if (tooltipRect.right > viewportWidth) {
        newPosition = 'left';
      } else if (tooltipRect.left < 0) {
        newPosition = 'right';
      }

      // Check vertical overflow
      if (tooltipRect.bottom > viewportHeight && position === 'top') {
        newPosition = 'bottom';
      } else if (tooltipRect.top < 0 && position === 'bottom') {
        newPosition = 'top';
      }

      if (newPosition !== tooltipPosition) {
        setTooltipPosition(newPosition);
      }
    }
  }, [isVisible, position, tooltipPosition]);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 translate-x-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex items-center cursor-help"
      >
        {children || <HelpCircleIcon size={16} className="text-gray-400 hover:text-gray-600" />}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 ${positionClasses[tooltipPosition]} pointer-events-none`}
          style={{ width: 'max-content', maxWidth: '300px' }}
        >
          <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg">
            {content}
            <div
              className={`absolute w-0 h-0 border-4 ${arrowClasses[tooltipPosition]}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Alternative inline tooltip for form fields
export function InlineTooltip({ label, tooltip, required = false, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500">*</span>}
      {tooltip && (
        <Tooltip content={tooltip}>
          <HelpCircleIcon size={14} className="text-gray-400 hover:text-gray-600" />
        </Tooltip>
      )}
    </label>
  );
}
