import { CreateStorage } from "database-sempai";

class UserCache {
  db: CreateStorage<number, {
    first_name: string;
    username: string;
    lang_code: string;
    attemptsLeft: number;
  }>;
  
  constructor() {
    this.db = new CreateStorage({
      table: ["user"],
    });
  }
  
  async get(item: number): Promise<{
    first_name: string;
    username: string;
    lang_code: string;
    attemptsLeft: number;
  }> {
    return await this.db.get("user", item);
  }
  
  async set(item: number, value: {
    first_name: string;
    username: string;
    lang_code: string;
    attemptsLeft: number;
  }): Promise<void> {
    await this.db.set("user", item, value);
  }
  
}

class GameStart {
  db: CreateStorage<number, {
    type: string,
    random: number,
    messageId: number,
    attemptsLeft: number,
  }>;
  
  constructor() {
    this.db = new CreateStorage({
      table: ["game"]
    });
  }
  
  async get(item: number): Promise<{
    type: string,
    random: number,
    messageId: number,
    attemptsLeft: number,
  }> {
    return await this.db.get("game", item);
  }
  
  async set(item: number, value: {
    type: string,
    random: number,
    messageId: number,
    attemptsLeft: number,
  }): Promise<void> {
    await this.db.set("game", item, value);
  }
  
  async has(item: number): Promise<boolean> {
    return await this.db.has("game", item);
  }
  
  async delete(item: number): Promise<void> {
    await this.db.delete("game", item);
  }
}

export {
  UserCache,
  GameStart,
};
