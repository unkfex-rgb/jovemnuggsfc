import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const players = mysqlTable("players", {
  id: varchar("id", { length: 64 }).notNull().primaryKey(),
  nick: varchar("nick", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 100 }),
  number: int("number").notNull(),
  position: mysqlEnum("position", ["ATA", "MEI", "ZAG", "GOL", "LAT"]).notNull(),
  cargo: mysqlEnum("cargo", ["Jogador", "Reserva"]).default("Jogador").notNull(),
  avatarUrl: varchar("avatarUrl", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  matchDate: timestamp("matchDate").notNull(),
  ourGoals: int("ourGoals").notNull(),
  opponentGoals: int("opponentGoals").notNull(),
  opponentName: varchar("opponentName", { length: 100 }).notNull(),
  result: mysqlEnum("result", ["V", "D", "E"]).notNull(),
  playerStats: text("playerStats"), // JSON string of player stats for this match
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const lineups = mysqlTable("lineups", {
  id: int("id").autoincrement().primaryKey(),
  formation: varchar("formation", { length: 20 }).notNull(), // e.g., "4-3-3"
  slots: text("slots"), // JSON string of player IDs in each slot
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;
export type Lineup = typeof lineups.$inferSelect;
export type InsertLineup = typeof lineups.$inferInsert;

// TODO: Add your tables here