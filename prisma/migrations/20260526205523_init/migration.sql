-- CreateEnum
CREATE TYPE "SimulationStatus" AS ENUM ('in_progress', 'completed', 'outcome_added');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "context_json" JSONB NOT NULL,
    "status" "SimulationStatus" NOT NULL DEFAULT 'in_progress',
    "total_score" INTEGER,
    "final_report_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulation_turns" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "turn_number" INTEGER NOT NULL,
    "ai_message" TEXT NOT NULL,
    "user_message" TEXT NOT NULL,
    "scores_json" JSONB NOT NULL,
    "feedback" TEXT NOT NULL,
    "better_alternative" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulation_turns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulation_outcomes" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "what_happened" TEXT NOT NULL,
    "other_person_reaction" TEXT NOT NULL,
    "goal_result" TEXT NOT NULL,
    "satisfaction_score" INTEGER NOT NULL,
    "next_goal" TEXT NOT NULL,
    "ai_followup_advice_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "simulation_outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "simulations_user_id_created_at_idx" ON "simulations"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "simulation_turns_simulation_id_idx" ON "simulation_turns"("simulation_id");

-- CreateIndex
CREATE UNIQUE INDEX "simulation_turns_simulation_id_turn_number_key" ON "simulation_turns"("simulation_id", "turn_number");

-- CreateIndex
CREATE UNIQUE INDEX "simulation_outcomes_simulation_id_key" ON "simulation_outcomes"("simulation_id");

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_turns" ADD CONSTRAINT "simulation_turns_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "simulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_outcomes" ADD CONSTRAINT "simulation_outcomes_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "simulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
