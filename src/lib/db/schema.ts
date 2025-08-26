import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

// 카페 테이블
export const cafe = pgTable("cafe", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  value: integer("value"), // 가격대나 평점 등의 값
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 참여자 테이블
export const participant = pgTable("participant", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  instagram: varchar("instagram", { length: 255 }),
  cafeId: uuid("cafe_id")
    .references(() => cafe.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 게스트 포토 테이블
export const guestphoto = pgTable("guestphoto", {
  id: uuid("id").primaryKey().defaultRandom(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  adminApproval: boolean("admin_approval").default(false).notNull(), // 관리자 승인 상태 (true: 승인, false: 미승인)
  cafeId: uuid("cafe_id")
    .references(() => cafe.id, { onDelete: "cascade" })
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 관계 설정
export const cafeRelations = relations(cafe, ({ many }) => ({
  guestphotos: many(guestphoto),
  participants: many(participant),
}));

export const participantRelations = relations(participant, ({ one }) => ({
  cafe: one(cafe, {
    fields: [participant.cafeId],
    references: [cafe.id],
  }),
}));

export const guestphotoRelations = relations(guestphoto, ({ one }) => ({
  cafe: one(cafe, {
    fields: [guestphoto.cafeId],
    references: [cafe.id],
  }),
}));

// 타입 추출
export type Cafe = InferSelectModel<typeof cafe>;
export type NewCafe = InferInsertModel<typeof cafe>;

export type Participant = InferSelectModel<typeof participant>;
export type NewParticipant = InferInsertModel<typeof participant>;

export type Guestphoto = InferSelectModel<typeof guestphoto>;
export type NewGuestphoto = InferInsertModel<typeof guestphoto>;

// Zod 스키마 (선택사항 - 유효성 검사용)
export const insertCafeSchema = createInsertSchema(cafe);
export const selectCafeSchema = createSelectSchema(cafe);

export const insertParticipantSchema = createInsertSchema(participant);
export const selectParticipantSchema = createSelectSchema(participant);

export const insertGuestphotoSchema = createInsertSchema(guestphoto);
export const selectGuestphotoSchema = createSelectSchema(guestphoto);
