/*
  Warnings:

  - A unique constraint covering the columns `[user_id,game_id,platform_id]` on the table `game_status` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "game_status_user_id_game_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "game_status_user_id_game_id_platform_id_key" ON "game_status"("user_id", "game_id", "platform_id");
