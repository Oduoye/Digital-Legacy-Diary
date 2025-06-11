import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0
  } = options;
  
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasTriggered) return;

    // Create observer only once
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasTriggered) {
            // Use setTimeout for delay if specified
            const triggerAnimation = () => {
              requestAnimationFrame(() => {
                setIsVisible(true);
                setHasTriggered(true);
                
                // Immediately disconnect observer to prevent re-triggering
                if (observerRef.current && triggerOnce) {
                  observerRef.current.disconnect();
                  observerRef.current = null;
                }
              });
            };

            if (delay > 0) {
              setTimeout(triggerAnimation, delay);
            } else {
              triggerAnimation();
            }
          }
        },
        {
          threshold,
          rootMargin,
        }
      );
    }

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered]);

  return { elementRef, isVisible };
};

export const useStaggeredScrollAnimation = (itemCount: number, options: UseScrollAnimationOptions = {}) => {
  const { elementRef, isVisible } = useScrollAnimation(options);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false));
  const [hasAnimated, setHasAnimated] = useState(false);

  const animateItems = useCallback(() => {
    if (!isVisible || hasAnimated) return;

    setHasAnimated(true);

    const animateItem = (index: number) => {
      if (index >= itemCount) return;
      
      setTimeout(() => {
        setVisibleItems(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
        
        // Schedule next item with optimized delay
        animateItem(index + 1);
      }, index * 80); // Reduced from 100ms to 80ms for smoother stagger
    };

    animateItem(0);
  }, [isVisible, itemCount, hasAnimated]);

  useEffect(() => {
    animateItems();
  }, [animateItems]);

  return { elementRef, isVisible, visibleItems };
};

// Simple one-time animation hook for better performance
export const useOnceAnimation = (delay: number = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasTriggeredRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          
          const trigger = () => {
            requestAnimationFrame(() => {
              setIsVisible(true);
            });
          };

          if (delay > 0) {
            setTimeout(trigger, delay);
          } else {
            trigger();
          }
          
          // Immediately disconnect to prevent re-triggering
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [delay]);

  return { elementRef, isVisible };
};