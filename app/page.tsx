import { getAllPlayerIndex } from "@/lib/data";
import { HomeClient } from "./HomeClient";

export default function HomePage() {
  const players = getAllPlayerIndex();
  return <HomeClient players={players} />;
}
