# Village relational data model proposal

**Status:** Design proposal only · 2026-10-02

This document proposes a first relational model for discovery, family profiles, organizers, bookings, and Circles. It does not change `prisma/schema.prisma`, create a migration, or require a database connection. The Prisma excerpt is a design sketch to review before implementation; PostgreSQL check constraints and deletion policy still need explicit migration decisions.

## 1. Entity overview

| Area | Entities | Purpose |
| --- | --- | --- |
| Accounts and family | `User`, `Child` | A parent or guardian account and private child age information |
| Taxonomy | `Interest`, `UserInterest`, `ChildInterest`, `ActivityCategory`, `ActivityInterest` | Reusable interests for matching and a primary category for browsing |
| Supply | `Organizer`, `Activity`, `ActivitySession`, `Venue` | Publisher, reusable activity listing, dated occurrence, and event location |
| Personal discovery | `SavedActivity`, `Booking` | Saved listings and a parent's reservation for a dated session |
| Community | `Circle`, `CircleMembership`, `Meetup`, `MeetupAttendee` | Local parent groups, memberships, events, and RSVPs |

An `Activity` is the stable listing (“Little Makers Art Club”). Each dated occurrence (“Saturday, 10:30–12:00”) is an `ActivitySession`. A session can override the activity's usual venue and price without copying the listing, organizer, description, category, or interests.

## 2. Relationship diagram

```text
User 1 ── * Child
User * ── * Interest              via UserInterest
Child * ── * Interest             via ChildInterest

User 1 ── * Organizer              (creator attribution; staff teams deferred)
Organizer 1 ── * Activity
ActivityCategory 1 ── * Activity
Activity * ── * Interest           via ActivityInterest
Venue 1 ── * Activity              (usual venue, optional)
Activity 1 ── * ActivitySession
Venue 1 ── * ActivitySession       (optional session-specific override)

User * ── * Activity               via SavedActivity
User 1 ── * Booking * ── 1 ActivitySession
Child 0..1 ── * Booking             optional, and must belong to booking's User

User 1 ── * Circle                 (creator attribution)
User * ── * Circle                 via CircleMembership
Circle 1 ── * Meetup
Venue 0..1 ── * Meetup
User 1 ── * Meetup                 (creator attribution)
User * ── * Meetup                 via MeetupAttendee
```

## 3. Proposed Prisma models and enums

The following sketch shows the intended relationships and important fields. Scalar naming and referential actions should be reviewed alongside the decisions later in this document before the schema is implemented.

```prisma
enum UserRole {
  USER
  ORGANIZER
  ADMIN
}

enum OnboardingStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}

enum InterestScope {
  CHILD
  PARENT
  BOTH
}

enum OrganizerVerificationStatus {
  UNVERIFIED
  PENDING
  VERIFIED
  REJECTED
}

enum ActivityAudience {
  CHILDREN
  PARENTS
  FAMILIES
}

enum ActivityStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum ActivitySessionStatus {
  SCHEDULED
  CANCELLED
  COMPLETED
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
}

enum CircleVisibility {
  PUBLIC
  PRIVATE
}

enum CircleMembershipRole {
  MEMBER
  MODERATOR
  OWNER
}

enum MeetupStatus {
  SCHEDULED
  CANCELLED
  COMPLETED
}

enum MeetupRsvpStatus {
  GOING
  WAITLISTED
  CANCELLED
}

model User {
  id                         String           @id @default(cuid())
  email                      String           @unique
  displayName                String?
  avatarUrl                  String?
  role                       UserRole         @default(USER)
  onboardingStatus           OnboardingStatus @default(NOT_STARTED)
  homeCity                   String?
  homeArea                   String?
  approximateHomeLatitude    Decimal?         @db.Decimal(6, 3)
  approximateHomeLongitude   Decimal?         @db.Decimal(6, 3)
  createdAt                  DateTime         @default(now()) @db.Timestamptz(3)
  updatedAt                  DateTime         @updatedAt @db.Timestamptz(3)

  children                   Child[]
  interests                  UserInterest[]
  createdOrganizers          Organizer[]      @relation("OrganizerCreator")
  savedActivities            SavedActivity[]
  bookings                   Booking[]
  circleMemberships          CircleMembership[]
  createdCircles             Circle[]         @relation("CircleCreator")
  createdMeetups             Meetup[]         @relation("MeetupCreator")
  meetupRsvps                MeetupAttendee[]

  @@index([homeCity])
}

model Child {
  id          String   @id @default(cuid())
  userId      String
  nickname    String?
  birthYear   Int?
  birthMonth  Int?
  createdAt   DateTime @default(now()) @db.Timestamptz(3)
  updatedAt   DateTime @updatedAt @db.Timestamptz(3)

  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  interests   ChildInterest[]
  bookings    Booking[]

  // Supports a composite Booking -> Child FK that also checks parent ownership.
  @@unique([id, userId])
  @@index([userId])
}

model Interest {
  id          String        @id @default(cuid())
  name        String
  slug        String        @unique
  scope       InterestScope @default(BOTH)

  users       UserInterest[]
  children    ChildInterest[]
  activities  ActivityInterest[]
}

model UserInterest {
  userId      String
  interestId  String
  createdAt   DateTime @default(now()) @db.Timestamptz(3)

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  interest    Interest  @relation(fields: [interestId], references: [id], onDelete: Cascade)

  @@id([userId, interestId])
  @@index([interestId, userId])
}

model ChildInterest {
  childId     String
  interestId  String
  createdAt   DateTime @default(now()) @db.Timestamptz(3)

  child       Child     @relation(fields: [childId], references: [id], onDelete: Cascade)
  interest    Interest  @relation(fields: [interestId], references: [id], onDelete: Cascade)

  @@id([childId, interestId])
  @@index([interestId, childId])
}

model ActivityCategory {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique

  activities  Activity[]
}

model Organizer {
  id                  String                      @id @default(cuid())
  name                String
  description         String?
  websiteUrl          String?
  publicContactEmail  String?
  verificationStatus  OrganizerVerificationStatus @default(UNVERIFIED)
  createdByUserId     String?
  createdAt           DateTime                    @default(now()) @db.Timestamptz(3)
  updatedAt           DateTime                    @updatedAt @db.Timestamptz(3)

  createdBy           User?       @relation("OrganizerCreator", fields: [createdByUserId], references: [id], onDelete: SetNull)
  activities          Activity[]

  @@index([createdByUserId])
}

model Venue {
  id            String   @id @default(cuid())
  name          String
  addressLine1  String
  addressLine2  String?
  city          String
  postalCode    String?
  countryCode   String   @default("NL") @db.Char(2)
  latitude      Decimal  @db.Decimal(8, 5)
  longitude     Decimal  @db.Decimal(8, 5)
  createdAt     DateTime @default(now()) @db.Timestamptz(3)
  updatedAt     DateTime @updatedAt @db.Timestamptz(3)

  activities    Activity[]
  sessions      ActivitySession[]
  meetups       Meetup[]

  @@index([city, latitude, longitude])
}

model Activity {
  id                 String           @id @default(cuid())
  organizerId        String
  categoryId         String
  venueId            String?
  title              String
  description        String
  audience           ActivityAudience
  childrenWelcome    Boolean          @default(true)
  minAgeMonths       Int?
  maxAgeMonths       Int?
  priceMinorUnits    Int?
  currencyCode       String           @default("EUR") @db.Char(3)
  timeZone           String           @default("Europe/Amsterdam")
  status             ActivityStatus   @default(DRAFT)
  createdAt          DateTime         @default(now()) @db.Timestamptz(3)
  updatedAt          DateTime         @updatedAt @db.Timestamptz(3)

  organizer          Organizer         @relation(fields: [organizerId], references: [id], onDelete: Restrict)
  category           ActivityCategory  @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  venue              Venue?            @relation(fields: [venueId], references: [id], onDelete: SetNull)
  interests          ActivityInterest[]
  sessions           ActivitySession[]
  saves              SavedActivity[]

  @@index([status, categoryId, audience])
  @@index([organizerId, status])
  @@index([status, audience, minAgeMonths, maxAgeMonths])
  @@index([venueId])
}

model ActivityInterest {
  activityId  String
  interestId  String

  activity    Activity  @relation(fields: [activityId], references: [id], onDelete: Cascade)
  interest    Interest  @relation(fields: [interestId], references: [id], onDelete: Cascade)

  @@id([activityId, interestId])
  @@index([interestId, activityId])
}

model ActivitySession {
  id                       String                @id @default(cuid())
  activityId               String
  venueId                  String?
  startsAt                 DateTime              @db.Timestamptz(3)
  endsAt                   DateTime              @db.Timestamptz(3)
  capacity                 Int?
  priceMinorUnitsOverride  Int?
  status                   ActivitySessionStatus @default(SCHEDULED)
  cancelledAt              DateTime?             @db.Timestamptz(3)
  createdAt                DateTime              @default(now()) @db.Timestamptz(3)
  updatedAt                DateTime              @updatedAt @db.Timestamptz(3)

  activity                 Activity      @relation(fields: [activityId], references: [id], onDelete: Restrict)
  venue                    Venue?        @relation(fields: [venueId], references: [id], onDelete: SetNull)
  bookings                 Booking[]

  @@index([status, startsAt])
  @@index([activityId, startsAt])
  @@index([venueId, startsAt])
}

model SavedActivity {
  userId      String
  activityId  String
  createdAt   DateTime @default(now()) @db.Timestamptz(3)

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  activity    Activity  @relation(fields: [activityId], references: [id], onDelete: Cascade)

  @@id([userId, activityId])
  @@index([activityId, createdAt])
}

model Booking {
  id          String        @id @default(cuid())
  sessionId   String
  userId      String
  childId     String?
  seatCount   Int           @default(1)
  status      BookingStatus @default(PENDING)
  expiresAt   DateTime?     @db.Timestamptz(3)
  createdAt   DateTime      @default(now()) @db.Timestamptz(3)
  updatedAt   DateTime      @updatedAt @db.Timestamptz(3)

  session     ActivitySession @relation(fields: [sessionId], references: [id], onDelete: Restrict)
  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  child       Child?          @relation(fields: [childId, userId], references: [id, userId], onDelete: Restrict)

  // One parent reservation per session; seatCount can represent more than one seat.
  @@unique([sessionId, userId])
  @@index([sessionId, status])
  @@index([userId, status, createdAt])
}

model Circle {
  id               String           @id @default(cuid())
  name             String
  description      String?
  city             String
  area             String?
  visibility       CircleVisibility @default(PUBLIC)
  createdByUserId  String?
  archivedAt       DateTime?        @db.Timestamptz(3)
  createdAt        DateTime         @default(now()) @db.Timestamptz(3)
  updatedAt        DateTime         @updatedAt @db.Timestamptz(3)

  createdBy        User?             @relation("CircleCreator", fields: [createdByUserId], references: [id], onDelete: SetNull)
  memberships      CircleMembership[]
  meetups           Meetup[]

  @@index([city, visibility, archivedAt])
  @@index([createdByUserId])
}

model CircleMembership {
  circleId    String
  userId      String
  role        CircleMembershipRole @default(MEMBER)
  joinedAt    DateTime             @default(now()) @db.Timestamptz(3)

  circle      Circle  @relation(fields: [circleId], references: [id], onDelete: Cascade)
  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([circleId, userId])
  @@index([userId, circleId])
  @@index([circleId, role])
}

model Meetup {
  id               String       @id @default(cuid())
  circleId         String
  venueId          String?
  creatorUserId    String?
  title            String
  description      String?
  startsAt         DateTime     @db.Timestamptz(3)
  endsAt           DateTime?    @db.Timestamptz(3)
  capacity         Int?
  status           MeetupStatus @default(SCHEDULED)
  createdAt        DateTime     @default(now()) @db.Timestamptz(3)
  updatedAt        DateTime     @updatedAt @db.Timestamptz(3)

  circle           Circle           @relation(fields: [circleId], references: [id], onDelete: Cascade)
  venue            Venue?           @relation(fields: [venueId], references: [id], onDelete: SetNull)
  creator          User?            @relation("MeetupCreator", fields: [creatorUserId], references: [id], onDelete: SetNull)
  attendees        MeetupAttendee[]

  @@index([circleId, status, startsAt])
  @@index([venueId, startsAt])
}

model MeetupAttendee {
  meetupId    String
  userId      String
  status      MeetupRsvpStatus @default(GOING)
  rsvpAt      DateTime         @default(now()) @db.Timestamptz(3)

  meetup      Meetup  @relation(fields: [meetupId], references: [id], onDelete: Cascade)
  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([meetupId, userId])
  @@index([userId, status, rsvpAt])
  @@index([meetupId, status])
}
```

PostgreSQL `CHECK` constraints should also enforce paired coordinates, latitude/longitude bounds (`-90..90` and `-180..180`), paired birth month/year, valid month numbers, non-negative ages/prices/capacities/seats, `minAgeMonths <= maxAgeMonths`, and `endsAt > startsAt`. Prisma schema alone does not express all of these invariants portably; add them in reviewed SQL migrations when implementing the schema.

## 4. Important indexes and constraints

- `User.email` is unique. Normalize email consistently in application code before writing; consider PostgreSQL `citext` only if case-insensitive uniqueness must be enforced independently of application normalization.
- Composite IDs on join models prevent duplicate interest tags, saved activities, memberships, and RSVPs. Reverse indexes support searches starting from an interest, user, or circle rather than only the leftmost side of the composite key.
- `Booking @@unique([sessionId, userId])` prevents duplicate parent reservations for the same session. It is intentionally one reservation per parent/session; `seatCount` represents requested places. Pending holds need an expiry worker/cleanup path, and capacity checks must run in a transaction with concurrency protection.
- The composite `Booking(childId, userId) -> Child(id, userId)` relation prevents booking another parent's child. `Child @@unique([id, userId])` exists to support that FK. A child referenced by a booking is restricted from deletion until the booking is cancelled/unlinked.
- Session indexes support upcoming-session discovery and the session list for one activity. Booking indexes support capacity counts grouped by session/status and a parent's booking history.
- The creator index on `Organizer` and `Circle` supports content-management queries scoped to the creating account. Do not add a standalone verification-status index at MVP scale; its small number of values makes it low-selectivity unless moderation volume demonstrates a need.
- `Activity(status, categoryId, audience)` and its age-oriented index support published listing filters. Range matching on both minimum and maximum age is not perfectly served by a B-tree; begin with these indexes and inspect real PostgreSQL query plans before adding range types or specialized indexes.
- `Venue(city, latitude, longitude)` supports city-prefiltered bounding-box queries. It is a pragmatic starting point, not a true geospatial index. See the geographic discovery section.
- `Circle(city, visibility, archivedAt)` supports local public-circle browse. Meetup indexes support chronological lists per circle and RSVP/capacity counts.
- Avoid a uniqueness constraint on organizer or venue names: independent businesses can share names. Category and interest slugs are unique because they are stable taxonomy keys.
- `CircleMembershipRole.OWNER` should have one active owner per Circle. A partial unique index (`WHERE role = 'OWNER'`) is the strongest PostgreSQL constraint, but Prisma doesn't express it in the model; alternatively, enforce ownership transfer in a transaction and test it.

## 5. Privacy and deletion decisions

### Children

- Store an optional nickname, never require a child's legal/full name.
- Store birth month and year only, never a full birth date. Derive age in months at query time. If a family omits this information, allow broad discovery without precise age matching.
- Do not store child email, login, exact birth date, school/daycare, health/disability data, government identifiers, biometric information, public profile, or child photos in this MVP.
- Keep child interests and age data private to the parent. No child-facing account or public child directory is modeled.
- Validate that birth month/year are both present or both absent. Re-evaluate retention and parental consent requirements before onboarding real families.

### Location and public exposure

- Do not store a parent's street address or house-level coordinate. Store only a city/area and, if the family opts in to distance sorting, a point rounded to a coarse grid (the proposed `Decimal(6,3)` is around 100 m at Village latitudes; a 1 km grid is safer and can be applied before persistence).
- Never return a parent's approximate home point, child age/interests, private membership list, or private-circle meetup location in public queries.
- A public activity may expose the organizer's event venue and address because that is necessary for local discovery. Private Circle meetups should reveal venue details only to eligible members/attendees; enforce this in application authorization and response shaping, not merely by hiding UI fields.
- Circle location is city/area only. Do not add Circle latitude/longitude unless a concrete use case justifies the added exposure.
- Organizer contact fields must be explicitly labeled public or private. This proposal models only a public contact email; private verification/contact workflow data belongs in a separately access-controlled table if needed.

### Deletion behavior

- Deleting a User cascades private children, preferences, saves, memberships, bookings, and RSVPs. Organizer, Circle, and Meetup creator attribution is nullable with `SetNull`, so content can survive its creator's account deletion.
- Delete/transfer an owner's Circle membership before deleting that User. If the final owner leaves, archive the Circle or assign another owner transactionally; do not leave active ownerless groups.
- Activities, organizers, venues, and sessions should normally be archived/cancelled rather than hard-deleted. Restrict deletion of organizers/categories/activities/sessions while dependent content or bookings exist; cascade dependent save links only when a listing is truly removed.
- Circle deletion cascades its meetups and attendee RSVP rows. Archive instead when community history should remain visible to members.
- With no payment processing in this stage, deleting a user may delete their bookings. If payment, refunds, or statutory audit records are added, replace that policy with a legally reviewed anonymization/retention flow; never keep account-identifying data just to preserve analytics.

## 6. Activity vs ActivitySession

`Activity` stores stable editorial and matching fields: title, description, category, audience, child-welcome policy, age range, organizer, typical venue, interests, and default price. `ActivitySession` stores one occurrence's actual UTC start/end, capacity, state, and any venue/price override.

Recurring classes are represented by creating sessions from the organizer's recurrence schedule. Do not duplicate Activities per date. The MVP can materialize a rolling window of occurrences; it does not need a recurrence-rule table until organizers need self-service recurrence editing. Keep the Activity's IANA `timeZone` so future local recurrence generation is correct through daylight-saving changes, while each occurrence is stored as a concrete `timestamptz` instant.

Remaining capacity is computed as `capacity - sum(seatCount)` for active, non-expired PENDING holds and CONFIRMED bookings. A `null` capacity means unlimited/untracked. Do not persist `remainingCapacity`; it becomes inconsistent when bookings change. A booking flow must atomically check capacity and create/confirm the booking (row lock or serializable transaction). A scheduled worker or lazy query must expire pending holds.

Parent-only listings use `audience = PARENTS` and `childrenWelcome = false`; age bounds are null. Adult activities where children may accompany use `audience = PARENTS`, `childrenWelcome = true`. Child-centered or family activities use `CHILDREN` or `FAMILIES` and age bounds when known. Validate these combinations at the application boundary; consider SQL checks for impossible combinations after product semantics are settled.

## 7. Geographic discovery in the MVP

Use ordinary PostgreSQL numeric latitude/longitude columns and city. Given the family's optional coarse origin, calculate a latitude/longitude bounding box for the requested radius, query candidate Venues in the same city/box, then compute exact haversine distance and filter/sort the smaller candidate set in application code. Include an appropriate high-latitude longitude adjustment; Dordrecht-centered assumptions should not become global math assumptions.

Use the session start index to bound the date/time window, join through the activity's default venue or session override, and apply the venue box. City-only search remains available for people who decline location sharing. Public result cards can show distance bands or rounded distance, never the saved home coordinate. This is sufficient for an MVP-sized dataset; add PostGIS (`geography(Point, 4326)` + GiST) only when measured query volume/latency justifies it.

## 8. Recommendation and future AI-search support

No recommendation table is warranted initially. Compute relevance from existing relations and fields:

- **Child age:** derive age-in-months from month/year and match against `minAgeMonths` / `maxAgeMonths`.
- **Interests:** join `ChildInterest` or `UserInterest` to `ActivityInterest`; `Interest.scope` clarifies which profile type an interest applies to.
- **Category and audience:** use the Activity's category and audience fields; `childrenWelcome` handles adult events where children can accompany.
- **Date/time:** filter scheduled sessions by `startsAt`, `endsAt`, and session status. The activity timezone is the source for local recurrence generation.
- **Distance:** resolve the session venue override or activity venue, apply the bounding box and haversine distance.
- **Price and availability:** resolve `priceMinorUnitsOverride ?? Activity.priceMinorUnits`; `0` is free and `null` is unpriced/unknown. Derive places remaining from capacity and non-cancelled booking rows.
- **Popularity:** aggregate saves and confirmed bookings (and later completed attendance) over a bounded window. Add a cached aggregate only after query cost warrants it.

An LLM should not have credentials or arbitrary SQL access. A server-side tool should turn language into a validated, allowlisted filter object (age months, interest/category IDs, audience, time window, radius, currency/maximum price, and availability requirement), apply authorization and privacy filtering, then query through the application/data-access layer. Return typed results and source fields so recommendations are explainable. Keep model/provider prompts and tool logic outside the schema and database client.

## 9. Open questions before implementation

1. **Child-age precision and consent:** Is month/year precise enough for age thresholds, and should age be optional? Which retention/deletion rules apply to children's profile data?
2. **Booking parties:** Is one reservation per parent/session with a `seatCount` sufficient, or must a booking separately identify multiple children and guardians? If multiple child profiles per booking are required, add a `BookingChild` join and revisit duplicate/capacity semantics.
3. **Pending holds:** How long does a PENDING booking reserve capacity? Is there a payment step later? These choices determine expiration and transition rules.
4. **Price semantics:** Are price and currency fixed per activity, variable per session, per child, or per family? The sketch allows a session amount override but assumes one currency per activity.
5. **Organizer accounts:** MVP uses a creator attribution and a coarse `UserRole`; it does not support multiple staff, claims, or delegated publishing. Add `OrganizerMember` only when team workflows are needed; do not treat `User.role = ORGANIZER` alone as proof of access to every organizer.
6. **Circle lifecycle:** Is `PRIVATE` invite-only or request-to-join? How is the single owner transferred, and should old meetups remain visible after archive/delete?
7. **Venue disclosure:** Are public activity addresses visible before a booking? Should private meetup venue details be shown to all Circle members or only confirmed attendees?
8. **Scheduling:** How far ahead should sessions be materialized, and who edits/cancels them? Recurrence editing is intentionally out of scope for the first schema.
9. **Geography scale:** Which launch countries and currencies are in scope? Start with city + coarse point + bounding-box filtering, and revisit PostGIS only with real performance data.
10. **Account deletion and legal retention:** If bookings or organizer contacts must be retained, define anonymization, retention windows, and audit access before implementing cascades.

## 10. Deliberate non-goals

- No `Recommendation` table until recommendations need persistence or offline explanation.
- No PostGIS, recurrence-rule DSL, address-geocoding provider, payment ledger, child authentication, organizer staff/claim workflow, chat, analytics event lake, or AI-provider fields in this MVP model.
- No exact parent home addresses or public child profiles.

These boundaries keep the first relational model focused while leaving the major future extension points explicit.
