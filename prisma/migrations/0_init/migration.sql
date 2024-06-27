-- CreateTable
CREATE TABLE "item" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "likes" INTEGER DEFAULT 0,
    "parent_id" INTEGER,
    "time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,

    CONSTRAINT "pk_item" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "fk_item_item" FOREIGN KEY ("parent_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

