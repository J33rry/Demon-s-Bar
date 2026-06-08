import { pgTable, timestamp, uuid, varchar, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    firebaseUid: varchar("firebase_uid", {
        length: 128,
    })
        .notNull()
        .unique(),
    name: varchar("name", {
        length: 255,
    }),
    email: varchar("email", {
        length: 255,
    }),
    username: varchar("username", {
        length: 20,
    }).unique(),
    phone: varchar("phone", {
        length: 20,
    }),
    avatar: text("avatar"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const chats = pgTable("chats", {
    id: uuid("id").defaultRandom().primaryKey(),
    senderId: uuid("sender_id").notNull(),
    receiverId: uuid("receiver_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
    id: uuid("id").defaultRandom().primaryKey(),
    senderId: uuid("sender_id").notNull(),
    receiverId: uuid("receiver_id").notNull(),
    text: varchar("text", { length: 255 }),
    image: varchar("image", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
