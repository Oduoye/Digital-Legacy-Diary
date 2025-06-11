import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = true
  } = options;
  
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add will-change for better performance
    element.style.willChange = 'transform, opacity';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame for smoother transitions
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          requestAnimationFrame(() => {
            setIsVisible(false);
          });
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      // Clean up will-change
      if (element) {
        element.style.willChange = 'auto';
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { elementRef, isVisible };
};

export const useStaggeredScrollAnimation = (itemCount: number, options: UseScrollAnimationOptions = {}) => {
  const { elementRef, isVisible } = useScrollAnimation(options);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false));

  const animateItems = useCallback(() => {
    if (!isVisible) return;

    const animateItem = (index: number) => {
      if (index >= itemCount) return;
      
      requestAnimationFrame(() => {
        setVisibleItems(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
        
        // Schedule next item with reduced delay for smoother effect
        setTimeout(() => animateItem(index + 1), 100);
      });
    };

    animateItem(0);
  }, [isVisible, itemCount]);

  useEffect(() => {
    animateItems();
  }, [animateItems]);

  return { elementRef, isVisible, visibleItems };
};