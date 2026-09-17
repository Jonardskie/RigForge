CREATE TABLE `activity_logs` (
	`id` varchar(64) NOT NULL,
	`store_id` varchar(64),
	`action_type` enum('STOCK_RESTOCK','RULE_CREATED','RULE_TOGGLED','BUILD_VERIFIED','COMPONENT_ADDED','PRICE_UPDATED') NOT NULL,
	`entity_type` enum('COMPONENT','RULE','BUILD','SYSTEM') NOT NULL,
	`description` text NOT NULL,
	`performed_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `compatibility_rules` (
	`id` varchar(64) NOT NULL,
	`store_id` varchar(64),
	`name` varchar(255) NOT NULL,
	`source_category` enum('CPU','Motherboard','GPU','RAM','Cooler','Case','PSU','Display') NOT NULL,
	`target_category` enum('CPU','Motherboard','GPU','RAM','Cooler','Case','PSU','Display') NOT NULL,
	`rule_type` enum('SOCKET_MATCH','POWER_ENVELOPE','CLEARANCE_LENGTH','FORM_FACTOR') NOT NULL,
	`severity` enum('BLOCKING','WARNING') NOT NULL DEFAULT 'BLOCKING',
	`description` text NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `compatibility_rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `components` (
	`id` varchar(64) NOT NULL,
	`store_id` varchar(64),
	`sku` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('CPU','Motherboard','GPU','RAM','Cooler','Case','PSU','Display') NOT NULL,
	`socket` varchar(32),
	`watts` int,
	`length_mm` int,
	`max_gpu_length` int,
	`price` int NOT NULL,
	`stock_quantity` int NOT NULL DEFAULT 0,
	`low_stock_threshold` int NOT NULL DEFAULT 5,
	`status` enum('ACTIVE','ARCHIVED','OUT_OF_STOCK') NOT NULL DEFAULT 'ACTIVE',
	`image` text,
	`tags` text,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `components_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `custom_builds` (
	`id` varchar(64) NOT NULL,
	`store_id` varchar(64),
	`order_number` varchar(64) NOT NULL,
	`customer_name` varchar(255) NOT NULL,
	`profile` enum('CREATOR','AI DEV','ESPORTS','CUSTOM') NOT NULL DEFAULT 'CUSTOM',
	`items_json` text NOT NULL,
	`total_watts` int NOT NULL,
	`recommended_psu` int NOT NULL,
	`total_price` int NOT NULL,
	`risk_score` enum('LOW','MEDIUM','HIGH') NOT NULL DEFAULT 'LOW',
	`status` enum('PENDING_VERIFICATION','APPROVED','IN_ASSEMBLY','COMPLETED') NOT NULL DEFAULT 'PENDING_VERIFICATION',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `custom_builds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` varchar(64) NOT NULL,
	`shop_domain` varchar(255) NOT NULL,
	`access_token` text NOT NULL,
	`installed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stores_id` PRIMARY KEY(`id`),
	CONSTRAINT `stores_shop_domain_unique` UNIQUE(`shop_domain`)
);
--> statement-breakpoint
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_store_id_stores_id_fk` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `compatibility_rules` ADD CONSTRAINT `compatibility_rules_store_id_stores_id_fk` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `components` ADD CONSTRAINT `components_store_id_stores_id_fk` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `custom_builds` ADD CONSTRAINT `custom_builds_store_id_stores_id_fk` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE no action ON UPDATE no action;