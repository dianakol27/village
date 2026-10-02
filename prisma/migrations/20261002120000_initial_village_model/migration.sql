-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ORGANIZER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "InterestScope" AS ENUM ('CHILD', 'PARENT', 'BOTH');

-- CreateEnum
CREATE TYPE "OrganizerVerificationStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ActivityAudience" AS ENUM ('CHILDREN', 'PARENTS', 'FAMILIES');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ActivitySessionStatus" AS ENUM ('SCHEDULED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CircleVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "CircleMembershipRole" AS ENUM ('MEMBER', 'MODERATOR', 'OWNER');

-- CreateEnum
CREATE TYPE "MeetupStatus" AS ENUM ('SCHEDULED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MeetupRsvpStatus" AS ENUM ('GOING', 'WAITLISTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "onboardingStatus" "OnboardingStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "homeCity" TEXT,
    "homeArea" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nickname" TEXT,
    "birthYear" INTEGER,
    "birthMonth" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "scope" "InterestScope" NOT NULL DEFAULT 'BOTH',

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInterest" (
    "userId" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserInterest_pkey" PRIMARY KEY ("userId","interestId")
);

-- CreateTable
CREATE TABLE "ChildInterest" (
    "childId" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChildInterest_pkey" PRIMARY KEY ("childId","interestId")
);

-- CreateTable
CREATE TABLE "ActivityCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "ActivityCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organizer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "websiteUrl" TEXT,
    "publicContactEmail" TEXT,
    "verificationStatus" "OrganizerVerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Organizer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "postalCode" TEXT,
    "countryCode" CHAR(2) NOT NULL,
    "latitude" DECIMAL(8,5) NOT NULL,
    "longitude" DECIMAL(8,5) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "venueId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "audience" "ActivityAudience" NOT NULL,
    "childrenWelcome" BOOLEAN NOT NULL DEFAULT true,
    "minAgeMonths" INTEGER,
    "maxAgeMonths" INTEGER,
    "priceMinorUnits" INTEGER,
    "currencyCode" CHAR(3) NOT NULL DEFAULT 'EUR',
    "timeZone" TEXT NOT NULL,
    "status" "ActivityStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityInterest" (
    "activityId" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,

    CONSTRAINT "ActivityInterest_pkey" PRIMARY KEY ("activityId","interestId")
);

-- CreateTable
CREATE TABLE "ActivitySession" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "venueId" TEXT,
    "startsAt" TIMESTAMPTZ(3) NOT NULL,
    "endsAt" TIMESTAMPTZ(3) NOT NULL,
    "capacity" INTEGER,
    "priceMinorUnitsOverride" INTEGER,
    "status" "ActivitySessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "cancelledAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ActivitySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedActivity" (
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedActivity_pkey" PRIMARY KEY ("userId","activityId")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "childId" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Circle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "city" TEXT NOT NULL,
    "area" TEXT,
    "visibility" "CircleVisibility" NOT NULL DEFAULT 'PUBLIC',
    "createdByUserId" TEXT,
    "archivedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Circle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CircleMembership" (
    "circleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "CircleMembershipRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CircleMembership_pkey" PRIMARY KEY ("circleId","userId")
);

-- CreateTable
CREATE TABLE "Meetup" (
    "id" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,
    "venueId" TEXT,
    "creatorUserId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startsAt" TIMESTAMPTZ(3) NOT NULL,
    "endsAt" TIMESTAMPTZ(3),
    "capacity" INTEGER,
    "status" "MeetupStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Meetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetupAttendee" (
    "meetupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "MeetupRsvpStatus" NOT NULL DEFAULT 'GOING',
    "rsvpAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeetupAttendee_pkey" PRIMARY KEY ("meetupId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_homeCity_idx" ON "User"("homeCity");

-- CreateIndex
CREATE INDEX "Child_userId_idx" ON "Child"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Child_id_userId_key" ON "Child"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Interest_slug_key" ON "Interest"("slug");

-- CreateIndex
CREATE INDEX "UserInterest_interestId_userId_idx" ON "UserInterest"("interestId", "userId");

-- CreateIndex
CREATE INDEX "ChildInterest_interestId_childId_idx" ON "ChildInterest"("interestId", "childId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityCategory_slug_key" ON "ActivityCategory"("slug");

-- CreateIndex
CREATE INDEX "Organizer_createdByUserId_idx" ON "Organizer"("createdByUserId");

-- CreateIndex
CREATE INDEX "Venue_city_latitude_longitude_idx" ON "Venue"("city", "latitude", "longitude");

-- CreateIndex
CREATE INDEX "Activity_status_categoryId_audience_idx" ON "Activity"("status", "categoryId", "audience");

-- CreateIndex
CREATE INDEX "Activity_organizerId_status_idx" ON "Activity"("organizerId", "status");

-- CreateIndex
CREATE INDEX "Activity_status_audience_minAgeMonths_maxAgeMonths_idx" ON "Activity"("status", "audience", "minAgeMonths", "maxAgeMonths");

-- CreateIndex
CREATE INDEX "Activity_venueId_idx" ON "Activity"("venueId");

-- CreateIndex
CREATE INDEX "ActivityInterest_interestId_activityId_idx" ON "ActivityInterest"("interestId", "activityId");

-- CreateIndex
CREATE INDEX "ActivitySession_status_startsAt_idx" ON "ActivitySession"("status", "startsAt");

-- CreateIndex
CREATE INDEX "ActivitySession_activityId_startsAt_idx" ON "ActivitySession"("activityId", "startsAt");

-- CreateIndex
CREATE INDEX "ActivitySession_venueId_startsAt_idx" ON "ActivitySession"("venueId", "startsAt");

-- CreateIndex
CREATE INDEX "SavedActivity_activityId_createdAt_idx" ON "SavedActivity"("activityId", "createdAt");

-- CreateIndex
CREATE INDEX "Booking_sessionId_status_idx" ON "Booking"("sessionId", "status");

-- CreateIndex
CREATE INDEX "Booking_sessionId_userId_idx" ON "Booking"("sessionId", "userId");

-- CreateIndex
CREATE INDEX "Booking_userId_status_createdAt_idx" ON "Booking"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Circle_city_visibility_archivedAt_idx" ON "Circle"("city", "visibility", "archivedAt");

-- CreateIndex
CREATE INDEX "Circle_createdByUserId_idx" ON "Circle"("createdByUserId");

-- CreateIndex
CREATE INDEX "CircleMembership_userId_circleId_idx" ON "CircleMembership"("userId", "circleId");

-- CreateIndex
CREATE INDEX "CircleMembership_circleId_role_idx" ON "CircleMembership"("circleId", "role");

-- CreateIndex
CREATE INDEX "Meetup_circleId_status_startsAt_idx" ON "Meetup"("circleId", "status", "startsAt");

-- CreateIndex
CREATE INDEX "Meetup_venueId_startsAt_idx" ON "Meetup"("venueId", "startsAt");

-- CreateIndex
CREATE INDEX "MeetupAttendee_userId_status_rsvpAt_idx" ON "MeetupAttendee"("userId", "status", "rsvpAt");

-- CreateIndex
CREATE INDEX "MeetupAttendee_meetupId_status_idx" ON "MeetupAttendee"("meetupId", "status");

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInterest" ADD CONSTRAINT "UserInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInterest" ADD CONSTRAINT "UserInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildInterest" ADD CONSTRAINT "ChildInterest_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildInterest" ADD CONSTRAINT "ChildInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organizer" ADD CONSTRAINT "Organizer_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ActivityCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityInterest" ADD CONSTRAINT "ActivityInterest_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityInterest" ADD CONSTRAINT "ActivityInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitySession" ADD CONSTRAINT "ActivitySession_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitySession" ADD CONSTRAINT "ActivitySession_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedActivity" ADD CONSTRAINT "SavedActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedActivity" ADD CONSTRAINT "SavedActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ActivitySession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_childId_userId_fkey" FOREIGN KEY ("childId", "userId") REFERENCES "Child"("id", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Circle" ADD CONSTRAINT "Circle_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleMembership" ADD CONSTRAINT "CircleMembership_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleMembership" ADD CONSTRAINT "CircleMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meetup" ADD CONSTRAINT "Meetup_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meetup" ADD CONSTRAINT "Meetup_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meetup" ADD CONSTRAINT "Meetup_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetupAttendee" ADD CONSTRAINT "MeetupAttendee_meetupId_fkey" FOREIGN KEY ("meetupId") REFERENCES "Meetup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetupAttendee" ADD CONSTRAINT "MeetupAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- PostgreSQL CHECK constraints and partial indexes are not expressible in Prisma schema DSL.
-- Keep these in migration SQL so invalid values and duplicate participant reservations are rejected.
ALTER TABLE "Child"
  ADD CONSTRAINT "Child_birthMonth_valid_chk" CHECK ("birthMonth" IS NULL OR "birthMonth" BETWEEN 1 AND 12),
  ADD CONSTRAINT "Child_birthMonth_birthYear_paired_chk" CHECK (("birthMonth" IS NULL AND "birthYear" IS NULL) OR ("birthMonth" IS NOT NULL AND "birthYear" IS NOT NULL)),
  ADD CONSTRAINT "Child_birthYear_positive_chk" CHECK ("birthYear" IS NULL OR "birthYear" > 0);

ALTER TABLE "Venue"
  ADD CONSTRAINT "Venue_latitude_range_chk" CHECK ("latitude" BETWEEN -90 AND 90),
  ADD CONSTRAINT "Venue_longitude_range_chk" CHECK ("longitude" BETWEEN -180 AND 180);

ALTER TABLE "Activity"
  ADD CONSTRAINT "Activity_minAgeMonths_nonnegative_chk" CHECK ("minAgeMonths" IS NULL OR "minAgeMonths" >= 0),
  ADD CONSTRAINT "Activity_maxAgeMonths_nonnegative_chk" CHECK ("maxAgeMonths" IS NULL OR "maxAgeMonths" >= 0),
  ADD CONSTRAINT "Activity_ageRange_order_chk" CHECK ("minAgeMonths" IS NULL OR "maxAgeMonths" IS NULL OR "minAgeMonths" <= "maxAgeMonths"),
  ADD CONSTRAINT "Activity_priceMinorUnits_nonnegative_chk" CHECK ("priceMinorUnits" IS NULL OR "priceMinorUnits" >= 0);

ALTER TABLE "ActivitySession"
  ADD CONSTRAINT "ActivitySession_capacity_nonnegative_chk" CHECK ("capacity" IS NULL OR "capacity" >= 0),
  ADD CONSTRAINT "ActivitySession_priceOverride_nonnegative_chk" CHECK ("priceMinorUnitsOverride" IS NULL OR "priceMinorUnitsOverride" >= 0),
  ADD CONSTRAINT "ActivitySession_end_after_start_chk" CHECK ("endsAt" > "startsAt");

ALTER TABLE "Meetup"
  ADD CONSTRAINT "Meetup_capacity_nonnegative_chk" CHECK ("capacity" IS NULL OR "capacity" >= 0),
  ADD CONSTRAINT "Meetup_end_after_start_chk" CHECK ("endsAt" IS NULL OR "endsAt" > "startsAt");

-- Enforce one place per child per session and one parent-only place per session.
-- Separate partial indexes preserve sibling bookings by the same parent.
CREATE UNIQUE INDEX "Booking_sessionId_childId_unique_idx"
  ON "Booking"("sessionId", "childId") WHERE "childId" IS NOT NULL;
CREATE UNIQUE INDEX "Booking_sessionId_userId_parent_unique_idx"
  ON "Booking"("sessionId", "userId") WHERE "childId" IS NULL;
