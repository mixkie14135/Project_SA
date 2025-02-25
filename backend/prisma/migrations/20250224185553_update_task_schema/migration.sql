/*
  Warnings:

  - A unique constraint covering the columns `[category_name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[priority]` on the table `priority` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[status]` on the table `status` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `categories_category_name_key` ON `categories`(`category_name`);

-- CreateIndex
CREATE UNIQUE INDEX `priority_priority_key` ON `priority`(`priority`);

-- CreateIndex
CREATE UNIQUE INDEX `status_status_key` ON `status`(`status`);
