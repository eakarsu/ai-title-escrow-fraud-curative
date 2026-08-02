CREATE TABLE IF NOT EXISTS app_users(
  id BIGSERIAL PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,role TEXT NOT NULL,password_hash TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS workflow_cases(
  id BIGSERIAL PRIMARY KEY,workflow_id TEXT NOT NULL,reference TEXT UNIQUE NOT NULL,subject TEXT NOT NULL,owner TEXT NOT NULL,state TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,payload JSONB NOT NULL DEFAULT '{}'::jsonb,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS audit_events(
  id BIGSERIAL PRIMARY KEY,event_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),actor TEXT NOT NULL,action TEXT NOT NULL,object_type TEXT NOT NULL,object_reference TEXT NOT NULL,detail TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS saved_analyses(
  id BIGSERIAL PRIMARY KEY,workflow_id TEXT NOT NULL,actor TEXT NOT NULL,analysis_type TEXT NOT NULL,inputs JSONB NOT NULL,result JSONB NOT NULL,provider TEXT NOT NULL,model TEXT,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS integration_state(
  id TEXT PRIMARY KEY,name TEXT NOT NULL,category TEXT NOT NULL,mode TEXT NOT NULL,status TEXT NOT NULL,last_tested TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_workflow_cases_workflow ON workflow_cases(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_cases_due ON workflow_cases(due_date);
CREATE INDEX IF NOT EXISTS idx_audit_events_time ON audit_events(event_time DESC);

CREATE TABLE IF NOT EXISTS "op_title_search"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_orderId" TEXT NOT NULL,
  "data_property" TEXT NOT NULL,
  "data_vesting" TEXT NOT NULL,
  "data_examinerNotes" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_title_search_due ON "op_title_search"(due_date);

CREATE TABLE IF NOT EXISTS "op_curative"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_requirementId" TEXT NOT NULL,
  "data_requirementType" TEXT NOT NULL,
  "data_targetDate" DATE NOT NULL,
  "data_curativeNotes" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_curative_due ON "op_curative"(due_date);

CREATE TABLE IF NOT EXISTS "op_payoff"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_lender" TEXT NOT NULL,
  "data_payoffAmount" NUMERIC(16,2) NOT NULL,
  "data_callbackNumber" TEXT NOT NULL,
  "data_verificationNotes" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_payoff_due ON "op_payoff"(due_date);

CREATE TABLE IF NOT EXISTS "op_escrow_fraud"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_transactionId" TEXT NOT NULL,
  "data_riskSignal" TEXT NOT NULL,
  "data_fundsAtRisk" NUMERIC(16,2) NOT NULL,
  "data_investigationNotes" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_escrow_fraud_due ON "op_escrow_fraud"(due_date);

CREATE TABLE IF NOT EXISTS "op_closing_disclosure"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_closingId" TEXT NOT NULL,
  "data_cashToClose" NUMERIC(16,2) NOT NULL,
  "data_ledgerBalance" NUMERIC(16,2) NOT NULL,
  "data_varianceNotes" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_closing_disclosure_due ON "op_closing_disclosure"(due_date);

CREATE TABLE IF NOT EXISTS "op_disbursement"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_closingId" TEXT NOT NULL,
  "data_disbursementAmount" NUMERIC(16,2) NOT NULL,
  "data_recordingStatus" TEXT NOT NULL,
  "data_releaseNotes" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_disbursement_due ON "op_disbursement"(due_date);

CREATE TABLE IF NOT EXISTS "op_recording"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_instrument" TEXT NOT NULL,
  "data_county" TEXT NOT NULL,
  "data_recordingDate" DATE NOT NULL,
  "data_recordingNotes" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_recording_due ON "op_recording"(due_date);

CREATE TABLE IF NOT EXISTS "op_policy"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_policyNumber" TEXT NOT NULL,
  "data_insured" TEXT NOT NULL,
  "data_coverageAmount" NUMERIC(16,2) NOT NULL,
  "data_policyNotes" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_policy_due ON "op_policy"(due_date);

CREATE TABLE IF NOT EXISTS "op_closing_register"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_closingId" TEXT NOT NULL,
  "data_property" TEXT NOT NULL,
  "data_lender" TEXT NOT NULL,
  "data_closingDate" DATE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_closing_register_due ON "op_closing_register"(due_date);

CREATE TABLE IF NOT EXISTS "op_party_register"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_party" TEXT NOT NULL,
  "data_role" TEXT NOT NULL,
  "data_verificationStatus" TEXT NOT NULL,
  "data_verifiedDate" DATE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_party_register_due ON "op_party_register"(due_date);

CREATE TABLE IF NOT EXISTS "op_escrow_ledger"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_closingId" TEXT NOT NULL,
  "data_ledgerBalance" NUMERIC(16,2) NOT NULL,
  "data_bankBalance" NUMERIC(16,2) NOT NULL,
  "data_reconciledDate" DATE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_escrow_ledger_due ON "op_escrow_ledger"(due_date);

CREATE TABLE IF NOT EXISTS "op_wire_instruction_register"(
  id BIGSERIAL PRIMARY KEY,reference TEXT UNIQUE NOT NULL,status TEXT NOT NULL,owner TEXT NOT NULL,risk TEXT NOT NULL,due_date DATE NOT NULL,amount NUMERIC(16,2) NOT NULL DEFAULT 0,
  "data_payee" TEXT NOT NULL,
  "data_bank" TEXT NOT NULL,
  "data_accountLast4" TEXT NOT NULL,
  "data_verifiedDate" DATE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_op_wire_instruction_register_due ON "op_wire_instruction_register"(due_date);
