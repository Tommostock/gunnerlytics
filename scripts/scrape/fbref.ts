import axios from "axios";
import * as cheerio from "cheerio";

const FBREF_ARSENAL_URL = "https://fbref.com/en/squads/18bb7c10/Arsenal-Stats";
const FBREF_ARSENAL_HISTORY_URL =
  "https://fbref.com/en/squads/18bb7c10/history/Arsenal-Stats-and-History";

const REQUEST_DELAY_MS = 4000;

interface ScrapedPlayer {
  name: string;
  nationality: string;
  position: string;
  appearances: number;
  goals: number;
  assists: number;
  minutesPlayed: number;
  yellowCards: number;
  redCards: number;
  dateOfBirth?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url: string): Promise<string> {
  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; Gunnerlytics/1.0; +https://github.com/gunnerlytics)",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
    timeout: 30000,
  });
  return response.data;
}

function parsePosition(posStr: string): string {
  const map: Record<string, string> = {
    GK: "GK",
    DF: "CB",
    "DF,MF": "CB",
    MF: "CM",
    "MF,FW": "CAM",
    "MF,DF": "CDM",
    FW: "ST",
    "FW,MF": "CF",
    "FW,DF": "CF",
  };
  return map[posStr.trim()] || "CM";
}

function parseNumber(text: string): number {
  const num = parseInt(text.replace(/,/g, "").trim(), 10);
  return isNaN(num) ? 0 : num;
}

export async function scrapeArsenalSquad(): Promise<ScrapedPlayer[]> {
  const players: ScrapedPlayer[] = [];

  try {
    console.log("  Fetching current squad page...");
    const html = await fetchPage(FBREF_ARSENAL_URL);
    const $ = cheerio.load(html);

    // Parse the standard stats table
    const table = $('table[id="stats_standard_9"]');
    if (table.length === 0) {
      console.log("  Warning: Could not find stats table. Trying alternate selector...");
      // Try alternate approach - look for any stats table
      const altTable = $("table.stats_table").first();
      if (altTable.length > 0) {
        parseStatsTable(altTable, $, players);
      } else {
        console.log("  No stats tables found on page.");
      }
    } else {
      parseStatsTable(table, $, players);
    }

    console.log(`  Parsed ${players.length} players from current squad`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`  FBref request failed: ${error.response?.status || error.message}`);
      if (error.response?.status === 429) {
        console.error("  Rate limited by FBref. Try again later.");
      }
    } else {
      console.error("  Error scraping FBref:", error);
    }
  }

  return players;
}

function parseStatsTable(
  table: cheerio.Cheerio<cheerio.Element>,
  $: cheerio.CheerioAPI,
  players: ScrapedPlayer[]
): void {
  table.find("tbody tr:not(.thead)").each((_, row) => {
    const $row = $(row);

    // Skip spacer/header rows
    if ($row.hasClass("spacer") || $row.hasClass("partial_table")) return;
    if ($row.find("th").attr("data-stat") === "ranker") return;

    const nameCell = $row.find('td[data-stat="player"]');
    const name = nameCell.find("a").text().trim() || nameCell.text().trim();
    if (!name) return;

    const nationality =
      $row
        .find('td[data-stat="nationality"]')
        .text()
        .trim()
        .split(" ")
        .pop() || "";

    const position = $row.find('td[data-stat="position"]').text().trim();
    const age = $row.find('td[data-stat="age"]').text().trim();

    const appearances = parseNumber(
      $row.find('td[data-stat="games"]').text()
    );
    const goals = parseNumber(
      $row.find('td[data-stat="goals"]').text()
    );
    const assists = parseNumber(
      $row.find('td[data-stat="assists"]').text()
    );
    const minutes = parseNumber(
      $row.find('td[data-stat="minutes"]').text()
    );
    const yellowCards = parseNumber(
      $row.find('td[data-stat="cards_yellow"]').text()
    );
    const redCards = parseNumber(
      $row.find('td[data-stat="cards_red"]').text()
    );

    if (name && appearances > 0) {
      players.push({
        name,
        nationality: cleanNationality(nationality),
        position: parsePosition(position),
        appearances,
        goals,
        assists,
        minutesPlayed: minutes,
        yellowCards,
        redCards,
      });
    }
  });
}

function cleanNationality(raw: string): string {
  // FBref uses country codes like "eng ENG", "fr FRA"
  const countryMap: Record<string, string> = {
    ENG: "England",
    FRA: "France",
    BRA: "Brazil",
    ESP: "Spain",
    NED: "Netherlands",
    GER: "Germany",
    ITA: "Italy",
    POR: "Portugal",
    BEL: "Belgium",
    NOR: "Norway",
    SCO: "Scotland",
    WAL: "Wales",
    NIR: "Northern Ireland",
    IRL: "Ireland",
    GHA: "Ghana",
    NGA: "Nigeria",
    CIV: "Ivory Coast",
    CMR: "Cameroon",
    SEN: "Senegal",
    JPN: "Japan",
    EGY: "Egypt",
    GRE: "Greece",
    SWE: "Sweden",
    DEN: "Denmark",
    SUI: "Switzerland",
    CZE: "Czech Republic",
    POL: "Poland",
    URU: "Uruguay",
    ARG: "Argentina",
    COL: "Colombia",
    CHI: "Chile",
    USA: "United States",
    CAN: "Canada",
    AUS: "Australia",
    GAB: "Gabon",
    UKR: "Ukraine",
    GEO: "Georgia",
  };

  const upper = raw.toUpperCase().trim();
  return countryMap[upper] || raw || "Unknown";
}

export type { ScrapedPlayer };
