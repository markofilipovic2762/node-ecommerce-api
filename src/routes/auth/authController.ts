import { db } from "@/db";
import { usersInEshop } from "../../../drizzle/schema";
import { Request, Response } from "express"
import { eq, or } from "drizzle-orm";
import { createPasswordHash, createToken, verifyPasswordHash } from "@/services/authService";

export async function register(req: Request, res: Response) {
    const { name, username, email, password } = req.body;
    const existing = await db
      .select()
      .from(usersInEshop)
      .where(or(eq(usersInEshop.username, username), eq(usersInEshop.email, email)));

    if (existing.length > 0) return res.status(400).send("User already exists");

    const { hash, salt } = createPasswordHash(password);

    await db.insert(usersInEshop).values({
      name,
      username,
      email,
      passwordHash: hash,
      passwordSalt: salt,
    });

    res.status(200).send("User successfully registered");
}

export async function login(req: Request, res: Response) {
    const { username, email, password } = req.body;

    const [user] = await db
      .select()
      .from(usersInEshop)
      .where(or(eq(usersInEshop.username, username), eq(usersInEshop.email, email)));

    if (!user) return res.status(404).send("User not found");

    const valid = verifyPasswordHash(
      password,
      user.passwordHash,
      user.passwordSalt
    );
    if (!valid) return res.status(400).send("Wrong password");

    const token = createToken({username: user.username, email: user.email, id: user.id});

    res.json({
      token,
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    });
}
