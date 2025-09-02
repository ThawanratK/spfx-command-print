declare interface IOnePrintCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'OnePrintCommandSetStrings' {
  const strings: IOnePrintCommandSetStrings;
  export = strings;
}
