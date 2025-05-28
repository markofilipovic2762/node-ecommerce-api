import { db } from "@/db";
import { users } from "../../../drizzle/schema";
import { Request, Response } from "express"
import { eq, or } from "drizzle-orm";
import { createPasswordHash, createToken, verifyPasswordHash } from "@/services/authService";

export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, username, email, password } = req.body;
    const existing = await db
      .select()
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, email)));

    if (existing.length > 0) res.status(400).send("User already exists");

    const { hash, salt } = createPasswordHash(password);

    await db.insert(users).values({
      name,
      username,
      email,
      passwordHash: hash,
      passwordSalt: salt,
    });

    res.status(200).send("User successfully registered");
}

export const login = async (req: Request, res: Response) : Promise<void> => {
    const { username, email, password } = req.body;

    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, email)));

    if (!user) res.status(404).send("User not found");

    const valid = verifyPasswordHash(
      password,
      user.passwordHash,
      user.passwordSalt
    );
    if (!valid) res.status(400).send("Wrong password");

    const token = createToken({username: user.username, email: user.email, id: user.id});

    res.json({
      token,
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    });
}
