function getType(data: string): string {
  if (data === "easy") return "лёгкий";
  else if (data === "average") return "средний";
  else if (data === "difficult") return "сложный";
  else throw new Error("type undefined");
}

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + min)) + 1;
}

function getRandomType(type: string): number | never {
  if (type === "easy") return random(0, 10);
  else if (type === "average") return random(0, 50);
  else if (type === "difficult") return random(0, 100);
  else throw new Error("type undefined");
}

function replaceTypeNumber(data: string): number | never {
  if (data === "easy") return 10;
  else if (data === "average") return 50;
  else if (data === "difficult") return 100;
  else throw new Error("type undefined");
}

const maxAttempts: { [key: string]: number } = {
  easy: 3,
  average: 8,
  difficult: 12,
};

function getUserAttempts(type: string): number {
  return maxAttempts[type];
}

export {
  getType,
  getRandomType,
  replaceTypeNumber,
  getUserAttempts,
};