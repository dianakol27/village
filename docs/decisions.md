# Village visual architecture decisions

Status: Accepted · 2026-10-02

## Mobile-first from the start

The landing page and reusable UI are composed at a narrow viewport first, then gain columns, roomier spacing, and expanded navigation at tablet and desktop widths. This reflects the product’s primary use on phones while keeping the public site comfortable to review on a large screen.

## Semantic design tokens

Color roles such as `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `border`, `card`, and `success` are defined as CSS custom properties and mapped into Tailwind. Components use those roles instead of repeating raw color values, so palette changes remain centralized and status remains legible through text and icon cues as well as color.

## Reusable product components

Section headings, badges, button links, activity cards, circle cards, the mobile preview, navigation, and footer live in small shared or domain-focused components. The page composes these components instead of duplicating presentation markup. shadcn/ui remains the home for generated primitives; the landing page uses a small local layer for its brand-specific patterns.

## Mock data stays outside presentation

Fictional activities, circles, categories, personalization preferences, and trust principles are typed in `src/lib/landing-page-data.ts`. UI components receive those values as props. Later, route or application code can replace the examples with real data without moving content rules into JSX.

## A family product without a child-oriented aesthetic

Village serves adults making decisions for their families. A restrained botanical palette, editorial display type, quiet surfaces, and abstract activity artwork communicate warmth and care without cartoon characters, nursery colors, or daycare-style decoration. The result should feel welcoming to parents without assuming a gender or talking down to the people using it.

## Relational model decisions

Status: Accepted · 2026-10-02

- **Activity and ActivitySession are separate.** Activity stores reusable description, audience, organizer, category, age guidance, and default price. ActivitySession stores a dated occurrence, its venue override, capacity, price override, and status. This lets one listing have multiple scheduled dates without repeating its descriptive data.
- **Child age uses birth month and year only.** Both fields are optional and must be present together. Month-level age is enough for broad activity suitability while avoiding collection of a full date of birth for young children.
- **Parent coordinates are not persisted.** The MVP stores a parent’s optional city and area for coarse local context. Precise home coordinates create unnecessary sensitivity; location-based discovery can use venue coordinates and, if needed later, a transient user-provided search origin.
- **PostGIS is deferred.** The MVP can support an initial nearby search with venue latitude/longitude and application-side distance calculations. A spatial extension should be introduced when measured query needs justify the added database and deployment complexity.
- **One Booking represents one participant/place.** A booking belongs to one parent and may reference one of that parent’s children, or no child for a parent activity. Capacity is counted by booking rows. Multi-participant reservations and a BookingChild join model are outside the MVP.
