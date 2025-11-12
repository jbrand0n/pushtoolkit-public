/*
  Warnings:

  - Added the required column `updated_at` to the `rss_feeds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rss_feeds" ADD COLUMN     "create_draft" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "icon_url" TEXT,
ADD COLUMN     "max_pushes_per_day" INTEGER,
ADD COLUMN     "segment_id" TEXT,
ADD COLUMN     "show_action_buttons" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "utm_params" JSONB;

-- CreateIndex
CREATE INDEX "rss_feeds_site_id_idx" ON "rss_feeds"("site_id");

-- CreateIndex
CREATE INDEX "rss_feeds_is_active_idx" ON "rss_feeds"("is_active");

-- AddForeignKey
ALTER TABLE "rss_feeds" ADD CONSTRAINT "rss_feeds_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "segments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
