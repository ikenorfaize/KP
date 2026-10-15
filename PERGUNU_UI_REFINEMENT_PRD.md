# PERGUNU Situbondo --- UI Refinement PRD

## Purpose

Refine the existing PERGUNU Situbondo website so that every public page
feels professionally designed, symmetrical, consistent, restrained, and
production-ready.

**Do not redesign the website from scratch.**

The existing identity is intentional and should be preserved:

-   White surfaces
-   PERGUNU green
-   Dark text
-   Rounded elements
-   Photography
-   Poppins-like typography

The objective is to **systematize, align, simplify, and polish** the
existing design---not replace it with a generic AI-generated landing
page.

------------------------------------------------------------------------

## Primary Objective

Audit and refine all public pages:

-   Home
-   Berita
-   Galeri
-   Beasiswa
-   Layanan
-   Sponsor
-   Hubungi Kami

They should feel like parts of **one coherent design system**.

Do not change backend behavior, routes, APIs, CMS logic, authentication,
forms, or existing functionality unless required to fix a genuine UI
bug.

------------------------------------------------------------------------

## 1. Global Layout System

The current pages have inconsistent horizontal alignment and content
widths.

Create a reusable container system and use it everywhere.

Suggested desktop starting point:

``` css
.container {
  width: min(100% - 48px, 1280px);
  margin-inline: auto;
}
```

Inspect the existing implementation before choosing the final maximum
width.

Navbar content, hero content, page sections, cards, headings, CTAs, and
footer content should visually align to the same grid.

Do not arbitrarily center individual components when the surrounding
page follows a grid.

------------------------------------------------------------------------

## 2. Spacing System

Stop using arbitrary spacing values throughout the site.

Use a consistent scale such as:

``` text
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 120
```

Desktop sections should generally use approximately 80--120px vertical
spacing depending on hierarchy.

Related elements should remain visually close. Separate unrelated
sections more strongly.

Remove accidental giant blank areas and avoid stretching sections merely
to fill the viewport.

------------------------------------------------------------------------

## 3. Typography

Define reusable typography instead of choosing font sizes independently
for every component.

Suggested desktop hierarchy:

``` text
Display: 56–64px
H1:      48–56px
H2:      36–44px
H3:      24–30px
Body L:  18–20px
Body:    16–18px
Small:   14–16px
```

Use responsive sizing on smaller screens.

Recommended line heights:

``` text
Headings: 1.1–1.25
Body:     ~1.6
```

Avoid excessive bold text. Strong weights should primarily be used for
headings, important labels, and CTAs.

Limit paragraph widths to roughly 55--70 characters where practical.

------------------------------------------------------------------------

## 4. Color System

Derive the exact colors from the existing project and convert them into
reusable design tokens.

Suggested structure:

``` text
--green-primary
--green-dark
--green-light
--green-surface
--text-primary
--text-secondary
--surface
--surface-muted
--border
```

Do not introduce unrelated colors.

Avoid decorative gradients unless there is a genuine visual reason.

Green should communicate brand and hierarchy rather than appearing on
every possible element.

Maintain accessible contrast.

------------------------------------------------------------------------

## 5. Avoid the Generic "AI Landing Page" Look

Explicitly avoid:

-   Excessive pill-shaped labels
-   Decorative gradients
-   Glassmorphism
-   Glow effects
-   Huge text without purpose
-   Excessive shadows
-   Excessive rounded cards
-   Random floating elements
-   Decorative blobs
-   Icon overload
-   Fake statistics
-   Unnecessary animations
-   Excessive centered layouts
-   Turning every section into a card grid

The result should feel like a competent designer carefully refined an
existing Indonesian organizational website.

Prefer hierarchy, whitespace, typography, photography, and alignment
over decoration.

------------------------------------------------------------------------

## 6. Border Radius and Shadows

Standardize radii.

Suggested starting point:

``` text
Small controls: 8–10px
Cards:          12–16px
Large panels:   20–24px
Pills:          999px only when semantically appropriate
```

Do not make every component pill-shaped.

Use subtle shadows. Cards should generally be defined by spacing,
borders, and surface contrast rather than heavy elevation.

------------------------------------------------------------------------

## 7. Navbar

Use one reusable navbar across every page.

Standardize:

-   Height
-   Logo dimensions
-   Content width
-   Navigation spacing
-   Active state
-   Login button
-   Hover state
-   Keyboard focus state

The navbar should align precisely with the global container.

Preserve the simple white navigation style.

Do not make it oversized.

------------------------------------------------------------------------

## 8. Footer

Build one reusable footer and use it everywhere.

Preserve the current information architecture:

-   PERGUNU identity
-   Phone
-   Email
-   Address
-   Social links

Improve alignment and spacing.

On desktop, organize information using a deliberate grid rather than
manually positioned columns.

Logo/name, social icons, divider, and contact information should follow
the same container boundaries as the rest of the website.

------------------------------------------------------------------------

## 9. Home Page

Preserve the large photographic hero.

The white overlay panel is distinctive and should remain, but refine its
proportions and alignment.

Use a deliberate two-column layout:

``` text
| identity / headline | description / CTA |
```

Align both columns intentionally.

Make carousel arrows visually subordinate to the content.

Standardize the two CTA buttons.

For the Tentang section, use a balanced desktop composition:

``` text
| introduction | image | mission / vision / values |
```

Equalize visual weight rather than forcing mathematically equal widths.

Reduce unnecessary whitespace before subsequent sections.

------------------------------------------------------------------------

## 10. Organization and Department Sections

Department cards must follow a consistent grid.

Every card in a row should have equal height.

Numbers should occupy a consistent position.

Department names should use consistent typography and line height.

Acronyms should align naturally within the textual group.

Different text lengths should not make the grid visually irregular.

Member/profile cards should standardize:

-   Image size
-   Image crop
-   Card dimensions
-   Title placement
-   Role placement
-   Internal padding

Remove unexplained decorative dots or elements unless they serve a real
function.

------------------------------------------------------------------------

## 11. Berita

Preserve the green hero, but tighten its vertical proportions.

The empty state should not occupy an enormous dashed rectangle.

Create a restrained empty state containing:

-   Small icon
-   Clear heading
-   Short explanation
-   Optional text link

Keep it compact.

When articles exist, use a clean editorial layout rather than oversized
marketing cards.

------------------------------------------------------------------------

## 12. Galeri

Keep its visual language closely related to Berita so both feel like
parts of the same content system.

Reduce oversized empty-state containers.

When gallery content exists, photography should dominate rather than
card decoration.

Use consistent image aspect ratios.

------------------------------------------------------------------------

## 13. Beasiswa

Preserve the green identity while making the hero proportions consistent
with the rest of the site.

Improve scholarship category filters.

They should behave and look like filters/tabs rather than an arbitrary
collection of pills.

Fix the registration process content. The current design repeats
**"Pilih Program"** for step 4.

Use a clear four-step progression with concise, accurate copy.

Cards should have equal heights and aligned content.

Do not repeat generic descriptions simply to fill space.

------------------------------------------------------------------------

## 14. Layanan

The photographic hero is strong and should remain.

Improve text contrast and constrain text width.

Make statistics visually secondary to the primary message.

The "Layanan digital PERGUNU" cards should share equal dimensions and
internal alignment.

For the service selector, use a deliberate master/detail layout:

``` text
| service navigation | selected service details |
```

Make the selected state clear but restrained.

Ensure the detail card aligns vertically with the service navigation.

------------------------------------------------------------------------

## 15. Sponsor

Preserve the photographic hero.

Partner cards currently contain too much empty space relative to their
content.

Reduce their height.

Normalize logo presentation with a fixed logo bounding box and:

``` css
object-fit: contain;
```

Different source image dimensions should not cause logos to appear
arbitrarily larger or smaller.

Keep partner names and descriptions consistently aligned.

The "Ingin Menjadi Partner?" CTA should be clear without becoming
another oversized card.

------------------------------------------------------------------------

## 16. Hubungi Kami

This page should feel practical and trustworthy rather than overly
promotional.

Reduce excessive empty hero space.

Preserve the core heading:

``` text
Mari terhubung dan
berkolaborasi
```

Create a more balanced relationship between the heading and contact
information.

Standardize contact cards.

Phone, email, WhatsApp, and office information should follow the same
structure:

``` text
icon
label
primary value/action
supporting text
```

Do not make WhatsApp radically different unless it is intentionally the
primary contact method.

------------------------------------------------------------------------

## 17. Buttons

Create reusable variants:

``` text
primary
secondary
outline
text
icon
```

Standardize:

-   Height
-   Horizontal padding
-   Radius
-   Font weight
-   Icon spacing
-   Hover
-   Focus-visible
-   Disabled
-   Loading

Do not create a unique button style for every page.

------------------------------------------------------------------------

## 18. Responsive Behavior

Do not solve responsiveness by merely shrinking desktop components.

Explicitly test approximately:

``` text
1440+
1280
1024
768
390
360
```

Desktop grids should collapse deliberately.

On mobile:

-   Navigation becomes an accessible mobile menu
-   Multi-column sections become appropriate single-column layouts
-   Typography scales down
-   Horizontal padding becomes approximately 20--24px
-   Buttons remain comfortably tappable
-   Cards do not overflow
-   Images retain useful crops
-   Hero sections do not unnecessarily consume several screens

------------------------------------------------------------------------

## 19. Accessibility

Preserve semantic HTML.

Ensure:

-   Visible keyboard focus
-   Sufficient color contrast
-   Useful alt text
-   Correct heading hierarchy
-   Real buttons for actions
-   Real links for navigation
-   Keyboard-accessible accordions
-   Appropriate `aria-expanded`
-   Adequate touch targets

Do not sacrifice accessibility merely to achieve visual symmetry.

------------------------------------------------------------------------

## 20. Implementation Strategy

**Do not immediately start editing files.**

First inspect the existing repository and produce a short implementation
plan identifying:

-   Shared components
-   Current design tokens
-   Inconsistent spacing
-   Inconsistent typography
-   Duplicated CSS/styles
-   Page-specific UI problems
-   Components that can safely be reused
-   Components that should remain page-specific

Then implement systematically:

``` text
Design tokens
    ↓
Shared primitives
    ↓
Global layout
    ↓
Navbar + Footer
    ↓
Shared page patterns
    ↓
Individual page refinements
    ↓
Responsive QA
    ↓
Accessibility QA
```

Potential shared primitives include:

``` text
Container
Section
SectionHeader
Badge
Button
Card
Navbar
Footer
EmptyState
PageHero
ImageHero
Accordion
```

Do not over-componentize trivial markup.

Do not rewrite working components merely because a different
implementation is possible.

------------------------------------------------------------------------

## 21. Symmetry Does Not Mean Center Everything

The website should feel balanced and symmetrical, but **do not interpret
symmetry as centering everything**.

Symmetry should come from:

-   Shared container boundaries
-   Consistent spacing
-   Repeated grid lines
-   Predictable card dimensions
-   Aligned baselines
-   Consistent image ratios
-   Intentional visual weight

Editorial content can and often should remain left-aligned.

------------------------------------------------------------------------

## 22. Content Integrity

Do not invent:

-   Statistics
-   Sponsors
-   Testimonials
-   Scholarships
-   News
-   Staff
-   Services
-   Organization information

Preserve real existing content.

If data is unavailable, use a polished empty state.

Do not populate the UI with fake content merely to make the design
appear fuller.

------------------------------------------------------------------------

## 23. Functional Safety

Visual refinement must not break existing behavior.

Preserve:

-   Routes
-   API requests
-   Authentication
-   Admin functionality
-   Forms
-   Registration/status checking
-   Dynamic news
-   Dynamic gallery data
-   Scholarship data
-   Sponsor data
-   Existing external links

When refactoring shared components, verify every page that consumes
them.

Avoid unrelated code changes.

------------------------------------------------------------------------

## Definition of Done

Before considering the work complete, compare every public page
side-by-side.

The final site should look like **one designer created the entire
product using one design system**.

A visitor should not feel that Berita, Beasiswa, Layanan, Sponsor, and
other pages came from unrelated templates.

Verify all of the following:

-   Same navbar geometry
-   Same footer geometry
-   Same content boundaries
-   Consistent heading scale
-   Consistent section spacing
-   Consistent buttons
-   Consistent radii
-   Consistent card treatment
-   Consistent green palette
-   Balanced desktop grids
-   Polished mobile layouts
-   No accidental horizontal overflow
-   No giant unexplained whitespace
-   No fake content
-   No functionality regressions
-   Accessible keyboard navigation
-   Appropriate mobile touch targets

------------------------------------------------------------------------

## Final Design Principle

> **Do not redesign for novelty. Refine for consistency.**

When choosing between a visually impressive solution and a restrained,
coherent solution, choose the restrained solution.

The goal is not to make the website look "AI-designed."

The goal is to make the existing PERGUNU Situbondo website feel
intentional, trustworthy, cohesive, and professionally finished.
