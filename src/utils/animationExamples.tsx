/**
 * ROKO Network Animation Examples
 *
 * Comprehensive examples and usage patterns for the ROKO animation system
 * Use these examples as reference for implementing animations throughout the site
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation, useParallax, useScrollCounter } from '@/hooks/useScrollAnimation';
import { animations, textAnimations, pageTransitions } from '@/utils/animations';
import { AnimatedButton, PrimaryButton } from '@/components/atoms/AnimatedButton';
import { AnimatedCard, FeatureCard, CyberpunkCard } from '@/components/atoms/AnimatedCard';
import { AnimatedInput, CyberpunkInput } from '@/components/atoms/AnimatedInput';
import { PageTransition, SectionTransition } from '@/components/molecules/PageTransition';

// Example: Basic scroll animations
export const ScrollAnimationExample: React.FC = () => {
  const { ref, inView } = useScrollAnimation({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      {...animations.scroll.fadeUp}
      className="p-8 bg-roko-dark rounded-lg"
    >
      <h3 className="text-2xl font-display text-roko-accent mb-4">
        Scroll Animation Example
      </h3>
      <p className="text-roko-tertiary">
        This content animates in when it becomes visible in the viewport.
      </p>
    </motion.div>
  );
};

// Example: Parallax effects
export const ParallaxExample: React.FC = () => {
  const { ref, y } = useParallax({
    speed: 0.5,
    direction: 'up',
  });

  return (
    <div ref={ref} className="relative h-96 overflow-hidden rounded-lg">
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-gradient-to-br from-roko-accent to-roko-gradient-end"
      />
      <div className="relative z-10 flex items-center justify-center h-full">
        <h3 className="text-3xl font-display text-white">
          Parallax Background
        </h3>
      </div>
    </div>
  );
};

// Example: Staggered list animations
export const StaggeredListExample: React.FC = () => {
  const items = ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'];

  return (
    <motion.div
      {...animations.container.stagger(0.1, 0.2)}
      className="space-y-4"
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          {...animations.scroll.fadeUp}
          className="p-4 bg-roko-primary/10 rounded-lg border border-roko-primary/20"
        >
          <h4 className="text-lg font-display text-roko-accent">{item}</h4>
          <p className="text-roko-tertiary">
            This is a staggered animation example for list items.
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Example: Interactive button animations
export const ButtonAnimationExample: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-display text-roko-accent">
        Button Animation Examples
      </h3>

      <div className="flex flex-wrap gap-4">
        {/* Shimmer effect */}
        <AnimatedButton animation="shimmer" variant="primary">
          Shimmer Effect
        </AnimatedButton>

        {/* Glow effect */}
        <AnimatedButton animation="glow" variant="secondary">
          Glow Effect
        </AnimatedButton>

        {/* Glitch effect */}
        <AnimatedButton animation="glitch" variant="primary">
          Glitch Effect
        </AnimatedButton>

        {/* Pulse effect */}
        <AnimatedButton animation="pulse" variant="ghost">
          Pulse Effect
        </AnimatedButton>

        {/* Loading state */}
        <AnimatedButton loading variant="primary">
          Loading
        </AnimatedButton>
      </div>
    </div>
  );
};

// Example: Card hover effects
export const CardAnimationExample: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-display text-roko-accent">
        Card Animation Examples
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Lift effect */}
        <FeatureCard hoverEffect="lift">
          <h4 className="text-lg font-display text-roko-accent mb-2">
            Lift Effect
          </h4>
          <p className="text-roko-tertiary">
            Hover to see the lift animation with shadow.
          </p>
        </FeatureCard>

        {/* Glow effect */}
        <AnimatedCard hoverEffect="glow" borderGradient>
          <h4 className="text-lg font-display text-roko-accent mb-2">
            Glow Effect
          </h4>
          <p className="text-roko-tertiary">
            Features particle burst and border glow.
          </p>
        </AnimatedCard>

        {/* Tilt effect */}
        <CyberpunkCard hoverEffect="tilt" tiltStrength={15}>
          <h4 className="text-lg font-display text-roko-accent mb-2">
            3D Tilt Effect
          </h4>
          <p className="text-roko-tertiary">
            Mouse movement creates 3D perspective.
          </p>
        </CyberpunkCard>

        {/* Scale effect */}
        <AnimatedCard hoverEffect="scale" variant="glass">
          <h4 className="text-lg font-display text-roko-accent mb-2">
            Scale Effect
          </h4>
          <p className="text-roko-tertiary">
            Smooth scaling on hover interaction.
          </p>
        </AnimatedCard>

        {/* Morph effect */}
        <AnimatedCard hoverEffect="morph" variant="cyberpunk">
          <h4 className="text-lg font-display text-roko-accent mb-2">
            Morph Effect
          </h4>
          <p className="text-roko-tertiary">
            Border radius morphs with color shift.
          </p>
        </AnimatedCard>
      </div>
    </div>
  );
};

// Example: Form animations
export const FormAnimationExample: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-display text-roko-accent">
        Form Animation Examples
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cyberpunk input */}
        <CyberpunkInput
          label="Cyberpunk Input"
          placeholder="Enter your data..."
          helperText="Features scan lines and particle effects"
          characterCount
          maxLength={50}
        />

        {/* Glass input */}
        <AnimatedInput
          variant="glass"
          label="Glass Input"
          placeholder="Transparent background..."
          state="success"
          helperText="Glass morphism styling"
        />

        {/* Floating label */}
        <AnimatedInput
          variant="floating"
          label="Floating Label"
          placeholder="Watch the label animate"
          size="lg"
        />

        {/* Error state */}
        <AnimatedInput
          label="Error State"
          placeholder="Invalid input..."
          state="error"
          helperText="This field has an error"
          value="invalid"
        />
      </div>
    </div>
  );
};

// Example: Text animations
export const TextAnimationExample: React.FC = () => {
  const { count } = useScrollCounter(1000, 2000);

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-display text-roko-accent">
        Text Animation Examples
      </h3>

      {/* Gradient text animation */}
      <motion.h2
        className="text-4xl font-display bg-gradient-to-r from-roko-accent to-roko-gradient-end bg-clip-text text-transparent bg-300% bg-pos-0"
        {...textAnimations.gradientShift}
        style={{
          backgroundSize: '300% 300%',
        }}
      >
        Animated Gradient Text
      </motion.h2>

      {/* Glitch text effect */}
      <motion.p
        className="text-2xl font-display text-roko-tertiary"
        {...textAnimations.glitchText}
      >
        Hover for Glitch Effect
      </motion.p>

      {/* Typing effect */}
      <motion.div
        className="font-mono text-roko-accent overflow-hidden whitespace-nowrap border-r-2 border-roko-accent"
        {...textAnimations.typing}
      >
        Typing animation effect...
      </motion.div>

      {/* Counter animation */}
      <div className="text-center">
        <motion.div
          className="text-6xl font-display text-roko-accent"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {count.toLocaleString()}
        </motion.div>
        <p className="text-roko-tertiary">Animated Counter</p>
      </div>

      {/* Pulse text */}
      <motion.p
        className="text-xl text-roko-accent font-display text-center"
        {...textAnimations.pulse}
      >
        Pulsing Text Animation
      </motion.p>
    </div>
  );
};

// Example: Page transitions
export const PageTransitionExample: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-display text-roko-accent">
        Page Transition Examples
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.keys(pageTransitions).map((transitionType) => (
          <motion.div
            key={transitionType}
            className="p-4 bg-roko-primary/10 rounded-lg border border-roko-primary/20 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h4 className="text-sm font-display text-roko-accent capitalize">
              {transitionType}
            </h4>
            <p className="text-xs text-roko-tertiary mt-1">
              Click to preview
            </p>
          </motion.div>
        ))}
      </div>

      <p className="text-sm text-roko-primary">
        Page transitions are automatically applied based on route navigation.
      </p>
    </div>
  );
};

// Example: Loading animations
export const LoadingAnimationExample: React.FC = () => {
  return (
    <div className="space-y-8">
      <h3 className="text-xl font-display text-roko-accent">
        Loading Animation Examples
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Skeleton loading */}
        <div className="space-y-3">
          <h4 className="text-lg font-display text-roko-accent">Skeleton</h4>
          <motion.div
            className="h-4 bg-roko-primary/20 rounded"
            {...animations.loading.skeleton}
          />
          <motion.div
            className="h-4 bg-roko-primary/20 rounded w-3/4"
            {...animations.loading.skeleton}
          />
          <motion.div
            className="h-4 bg-roko-primary/20 rounded w-1/2"
            {...animations.loading.skeleton}
          />
        </div>

        {/* Pulse loading */}
        <div className="space-y-3">
          <h4 className="text-lg font-display text-roko-accent">Pulse</h4>
          <motion.div
            className="w-16 h-16 bg-roko-accent rounded-full mx-auto"
            {...animations.loading.pulse}
          />
        </div>

        {/* Dots loading */}
        <div className="space-y-3">
          <h4 className="text-lg font-display text-roko-accent">Dots</h4>
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-roko-accent rounded-full"
                {...animations.loading.dots(index * 0.2)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Example: Feedback animations
export const FeedbackAnimationExample: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-display text-roko-accent">
        Feedback Animation Examples
      </h3>

      <div className="flex flex-wrap gap-4">
        {/* Success animation */}
        <motion.div
          className="p-4 bg-roko-success/10 border border-roko-success/30 rounded-lg flex items-center space-x-3"
          {...animations.feedback.success}
        >
          <div className="w-6 h-6 bg-roko-success rounded-full flex items-center justify-center">
            ✓
          </div>
          <span className="text-roko-success">Success Animation</span>
        </motion.div>

        {/* Error animation */}
        <motion.div
          className="p-4 bg-roko-error/10 border border-roko-error/30 rounded-lg flex items-center space-x-3"
          {...animations.feedback.error}
        >
          <div className="w-6 h-6 bg-roko-error rounded-full flex items-center justify-center">
            ✕
          </div>
          <span className="text-roko-error">Error Animation</span>
        </motion.div>

        {/* Warning animation */}
        <motion.div
          className="p-4 bg-roko-warning/10 border border-roko-warning/30 rounded-lg flex items-center space-x-3"
          {...animations.feedback.warning}
        >
          <div className="w-6 h-6 bg-roko-warning rounded-full flex items-center justify-center">
            !
          </div>
          <span className="text-roko-warning">Warning Animation</span>
        </motion.div>
      </div>
    </div>
  );
};

// Master example component
export const AnimationShowcase: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-roko-dark py-12">
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          <SectionTransition>
            <div className="text-center">
              <h1 className="text-5xl font-display text-roko-accent mb-4">
                ROKO Animation System
              </h1>
              <p className="text-xl text-roko-tertiary max-w-3xl mx-auto">
                Comprehensive animation examples showcasing the cyberpunk-inspired
                motion design system built for ROKO Network.
              </p>
            </div>
          </SectionTransition>

          <SectionTransition delay={0.1}>
            <ScrollAnimationExample />
          </SectionTransition>

          <SectionTransition delay={0.2}>
            <ParallaxExample />
          </SectionTransition>

          <SectionTransition delay={0.3}>
            <StaggeredListExample />
          </SectionTransition>

          <SectionTransition delay={0.4}>
            <ButtonAnimationExample />
          </SectionTransition>

          <SectionTransition delay={0.5}>
            <CardAnimationExample />
          </SectionTransition>

          <SectionTransition delay={0.6}>
            <FormAnimationExample />
          </SectionTransition>

          <SectionTransition delay={0.7}>
            <TextAnimationExample />
          </SectionTransition>

          <SectionTransition delay={0.8}>
            <LoadingAnimationExample />
          </SectionTransition>

          <SectionTransition delay={0.9}>
            <FeedbackAnimationExample />
          </SectionTransition>

          <SectionTransition delay={1.0}>
            <PageTransitionExample />
          </SectionTransition>
        </div>
      </div>
    </PageTransition>
  );
};

export default AnimationShowcase;