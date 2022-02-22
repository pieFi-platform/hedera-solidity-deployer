declare namespace NodeJS {
  export interface ProcessEnv {
      OPERATOR_ID: string;
      OPERATOR_PVKEY: string;
      OPERATOR_PBKEY: string;
      BIN: string;
      CONTRACT_GAS: string;
      CONSTRUCTOR_PARAMS: string;
  }
}