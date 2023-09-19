export enum Mood {
	good = 'good',
	bad = 'bad',
	warn = 'warn',
	neutral = 'neutral'
}

export enum PaymentStatus {
	SETTLED = 'SETTLED',
	OPEN = 'OPEN'
}

// API types

// GET /api/v1/towhom
export type ToWhomResponse = {
	total_count_pubkeys: number;
	total_count_wos_addresses: number;
	total_count: number;
};

// POST /api/v1/satogram
export type SatogramPayload = {
	total_cost: number;
	amt_per_satogram?: number;
	max_fees?: number;
	message: string;
	sender_address?: string;
};

export type SatogramResponse = {
	payment_request: string;
};

// GET /api/v1/status/:payment_request
export type StatusResponse = {
	payment_request: string;
	status: PaymentStatus;
};

// GET /api/v1/satogram/status/:payment_request
export type SatogramDetailsPayload = {
	payment_request: string;
	satogram_payload: SatogramPayload;
	satogram_progress: {
		success_count: number;
		failure_count: number;
		kickoff_count: number;
		finished_count: number;
		total_cost: number;
		satogram_status: number;
	};
	invoice_states: number;
	start_process_time: string;
	end_process_time: string;
};
