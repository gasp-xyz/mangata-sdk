import { Logger, ILogObj, ISettingsParam } from "tslog";

export let logger = {} as Logger<ILogObj>;
export const setLoggerOptions = (options: ISettingsParam<ILogObj> = {}) => {
  logger = new Logger({
    ...{
      name: "MangataLogger",
      type: "hidden",
      prettyLogTimeZone: "UTC",
      hideLogPositionForProduction: true,
      stylePrettyLogs: true,
      prettyLogStyles: {
        dateIsoStr: "blue",
        filePathWithLine: "yellow",
        fileName: ["yellow"]
      }
    },
    ...options
  });
};

setLoggerOptions({});
