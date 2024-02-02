-- DropForeignKey
ALTER TABLE "ProjectService" DROP CONSTRAINT "ProjectService_project_id_fkey";

-- AddForeignKey
ALTER TABLE "ProjectService" ADD CONSTRAINT "ProjectService_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
