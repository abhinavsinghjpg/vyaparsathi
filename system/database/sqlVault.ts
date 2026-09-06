/**
 * VyaparMap Live SQL Database Vault & Transaction Logger
 * Supports SIH 26091 (MoSJE) presentations and live persistent backend simulation.
 * Emits syntactically valid SQL queries and maintains real-time database state.
 */

export interface SqlTransactionRecord {
  id: string;
  tableName: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  sqlStatement: string;
  executedBy: string;
  createdAt: string;
}

export interface VyaparFranchiseInquiry {
  id: string;
  franchiseId: string;
  brandName: string;
  applicantName: string;
  preferredLocation: string;
  investmentAmount: number;
  phone: string;
  email: string;
  status: 'UNDER_REVIEW' | 'OFFER_DISPATCHED' | 'APPROVED';
  submittedAt: string;
}

export interface VyaparPropertyInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  applicantName: string;
  phone: string;
  preferredDate: string;
  notes?: string;
  status: 'SCHEDULED' | 'VISITED' | 'NEGOTIATION';
  submittedAt: string;
}

export interface VyaparBusinessInquiry {
  id: string;
  businessName: string;
  category: string;
  applicantName: string;
  phone: string;
  email: string;
  targetLocation: string;
  availableMargin: number;
  estimatedProjectCost: number;
  schemePreference?: string;
  notes?: string;
  status: 'APPLICATION_LOGGED' | 'DOCS_PENDING' | 'PROCESSED';
  submittedAt: string;
}

export interface VyaparHarvestedPlace {
  id: string;
  name: string;
  category: string;
  specificType: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  source: 'OpenStreetMap Overpass' | 'Google Places' | 'Field Survey';
  rating: number;
  reviewSentiment: string;
  footfallEstimate: number;
  tagsJson?: string;
  harvestedAt: string;
}

export interface VyaparLoanApplication {
  id: string;
  applicantName: string;
  phone: string;
  email: string;
  villageOrBlock: string;
  businessCategory: string;
  marginAmount: number;          // 10% Margin
  projectCost: number;           // Margin / 10%
  loanAmount: number;            // 90% Concessional Credit
  schemeTier: 'MICRO_FINANCE' | 'TERM_LOAN' | 'VYAPAR_BANK_SYNDICATE';
  interestRate: number;          // 6.5%, 8.0%, or 8.75%
  tenureYears: number;           // 3 or 7
  moratoriumMonths: number;      // 3 or 6
  quarterlyInstallment: number;
  fundingAgency: string;
  status: 'PRE_QUALIFIED' | 'FORWARDED_TO_SCA' | 'DISBURSED';
  submittedAt: string;
}

const STORAGE_KEYS = {
  USERS: 'vyapar_r_users',
  BUSINESS_REGISTRATIONS: 'vyapar_business_registrations',
  FRANCHISE_INQUIRIES: 'vyapar_franchise_inquiries',
  PROPERTY_INQUIRIES: 'vyapar_property_inquiries',
  BUSINESS_INQUIRIES: 'vyapar_business_inquiries',
  LOAN_APPLICATIONS: 'vyapar_loan_applications',
  SQL_LOGS: 'vyapar_sql_transaction_logs',
  HARVESTED_PLACES: 'vyapar_harvested_places',
};

function escapeSql(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  return `'` + String(val).replace(/'/g, "''") + `'`;
}

class SqlVaultService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private getItem<T>(key: string, fallback: T[]): T[] {
    if (!this.isBrowser()) return fallback;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      }
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, items: T[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      console.warn('[SQL Vault] LocalStorage write error:', e);
    }
  }

  // Record an executed SQL transaction into the live audit log
  public recordSqlTransaction(tableName: string, operation: 'INSERT' | 'UPDATE' | 'DELETE', sql: string, executedBy = 'web_client'): void {
    const logs = this.getTransactionLogs();
    const newLog: SqlTransactionRecord = {
      id: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tableName,
      operation,
      sqlStatement: sql.trim(),
      executedBy,
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    if (logs.length > 200) logs.pop(); // Keep last 200 transactions
    this.setItem(STORAGE_KEYS.SQL_LOGS, logs);
    
    // Broadcast custom event so UI components can update instantly
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vyapar_sql_event', { detail: newLog }));
    }
  }

  public getTransactionLogs(): SqlTransactionRecord[] {
    return this.getItem<SqlTransactionRecord>(STORAGE_KEYS.SQL_LOGS, [
      {
        id: 'TXN-INIT-001',
        tableName: 'vyapar_r_users',
        operation: 'INSERT',
        sqlStatement: "INSERT INTO vyapar_r_users (id, name, phone, email) VALUES ('000001', 'Abhinav Choudhary', '9999999999', 'Abhinav@gmail.com');",
        executedBy: 'system_bootstrap',
        createdAt: '2026-01-15T10:00:00.000Z',
      },
      {
        id: 'TXN-INIT-002',
        tableName: 'vyapar_loan_applications',
        operation: 'INSERT',
        sqlStatement: "INSERT INTO vyapar_loan_applications (id, applicant_name, scheme_tier, loan_amount) VALUES ('LOAN-26091-001', 'Sunita Devi Meghwal', 'MICRO_FINANCE', 125000.00);",
        executedBy: 'beneficiary_portal',
        createdAt: '2026-02-20T16:20:00.000Z',
      },
    ]);
  }

  // 1. Franchise Inquiries
  public getFranchiseInquiries(): VyaparFranchiseInquiry[] {
    return this.getItem<VyaparFranchiseInquiry>(STORAGE_KEYS.FRANCHISE_INQUIRIES, [
      {
        id: 'INQ-FRAN-001',
        franchiseId: 'franchise-1',
        brandName: 'Chai Point Express',
        applicantName: 'Vikas Sharma',
        preferredLocation: 'Jaipur, Malviya Nagar',
        investmentAmount: 1200000,
        phone: '9829000001',
        email: 'vikas.sharma@gmail.com',
        status: 'UNDER_REVIEW',
        submittedAt: '2026-02-25T15:30:00.000Z',
      },
    ]);
  }

  public insertFranchiseInquiry(item: Omit<VyaparFranchiseInquiry, 'id' | 'status' | 'submittedAt'>): VyaparFranchiseInquiry {
    const list = this.getFranchiseInquiries();
    const record: VyaparFranchiseInquiry = {
      ...item,
      id: `INQ-FRAN-${Date.now().toString().slice(-6)}`,
      status: 'UNDER_REVIEW',
      submittedAt: new Date().toISOString(),
    };
    list.unshift(record);
    this.setItem(STORAGE_KEYS.FRANCHISE_INQUIRIES, list);

    const sql = `INSERT INTO vyapar_franchise_inquiries (id, franchise_id, brand_name, applicant_name, preferred_location, investment_amount, phone, email, status, submitted_at) VALUES (${escapeSql(record.id)}, ${escapeSql(record.franchiseId)}, ${escapeSql(record.brandName)}, ${escapeSql(record.applicantName)}, ${escapeSql(record.preferredLocation)}, ${record.investmentAmount}, ${escapeSql(record.phone)}, ${escapeSql(record.email)}, ${escapeSql(record.status)}, ${escapeSql(record.submittedAt)});`;
    this.recordSqlTransaction('vyapar_franchise_inquiries', 'INSERT', sql);
    return record;
  }

  // 2. Commercial Property Inquiries / Tours
  public getPropertyInquiries(): VyaparPropertyInquiry[] {
    return this.getItem<VyaparPropertyInquiry>(STORAGE_KEYS.PROPERTY_INQUIRIES, [
      {
        id: 'TOUR-PROP-001',
        propertyId: 'prop-1',
        propertyTitle: 'Corner Retail Showroom - C-Scheme',
        applicantName: 'Pooja Agarwal',
        phone: '9829000002',
        preferredDate: '2026-03-10',
        notes: 'Interested for organic farm-to-table outlet',
        status: 'SCHEDULED',
        submittedAt: '2026-02-28T11:00:00.000Z',
      },
    ]);
  }

  public insertPropertyInquiry(item: Omit<VyaparPropertyInquiry, 'id' | 'status' | 'submittedAt'>): VyaparPropertyInquiry {
    const list = this.getPropertyInquiries();
    const record: VyaparPropertyInquiry = {
      ...item,
      id: `TOUR-PROP-${Date.now().toString().slice(-6)}`,
      status: 'SCHEDULED',
      submittedAt: new Date().toISOString(),
    };
    list.unshift(record);
    this.setItem(STORAGE_KEYS.PROPERTY_INQUIRIES, list);

    const sql = `INSERT INTO vyapar_property_inquiries (id, property_id, property_title, applicant_name, phone, preferred_date, notes, status, submitted_at) VALUES (${escapeSql(record.id)}, ${escapeSql(record.propertyId)}, ${escapeSql(record.propertyTitle)}, ${escapeSql(record.applicantName)}, ${escapeSql(record.phone)}, ${escapeSql(record.preferredDate)}, ${escapeSql(record.notes)}, ${escapeSql(record.status)}, ${escapeSql(record.submittedAt)});`;
    this.recordSqlTransaction('vyapar_property_inquiries', 'INSERT', sql);
    return record;
  }

  // 3. Find Business Internal Applications
  public getBusinessInquiries(): VyaparBusinessInquiry[] {
    return this.getItem<VyaparBusinessInquiry>(STORAGE_KEYS.BUSINESS_INQUIRIES, [
      {
        id: 'BIZ-INQ-001',
        businessName: 'Cold-Pressed Mustard Oil & Spices',
        category: 'food',
        applicantName: 'Anil Meena',
        phone: '9414012345',
        email: 'anil.meena@yahoo.com',
        targetLocation: 'Dausa Rural Block, Rajasthan',
        availableMargin: 35000,
        estimatedProjectCost: 350000,
        schemePreference: 'PMEGP 35% Capital Subsidy + MoSJE Concessional Credit',
        notes: 'Have ancestral land along state highway',
        status: 'APPLICATION_LOGGED',
        submittedAt: '2026-03-01T14:00:00.000Z',
      },
    ]);
  }

  public insertBusinessInquiry(item: Omit<VyaparBusinessInquiry, 'id' | 'status' | 'submittedAt'>): VyaparBusinessInquiry {
    const list = this.getBusinessInquiries();
    const record: VyaparBusinessInquiry = {
      ...item,
      id: `BIZ-INQ-${Date.now().toString().slice(-6)}`,
      status: 'APPLICATION_LOGGED',
      submittedAt: new Date().toISOString(),
    };
    list.unshift(record);
    this.setItem(STORAGE_KEYS.BUSINESS_INQUIRIES, list);

    const sql = `INSERT INTO vyapar_business_inquiries (id, business_name, category, applicant_name, phone, email, target_location, available_margin, estimated_project_cost, scheme_preference, notes, status, submitted_at) VALUES (${escapeSql(record.id)}, ${escapeSql(record.businessName)}, ${escapeSql(record.category)}, ${escapeSql(record.applicantName)}, ${escapeSql(record.phone)}, ${escapeSql(record.email)}, ${escapeSql(record.targetLocation)}, ${record.availableMargin}, ${record.estimatedProjectCost}, ${escapeSql(record.schemePreference)}, ${escapeSql(record.notes)}, ${escapeSql(record.status)}, ${escapeSql(record.submittedAt)});`;
    this.recordSqlTransaction('vyapar_business_inquiries', 'INSERT', sql);
    return record;
  }

  // 4. MoSJE Concessional Credit & Loan Applications (SIH 26091)
  public getLoanApplications(): VyaparLoanApplication[] {
    return this.getItem<VyaparLoanApplication>(STORAGE_KEYS.LOAN_APPLICATIONS, [
      {
        id: 'LOAN-26091-001',
        applicantName: 'Sunita Devi Meghwal',
        phone: '9414056789',
        email: 'sunita.meghwal@gramin.org',
        villageOrBlock: 'Chomu Block, Gram Panchayat Morija',
        businessCategory: 'Dairy & Cattle Farming',
        marginAmount: 14000,
        projectCost: 140000,
        loanAmount: 125000,
        schemeTier: 'MICRO_FINANCE',
        interestRate: 6.5,
        tenureYears: 3,
        moratoriumMonths: 3,
        quarterlyInstallment: 11520,
        fundingAgency: 'Rajasthan SC/ST Finance & Dev Corp (SCA/MoSJE)',
        status: 'PRE_QUALIFIED',
        submittedAt: '2026-02-20T16:20:00.000Z',
      },
      {
        id: 'LOAN-26091-002',
        applicantName: 'Ramesh Chandra Verma',
        phone: '9829012345',
        email: 'ramesh.verma@vyaparmap.in',
        villageOrBlock: 'Bassi Block, Jaipur Rural',
        businessCategory: 'Agro-Processing & Dal Mill',
        marginAmount: 100000,
        projectCost: 1000000,
        loanAmount: 900000,
        schemeTier: 'TERM_LOAN',
        interestRate: 8.0,
        tenureYears: 7,
        moratoriumMonths: 6,
        quarterlyInstallment: 42180,
        fundingAgency: 'National Backward Classes Finance & Dev Corp (NBCFDC/MoSJE)',
        status: 'PRE_QUALIFIED',
        submittedAt: '2026-02-22T10:45:00.000Z',
      },
    ]);
  }

  public insertLoanApplication(item: Omit<VyaparLoanApplication, 'id' | 'status' | 'submittedAt'>): VyaparLoanApplication {
    const list = this.getLoanApplications();
    const record: VyaparLoanApplication = {
      ...item,
      id: `LOAN-26091-${Date.now().toString().slice(-5)}`,
      status: 'PRE_QUALIFIED',
      submittedAt: new Date().toISOString(),
    };
    list.unshift(record);
    this.setItem(STORAGE_KEYS.LOAN_APPLICATIONS, list);

    const sql = `INSERT INTO vyapar_loan_applications (id, applicant_name, phone, email, village_or_block, business_category, margin_amount, project_cost, loan_amount, scheme_tier, interest_rate, tenure_years, moratorium_months, quarterly_installment, funding_agency, status, submitted_at) VALUES (${escapeSql(record.id)}, ${escapeSql(record.applicantName)}, ${escapeSql(record.phone)}, ${escapeSql(record.email)}, ${escapeSql(record.villageOrBlock)}, ${escapeSql(record.businessCategory)}, ${record.marginAmount}, ${record.projectCost}, ${record.loanAmount}, ${escapeSql(record.schemeTier)}, ${record.interestRate}, ${record.tenureYears}, ${record.moratoriumMonths}, ${record.quarterlyInstallment}, ${escapeSql(record.fundingAgency)}, ${escapeSql(record.status)}, ${escapeSql(record.submittedAt)});`;
    this.recordSqlTransaction('vyapar_loan_applications', 'INSERT', sql);
    return record;
  }

  // 5. User Registration Audit
  public recordUserRegistration(user: { id: string; name: string; phone: string; email: string; otpDelivery?: string }): void {
    const sql = `INSERT INTO vyapar_r_users (id, name, phone, email, otp_delivery, default_otp, created_at) VALUES (${escapeSql(user.id)}, ${escapeSql(user.name)}, ${escapeSql(user.phone)}, ${escapeSql(user.email)}, ${escapeSql(user.otpDelivery || 'SMS')}, '111111', ${escapeSql(new Date().toISOString())});`;
    this.recordSqlTransaction('vyapar_r_users', 'INSERT', sql);
  }

  // 6. Business Registration Audit (Owner Dashboard)
  public recordBusinessRegistration(biz: {
    id?: string;
    userId: string;
    businessName: string;
    businessType: string;
    location: string;
    city: string;
    ownerName: string;
    businessEmail?: string;
    businessPhone?: string;
    landAreaSqft?: number;
    monthlyRevenue?: number;
    monthlyRent?: number;
    isFranchiseOffered?: boolean;
  }): void {
    const bizId = biz.id || `biz-${Date.now().toString().slice(-6)}`;
    const sql = `INSERT INTO vyapar_business_registrations (id, user_id, business_name, business_type, location, city, owner_name, business_email, business_phone, land_area_sqft, monthly_revenue, monthly_rent, is_verified, is_franchise_offered, registered_at) VALUES (${escapeSql(bizId)}, ${escapeSql(biz.userId)}, ${escapeSql(biz.businessName)}, ${escapeSql(biz.businessType)}, ${escapeSql(biz.location)}, ${escapeSql(biz.city)}, ${escapeSql(biz.ownerName)}, ${escapeSql(biz.businessEmail)}, ${escapeSql(biz.businessPhone)}, ${biz.landAreaSqft || 0}, ${biz.monthlyRevenue || 0}, ${biz.monthlyRent || 0}, TRUE, ${biz.isFranchiseOffered ? 'TRUE' : 'FALSE'}, ${escapeSql(new Date().toISOString())});`;
    this.recordSqlTransaction('vyapar_business_registrations', 'INSERT', sql);
  }

  // Presentation Export Tools
  public generateFullSqlDump(): string {
    const users = this.getItem<any>(STORAGE_KEYS.USERS, []);
    const loans = this.getLoanApplications();
    const franchises = this.getFranchiseInquiries();
    const properties = this.getPropertyInquiries();
    const bizInquiries = this.getBusinessInquiries();

    let out = `-- =============================================================================\n`;
    out += `-- VyaparMap Live Database Dump (Exported: ${new Date().toISOString()})\n`;
    out += `-- Total Records: Users (${users.length}), Loans (${loans.length}), Franchises (${franchises.length}), Properties (${properties.length}), Biz Inquiries (${bizInquiries.length})\n`;
    out += `-- =============================================================================\n\n`;
    out += `BEGIN TRANSACTION;\n\n`;

    if (users.length > 0) {
      out += `-- Table: vyapar_r_users\n`;
      users.forEach((u: any) => {
        out += `INSERT INTO vyapar_r_users (id, name, phone, email, otp_delivery) VALUES (${escapeSql(u.id)}, ${escapeSql(u.name)}, ${escapeSql(u.phone)}, ${escapeSql(u.email)}, ${escapeSql(u.otpDelivery || 'SMS')});\n`;
      });
      out += `\n`;
    }

    if (loans.length > 0) {
      out += `-- Table: vyapar_loan_applications (SIH 26091 MoSJE)\n`;
      loans.forEach((l: VyaparLoanApplication) => {
        out += `INSERT INTO vyapar_loan_applications (id, applicant_name, phone, village_or_block, business_category, margin_amount, project_cost, loan_amount, scheme_tier, interest_rate, tenure_years, moratorium_months, quarterly_installment) VALUES (${escapeSql(l.id)}, ${escapeSql(l.applicantName)}, ${escapeSql(l.phone)}, ${escapeSql(l.villageOrBlock)}, ${escapeSql(l.businessCategory)}, ${l.marginAmount}, ${l.projectCost}, ${l.loanAmount}, ${escapeSql(l.schemeTier)}, ${l.interestRate}, ${l.tenureYears}, ${l.moratoriumMonths}, ${l.quarterlyInstallment});\n`;
      });
      out += `\n`;
    }

    if (franchises.length > 0) {
      out += `-- Table: vyapar_franchise_inquiries\n`;
      franchises.forEach((f: VyaparFranchiseInquiry) => {
        out += `INSERT INTO vyapar_franchise_inquiries (id, franchise_id, brand_name, applicant_name, preferred_location, investment_amount, phone, email) VALUES (${escapeSql(f.id)}, ${escapeSql(f.franchiseId)}, ${escapeSql(f.brandName)}, ${escapeSql(f.applicantName)}, ${escapeSql(f.preferredLocation)}, ${f.investmentAmount}, ${escapeSql(f.phone)}, ${escapeSql(f.email)});\n`;
      });
      out += `\n`;
    }

    if (properties.length > 0) {
      out += `-- Table: vyapar_property_inquiries\n`;
      properties.forEach((p: VyaparPropertyInquiry) => {
        out += `INSERT INTO vyapar_property_inquiries (id, property_id, property_title, applicant_name, phone, preferred_date) VALUES (${escapeSql(p.id)}, ${escapeSql(p.propertyId)}, ${escapeSql(p.propertyTitle)}, ${escapeSql(p.applicantName)}, ${escapeSql(p.phone)}, ${escapeSql(p.preferredDate)});\n`;
      });
      out += `\n`;
    }

    if (bizInquiries.length > 0) {
      out += `-- Table: vyapar_business_inquiries\n`;
      bizInquiries.forEach((b: VyaparBusinessInquiry) => {
        out += `INSERT INTO vyapar_business_inquiries (id, business_name, category, applicant_name, phone, target_location, available_margin, estimated_project_cost) VALUES (${escapeSql(b.id)}, ${escapeSql(b.businessName)}, ${escapeSql(b.category)}, ${escapeSql(b.applicantName)}, ${escapeSql(b.phone)}, ${escapeSql(b.targetLocation)}, ${b.availableMargin}, ${b.estimatedProjectCost});\n`;
      });
      out += `\n`;
    }

    out += `COMMIT;\n`;
    return out;
  }

  
  public saveHarvestedPlace(
    place: Omit<VyaparHarvestedPlace, 'id' | 'harvestedAt'>
  ): VyaparHarvestedPlace {
    const list = this.getItem<VyaparHarvestedPlace>(STORAGE_KEYS.HARVESTED_PLACES, []);
    const record: VyaparHarvestedPlace = {
      ...place,
      id: `osm-poi-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      harvestedAt: new Date().toISOString(),
    };
    list.unshift(record);
    this.setItem(STORAGE_KEYS.HARVESTED_PLACES, list.slice(0, 1000));

    const sql = `INSERT INTO vyapar_harvested_places (id, name, category, specific_type, address, locality, city, state, lat, lng, source, rating, review_sentiment, footfall_est, harvested_at) VALUES (${escapeSql(
      record.id
    )}, ${escapeSql(record.name)}, ${escapeSql(record.category)}, ${escapeSql(
      record.specificType
    )}, ${escapeSql(record.address)}, ${escapeSql(record.locality)}, ${escapeSql(
      record.city
    )}, ${escapeSql(record.state)}, ${record.lat}, ${record.lng}, ${escapeSql(
      record.source
    )}, ${record.rating}, ${escapeSql(record.reviewSentiment)}, ${record.footfallEstimate}, ${escapeSql(
      record.harvestedAt
    )});`;

    this.recordSqlTransaction('vyapar_harvested_places', 'INSERT', sql, 'MapHarvester');
    return record;
  }

  public saveBatchHarvestedPlaces(
    places: Array<Omit<VyaparHarvestedPlace, 'id' | 'harvestedAt'>>
  ): VyaparHarvestedPlace[] {
    const savedRecords: VyaparHarvestedPlace[] = [];
    const list = this.getItem<VyaparHarvestedPlace>(STORAGE_KEYS.HARVESTED_PLACES, []);

    places.forEach((p, idx) => {
      // Deduplicate by name and lat/lng
      const exists = list.some(
        ex => ex.name.toLowerCase() === p.name.toLowerCase() &&
              Math.abs(ex.lat - p.lat) < 0.0005 &&
              Math.abs(ex.lng - p.lng) < 0.0005
      );
      if (!exists) {
        const record: VyaparHarvestedPlace = {
          ...p,
          id: `osm-poi-${Date.now()}-${idx}`,
          harvestedAt: new Date().toISOString(),
        };
        list.unshift(record);
        savedRecords.push(record);
      }
    });

    this.setItem(STORAGE_KEYS.HARVESTED_PLACES, list.slice(0, 1000));

    if (savedRecords.length > 0) {
      const sample = savedRecords[0];
      const sql = `-- Batch Inserted ${savedRecords.length} Real Establishments from ${sample.source}\nINSERT INTO vyapar_harvested_places (id, name, category, specific_type, address, locality, city, lat, lng, source, footfall_est) VALUES (${escapeSql(sample.id)}, ${escapeSql(sample.name)}, ${escapeSql(sample.category)}, ${escapeSql(sample.specificType)}, ${escapeSql(sample.address)}, ${escapeSql(sample.locality)}, ${escapeSql(sample.city)}, ${sample.lat}, ${sample.lng}, ${escapeSql(sample.source)}, ${sample.footfallEstimate}) ... [${savedRecords.length} rows];`;
      this.recordSqlTransaction('vyapar_harvested_places', 'INSERT', sql, 'MapHarvester');
    }

    return savedRecords;
  }

  public getHarvestedPlaces(categoryFilter?: string): VyaparHarvestedPlace[] {
    const list = this.getItem<VyaparHarvestedPlace>(STORAGE_KEYS.HARVESTED_PLACES, []);
    if (!categoryFilter || categoryFilter === 'All') return list;
    const clean = categoryFilter.toLowerCase();
    return list.filter(p => p.category.toLowerCase().includes(clean) || p.specificType.toLowerCase().includes(clean));
  }

  public downloadSqlFile(): void {
    if (typeof window === 'undefined') return;
    const content = this.generateFullSqlDump();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vyapar_database_dump_${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public downloadJsonDump(): void {
    if (typeof window === 'undefined') return;
    const dump = {
      exportedAt: new Date().toISOString(),
      sihProblemStatement: '26091',
      ministry: 'Ministry of Social Justice and Empowerment (MoSJE)',
      tables: {
        users: this.getItem<any>(STORAGE_KEYS.USERS, []),
        loanApplications: this.getLoanApplications(),
        franchiseInquiries: this.getFranchiseInquiries(),
        propertyInquiries: this.getPropertyInquiries(),
        businessInquiries: this.getBusinessInquiries(),
        sqlTransactions: this.getTransactionLogs(),
      },
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vyapar_database_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const sqlVault = new SqlVaultService();
