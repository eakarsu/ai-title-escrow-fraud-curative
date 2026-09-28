// Seed script — creates demo users and realistic domain records.
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const phones = ["(415) 555-0132", "(212) 555-0187", "(312) 555-0149", "(617) 555-0110"];
const cities = ["Chicago, IL", "Austin, TX", "Boston, MA", "Denver, CO", "Seattle, WA"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function amount(i: number, base = 1000): number { return Math.round((base + ((i * 7919) % 900) * base) * 100) / 100; }
function daysAgo(i: number, spread = 180): Date { return new Date(Date.now() - ((i * 37) % spread) * 86400000); }

async function main() {
  const database = new URL(process.env.DATABASE_URL || "").pathname.slice(1);
  if (process.env.NODE_ENV === "production" || process.env.ALLOW_DEMO_SEED !== "true" || !/^(demo_|inspection_test_)/.test(database)) throw new Error("Demo seeding requires ALLOW_DEMO_SEED=true and a dedicated demo_ or inspection_test_ database");
  if (!process.env.DEMO_PASSWORD || process.env.DEMO_PASSWORD.length < 16) throw new Error("Set DEMO_PASSWORD to at least 16 characters");
  const passwordHash = await bcrypt.hash(process.env.DEMO_PASSWORD!, 12);
  const demoUsers: Array<[string, string, Role]> = [
    ["admin@ai-title-escrow-fraud-curative.local", "Demo Admin", "ADMIN"],
    ["manager@ai-title-escrow-fraud-curative.local", "Demo Manager", "MANAGER"],
    ["analyst@ai-title-escrow-fraud-curative.local", "Demo Analyst", "ANALYST"],
  ];
  for (const [email, name, role] of demoUsers) {
    await prisma.user.upsert({ where: { email }, update: {}, create: { email, name, role, passwordHash } });
  }

  const STATUSES_ClosingFile = ["OPEN", "CLEAR", "CLOSING", "CLOSED"];
  await prisma.closingFile.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.closingFile.create({
      data: {
      fileNumber: `FileNumber ${String(i + 1).padStart(3, "0")}`,
      propertyAddress: `PropertyAddress ${String(i + 1).padStart(3, "0")}`,
      buyer: `Buyer ${String(i + 1).padStart(3, "0")}`,
      seller: `Seller ${String(i + 1).padStart(3, "0")}`,
      purchasePrice: amount(i, 250),
      status: pick(STATUSES_ClosingFile, i)
      },
    });
  }

  const closingFileRefs = await prisma.closingFile.findMany({ select: { id: true } });

  const STATUSES_TitleSearch = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.titleSearch.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.titleSearch.create({
      data: {
      underwriter: `Underwriter ${String(i + 1).padStart(3, "0")}`,
      examiner: `Examiner ${String(i + 1).padStart(3, "0")}`,
      effectiveDate: `EffectiveDate ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_TitleSearch, i),
      searchedBy: `SearchedBy ${String(i + 1).padStart(3, "0")}`,
      productType: `ProductType ${String(i + 1).padStart(3, "0")}`,
      file: { connect: { id: closingFileRefs[i % closingFileRefs.length].id } }
      },
    });
  }

  const STATUSES_LienRecord = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.lienRecord.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.lienRecord.create({
      data: {
      kind: `Kind ${String(i + 1).padStart(3, "0")}`,
      creditor: `Creditor ${String(i + 1).padStart(3, "0")}`,
      amount: amount(i, 250),
      priority: `Priority ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_LienRecord, i),
      recordedAt: daysAgo(i),
      file: { connect: { id: closingFileRefs[i % closingFileRefs.length].id } }
      },
    });
  }

  const STATUSES_CurativeItem = ["OPEN", "CURED", "WAIVED", "ESCALATED"];
  await prisma.curativeItem.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.curativeItem.create({
      data: {
      requirement: `Requirement ${String(i + 1).padStart(3, "0")}`,
      kind: `Kind ${String(i + 1).padStart(3, "0")}`,
      owner: `Owner ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_CurativeItem, i),
      dueDate: daysAgo(i),
      evidenceRef: `EvidenceRef ${String(i + 1).padStart(3, "0")}`,
      file: { connect: { id: closingFileRefs[i % closingFileRefs.length].id } }
      },
    });
  }

  const STATUSES_PayoffStatement = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.payoffStatement.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.payoffStatement.create({
      data: {
      lender: `Lender ${String(i + 1).padStart(3, "0")}`,
      loanNumber: `LoanNumber ${String(i + 1).padStart(3, "0")}`,
      payoffAmount: amount(i, 250),
      goodThrough: daysAgo(i),
      status: pick(STATUSES_PayoffStatement, i),
      verifiedBy: `VerifiedBy ${String(i + 1).padStart(3, "0")}`,
      file: { connect: { id: closingFileRefs[i % closingFileRefs.length].id } }
      },
    });
  }

  const STATUSES_WireInstruction = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.wireInstruction.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.wireInstruction.create({
      data: {
      beneficiary: `Beneficiary ${String(i + 1).padStart(3, "0")}`,
      bankName: `BankName ${String(i + 1).padStart(3, "0")}`,
      routingLast4: `RoutingLast4 ${String(i + 1).padStart(3, "0")}`,
      accountLast4: `AccountLast4 ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_WireInstruction, i),
      verifiedVia: `VerifiedVia ${String(i + 1).padStart(3, "0")}`,
      file: { connect: { id: closingFileRefs[i % closingFileRefs.length].id } }
      },
    });
  }

  const STATUSES_FraudAlert = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.fraudAlert.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.fraudAlert.create({
      data: {
      signal: `Signal ${String(i + 1).padStart(3, "0")}`,
      severity: `Severity ${String(i + 1).padStart(3, "0")}`,
      detail: `Detail ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_FraudAlert, i),
      raisedAt: daysAgo(i),
      assignee: `Assignee ${String(i + 1).padStart(3, "0")}`,
      file: { connect: { id: closingFileRefs[i % closingFileRefs.length].id } }
      },
    });
  }

  const STATUSES_DisclosureReconciliation = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.disclosureReconciliation.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.disclosureReconciliation.create({
      data: {
      buyerCd: `BuyerCd ${String(i + 1).padStart(3, "0")}`,
      sellerCd: `SellerCd ${String(i + 1).padStart(3, "0")}`,
      variance: amount(i, 250),
      status: pick(STATUSES_DisclosureReconciliation, i),
      version: `Version ${String(i + 1).padStart(3, "0")}`,
      reconciledAt: daysAgo(i),
      file: { connect: { id: closingFileRefs[i % closingFileRefs.length].id } }
      },
    });
  }

  const STATUSES_EscrowLedger = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.escrowLedger.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.escrowLedger.create({
      data: {
      period: `Period ${String(i + 1).padStart(3, "0")}`,
      deposits: amount(i, 250),
      disbursements: amount(i, 250),
      balance: amount(i, 250),
      status: pick(STATUSES_EscrowLedger, i),
      reconciledAt: daysAgo(i),
      file: { connect: { id: closingFileRefs[i % closingFileRefs.length].id } }
      },
    });
  }

  const STATUSES_DisbursementApproval = ["PENDING", "FIRST_SIGNED", "DUAL_SIGNED", "RELEASED"];
  await prisma.disbursementApproval.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.disbursementApproval.create({
      data: {
      payee: `Payee ${String(i + 1).padStart(3, "0")}`,
      amount: amount(i, 250),
      approverOne: `ApproverOne ${String(i + 1).padStart(3, "0")}`,
      approverTwo: `ApproverTwo ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_DisbursementApproval, i),
      requestedAt: daysAgo(i),
      file: { connect: { id: closingFileRefs[i % closingFileRefs.length].id } }
      },
    });
  }

  const STATUSES_RecordingPackage = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.recordingPackage.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.recordingPackage.create({
      data: {
      county: `County ${String(i + 1).padStart(3, "0")}`,
      instrument: `Instrument ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_RecordingPackage, i),
      submittedAt: daysAgo(i),
      recordingNumber: `RecordingNumber ${String(i + 1).padStart(3, "0")}`,
      recordingFee: amount(i, 250),
      file: { connect: { id: closingFileRefs[i % closingFileRefs.length].id } }
      },
    });
  }

  const STATUSES_PolicyIssuance = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.policyIssuance.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.policyIssuance.create({
      data: {
      policyNumber: `PolicyNumber ${String(i + 1).padStart(3, "0")}`,
      underwriter: `Underwriter ${String(i + 1).padStart(3, "0")}`,
      policyType: `PolicyType ${String(i + 1).padStart(3, "0")}`,
      coverageAmount: amount(i, 250),
      status: pick(STATUSES_PolicyIssuance, i),
      issuedAt: daysAgo(i),
      file: { connect: { id: closingFileRefs[i % closingFileRefs.length].id } }
      },
    });
  }

  await prisma.auditLog.create({ data: { actorName: "Seeder", action: "SEED", entity: "system", detail: "Demo dataset created" } });

  console.log("Seeded demo users and domain records.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
