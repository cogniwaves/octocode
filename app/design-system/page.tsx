'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardSubtitle, 
  CardContent, 
  CardBody, 
  CardSupporting,
  CardActions,
  CardDivider 
} from '@/components/ui/Card';
import { ThemeToggle } from '@/lib/theme/theme-provider';

export default function DesignSystemPage() {
  return (
    <div className="md-container md-spacing-y-xxl">
      {/* Header */}
      <header className="md-stack md-stack--gap-md md-text-center md-spacing-b-xxl">
        <h1 className="md-typescale-display-large">Material Design 3</h1>
        <p className="md-typescale-headline-small md-text-outline">
          OctoCode Design System Demo
        </p>
        <div className="md-cluster md-cluster--center">
          <ThemeToggle />
        </div>
      </header>

      {/* Typography Section */}
      <section className="md-spacing-b-xxl">
        <Card variant="outlined" className="md-spacing-b-lg">
          <CardHeader>
            <CardTitle>Typography System</CardTitle>
            <CardSubtitle>Material Design 3 type scales</CardSubtitle>
          </CardHeader>
          <CardContent>
            <div className="md-stack md-stack--gap-md">
              <div>
                <h2 className="md-typescale-display-large">Display Large</h2>
                <p className="md-typescale-body-small md-text-outline">57px • Roboto Regular</p>
              </div>
              <div>
                <h3 className="md-typescale-headline-large">Headline Large</h3>
                <p className="md-typescale-body-small md-text-outline">32px • Roboto Regular</p>
              </div>
              <div>
                <h4 className="md-typescale-title-large">Title Large</h4>
                <p className="md-typescale-body-small md-text-outline">22px • Roboto Regular</p>
              </div>
              <div>
                <p className="md-typescale-body-large">Body Large</p>
                <p className="md-typescale-body-small md-text-outline">16px • Roboto Regular</p>
              </div>
              <div>
                <p className="md-typescale-label-large">Label Large</p>
                <p className="md-typescale-body-small md-text-outline">14px • Roboto Medium</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Button Section */}
      <section className="md-spacing-b-xxl">
        <Card variant="outlined" className="md-spacing-b-lg">
          <CardHeader>
            <CardTitle>Button Components</CardTitle>
            <CardSubtitle>Various button styles and states</CardSubtitle>
          </CardHeader>
          <CardContent>
            <div className="md-stack md-stack--gap-lg">
              {/* Button Variants */}
              <div>
                <h4 className="md-typescale-title-medium md-spacing-b-sm">Variants</h4>
                <div className="md-cluster md-cluster--start">
                  <Button variant="filled">Filled</Button>
                  <Button variant="filled-tonal">Filled Tonal</Button>
                  <Button variant="elevated">Elevated</Button>
                  <Button variant="outlined">Outlined</Button>
                  <Button variant="text">Text</Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div>
                <h4 className="md-typescale-title-medium md-spacing-b-sm">Sizes</h4>
                <div className="md-cluster md-cluster--start md-items-end">
                  <Button size="small">Small</Button>
                  <Button size="medium">Medium</Button>
                  <Button size="large">Large</Button>
                </div>
              </div>

              {/* Button States */}
              <div>
                <h4 className="md-typescale-title-medium md-spacing-b-sm">States</h4>
                <div className="md-cluster md-cluster--start">
                  <Button>Default</Button>
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              {/* Buttons with Icons */}
              <div>
                <h4 className="md-typescale-title-medium md-spacing-b-sm">With Icons</h4>
                <div className="md-cluster md-cluster--start">
                  <Button 
                    leftIcon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                    }
                  >
                    Add Item
                  </Button>
                  <Button 
                    variant="outlined"
                    rightIcon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
                      </svg>
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Card Section */}
      <section className="md-spacing-b-xxl">
        <Card variant="outlined" className="md-spacing-b-lg">
          <CardHeader>
            <CardTitle>Card Components</CardTitle>
            <CardSubtitle>Different card variants and configurations</CardSubtitle>
          </CardHeader>
          <CardContent>
            <div className="md-grid md-grid--cols-3 md-grid--gap-lg">
              {/* Elevated Card */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated Card</CardTitle>
                  <CardSubtitle>With shadow elevation</CardSubtitle>
                </CardHeader>
                <CardContent>
                  <CardBody>
                    This card uses elevation to create depth and hierarchy in the interface.
                  </CardBody>
                </CardContent>
                <CardActions alignment="end">
                  <Button variant="text">Learn More</Button>
                </CardActions>
              </Card>

              {/* Filled Card */}
              <Card variant="filled">
                <CardHeader>
                  <CardTitle>Filled Card</CardTitle>
                  <CardSubtitle>Surface container highest</CardSubtitle>
                </CardHeader>
                <CardContent>
                  <CardBody>
                    This card uses the highest surface container color for background.
                  </CardBody>
                </CardContent>
                <CardDivider />
                <CardActions>
                  <Button variant="filled-tonal">Action</Button>
                </CardActions>
              </Card>

              {/* Outlined Card */}
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Outlined Card</CardTitle>
                  <CardSubtitle>With border outline</CardSubtitle>
                </CardHeader>
                <CardContent>
                  <CardBody>
                    This card uses an outline border to define its boundaries.
                  </CardBody>
                  <CardSupporting>
                    Supporting text provides additional context.
                  </CardSupporting>
                </CardContent>
                <CardActions alignment="between">
                  <Button variant="text">Cancel</Button>
                  <Button variant="filled">Confirm</Button>
                </CardActions>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Color System Section */}
      <section className="md-spacing-b-xxl">
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Color System</CardTitle>
            <CardSubtitle>Material Design 3 color tokens</CardSubtitle>
          </CardHeader>
          <CardContent>
            <div className="md-grid md-grid--cols-4 md-grid--gap-sm">
              {/* Primary Colors */}
              <div className="md-stack md-stack--gap-xs">
                <h4 className="md-typescale-label-large">Primary</h4>
                <div className="md-bg-primary md-text-on-primary md-padding-md md-shape-small md-text-center">
                  <span className="md-typescale-label-small">Primary</span>
                </div>
                <div className="md-bg-primary-container md-text-on-primary-container md-padding-md md-shape-small md-text-center">
                  <span className="md-typescale-label-small">Container</span>
                </div>
              </div>

              {/* Secondary Colors */}
              <div className="md-stack md-stack--gap-xs">
                <h4 className="md-typescale-label-large">Secondary</h4>
                <div className="md-bg-secondary md-text-on-secondary md-padding-md md-shape-small md-text-center">
                  <span className="md-typescale-label-small">Secondary</span>
                </div>
                <div className="md-bg-secondary-container md-text-on-secondary-container md-padding-md md-shape-small md-text-center">
                  <span className="md-typescale-label-small">Container</span>
                </div>
              </div>

              {/* Tertiary Colors */}
              <div className="md-stack md-stack--gap-xs">
                <h4 className="md-typescale-label-large">Tertiary</h4>
                <div className="md-bg-tertiary md-text-on-tertiary md-padding-md md-shape-small md-text-center">
                  <span className="md-typescale-label-small">Tertiary</span>
                </div>
                <div className="md-bg-tertiary-container md-text-on-tertiary-container md-padding-md md-shape-small md-text-center">
                  <span className="md-typescale-label-small">Container</span>
                </div>
              </div>

              {/* Error Colors */}
              <div className="md-stack md-stack--gap-xs">
                <h4 className="md-typescale-label-large">Error</h4>
                <div className="md-bg-error md-text-on-error md-padding-md md-shape-small md-text-center">
                  <span className="md-typescale-label-small">Error</span>
                </div>
                <div className="md-bg-error-container md-text-on-error-container md-padding-md md-shape-small md-text-center">
                  <span className="md-typescale-label-small">Container</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Surface System Section */}
      <section className="md-spacing-b-xxl">
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Surface System</CardTitle>
            <CardSubtitle>Layered surface containers</CardSubtitle>
          </CardHeader>
          <CardContent>
            <div className="md-stack md-stack--gap-sm">
              <div className="md-surface-container-lowest md-padding-lg md-shape-medium md-text-center">
                <span className="md-typescale-label-medium">Surface Container Lowest</span>
              </div>
              <div className="md-surface-container-low md-padding-lg md-shape-medium md-text-center">
                <span className="md-typescale-label-medium">Surface Container Low</span>
              </div>
              <div className="md-surface-container md-padding-lg md-shape-medium md-text-center">
                <span className="md-typescale-label-medium">Surface Container</span>
              </div>
              <div className="md-surface-container-high md-padding-lg md-shape-medium md-text-center">
                <span className="md-typescale-label-medium">Surface Container High</span>
              </div>
              <div className="md-surface-container-highest md-padding-lg md-shape-medium md-text-center">
                <span className="md-typescale-label-medium">Surface Container Highest</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Utilities Section */}
      <section className="md-spacing-b-xxl">
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Utility Classes</CardTitle>
            <CardSubtitle>Layout and spacing utilities</CardSubtitle>
          </CardHeader>
          <CardContent>
            <div className="md-stack md-stack--gap-lg">
              {/* Stack Layout */}
              <div>
                <h4 className="md-typescale-title-small md-spacing-b-sm">Stack Layout</h4>
                <div className="md-stack md-stack--gap-sm">
                  <div className="md-surface-container md-padding-md md-shape-small md-text-center">
                    <span className="md-typescale-label-small">Stack Item 1</span>
                  </div>
                  <div className="md-surface-container md-padding-md md-shape-small md-text-center">
                    <span className="md-typescale-label-small">Stack Item 2</span>
                  </div>
                  <div className="md-surface-container md-padding-md md-shape-small md-text-center">
                    <span className="md-typescale-label-small">Stack Item 3</span>
                  </div>
                </div>
              </div>

              {/* Cluster Layout */}
              <div>
                <h4 className="md-typescale-title-small md-spacing-b-sm">Cluster Layout</h4>
                <div className="md-cluster md-cluster--center">
                  <div className="md-surface-container md-padding-sm md-shape-small md-text-center">
                    <span className="md-typescale-label-small">Item A</span>
                  </div>
                  <div className="md-surface-container md-padding-sm md-shape-small md-text-center">
                    <span className="md-typescale-label-small">Item B</span>
                  </div>
                  <div className="md-surface-container md-padding-sm md-shape-small md-text-center">
                    <span className="md-typescale-label-small">Item C</span>
                  </div>
                </div>
              </div>

              {/* Grid Layout */}
              <div>
                <h4 className="md-typescale-title-small md-spacing-b-sm">Grid Layout</h4>
                <div className="md-grid md-grid--cols-3 md-grid--gap-sm">
                  <div className="md-surface-container md-padding-md md-shape-small md-text-center">
                    <span className="md-typescale-label-small">Grid 1</span>
                  </div>
                  <div className="md-surface-container md-padding-md md-shape-small md-text-center">
                    <span className="md-typescale-label-small">Grid 2</span>
                  </div>
                  <div className="md-surface-container md-padding-md md-shape-small md-text-center">
                    <span className="md-typescale-label-small">Grid 3</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="md-text-center md-spacing-t-xxl">
        <CardDivider className="md-spacing-b-lg" />
        <p className="md-typescale-body-small md-text-outline">
          Material Design 3 System for OctoCode • Built with Pure CSS
        </p>
      </footer>
    </div>
  );
}