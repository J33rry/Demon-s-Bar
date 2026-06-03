import { pgTable ,serial,timestamp,varchar,now} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    profilePic: varchar("profile_pic", { length: 255 }),
    createdAt: timestamp("created_at").default(now()).notNull(),
    updatedAt: timestamp("updated_at").default(now()).notNull(),

});

export const messageTable = pgTable("messages",{
    id: serial("id").primaryKey(),
    senderId: serial("sender_id").notNull(),
    receiverId: serial("receiver_id").notNull(),
    text: varchar("text", { length: 255 }),
    image: varchar("image", { length: 255 }),
    createdAt: timestamp("created_at").default(now()).notNull(),
    updatedAt: timestamp("updated_at").default(now()).notNull(),
})