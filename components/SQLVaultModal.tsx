import { useState, useEffect } from 'react';
import {
  Database,
  Terminal,
  Download,
  Copy,
  Check,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Table,
  Layers,
  FileCode2,
} from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { sqlVault, type SqlTransactionRecord } from '@/system/database/sqlVault';
import { formatCurrency } from './utils';

interface SQLVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TableKey =
  | 'loans'
  | 'business_inquiries'
  | 'franchise_inquiries'
  | 'property_inquiries'
  | 'users';

export function SQLVaultModal({ isOpen, onClose }: SQLVaultModalProps) {
  const [activeTab, setActiveTab] = useState<'tables' | 'sql_logs' | 'export'>('tables');
  const [selectedTable, setSelectedTable] = useState<TableKey>('loans');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState<SqlTransactionRecord[]>([]);

  // Tables data state
  const [loans, setLoans] = useState<any[]>([]);
  const [bizInquiries, setBizInquiries] = useState<any[]>([]);
  const [franchiseInquiries, setFranchiseInquiries] = useState<any[]>([]);
  const [propertyInquiries, setPropertyInquiries] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const refreshAll = () => {
    setLogs(sqlVault.getTransactionLogs());
    setLoans(sqlVault.getLoanApplications());
    setBizInquiries(sqlVault.getBusinessInquiries());
    setFranchiseInquiries(sqlVault.getFranchiseInquiries());
    setPropertyInquiries(sqlVault.getPropertyInquiries());
    try {
      const u = localStorage.getItem('vyapar_r_users');
      setUsers(u ? JSON.parse(u) : []);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshAll();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleSqlEvent = () => refreshAll();
    window.addEventListener('vyapar_sql_event', handleSqlEvent);
    return () => window.removeEventListener('vyapar_sql_event', handleSqlEvent);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tableCounts = {
    loans: loans.length,
    business_inquiries: bizInquiries.length,
    franchise_inquiries: franchiseInquiries.length,
    property_inquiries: propertyInquiries.length,
    users: users.length,
  };

  const totalRecords = Object.values(tableCounts).reduce((a, b) => a + b, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Live SQL Database Vault & Inspector"
      description="Real-time relational persistence layer & audit trail for SIH 26091 (MoSJE)"
      size="2xl"
    >
      <div className="space-y-4 pt-1">
        {/* Top Status Bar & Metrics */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gold-500/15 text-gold-400 border border-gold-500/30">
              <Database size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">Relational SQL Engine</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Vault Synced
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                Total Tracked Entities: <strong className="text-gold-400 font-mono">{totalRecords}</strong> | Executed SQL Transactions: <strong className="text-blue-400 font-mono">{logs.length}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refreshAll} className="text-xs gap-1.5">
              <RefreshCw size={13} />
              <span>Refresh</span>
            </Button>
            <Button variant="gold" size="sm" onClick={() => sqlVault.downloadSqlFile()} className="text-xs gap-1.5">
              <Download size={13} />
              <span>Export .SQL</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border/80 text-xs font-semibold gap-2">
          <button
            onClick={() => setActiveTab('tables')}
            className={`pb-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'tables'
                ? 'border-gold-500 text-gold-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Table size={14} />
            <span>Database Tables ({totalRecords})</span>
          </button>
          <button
            onClick={() => setActiveTab('sql_logs')}
            className={`pb-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sql_logs'
                ? 'border-gold-500 text-gold-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Terminal size={14} />
            <span>SQL Audit Stream ({logs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-gold-500 text-gold-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileCode2 size={14} />
            <span>DDL Schema & Presentation Export</span>
          </button>
        </div>

        {/* TAB 1: Database Tables View */}
        {activeTab === 'tables' && (
          <div className="space-y-3">
            {/* Table Selector Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTable('loans')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all flex items-center gap-1.5 ${
                  selectedTable === 'loans'
                    ? 'bg-gold-500/15 border-gold-500/50 text-gold-300 font-bold'
                    : 'bg-muted/30 border-border/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>vyapar_loan_applications</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
                  {tableCounts.loans}
                </span>
              </button>

              <button
                onClick={() => setSelectedTable('business_inquiries')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all flex items-center gap-1.5 ${
                  selectedTable === 'business_inquiries'
                    ? 'bg-gold-500/15 border-gold-500/50 text-gold-300 font-bold'
                    : 'bg-muted/30 border-border/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>vyapar_business_inquiries</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
                  {tableCounts.business_inquiries}
                </span>
              </button>

              <button
                onClick={() => setSelectedTable('franchise_inquiries')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all flex items-center gap-1.5 ${
                  selectedTable === 'franchise_inquiries'
                    ? 'bg-gold-500/15 border-gold-500/50 text-gold-300 font-bold'
                    : 'bg-muted/30 border-border/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>vyapar_franchise_inquiries</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
                  {tableCounts.franchise_inquiries}
                </span>
              </button>

              <button
                onClick={() => setSelectedTable('property_inquiries')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all flex items-center gap-1.5 ${
                  selectedTable === 'property_inquiries'
                    ? 'bg-gold-500/15 border-gold-500/50 text-gold-300 font-bold'
                    : 'bg-muted/30 border-border/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>vyapar_property_inquiries</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
                  {tableCounts.property_inquiries}
                </span>
              </button>

              <button
                onClick={() => setSelectedTable('users')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all flex items-center gap-1.5 ${
                  selectedTable === 'users'
                    ? 'bg-gold-500/15 border-gold-500/50 text-gold-300 font-bold'
                    : 'bg-muted/30 border-border/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>vyapar_r_users</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
                  {tableCounts.users}
                </span>
              </button>
            </div>

            {/* Filter */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search records in ${selectedTable}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-background border border-border/80 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-gold-400"
              />
            </div>

            {/* Table Content */}
            <div className="max-h-72 overflow-x-auto overflow-y-auto rounded-xl border border-border/80 bg-background/50">
              {/* TABLE: LOANS */}
              {selectedTable === 'loans' && (
                <table className="w-full text-left text-[11px] font-sans border-collapse">
                  <thead className="sticky top-0 bg-muted/90 backdrop-blur-sm border-b border-border/80 text-muted-foreground uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-2.5">Application ID</th>
                      <th className="p-2.5">Beneficiary / Applicant</th>
                      <th className="p-2.5">Village / Block</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Margin (10%)</th>
                      <th className="p-2.5">Loan (90%)</th>
                      <th className="p-2.5">Scheme Tier</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    {loans
                      .filter(l =>
                        searchQuery
                          ? l.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            l.villageOrBlock.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            l.id.toLowerCase().includes(searchQuery.toLowerCase())
                          : true
                      )
                      .map(l => (
                        <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-2.5 text-gold-400 font-bold">{l.id}</td>
                          <td className="p-2.5 text-foreground font-sans font-medium">
                            {l.applicantName}
                            <div className="text-[10px] text-muted-foreground font-mono">{l.phone}</div>
                          </td>
                          <td className="p-2.5 text-muted-foreground font-sans">{l.villageOrBlock}</td>
                          <td className="p-2.5 text-foreground/90 font-sans">{l.businessCategory}</td>
                          <td className="p-2.5 text-blue-400 font-bold">{formatCurrency(l.marginAmount)}</td>
                          <td className="p-2.5 text-emerald-400 font-bold">{formatCurrency(l.loanAmount)}</td>
                          <td className="p-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                l.schemeTier === 'MICRO_FINANCE'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              }`}
                            >
                              {l.schemeTier === 'MICRO_FINANCE' ? 'Micro Finance (6.5%)' : 'Term Loan (8.0%)'}
                            </span>
                          </td>
                          <td className="p-2.5">
                            <Badge variant="green" className="text-[9px]">
                              {l.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {/* TABLE: BUSINESS INQUIRIES */}
              {selectedTable === 'business_inquiries' && (
                <table className="w-full text-left text-[11px] font-sans border-collapse">
                  <thead className="sticky top-0 bg-muted/90 backdrop-blur-sm border-b border-border/80 text-muted-foreground uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-2.5">Ref ID</th>
                      <th className="p-2.5">Proposed Venture</th>
                      <th className="p-2.5">Applicant</th>
                      <th className="p-2.5">Location</th>
                      <th className="p-2.5">Available Margin</th>
                      <th className="p-2.5">Est. Project Cost</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    {bizInquiries
                      .filter(b =>
                        searchQuery
                          ? b.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.targetLocation.toLowerCase().includes(searchQuery.toLowerCase())
                          : true
                      )
                      .map(b => (
                        <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-2.5 text-gold-400 font-bold">{b.id}</td>
                          <td className="p-2.5 text-foreground font-sans font-medium">{b.businessName}</td>
                          <td className="p-2.5 text-foreground font-sans">
                            {b.applicantName}
                            <div className="text-[10px] text-muted-foreground font-mono">{b.phone}</div>
                          </td>
                          <td className="p-2.5 text-muted-foreground font-sans">{b.targetLocation}</td>
                          <td className="p-2.5 text-blue-400 font-bold">{formatCurrency(b.availableMargin)}</td>
                          <td className="p-2.5 text-emerald-400 font-bold">{formatCurrency(b.estimatedProjectCost)}</td>
                          <td className="p-2.5">
                            <Badge variant="blue" className="text-[9px]">
                              {b.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {/* TABLE: FRANCHISE INQUIRIES */}
              {selectedTable === 'franchise_inquiries' && (
                <table className="w-full text-left text-[11px] font-sans border-collapse">
                  <thead className="sticky top-0 bg-muted/90 backdrop-blur-sm border-b border-border/80 text-muted-foreground uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-2.5">Inquiry ID</th>
                      <th className="p-2.5">Franchise Brand</th>
                      <th className="p-2.5">Applicant</th>
                      <th className="p-2.5">Preferred Territory</th>
                      <th className="p-2.5">Capital Commitment</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    {franchiseInquiries
                      .filter(f =>
                        searchQuery
                          ? f.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            f.brandName.toLowerCase().includes(searchQuery.toLowerCase())
                          : true
                      )
                      .map(f => (
                        <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-2.5 text-gold-400 font-bold">{f.id}</td>
                          <td className="p-2.5 text-foreground font-sans font-medium">{f.brandName}</td>
                          <td className="p-2.5 text-foreground font-sans">
                            {f.applicantName}
                            <div className="text-[10px] text-muted-foreground font-mono">{f.phone}</div>
                          </td>
                          <td className="p-2.5 text-muted-foreground font-sans">{f.preferredLocation}</td>
                          <td className="p-2.5 text-emerald-400 font-bold">{formatCurrency(f.investmentAmount)}</td>
                          <td className="p-2.5">
                            <Badge variant="gold" className="text-[9px]">
                              {f.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {/* TABLE: PROPERTY INQUIRIES */}
              {selectedTable === 'property_inquiries' && (
                <table className="w-full text-left text-[11px] font-sans border-collapse">
                  <thead className="sticky top-0 bg-muted/90 backdrop-blur-sm border-b border-border/80 text-muted-foreground uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-2.5">Tour Booking ID</th>
                      <th className="p-2.5">Property Listing</th>
                      <th className="p-2.5">Applicant</th>
                      <th className="p-2.5">Scheduled Visit Date</th>
                      <th className="p-2.5">Notes</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    {propertyInquiries
                      .filter(p =>
                        searchQuery
                          ? p.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase())
                          : true
                      )
                      .map(p => (
                        <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-2.5 text-gold-400 font-bold">{p.id}</td>
                          <td className="p-2.5 text-foreground font-sans font-medium">{p.propertyTitle}</td>
                          <td className="p-2.5 text-foreground font-sans">
                            {p.applicantName}
                            <div className="text-[10px] text-muted-foreground font-mono">{p.phone}</div>
                          </td>
                          <td className="p-2.5 text-gold-300 font-mono">{p.preferredDate}</td>
                          <td className="p-2.5 text-muted-foreground font-sans max-w-xs truncate">{p.notes || '—'}</td>
                          <td className="p-2.5">
                            <Badge variant="green" className="text-[9px]">
                              {p.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {/* TABLE: USERS */}
              {selectedTable === 'users' && (
                <table className="w-full text-left text-[11px] font-sans border-collapse">
                  <thead className="sticky top-0 bg-muted/90 backdrop-blur-sm border-b border-border/80 text-muted-foreground uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-2.5">User ID</th>
                      <th className="p-2.5">Full Name</th>
                      <th className="p-2.5">Phone</th>
                      <th className="p-2.5">Email</th>
                      <th className="p-2.5">OTP Method</th>
                      <th className="p-2.5">Registered Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    {users
                      .filter(u =>
                        searchQuery
                          ? u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.email.toLowerCase().includes(searchQuery.toLowerCase())
                          : true
                      )
                      .map(u => (
                        <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-2.5 text-gold-400 font-bold">#{u.id}</td>
                          <td className="p-2.5 text-foreground font-sans font-medium">{u.name}</td>
                          <td className="p-2.5 text-muted-foreground">{u.phone}</td>
                          <td className="p-2.5 text-muted-foreground">{u.email}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded bg-muted text-foreground text-[10px]">
                              {u.otpDelivery || 'Email'}
                            </span>
                          </td>
                          <td className="p-2.5 text-emerald-400 font-sans">
                            {u.business ? `${u.business.businessName} (${u.business.businessType})` : 'Individual Micro-Entrepreneur'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Live SQL Transaction Stream */}
        {activeTab === 'sql_logs' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Real-time SQL Execution Stream (Latest first)</span>
              <span className="font-mono text-[11px] text-gold-400">{logs.length} transactions recorded</span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 rounded-xl p-2 bg-black/50 border border-border/80 font-mono text-xs">
              {logs.map(log => (
                <div key={log.id} className="p-2.5 rounded-lg bg-card/60 border border-border/60 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        {log.operation}
                      </span>
                      <span className="text-gold-400 font-semibold">{log.tableName}</span>
                      <span className="text-muted-foreground font-mono">[{log.executedBy}]</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-[9px] font-mono">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                      <button
                        onClick={() => handleCopy(log.sqlStatement, log.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        title="Copy SQL"
                      >
                        {copiedId === log.id ? (
                          <Check size={12} className="text-emerald-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-300 font-mono break-all bg-black/40 p-2 rounded border border-border/40 selection:bg-emerald-500/30">
                    {log.sqlStatement}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Presentation Export Tools */}
        {activeTab === 'export' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/80 space-y-3">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <ShieldCheck size={16} className="text-gold-400" />
                <span>Presentation & Evaluation Tools for Evaluators</span>
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                During project demonstration to college professors and hackathon evaluators, use these options to verify that VyaparMap maintains real, structured relational database tables with full SQL queries and audit integrity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-card border border-border/80 space-y-2">
                  <div className="font-bold text-gold-400 flex items-center justify-between">
                    <span>Export SQL Dump File</span>
                    <Badge variant="gold" className="text-[9px]">.SQL</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Generates a complete PostgreSQL/MySQL/SQLite compatible script with `CREATE TABLE` and `INSERT INTO` statements.
                  </p>
                  <Button variant="gold" size="sm" onClick={() => sqlVault.downloadSqlFile()} className="w-full text-xs gap-1.5">
                    <Download size={13} />
                    <span>Download vyapar_dump.sql</span>
                  </Button>
                </div>

                <div className="p-3 rounded-lg bg-card border border-border/80 space-y-2">
                  <div className="font-bold text-blue-400 flex items-center justify-between">
                    <span>Export JSON Database Backup</span>
                    <Badge variant="blue" className="text-[9px]">.JSON</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Downloads all 6 tables as structured master JSON document with SIH 26091 MoSJE metadata.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => sqlVault.downloadJsonDump()} className="w-full text-xs gap-1.5">
                    <Download size={13} />
                    <span>Download vyapar_backup.json</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* DDL Schema Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span>Database File Location in Repository</span>
                <span className="text-gold-400">database/schema.sql & database/vyapar_database.sql</span>
              </div>
              <pre className="p-3 rounded-xl bg-black/60 border border-border/80 font-mono text-[10px] text-muted-foreground overflow-x-auto max-h-40 leading-relaxed">
{`CREATE TABLE vyapar_loan_applications (
    id VARCHAR(40) PRIMARY KEY,
    applicant_name VARCHAR(120) NOT NULL,
    village_or_block VARCHAR(200) NOT NULL,
    margin_amount NUMERIC(12, 2) NOT NULL,    -- 10% Beneficiary Contribution
    project_cost NUMERIC(12, 2) NOT NULL,     -- Margin / 10%
    loan_amount NUMERIC(12, 2) NOT NULL,      -- 90% Concessional Credit
    scheme_tier VARCHAR(60) NOT NULL,         -- MICRO_FINANCE (<=1.4L) vs TERM_LOAN (>1.4L to 50L)
    interest_rate NUMERIC(4, 2) NOT NULL,     -- 6.50% vs 8.00%
    moratorium_months INTEGER NOT NULL        -- 3 vs 6 Months Moratorium
);`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
