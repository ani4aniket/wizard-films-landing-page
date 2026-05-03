-- CreateTable
CREATE TABLE "NavLink" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavLink_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "navCtaLabel" TEXT,
ADD COLUMN "navCtaHref" TEXT,
ADD COLUMN "searchArchivePlaceholder" TEXT,
ADD COLUMN "footerLeadLine" TEXT,
ADD COLUMN "workPageEyebrow" TEXT,
ADD COLUMN "workPageHeroTitle" TEXT,
ADD COLUMN "workPageHeroDescription" TEXT,
ADD COLUMN "servicesPageEyebrow" TEXT,
ADD COLUMN "servicesPageHeroTitle" TEXT,
ADD COLUMN "servicesPageHeroDescription" TEXT,
ADD COLUMN "projectRelatedEyebrow" TEXT,
ADD COLUMN "projectRelatedTitle" TEXT,
ADD COLUMN "projectRelatedDescription" TEXT,
ADD COLUMN "projectPlaybackNote" TEXT,
ADD COLUMN "homeFeaturedWorkCtaLabel" TEXT,
ADD COLUMN "homeFeaturedWorkCtaHref" TEXT;

-- AlterTable
ALTER TABLE "HomepageContent" ADD COLUMN "heroEyebrow" TEXT,
ADD COLUMN "heroAsideEyebrow" TEXT,
ADD COLUMN "heroAsideFocus" TEXT,
ADD COLUMN "featuredEyebrow" TEXT,
ADD COLUMN "featuredTitle" TEXT,
ADD COLUMN "featuredDescription" TEXT,
ADD COLUMN "servicesEyebrow" TEXT,
ADD COLUMN "servicesTitle" TEXT,
ADD COLUMN "servicesDescription" TEXT,
ADD COLUMN "approachEyebrow" TEXT,
ADD COLUMN "approachTitle" TEXT,
ADD COLUMN "approachDescription" TEXT,
ADD COLUMN "approachBullets" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "AboutContent" ADD COLUMN "pageHeroEyebrow" TEXT,
ADD COLUMN "pageHeroTitle" TEXT,
ADD COLUMN "pageHeroDescription" TEXT;

-- AlterTable
ALTER TABLE "ContactContent" ADD COLUMN "pageHeroEyebrow" TEXT,
ADD COLUMN "pageHeroTitle" TEXT,
ADD COLUMN "pageHeroDescription" TEXT;
