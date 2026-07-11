ALTER TABLE "chairs" ALTER COLUMN "clinic_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chairs" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "chairs" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "visit_templates" ADD COLUMN "specialty" varchar(100);--> statement-breakpoint
ALTER TABLE "visit_templates" ADD COLUMN "default_icd10_label" varchar(255);--> statement-breakpoint
ALTER TABLE "visit_templates" ADD COLUMN "is_built_in" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "visit_templates" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;