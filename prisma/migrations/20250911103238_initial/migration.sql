-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."ReservationStatus" AS ENUM ('PENDING', 'ACTIVE', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."SectionType" AS ENUM ('META', 'GENERAL', 'COVER', 'HOME', 'COUNTDOWN', 'BRIDE', 'EVENT', 'INSTAGRAM', 'PRAYER', 'FOOTER', 'GALLERY', 'MUSIC', 'ENVELOPE', 'GIFT', 'LIVE', 'STORY', 'RUNDOWN', 'GUEST_BOOK', 'RSVP', 'THEME', 'ADDITIONAL_INFO');

-- CreateEnum
CREATE TYPE "public"."RSVPStatus" AS ENUM ('ATTENDING', 'NOT_ATTENDING', 'TENTATIVE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "address" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "public"."PasswordResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Transactions" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reservation" (
    "id" UUID NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "status" "public"."ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "method" TEXT,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "reservationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Catalogs" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "withPhoto" BOOLEAN NOT NULL DEFAULT false,
    "hexCode" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isPublish" BOOLEAN NOT NULL DEFAULT false,
    "sectionType" "public"."SectionType"[],
    "categoryId" UUID,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Catalogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "reviewer" TEXT,
    "catalogId" UUID NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Songs" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invitation" (
    "id" UUID NOT NULL,
    "title" TEXT,
    "slug" TEXT,
    "userId" TEXT NOT NULL,
    "catalogId" UUID,
    "weddingInfoId" UUID,
    "isCreating" TEXT DEFAULT 'self',
    "tagsTheme" TEXT,
    "note" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "transactionId" UUID,
    "reservationId" UUID,
    "accountId" UUID,
    "accountProviderId" TEXT,
    "accountProviderAccountId" TEXT,
    "accountProvider" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Meta" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "publicId" TEXT,
    "invitationId" UUID NOT NULL,

    CONSTRAINT "Meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CoverSection" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "coupleName" TEXT NOT NULL,
    "textInvitation" TEXT NOT NULL,
    "textAfterGuest" TEXT NOT NULL,
    "imageLittle" TEXT,
    "imageLittlePublicId" TEXT,
    "imageCover" TEXT,
    "imageCoverPublicId" TEXT,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoverSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WeddingInfo" (
    "id" UUID NOT NULL,
    "title" TEXT,
    "dateWedding" TEXT NOT NULL,
    "brideName" TEXT NOT NULL,
    "groomsName" TEXT NOT NULL,
    "invitationId" UUID NOT NULL,

    CONSTRAINT "WeddingInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HomeSection" (
    "id" UUID NOT NULL,
    "coverTitle" TEXT,
    "backgroundHome" TEXT,
    "backgroundHomePublicId" TEXT,
    "invitationId" UUID NOT NULL,

    CONSTRAINT "HomeSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CountdownSection" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "openingTitle" TEXT NOT NULL,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountdownSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BrideSection" (
    "id" UUID NOT NULL,
    "greeting" TEXT NOT NULL,
    "opening" TEXT NOT NULL,
    "bridePosition" TEXT NOT NULL,
    "groomsName" TEXT NOT NULL,
    "groomsFullname" TEXT NOT NULL,
    "groomsDescription" TEXT NOT NULL,
    "bridesName" TEXT NOT NULL,
    "bridesFullname" TEXT NOT NULL,
    "bridesDescription" TEXT NOT NULL,
    "groomsPhoto" TEXT,
    "bridesPhoto" TEXT,
    "groomsPhotoId" TEXT,
    "bridesPhotoId" TEXT,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrideSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScheduleEventSection" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleEventSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScheduleItem" (
    "id" UUID NOT NULL,
    "scheduleEventSectionId" UUID NOT NULL,
    "date" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "linkGoogleMaps" TEXT NOT NULL,
    "bridePlace" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InstagramSection" (
    "id" UUID NOT NULL,
    "instagramMen" TEXT NOT NULL,
    "instagramGirl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstagramSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PrayerSection" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrayerSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FooterSection" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "opening" TEXT NOT NULL DEFAULT '',
    "closing" TEXT NOT NULL DEFAULT '',
    "closingGreeting" TEXT NOT NULL DEFAULT '',
    "backgroundClosing" TEXT DEFAULT '',
    "backgroundClosingId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FooterSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GallerySection" (
    "id" UUID NOT NULL,
    "title" TEXT,
    "videoUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GallerySection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GalleryImage" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "gallerySectionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SongSection" (
    "id" UUID NOT NULL,
    "songId" UUID,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EnvelopeSection" (
    "id" UUID NOT NULL,
    "opening" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnvelopeSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EnvelopeItem" (
    "id" UUID NOT NULL,
    "bankName" TEXT NOT NULL,
    "ownerAccount" TEXT NOT NULL,
    "numberAccount" TEXT NOT NULL,
    "envelopeSectionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnvelopeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GiftSection" (
    "id" UUID NOT NULL,
    "opening" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GiftItem" (
    "id" UUID NOT NULL,
    "receiptName" TEXT NOT NULL,
    "receiptAddress" TEXT NOT NULL,
    "giftSectionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LiveSection" (
    "id" UUID NOT NULL,
    "mediaLive" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LiveItem" (
    "id" UUID NOT NULL,
    "urlLive" TEXT NOT NULL,
    "liveSectionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StorySection" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorySection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StoryItem" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "publicId" TEXT,
    "storySectionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RundownSection" (
    "id" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RundownSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RundownItem" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rundownSectionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RundownItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TemplateGuestMessage" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "TemplateGuestMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GuestBook" (
    "id" UUID NOT NULL,
    "invitationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "templateGuestId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RSVP" (
    "id" UUID NOT NULL,
    "invitationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "presentStatus" "public"."RSVPStatus" NOT NULL DEFAULT 'NOT_ATTENDING',
    "guestCount" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RSVP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RSVPSection" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RSVPSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdditionalSection" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "textAdditional" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "invitationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdditionalSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "whatsapp" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,
    "tiktok" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "audience" "public"."Role",
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "public"."User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "public"."PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_invitationId_key" ON "public"."Reservation"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reservationId_key" ON "public"."Payment"("reservationId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_slug_key" ON "public"."Invitation"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_transactionId_key" ON "public"."Invitation"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_reservationId_key" ON "public"."Invitation"("reservationId");

-- CreateIndex
CREATE UNIQUE INDEX "Meta_publicId_key" ON "public"."Meta"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Meta_invitationId_key" ON "public"."Meta"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "CoverSection_imageLittlePublicId_key" ON "public"."CoverSection"("imageLittlePublicId");

-- CreateIndex
CREATE UNIQUE INDEX "CoverSection_imageCoverPublicId_key" ON "public"."CoverSection"("imageCoverPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "CoverSection_invitationId_key" ON "public"."CoverSection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingInfo_invitationId_key" ON "public"."WeddingInfo"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeSection_backgroundHomePublicId_key" ON "public"."HomeSection"("backgroundHomePublicId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeSection_invitationId_key" ON "public"."HomeSection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "CountdownSection_invitationId_key" ON "public"."CountdownSection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "BrideSection_groomsPhotoId_key" ON "public"."BrideSection"("groomsPhotoId");

-- CreateIndex
CREATE UNIQUE INDEX "BrideSection_bridesPhotoId_key" ON "public"."BrideSection"("bridesPhotoId");

-- CreateIndex
CREATE UNIQUE INDEX "BrideSection_invitationId_key" ON "public"."BrideSection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleEventSection_invitationId_key" ON "public"."ScheduleEventSection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramSection_invitationId_key" ON "public"."InstagramSection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "PrayerSection_invitationId_key" ON "public"."PrayerSection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "FooterSection_backgroundClosingId_key" ON "public"."FooterSection"("backgroundClosingId");

-- CreateIndex
CREATE UNIQUE INDEX "FooterSection_invitationId_key" ON "public"."FooterSection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "GallerySection_invitationId_key" ON "public"."GallerySection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryImage_publicId_key" ON "public"."GalleryImage"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "SongSection_songId_key" ON "public"."SongSection"("songId");

-- CreateIndex
CREATE UNIQUE INDEX "SongSection_invitationId_key" ON "public"."SongSection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "EnvelopeSection_invitationId_key" ON "public"."EnvelopeSection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "GiftSection_invitationId_key" ON "public"."GiftSection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "LiveSection_invitationId_key" ON "public"."LiveSection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "StorySection_invitationId_key" ON "public"."StorySection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "StoryItem_publicId_key" ON "public"."StoryItem"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "RundownSection_invitationId_key" ON "public"."RundownSection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateGuestMessage_key_key" ON "public"."TemplateGuestMessage"("key");

-- CreateIndex
CREATE UNIQUE INDEX "RSVPSection_invitationId_key" ON "public"."RSVPSection"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalSection_invitationId_key" ON "public"."AdditionalSection"("invitationId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "public"."Notification"("userId", "isRead");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transactions" ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "public"."Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Catalogs" ADD CONSTRAINT "Catalogs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Catalogs" ADD CONSTRAINT "Catalogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "public"."Catalogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_accountProvider_accountProviderAccountId_fkey" FOREIGN KEY ("accountProvider", "accountProviderAccountId") REFERENCES "public"."Account"("provider", "providerAccountId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "public"."Catalogs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "public"."Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Meta" ADD CONSTRAINT "Meta_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CoverSection" ADD CONSTRAINT "CoverSection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeddingInfo" ADD CONSTRAINT "WeddingInfo_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HomeSection" ADD CONSTRAINT "HomeSection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CountdownSection" ADD CONSTRAINT "CountdownSection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BrideSection" ADD CONSTRAINT "BrideSection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScheduleEventSection" ADD CONSTRAINT "ScheduleEventSection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScheduleItem" ADD CONSTRAINT "ScheduleItem_scheduleEventSectionId_fkey" FOREIGN KEY ("scheduleEventSectionId") REFERENCES "public"."ScheduleEventSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InstagramSection" ADD CONSTRAINT "InstagramSection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PrayerSection" ADD CONSTRAINT "PrayerSection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FooterSection" ADD CONSTRAINT "FooterSection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GallerySection" ADD CONSTRAINT "GallerySection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GalleryImage" ADD CONSTRAINT "GalleryImage_gallerySectionId_fkey" FOREIGN KEY ("gallerySectionId") REFERENCES "public"."GallerySection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SongSection" ADD CONSTRAINT "SongSection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SongSection" ADD CONSTRAINT "SongSection_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."Songs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EnvelopeSection" ADD CONSTRAINT "EnvelopeSection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EnvelopeItem" ADD CONSTRAINT "EnvelopeItem_envelopeSectionId_fkey" FOREIGN KEY ("envelopeSectionId") REFERENCES "public"."EnvelopeSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GiftSection" ADD CONSTRAINT "GiftSection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GiftItem" ADD CONSTRAINT "GiftItem_giftSectionId_fkey" FOREIGN KEY ("giftSectionId") REFERENCES "public"."GiftSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LiveSection" ADD CONSTRAINT "LiveSection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LiveItem" ADD CONSTRAINT "LiveItem_liveSectionId_fkey" FOREIGN KEY ("liveSectionId") REFERENCES "public"."LiveSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StorySection" ADD CONSTRAINT "StorySection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StoryItem" ADD CONSTRAINT "StoryItem_storySectionId_fkey" FOREIGN KEY ("storySectionId") REFERENCES "public"."StorySection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RundownSection" ADD CONSTRAINT "RundownSection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RundownItem" ADD CONSTRAINT "RundownItem_rundownSectionId_fkey" FOREIGN KEY ("rundownSectionId") REFERENCES "public"."RundownSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuestBook" ADD CONSTRAINT "GuestBook_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuestBook" ADD CONSTRAINT "GuestBook_templateGuestId_fkey" FOREIGN KEY ("templateGuestId") REFERENCES "public"."TemplateGuestMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RSVP" ADD CONSTRAINT "RSVP_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RSVPSection" ADD CONSTRAINT "RSVPSection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdditionalSection" ADD CONSTRAINT "AdditionalSection_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
