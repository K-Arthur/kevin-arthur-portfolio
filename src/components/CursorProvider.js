'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Context for custom cursor state
const CursorContext = createContext({
    cursorType: 'default',
    cursorText: '',
    setCursor: () => { },
    resetCursor: () => { },
});

/**
 * useCursor hook - Access cursor state and controls
 */
export const useCursor = () => useContext(CursorContext);

/**
 * CursorProvider - Global provider for custom cursor functionality
 * 
 * Wrap your app with this to enable custom cursor states on project
 * images and interactive elements.
 */
export function CursorProvider({ children }) {
    const [cursorState, setCursorState] = useState({
        type: 'default',
        text: '',
    });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const rafRef = useRef(null);
    const prefersReducedMotion = useReducedMotion();

    // Throttled mouse position tracking using RAF
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (rafRef.current) return;

            rafRef.current = requestAnimationFrame(() => {
                setPosition({ x: e.clientX, y: e.clientY });
                rafRef.current = null;
            });
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    const setCursor = useCallback((type, text = '') => {
        setCursorState({ type, text });
    }, []);

    const resetCursor = useCallback(() => {
        setCursorState({ type: 'default', text: '' });
    }, []);

    const value = {
        cursorType: cursorState.type,
        cursorText: cursorState.text,
        setCursor,
        resetCursor,
    };

    // Don't render custom cursor on touch devices or if reduced motion preferred
    const isTouchDevice = typeof window !== 'undefined' &&
        ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    return (
        <CursorContext.Provider value={value}>
            {children}
            {!isTouchDevice && !prefersReducedMotion && (
                <CustomCursor
                    position={position}
                    isVisible={isVisible && cursorState.type !== 'default'}
                    type={cursorState.type}
                    text={cursorState.text}
                />
            )}
        </CursorContext.Provider>
    );
}

/**
 * CustomCursor - Visual cursor overlay component
 */
function CustomCursor({ position, isVisible, type, text }) {
    const cursorVariants = {
        default: {
            width: 12,
            height: 12,
            backgroundColor: 'hsl(var(--primary))',
        },
        view: {
            width: 80,
            height: 80,
            backgroundColor: 'hsl(var(--primary))',
        },
        explore: {
            width: 100,
            height: 100,
            backgroundColor: 'hsl(var(--primary))',
        },
        drag: {
            width: 60,
            height: 60,
            backgroundColor: 'hsl(var(--accent))',
        },
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="custom-cursor"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        x: position.x,
                        y: position.y,
                        ...cursorVariants[type] || cursorVariants.default
                    }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 28,
                        mass: 0.5
                    }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none',
                        zIndex: 9999,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'translate(-50%, -50%)',
                        mixBlendMode: 'difference',
                    }}
                >
                    {text && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs font-medium text-white uppercase tracking-wider"
                        >
                            {text}
                        </motion.span>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * CursorTrigger - Wrapper component that triggers custom cursor on hover
 * 
 * @param {Object} props
 * @param {string} props.type - Cursor type ('view', 'explore', 'drag')
 * @param {string} props.text - Optional text to display in cursor
 * @param {React.ReactNode} props.children - Content to wrap
 */
export function CursorTrigger({ type = 'view', text = '', children, className = '' }) {
    const { setCursor, resetCursor } = useCursor();

    return (
        <div
            className={`cursor-trigger ${className}`}
            onMouseEnter={() => setCursor(type, text)}
            onMouseLeave={resetCursor}
            style={{ cursor: 'none' }}
        >
            {children}
        </div>
    );
}

export default CursorProvider;
