import { faker } from "@faker-js/faker";
import type { Ninja } from "./types";

export function generateNinjas(count = 1000): Ninja[] {
  const locations = ["Konoha", "Suna", "Kiri", "Iwa", "Kumo"] as const;
  const healthStates = ["Healthy", "Injured", "Critical"] as const;

  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    location: faker.helpers.arrayElement(locations),
    health: faker.helpers.arrayElement(healthStates),
    power: faker.number.int({ min: 100, max: 10000 }),
  }));
}
