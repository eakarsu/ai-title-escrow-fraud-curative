export interface PageConfig {
  label: string;
  href: string;
  description: string;
  entities: string[];
  workflows: string[];
}

export interface EntityConfig {
  name: string;
  label: string;
  fields: Array<{ name: string; kind: "string" | "number" | "boolean" | "date" }>;
}

export interface WorkflowConfig {
  slug: string;
  title: string;
  description: string;
  prompt: string;
  fields: string[];
}

export const appConfig = {
  slug: "ai-title-escrow-fraud-curative",
  title: "TitleGuard Closing Control",
  tagline: "Title curative, escrow fraud prevention, closing control",
  accent: "slate",
};

export const pages: PageConfig[] = [
  {
    label: "Title & Curative",
    href: "/title",
    description: "Searches, liens, curative requirements.",
    entities: ["TitleSearch", "LienRecord", "CurativeItem"],
    workflows: ["curative-plan"],
  },
  {
    label: "Fraud Control",
    href: "/fraud",
    description: "Wire verification and BEC fraud alerts.",
    entities: ["WireInstruction", "FraudAlert"],
    workflows: ["wire-verify"],
  },
  {
    label: "Disbursement",
    href: "/disbursement",
    description: "Payoffs, ledgers, dual approvals, CDs.",
    entities: ["PayoffStatement", "EscrowLedger", "DisbursementApproval", "DisclosureReconciliation"],
    workflows: [],
  },
  {
    label: "Closing Files",
    href: "/closing",
    description: "Files, recording, policy issuance.",
    entities: ["ClosingFile", "RecordingPackage", "PolicyIssuance"],
    workflows: ["closing-summary"],
  },
];

export const entities: Record<string, EntityConfig> = {
  ClosingFile: {
    name: "ClosingFile",
    label: "Closing File",
    fields: [{ name: "fileNumber", kind: "string" }, { name: "propertyAddress", kind: "string" }, { name: "buyer", kind: "string" }, { name: "seller", kind: "string" }, { name: "purchasePrice", kind: "number" }, { name: "status", kind: "string" }],
  },
  TitleSearch: {
    name: "TitleSearch",
    label: "Title Search",
    fields: [{ name: "underwriter", kind: "string" }, { name: "examiner", kind: "string" }, { name: "effectiveDate", kind: "string" }, { name: "status", kind: "string" }, { name: "searchedBy", kind: "string" }, { name: "productType", kind: "string" }],
  },
  LienRecord: {
    name: "LienRecord",
    label: "Lien Record",
    fields: [{ name: "kind", kind: "string" }, { name: "creditor", kind: "string" }, { name: "amount", kind: "number" }, { name: "priority", kind: "string" }, { name: "status", kind: "string" }, { name: "recordedAt", kind: "date" }],
  },
  CurativeItem: {
    name: "CurativeItem",
    label: "Curative Item",
    fields: [{ name: "requirement", kind: "string" }, { name: "kind", kind: "string" }, { name: "owner", kind: "string" }, { name: "status", kind: "string" }, { name: "dueDate", kind: "date" }, { name: "evidenceRef", kind: "string" }],
  },
  PayoffStatement: {
    name: "PayoffStatement",
    label: "Payoff Statement",
    fields: [{ name: "lender", kind: "string" }, { name: "loanNumber", kind: "string" }, { name: "payoffAmount", kind: "number" }, { name: "goodThrough", kind: "date" }, { name: "status", kind: "string" }, { name: "verifiedBy", kind: "string" }],
  },
  WireInstruction: {
    name: "WireInstruction",
    label: "Wire Instruction",
    fields: [{ name: "beneficiary", kind: "string" }, { name: "bankName", kind: "string" }, { name: "routingLast4", kind: "string" }, { name: "accountLast4", kind: "string" }, { name: "status", kind: "string" }, { name: "verifiedVia", kind: "string" }],
  },
  FraudAlert: {
    name: "FraudAlert",
    label: "Fraud Alert",
    fields: [{ name: "signal", kind: "string" }, { name: "severity", kind: "string" }, { name: "detail", kind: "string" }, { name: "status", kind: "string" }, { name: "raisedAt", kind: "date" }, { name: "assignee", kind: "string" }],
  },
  DisclosureReconciliation: {
    name: "DisclosureReconciliation",
    label: "CD Reconciliation",
    fields: [{ name: "buyerCd", kind: "string" }, { name: "sellerCd", kind: "string" }, { name: "variance", kind: "number" }, { name: "status", kind: "string" }, { name: "version", kind: "string" }, { name: "reconciledAt", kind: "date" }],
  },
  EscrowLedger: {
    name: "EscrowLedger",
    label: "Escrow Ledger",
    fields: [{ name: "period", kind: "string" }, { name: "deposits", kind: "number" }, { name: "disbursements", kind: "number" }, { name: "balance", kind: "number" }, { name: "status", kind: "string" }, { name: "reconciledAt", kind: "date" }],
  },
  DisbursementApproval: {
    name: "DisbursementApproval",
    label: "Disbursement Approval",
    fields: [{ name: "payee", kind: "string" }, { name: "amount", kind: "number" }, { name: "approverOne", kind: "string" }, { name: "approverTwo", kind: "string" }, { name: "status", kind: "string" }, { name: "requestedAt", kind: "date" }],
  },
  RecordingPackage: {
    name: "RecordingPackage",
    label: "Recording Package",
    fields: [{ name: "county", kind: "string" }, { name: "instrument", kind: "string" }, { name: "status", kind: "string" }, { name: "submittedAt", kind: "date" }, { name: "recordingNumber", kind: "string" }, { name: "recordingFee", kind: "number" }],
  },
  PolicyIssuance: {
    name: "PolicyIssuance",
    label: "Policy Issuance",
    fields: [{ name: "policyNumber", kind: "string" }, { name: "underwriter", kind: "string" }, { name: "policyType", kind: "string" }, { name: "coverageAmount", kind: "number" }, { name: "status", kind: "string" }, { name: "issuedAt", kind: "date" }],
  },
};

export const workflows: WorkflowConfig[] = [
  {
    slug: "curative-plan",
    title: "Curative Planner",
    description: "Build the curative plan for title defects.",
    prompt: "You are a title curative officer. For the described defect chain, produce a curative plan with requirements, responsible parties, and target dates.",
    fields: ["defects", "vestingIssue", "liens", "closingTarget"],
  },
  {
    slug: "wire-verify",
    title: "Wire Fraud Analyzer",
    description: "Score escrow/wire instruction compromise risk.",
    prompt: "You are an escrow-fraud investigator. Score the wire-instruction change for BEC risk using account changes, email domain similarity, urgency patterns and callback evidence.",
    fields: ["changeRequest", "previousInstruction", "emailMetadata", "callbackDone"],
  },
  {
    slug: "closing-summary",
    title: "Closing Summary Drafter",
    description: "Summarize a closing file for post-closing review.",
    prompt: "You are a post-closing auditor. Summarize the closing file: disbursements, recording status, policy issuance, open curative items.",
    fields: ["fileNumber", "disbursements", "recordingStatus", "openItems"],
  },
];

export function findPage(href: string): PageConfig | undefined {
  return pages.find((p) => p.href === href);
}
