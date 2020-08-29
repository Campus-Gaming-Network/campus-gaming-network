import matchSorter from "match-sorter";

export async function getSchools(filter, schools = []) {
  if (!filter) {
    return schools;
  }

  return matchSorter(schools, filter, { keys: ["name"] });
}
