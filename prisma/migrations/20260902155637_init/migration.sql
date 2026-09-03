-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'ANALYST');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ANALYST',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "actorName" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClosingFile" (
    "id" TEXT NOT NULL,
    "fileNumber" TEXT NOT NULL,
    "propertyAddress" TEXT NOT NULL,
    "buyer" TEXT NOT NULL,
    "seller" TEXT NOT NULL,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClosingFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TitleSearch" (
    "id" TEXT NOT NULL,
    "underwriter" TEXT NOT NULL,
    "examiner" TEXT NOT NULL,
    "effectiveDate" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "searchedBy" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "fileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TitleSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LienRecord" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "creditor" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3),
    "fileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LienRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurativeItem" (
    "id" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "evidenceRef" TEXT,
    "fileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurativeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoffStatement" (
    "id" TEXT NOT NULL,
    "lender" TEXT NOT NULL,
    "loanNumber" TEXT NOT NULL,
    "payoffAmount" DOUBLE PRECISION NOT NULL,
    "goodThrough" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "verifiedBy" TEXT NOT NULL,
    "fileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayoffStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WireInstruction" (
    "id" TEXT NOT NULL,
    "beneficiary" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "routingLast4" TEXT NOT NULL,
    "accountLast4" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "verifiedVia" TEXT NOT NULL,
    "fileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WireInstruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudAlert" (
    "id" TEXT NOT NULL,
    "signal" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "raisedAt" TIMESTAMP(3),
    "assignee" TEXT,
    "fileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FraudAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisclosureReconciliation" (
    "id" TEXT NOT NULL,
    "buyerCd" TEXT NOT NULL,
    "sellerCd" TEXT NOT NULL,
    "variance" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "reconciledAt" TIMESTAMP(3),
    "fileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisclosureReconciliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscrowLedger" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "deposits" DOUBLE PRECISION NOT NULL,
    "disbursements" DOUBLE PRECISION NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "reconciledAt" TIMESTAMP(3),
    "fileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EscrowLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisbursementApproval" (
    "id" TEXT NOT NULL,
    "payee" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "approverOne" TEXT NOT NULL,
    "approverTwo" TEXT,
    "status" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3),
    "fileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisbursementApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordingPackage" (
    "id" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "recordingNumber" TEXT,
    "recordingFee" DOUBLE PRECISION NOT NULL,
    "fileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecordingPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PolicyIssuance" (
    "id" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "underwriter" TEXT NOT NULL,
    "policyType" TEXT NOT NULL,
    "coverageAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3),
    "fileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PolicyIssuance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "TitleSearch" ADD CONSTRAINT "TitleSearch_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "ClosingFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LienRecord" ADD CONSTRAINT "LienRecord_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "ClosingFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurativeItem" ADD CONSTRAINT "CurativeItem_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "ClosingFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoffStatement" ADD CONSTRAINT "PayoffStatement_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "ClosingFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WireInstruction" ADD CONSTRAINT "WireInstruction_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "ClosingFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudAlert" ADD CONSTRAINT "FraudAlert_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "ClosingFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisclosureReconciliation" ADD CONSTRAINT "DisclosureReconciliation_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "ClosingFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscrowLedger" ADD CONSTRAINT "EscrowLedger_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "ClosingFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisbursementApproval" ADD CONSTRAINT "DisbursementApproval_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "ClosingFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordingPackage" ADD CONSTRAINT "RecordingPackage_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "ClosingFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolicyIssuance" ADD CONSTRAINT "PolicyIssuance_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "ClosingFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
