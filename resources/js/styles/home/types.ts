export type Declarations = Record<string, string>;
export type StyleRule = Declarations | StyleSheet;

export type StyleSheet = {
  [selector: string]: StyleRule;
};
