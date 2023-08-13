const { CreateStorage } = require("database-sempai");

class UserCache {
  constructor() {
    this.db = new CreateStorage({
      table: ["user"],
    });
  }
  
  async get(item) {
    return await this.db.get("user", item);
  }
  
  async set(item, value) {
    await this.db.set("user", item, value);
  }
  
}

class GameStart {
  constructor() {
    this.db = new CreateStorage({
      table: ["game"]
    });
  }
  
  async get(item) {
    return await this.db.get("game", item);
  }
  
  async set(item, value) {
    await this.db.set("game", item, value);
  }
  
  async has(item) {
    return await this.db.has("game", item);
  }
  
  async delete(item) {
    await this.db.delete("game", item);
  }
}

module.exports = {
  UserCache,
  GameStart,
};
