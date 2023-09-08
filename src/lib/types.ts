export enum Mood {
	good = 'good',
	bad = 'bad',
	warn = 'warn',
	neutral = 'neutral'
}

// API types

// GET /api/v1/towhom
export type ToWhomResponse = {
	pubkeys: string[];
	wos_addresses: string[];
	total_count: number;
};

// POST /api/v1/satogram
export type SatogramPayload = {
	total_cost: number;
	amt_per_satogram?: number;
	max_fees?: number;
	message: string;
};

export type SatogramResponse = {
	payment_request: string;
};

// GET /api/v1/status/:payment_request
export type StatusResponse = {
	payment_request: string;
	status: string;
};
