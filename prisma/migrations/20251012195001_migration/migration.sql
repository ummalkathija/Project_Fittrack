/*
  Warnings:

  - You are about to drop the column `color` on the `workout_types` table. All the data in the column will be lost.
  - Made the column `auth0_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `auth0_id` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `workout_types` DROP COLUMN `color`;

-- CreateIndex
CREATE INDEX `idx_plan_completed_day` ON `plan_days`(`plan_id`, `is_completed`, `day_of_week`);

-- CreateIndex
CREATE INDEX `idx_type_completed` ON `plan_days`(`workout_type_id`, `is_completed`);

-- CreateIndex
CREATE INDEX `idx_plan_type` ON `plan_days`(`plan_id`, `workout_type_id`);

-- CreateIndex
CREATE INDEX `idx_user_active_week` ON `plans`(`user_id`, `is_active`, `week_start`);

-- CreateIndex
CREATE INDEX `idx_active_created` ON `plans`(`is_active`, `created_at`);

-- CreateIndex
CREATE INDEX `idx_email_created` ON `users`(`email`, `created_at`);

-- CreateIndex
CREATE INDEX `idx_name_created` ON `users`(`name`, `created_at`);

-- CreateIndex
CREATE INDEX `idx_auth0_id` ON `users`(`auth0_id`);

-- CreateIndex
CREATE INDEX `idx_user_type_date` ON `workouts`(`user_id`, `workout_type_id`, `performed_at`);

-- CreateIndex
CREATE INDEX `idx_date_type` ON `workouts`(`performed_at`, `workout_type_id`);

-- CreateIndex
CREATE INDEX `idx_user_created` ON `workouts`(`user_id`, `created_at`);

-- CreateIndex
CREATE INDEX `idx_duration_calories` ON `workouts`(`duration_min`, `calories`);
