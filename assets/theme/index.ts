import { anyMap } from "../../types/theme";
const PRIMARY = `--primary`;
const SECONDARY = `--secondary`;

const keys = [PRIMARY, SECONDARY];

const styleVariables = [[`#49240F`, `#E4A79D`]];

function zip(array: string[]) {
  return array.reduce((prev, cur, i) => {
    prev[keys[i]] = cur;
    return prev;
  }, {} as anyMap);
}

export function changeTheme(index = 0) {
  return zip(styleVariables[index]);
}
