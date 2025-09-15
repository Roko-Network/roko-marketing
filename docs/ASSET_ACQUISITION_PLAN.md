# ROKO Marketing Site - Asset Acquisition Plan

## Executive Summary
This document outlines all assets that need to be created, purchased, or generated for the ROKO Network marketing site based on the Figma design review.

---

## 1. 3D Assets Requirements

### 1.1 Models to Create

#### Temporal Orb (Priority: HIGH)
- **Description**: Intricate mechanical sphere with clock-like mechanisms
- **Specifications**:
  - Format: GLTF 2.0
  - Polycount: 8,000-12,000 vertices
  - Textures: 2K PBR (Base, Metallic, Roughness, Normal, Emission)
  - Animation: Rotating gears, floating particles
- **Estimated Cost**: $500-800 (freelance 3D artist)
- **Timeline**: 1 week
- **Alternative**: Use Three.js procedural generation

#### Fragmented Geometric Sphere (Priority: HIGH)
- **Description**: Hexagonal sphere breaking apart and reassembling
- **Specifications**:
  - Format: GLTF 2.0
  - Polycount: 5,000-8,000 vertices
  - Materials: Glass + Metal combination
  - Animation: Fragment explosion/reassembly loop
- **Estimated Cost**: $400-600
- **Timeline**: 5 days
- **Source**: Sketchfab or custom creation

#### Network Visualization Globe (Priority: MEDIUM)
- **Description**: Earth with glowing connection points
- **Specifications**:
  - Format: Three.js procedural or GLTF
  - Dynamic: Updates with real network data
  - Materials: Holographic with emission
- **Estimated Cost**: $300-500 or develop in-house
- **Timeline**: 1 week
- **Recommended**: Build with Three.js for dynamic updates

### 1.2 3D Asset Sources

**Recommended Platforms:**
1. **Sketchfab** (https://sketchfab.com)
   - Pre-made models: $20-200 per model
   - Custom work: $500-2000

2. **TurboSquid** (https://turbosquid.com)
   - High-quality models: $50-500
   - Enterprise licenses available

3. **CGTrader** (https://cgtrader.com)
   - Competitive pricing
   - Custom model requests

4. **Fiverr/Upwork** (For custom work)
   - 3D artists: $30-100/hour
   - Full models: $200-1500

---

## 2. Image Assets

### 2.1 AI-Generated Images (Priority: HIGH)

#### Hero Backgrounds (5 variations needed)
**Prompt Templates:**
```
1. "Futuristic cathedral architecture with temporal clock mechanisms,
   bright teal and cyan lighting (#00d4aa), pure black backgrounds,
   volumetric fog, flowing light streams, 8k resolution, cinematic
   composition, octane render, cyberpunk aesthetic"

2. "Abstract time visualization, flowing data streams forming geometric
   patterns, nanosecond precision representation, holographic interfaces,
   pure black background with bright teal/cyan accents (#00d4aa, #00ffcc),
   ultra detailed, award winning design, high contrast"

3. "Grand futuristic hallway with infinite perspective, sacred geometry
   patterns, glowing temporal portals, bright teal/cyan gradient lighting,
   pure black architecture, photorealistic, architectural photography style,
   cyberpunk atmosphere"
```

**Generation Platforms:**
- **Midjourney**: $30/month for commercial use
- **DALL-E 3**: $20/month via ChatGPT Plus
- **Stable Diffusion**: Free/Open source
- **Leonardo.ai**: $12-60/month

**Budget**: $100/month for 3 months = $300

#### Section Backgrounds (10 images)
- Technology visualization backgrounds
- Network/blockchain representations
- Abstract geometric patterns
- Temporal/clock themed compositions

**Estimated Generation Time**: 2-3 days
**Quality Control**: 3:1 generation ratio (generate 30 to get 10 good ones)

### 2.2 Stock Photography (Priority: MEDIUM)

**Required Themes:**
- Professional people using technology
- Data center/server imagery
- Abstract technology concepts
- Global network visualizations

**Recommended Sources:**
1. **Unsplash** (Free)
   - High quality, limited selection
   - Attribution not required

2. **Pexels** (Free)
   - Good variety
   - Commercial use allowed

3. **Shutterstock** ($29-199/month)
   - Extensive library
   - Editorial and commercial licenses

4. **Getty Images** (Premium)
   - Highest quality
   - $175-499 per image

**Budget**: $99/month Shutterstock subscription (3 months) = $297

---

## 3. Icon Assets

### 3.1 Custom Icon Set (Priority: HIGH)

**Required Icons (50 total):**

#### Navigation & UI (12 icons)
- Menu, Close, Arrow (up/down/left/right)
- External link, Download, Copy
- Search, Filter, Settings

#### Technology (15 icons)
- Blockchain, Node, Validator
- Clock, Sync, Timer
- API, SDK, Database
- Security, Lock, Shield
- Speed, Performance, Optimization

#### Features (12 icons)
- Nanosecond, Precision, Accuracy
- Network, Global, Connection
- Smart Contract, Transaction, Wallet
- Dashboard, Analytics, Chart

#### Social & Communication (11 icons)
- GitHub, Discord, Twitter, Telegram
- Email, Chat, Support
- Documentation, Tutorial, Video
- Community

**Creation Options:**

1. **Custom Design** (Recommended)
   - Designer rate: $50-100/hour
   - Estimated time: 20 hours
   - Total cost: $1000-2000

2. **Icon Packs** (Alternative)
   - Streamline Icons: $30/month
   - IconJar: $20/month
   - Modify existing sets: 10 hours work

3. **Free Resources** (Budget option)
   - Feather Icons (modify and extend)
   - Heroicons
   - Tabler Icons

**Recommended Approach**: Start with Feather Icons base, custom design 20 unique icons
**Budget**: $800 for custom icons

---

## 4. Typography Assets

### 4.1 Font Licenses (Priority: HIGH)

#### Rajdhani (Display Font)
- **License**: Google Fonts (Free)
- **Download**: https://fonts.google.com/specimen/Rajdhani
- **Weights needed**: 300, 400, 500, 600, 700
- **Usage**: Headlines, hero text, CTAs
- **Cost**: $0

#### HK Guise (Primary Font)
- **License**: Commercial license required
- **Source**: Hanken Design Co.
- **Weights needed**: 300, 400, 500, 600, 700
- **Usage**: Body text, UI elements
- **Cost**: $200-500 for web license

#### Aeonik TRIAL (Accent Font)
- **License**: Trial version (production license needed)
- **Source**: CoType Foundry
- **Weights needed**: 400, 500, 600, 700
- **Usage**: Special features, premium sections
- **Cost**: $300-800 for production license

#### JetBrains Mono (Code Font)
- **License**: Open source (Free)
- **Download**: https://www.jetbrains.com/lp/mono/
- **Weights needed**: 400, 500
- **Usage**: Code blocks, technical content
- **Cost**: $0

**Total Font Budget**: $200-1,300 (depending on licensing options)

### 4.2 Font Optimization
- **Subsetting**: Remove unused characters
- **Compression**: WOFF2 format
- **Loading**: Preload critical fonts
- **Fallbacks**: System font stack

---

## 5. Animation & Motion Assets

### 5.1 Lottie Animations (Priority: MEDIUM)

**Required Animations:**
1. **Loading Spinner** - Temporal clock animation
2. **Success State** - Checkmark with particle burst
3. **Error State** - Warning with shake effect
4. **Network Activity** - Pulsing node connections
5. **Data Sync** - Flowing data visualization

**Sources:**
- **LottieFiles**: Free + Premium ($15/month)
- **Custom Creation**: After Effects + Bodymovin
- **Designer Rate**: $500-1000 for set of 5

**Budget**: $750 for custom Lottie animations

### 5.2 Video Assets (Priority: LOW)

**Optional Hero Background Video:**
- Abstract temporal visualization
- 15-30 seconds loop
- 1920x1080 minimum
- WebM + MP4 formats

**Sources:**
- **Pexels/Pixabay**: Free options
- **Artgrid**: $25/month
- **Custom**: $1000-3000

**Recommendation**: Skip initially, add in Phase 2

---

## 6. Development Resources

### 6.1 Code Libraries (Priority: HIGH)

**Required Libraries (Open Source):**
- Three.js: Free (3D graphics)
- React Three Fiber: Free (React integration)
- Framer Motion: Free (animations)
- GSAP: Free with attribution / $149/year
- Chart.js: Free (data visualization)

**Budget**: $149 for GSAP license (optional)

### 6.2 Development Tools

**Design-to-Code:**
- Figma Dev Mode: Included with Figma
- Figma Tokens: Free plugin
- Style Dictionary: Free

**Performance Monitoring:**
- Lighthouse: Free
- WebPageTest: Free
- Sentry: Free tier available

---

## 7. Budget Summary

### Essential Assets (Phase 1)
| Category | Item | Cost |
|----------|------|------|
| 3D Models | 2 custom models | $1,200 |
| Icons | Custom icon set (20) | $800 |
| AI Images | 3 months subscription | $300 |
| Stock Photos | 3 months subscription | $297 |
| Fonts | Rajdhani (free) + HK Guise license | $350 |
| **Total** | | **$2,947** |

### Nice-to-Have (Phase 2)
| Category | Item | Cost |
|----------|------|------|
| 3D Models | Additional models | $800 |
| Animations | Lottie set | $750 |
| GSAP | Commercial license | $149 |
| Video | Background loops | $500 |
| Fonts | Aeonik production license | $550 |
| **Total** | | **$2,749** |

### Total Budget Range
- **Minimum (Essential)**: $2,947
- **Recommended**: $3,850
- **Full Implementation**: $5,696

---

## 8. Asset Creation Timeline

### Week 1-2
- [ ] Set up AI image generation workflow
- [ ] Generate hero backgrounds
- [ ] Source base icon set
- [ ] Commission 3D temporal orb

### Week 3-4
- [ ] Create custom icons
- [ ] Generate section backgrounds
- [ ] Complete 3D sphere model
- [ ] Optimize font files

### Week 5-6
- [ ] Finalize all imagery
- [ ] Create Lottie animations
- [ ] Integrate 3D models
- [ ] Asset optimization

### Week 7-8
- [ ] Performance testing
- [ ] Asset delivery
- [ ] Documentation
- [ ] Backup creation

---

## 9. Asset Management

### File Organization
```
assets/
├── 3d/
│   ├── models/
│   ├── textures/
│   └── animations/
├── images/
│   ├── hero/
│   ├── sections/
│   ├── backgrounds/
│   └── ui/
├── icons/
│   ├── svg/
│   └── sprite/
├── fonts/
│   ├── inter/
│   ├── space-grotesk/
│   └── jetbrains-mono/
├── animations/
│   ├── lottie/
│   └── video/
└── docs/
    ├── licenses/
    └── attribution/
```

### Version Control
- Use Git LFS for large files
- Maintain source files separately
- Document all licenses
- Keep attribution file updated

### CDN Strategy
- Host static assets on CDN
- Implement aggressive caching
- Use appropriate cache headers
- Monitor bandwidth usage

---

## 10. Procurement Process

### Immediate Actions (Week 1)
1. **Subscribe to AI image platform** (Midjourney recommended)
2. **Contact 3D artists** for quotes on temporal orb
3. **Download and prepare** open-source fonts
4. **Set up Shutterstock** trial/subscription

### Vendor Contacts
- **3D Artists**: Research Fiverr/Upwork profiles
- **Icon Designer**: Find specialist on Dribbble
- **Animation**: Contact Lottie specialists

### Quality Assurance
- Review all assets for brand consistency
- Test performance impact
- Verify licenses and usage rights
- Maintain asset documentation

---

## 11. Alternative Budget Options

### Minimal Budget ($500)
- Use free stock images
- Modify open-source icons
- Generate 3D with Three.js
- AI images with free credits

### Medium Budget ($2,000)
- Some custom 3D models
- Basic custom icons
- Paid AI image generation
- Stock photo subscription

### Premium Budget ($5,000+)
- All custom 3D models
- Full custom icon set
- Premium stock assets
- Custom animations
- Video backgrounds

---

## 12. Risk Mitigation

### Asset Delivery Risks
- **Mitigation**: Have backup free alternatives
- **Timeline buffer**: Add 20% to estimates
- **Quality control**: Review at milestones

### Budget Overruns
- **Mitigation**: Prioritize essential assets
- **Phase approach**: Delay nice-to-haves
- **Alternative sources**: Use free options

### Performance Impact
- **Mitigation**: Set performance budgets
- **Optimization**: Compress all assets
- **Testing**: Regular performance audits

---

## Conclusion

This asset acquisition plan provides a comprehensive roadmap for obtaining all necessary visual and interactive assets for the ROKO marketing site. The phased approach allows for budget flexibility while ensuring all critical assets are secured. Priority should be given to custom 3D models and AI-generated imagery that establish the unique visual identity of the ROKO brand.

**Next Steps:**
1. Approve budget allocation
2. Begin AI image generation
3. Commission priority 3D models
4. Start icon design process

For updates on asset acquisition progress, refer to the project tracking system.