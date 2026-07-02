CREATE TABLE `lineups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`formation` varchar(20) NOT NULL,
	`slots` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lineups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`matchDate` timestamp NOT NULL,
	`ourGoals` int NOT NULL,
	`opponentGoals` int NOT NULL,
	`opponentName` varchar(100) NOT NULL,
	`result` enum('V','D','E') NOT NULL,
	`playerStats` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` varchar(64) NOT NULL,
	`nick` varchar(20) NOT NULL,
	`name` varchar(100),
	`number` int NOT NULL,
	`position` enum('ATA','MEI','ZAG','GOL','LAT') NOT NULL,
	`cargo` enum('Jogador','Reserva') NOT NULL DEFAULT 'Jogador',
	`avatarUrl` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `players_id` PRIMARY KEY(`id`),
	CONSTRAINT `players_nick_unique` UNIQUE(`nick`)
);
