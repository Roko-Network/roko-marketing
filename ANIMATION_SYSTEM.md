# ROKO Network Animation System

A comprehensive animation system designed for the ROKO Network marketing website, featuring cyberpunk-inspired micro-interactions, performance optimization, and accessibility compliance.

## 🎨 System Overview

The ROKO animation system is built on **Framer Motion** and **Three.js**, providing seamless integration between 2D UI animations and 3D visualizations. It follows the cyberpunk aesthetic with holographic effects, glitch animations, and temporal-themed transitions.

## 📁 File Structure

```
src/
├── utils/
│   ├── animations.ts                 # Core animation variants library
│   ├── animationPerformance.ts      # Performance monitoring and optimization
│   ├── threeAnimations.ts           # Three.js integration utilities
│   └── animationExamples.tsx        # Comprehensive usage examples
├── hooks/
│   └── useScrollAnimation.ts        # Advanced scroll-based animation hooks
├── components/
│   ├── atoms/
│   │   ├── AnimatedButton.tsx       # Interactive button with holographic effects
│   │   ├── AnimatedCard.tsx         # Card with hover animations and 3D tilt
│   │   ├── AnimatedInput.tsx        # Form input with cyberpunk micro-interactions
│   │   └── AnimatedTextArea.tsx     # Enhanced textarea with auto-resize
│   └── molecules/
│       └── PageTransition.tsx       # Route-based page transitions
```

## 🎯 Core Features

### 1. Animation Variants (`animations.ts`)
- **Page Transitions**: fade, slide, scale, glitch effects
- **Scroll Animations**: fadeUp, parallax, reveal on scroll
- **Hover Effects**: lift, glow, shimmer, morph, tilt
- **Text Animations**: typing, gradient, glitch, pulse
- **Loading States**: skeleton, spinner, dots, progress
- **Feedback**: success, error, warning animations

### 2. Scroll Animation Hooks (`useScrollAnimation.ts`)
- **useScrollAnimation**: Intersection Observer based triggers
- **useParallax**: Hardware-accelerated parallax effects
- **useScrollProgress**: Scroll progress tracking
- **useStaggeredReveal**: Staggered list animations
- **useScrollVelocity**: Dynamic velocity-based effects
- **useStickyScroll**: Sticky element transitions
- **useMouseParallax**: Mouse-based interactive parallax
- **useScrollCounter**: Animated counters on scroll

### 3. Interactive Components

#### AnimatedButton
```tsx
<AnimatedButton
  animation="shimmer"
  variant="primary"
  glowIntensity={1.2}
>
  Click Me
</AnimatedButton>
```

Features:
- Holographic shimmer effects
- Multiple animation types (shimmer, glow, pulse, glitch)
- Loading states with spinners
- Hardware-accelerated transforms
- Accessibility compliant

#### AnimatedCard
```tsx
<AnimatedCard
  hoverEffect="tilt"
  variant="cyberpunk"
  borderGradient
  tiltStrength={15}
>
  Card Content
</AnimatedCard>
```

Features:
- 3D tilt with mouse tracking
- Particle burst effects
- Border gradient animations
- Cyberpunk grid overlays
- Performance-optimized hover states

#### AnimatedInput
```tsx
<CyberpunkInput
  label="Enter Data"
  glowOnFocus
  characterCount
  maxLength={100}
/>
```

Features:
- Focus glow effects
- Scan line animations
- Particle systems
- Auto-resize textarea
- Real-time character counting

### 4. Page Transitions (`PageTransition.tsx`)
- Route-based animation selection
- Loading progress indicators
- Scroll position preservation
- Performance monitoring
- Reduced motion support

### 5. Performance Optimization (`animationPerformance.ts`)

#### Device Capability Detection
```typescript
const capabilities = detectDeviceCapabilities();
// Returns: { isLowEndDevice, supportsHardwareAcceleration, maxAnimations }
```

#### Animation Queue Management
```typescript
animationQueue.add('unique-id', animationFunction, 'high');
```

#### Performance Monitoring
```typescript
performanceMonitor.start();
performanceMonitor.subscribe(metrics => {
  console.log(`FPS: ${metrics.fps}, Drops: ${metrics.frameDrops}`);
});
```

### 6. Three.js Integration (`threeAnimations.ts`)

#### Object Animation
```typescript
const { animateObject } = useThreeAnimation();

animateObject('object-1', meshRef.current, {
  position: new THREE.Vector3(0, 5, 0),
  rotation: new THREE.Euler(0, Math.PI, 0),
  scale: new THREE.Vector3(1.5, 1.5, 1.5),
  duration: 2,
  easing: 'easeOut'
});
```

#### Scroll Synchronization
```typescript
useScrollSync3D(objectRef.current, scrollProgress, {
  positionRange: [startPos, endPos],
  rotationRange: [startRot, endRot]
});
```

#### ROKO Specific Animations
```typescript
// Orb pulsing animation
rokoAnimations.orbPulse(orbMesh, 0.2);

// Network visualization
rokoAnimations.networkPulse(lines, nodes, 1.5);

// Data stream effect
rokoAnimations.dataStream(particles, new THREE.Vector3(0, 1, 0));
```

## 🎮 Usage Examples

### Basic Scroll Animation
```tsx
const { ref, inView } = useScrollAnimation({ threshold: 0.3 });

<motion.div
  ref={ref}
  {...animations.scroll.fadeUp}
  className="content"
>
  Content animates in on scroll
</motion.div>
```

### Parallax Background
```tsx
const { ref, y } = useParallax({ speed: 0.5, direction: 'up' });

<motion.div ref={ref} style={{ y }} className="bg-element">
  Parallax Background
</motion.div>
```

### Staggered List
```tsx
<motion.div {...animations.container.stagger(0.1)}>
  {items.map((item, i) => (
    <motion.div key={i} {...animations.scroll.fadeUp}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

### Animated Counter
```tsx
const { count } = useScrollCounter(1000, 2000);

<motion.div className="counter">
  {count.toLocaleString()}
</motion.div>
```

## ⚡ Performance Guidelines

### 1. Hardware Acceleration
- All animations use `transform` and `opacity` for GPU acceleration
- `will-change` property is automatically managed
- Hardware acceleration detection for optimal settings

### 2. Reduced Motion Support
```typescript
const { shouldReduceMotion } = useAdvancedReducedMotion();

if (shouldReduceMotion) {
  return <StaticComponent />;
}
```

### 3. Animation Budgeting
- Maximum 60fps target with frame drop monitoring
- Device-based animation limits (3-10 concurrent animations)
- Automatic quality adjustment for low-end devices

### 4. Memory Management
- Animation cleanup on component unmount
- Intersection Observer pooling
- Debounced scroll handlers

## 🎨 Design Tokens

### Timing Functions
```typescript
timingFunctions.standard    // cubic-bezier(0.4, 0, 0.2, 1)
timingFunctions.cyberGlitch // cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Spring Configurations
```typescript
springConfigs.cyberpunk // { stiffness: 300, damping: 25, mass: 0.8 }
springConfigs.gentle    // { stiffness: 260, damping: 20, mass: 1 }
```

### Duration Scale
```typescript
durations.fast      // 0.2s
durations.normal    // 0.3s
durations.slow      // 0.5s
durations.leisurely // 1.2s
```

## 🔧 Configuration

### Global Animation Settings
```typescript
// Disable animations globally
window.__ROKO_DISABLE_ANIMATIONS__ = true;

// Set animation quality
window.__ROKO_ANIMATION_QUALITY__ = 'low' | 'medium' | 'high';

// Enable performance monitoring
window.__ROKO_PERFORMANCE_MODE__ = true;
```

### Tailwind Integration
```css
/* Utility classes for animations */
.animate-glow { @apply shadow-lg shadow-roko-accent/30; }
.animate-shimmer { background-size: 300% 300%; }
.animate-pulse-cyber { animation: cyber-pulse 2s ease-in-out infinite; }
```

## 📱 Responsive Behavior

- **Mobile**: Reduced animation complexity, shorter durations
- **Tablet**: Medium complexity animations
- **Desktop**: Full animation suite with advanced effects
- **High-end**: Enhanced particle systems and 3D effects

## ♿ Accessibility Features

- **prefers-reduced-motion**: Automatic detection and fallbacks
- **Focus indicators**: Visible focus states for all interactive elements
- **Screen reader**: Proper ARIA labels and announcements
- **Keyboard navigation**: Full keyboard accessibility
- **Color contrast**: WCAG 2.2 AA compliant contrast ratios

## 🚀 Getting Started

1. Import the animation system:
```tsx
import { animations } from '@/utils/animations';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { AnimatedButton } from '@/components/atoms/AnimatedButton';
```

2. Apply animations to components:
```tsx
<motion.div {...animations.scroll.fadeUp}>
  Your content
</motion.div>
```

3. Use animated components:
```tsx
<AnimatedButton animation="shimmer" variant="primary">
  Get Started
</AnimatedButton>
```

4. Monitor performance:
```tsx
import { performanceMonitor } from '@/utils/animationPerformance';

useEffect(() => {
  performanceMonitor.start();
  return () => performanceMonitor.stop();
}, []);
```

## 🎯 Best Practices

1. **Use semantic animations**: Match animation type to user intent
2. **Respect user preferences**: Always check for reduced motion
3. **Optimize for mobile**: Limit concurrent animations on low-end devices
4. **Monitor performance**: Use built-in performance monitoring
5. **Progressive enhancement**: Ensure functionality without animations
6. **Test accessibility**: Verify keyboard navigation and screen reader support

## 📊 Performance Metrics

The system automatically tracks:
- **FPS**: Target 60fps, warn if drops below 55fps
- **Frame drops**: Count and report dropped frames
- **Memory usage**: Monitor JavaScript heap size
- **Animation duration**: Track actual vs expected timing
- **Device capabilities**: Automatic quality adjustment

## 🔮 Future Enhancements

- WebGL shader-based animations
- Advanced particle systems
- Machine learning-based motion prediction
- WebXR support for immersive experiences
- Real-time collaboration animations

---

**Built with love for the ROKO Network community** 🚀✨