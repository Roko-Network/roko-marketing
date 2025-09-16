# ROKO Network 3D Components

Stunning 3D visualizations for the ROKO Network marketing website using Three.js and React Three Fiber.

## Overview

This package provides high-performance 3D components that showcase ROKO's nanosecond-precision blockchain technology through immersive temporal visualizations.

## Components

### HeroScene
The main component for the hero section that automatically handles device detection and performance optimization.

```tsx
import { HeroScene } from './components/3d';

function Hero() {
  return (
    <div className="h-screen">
      <HeroScene
        className="w-full h-full"
        enableInteraction={true}
        showPerformanceIndicator={false}
      />
    </div>
  );
}
```

### TemporalOrb
The centerpiece visualization featuring an icosahedron geometry with particle effects.

```tsx
import { TemporalOrb } from './components/3d';

<TemporalOrb
  position={[0, 0, 0]}
  scale={1}
  isHovered={false}
  performanceLevel="high"
/>
```

**Features:**
- Metallic icosahedron with emission materials
- 5000+ orbital particles (performance adaptive)
- Continuous rotation and pulsing effects
- Interactive hover states
- LOD system for performance

### NetworkGlobe
Interactive 3D globe showing global validator network.

```tsx
import { NetworkGlobe } from './components/3d';

<NetworkGlobe
  position={[8, 2, -3]}
  scale={0.8}
  autoRotate={true}
  showTooltips={true}
  performanceLevel="high"
/>
```

**Features:**
- Geographic validator node distribution
- Dynamic connection arcs
- Real-time status indicators
- Interactive tooltips
- Performance-adaptive detail levels

### ParticleField & TemporalFlowField
Background particle systems for atmospheric effects.

```tsx
import { TemporalFlowField } from './components/3d';

<TemporalFlowField
  count={2000}
  spread={50}
  speed={0.3}
  opacity={0.4}
  performanceLevel="high"
/>
```

**Features:**
- Temporal flow patterns
- Brand color gradients
- GPU instancing for performance
- Infinite boundary wrapping

### Scene
Main 3D scene wrapper with lighting and camera controls.

```tsx
import { Scene } from './components/3d';

<Scene
  enableControls={true}
  autoRotate={true}
  performanceLevel="high"
  fallbackComponent={CustomFallback}
/>
```

**Features:**
- Cyberpunk lighting setup
- Adaptive performance optimization
- Orbit controls
- HDR environment (high performance only)
- Accessibility fallbacks

## Performance Optimization

### Automatic Detection
The system automatically detects device capabilities and adjusts quality:

- **High**: Desktop with dedicated GPU (60 FPS, full effects)
- **Medium**: Desktop with integrated GPU (60 FPS, reduced particles)
- **Low**: Mobile devices (30 FPS, minimal effects)

### Manual Configuration
```tsx
import { getPerformanceConfig } from './components/3d';

const config = getPerformanceConfig('medium');
// Use config.particleCount, config.geometry, etc.
```

### Performance Monitoring
```tsx
import { PerformanceMonitor } from './components/3d';

const monitor = new PerformanceMonitor();
// monitor.getCurrentFPS()
// monitor.shouldReduceQuality()
```

## Brand Colors

All components use the official ROKO brand colors:

- **Primary**: `#00d4aa` (Temporal green)
- **Secondary**: `#BAC0CC` (Light accent)
- **Tertiary**: `#BCC1D1` (Subtle highlight)
- **Base**: `#181818` (Dark foundation)

## Accessibility

### Fallback Support
- Automatic WebGL detection
- Graceful degradation for unsupported devices
- Static visual alternatives
- Keyboard navigation support

### Reduced Motion
- Respects `prefers-reduced-motion` CSS media query
- Pause/play controls for animations
- Alternative static presentations

### ARIA Support
```tsx
<Scene aria-label="ROKO Network 3D visualization" />
```

## Installation Requirements

Ensure these dependencies are installed:

```bash
npm install three @react-three/fiber @react-three/drei @react-spring/three
```

## Usage Examples

### Basic Hero Section
```tsx
import { HeroScene } from './components/3d';

export const Hero = () => (
  <section className="relative h-screen overflow-hidden">
    <HeroScene className="absolute inset-0" />
    <div className="relative z-10 flex items-center justify-center h-full">
      <h1 className="text-6xl font-bold text-white">ROKO Network</h1>
    </div>
  </section>
);
```

### Custom Performance Setup
```tsx
import { Scene, TemporalOrb, NetworkGlobe } from './components/3d';

export const CustomVisualization = () => {
  const [performanceLevel, setPerformanceLevel] = useState('medium');

  return (
    <Scene performanceLevel={performanceLevel}>
      <TemporalOrb performanceLevel={performanceLevel} />
      <NetworkGlobe performanceLevel={performanceLevel} />
    </Scene>
  );
};
```

### Development Mode
```tsx
<HeroScene
  showPerformanceIndicator={true}  // Shows FPS and settings
  className="w-full h-full"
/>
```

## Technical Specifications

### Performance Targets
- **Desktop**: 60 FPS with full effects
- **Mobile**: 30 FPS with reduced complexity
- **Memory**: <128MB GPU memory usage
- **Draw Calls**: <50 per frame

### Browser Support
- Modern browsers with WebGL 1.0/2.0
- Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- Graceful fallback for unsupported browsers

### Asset Optimization
- Geometry LOD system
- Texture compression
- Instanced rendering
- Frustum culling

## Troubleshooting

### Common Issues

**Low FPS**: Automatically reduces quality, or manually set `performanceLevel="low"`

**WebGL Errors**: Fallback component will render automatically

**Memory Issues**: Use `estimateMemoryUsage()` to check requirements

**Mobile Performance**: System automatically detects and optimizes for mobile

### Debug Mode
```tsx
// Enable debug information
<Scene showStats={true} />
```

### Performance Monitoring
```tsx
import { AdaptiveQualityManager } from './components/3d';

const qualityManager = new AdaptiveQualityManager();
qualityManager.onConfigChange(config => {
  console.log('Quality adjusted:', config.level);
});
```

## Contributing

When adding new 3D components:

1. Follow the performance level system
2. Include accessibility fallbacks
3. Use brand colors consistently
4. Add TypeScript types
5. Document performance impact
6. Test on mobile devices

## License

These components are part of the ROKO Network marketing website and follow the project's licensing terms.