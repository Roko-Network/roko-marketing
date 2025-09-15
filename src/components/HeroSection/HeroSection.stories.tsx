import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { HeroSection } from './HeroSection';

const meta = {
  title: 'Components/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main hero section displayed on the homepage, featuring the primary value proposition, network stats, and call-to-action buttons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    navigate: { action: 'navigate' },
    onRender: { action: 'rendered' },
  },
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {},
};

// Story with interaction testing
export const WithInteractions: Story = {
  args: {},
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Wait for hero content to load
    await waitFor(() => {
      expect(canvas.getByText('The Temporal Layer for Web3')).toBeInTheDocument();
    });

    // Check for CTA buttons
    const startBuildingBtn = canvas.getByRole('link', { name: /start building/i });
    const viewDocsBtn = canvas.getByRole('link', { name: /view docs/i });
    const joinNetworkBtn = canvas.getByRole('link', { name: /join network/i });

    expect(startBuildingBtn).toBeInTheDocument();
    expect(viewDocsBtn).toBeInTheDocument();
    expect(joinNetworkBtn).toBeInTheDocument();

    // Test CTA interactions
    await userEvent.click(startBuildingBtn);
    expect(args.navigate).toHaveBeenCalledWith('/developers/quick-start');

    await userEvent.click(viewDocsBtn);
    expect(args.navigate).toHaveBeenCalledWith('/developers');

    await userEvent.click(joinNetworkBtn);
    expect(args.navigate).toHaveBeenCalledWith('/ecosystem/validators');
  },
};

// Loading state story
export const LoadingStats: Story = {
  args: {},
  parameters: {
    mockData: {
      networkStats: { loading: true },
    },
  },
};

// Error state story
export const ErrorState: Story = {
  args: {},
  parameters: {
    mockData: {
      networkStats: { error: 'Failed to fetch network stats' },
    },
  },
};

// Mobile view story
export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};

// Tablet view story
export const Tablet: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// Reduced motion story
export const ReducedMotion: Story = {
  args: {},
  parameters: {
    prefersReducedMotion: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check that timeline is not animated
    const timeline = canvas.getByTestId('timeline-visualization');
    expect(timeline).not.toHaveClass('timeline-animated');
  },
};

// High contrast mode story
export const HighContrast: Story = {
  args: {},
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};

// Performance monitoring story
export const PerformanceTest: Story = {
  args: {},
  parameters: {
    performance: {
      allowedTime: 1000, // Should render within 1 second
    },
  },
  play: async ({ canvasElement }) => {
    const startTime = performance.now();
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getByText('The Temporal Layer for Web3')).toBeInTheDocument();
    });

    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(1000);
  },
};