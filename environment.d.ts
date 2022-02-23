declare namespace NodeJS {
	export interface ProcessEnv {
		OPERATOR_ID: string;
		OPERATOR_PVKEY: string;
		OPERATOR_PBKEY: string;
		KEYS: string;
		BIN: string;
		FILE_MEMO: string | undefined;
		EXPIRATION_DAYS: string | undefined;
		CONTRACT_GAS: string;
		CONSTRUCTOR_PARAMS: string | undefined;
		INITIAL_HBAR_BALANCE: string | undefined;
		ADMIN_KEY: string | undefined;
		PROXY_ACCOUNT_ID: string | undefined;
		CONTRACT_MEMO: string | undefined;
	}
}
