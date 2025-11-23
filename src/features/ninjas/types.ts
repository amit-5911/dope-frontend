export interface Ninja {
  id: string;
  name: string;
  location: "Konoha" | "Suna" | "Kiri" | "Iwa" | "Kumo";
  health: "Healthy" | "Injured" | "Critical";
  power: number;
}
