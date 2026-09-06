import { useState, useEffect } from 'react';
import { StoreKPICards } from './StoreKPICards';
import { FootfallTrends } from './FootfallTrends';
import { CompetitorRadar } from './CompetitorRadar';
import { RevenueMatrix } from './RevenueMatrix';
import { CustomerReviewsSection } from './CustomerReviewsSection';
import { BusinessRegistrationModal } from './BusinessRegistrationModal';
import { ownerDashboardService } from './ownerDashboard.service';
import { useAuth } from '@/system/auth/frontend/AuthContext';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { MapPin, Store, CheckCircle2, AlertCircle, Edit3, ShieldAlert, Sparkles } from 'lucide-react';
import type { StoreTelemetry } from '@/types/schema';
import type { CustomerReview } from '../backend/ownerDashboard.db';

export function OwnerDashboardPage() {
  const { user, registeredUser } = useAuth();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [dashboardData, setDashboardData] = useState(() => ownerDashboardService.getDashboardData(registeredUser));

  // Check if first-entry registration is needed
  useEffect(() => {
    // If not demo Abhinav and has no business, prompt registration
    if (registeredUser && !registeredUser.business && registeredUser.id !== '000001') {
      setShowRegisterModal(true);
    }
  }, [registeredUser]);

  // Refresh dashboard data when user or registeredUser changes
  useEffect(() => {
    setDashboardData(ownerDashboardService.getDashboardData(registeredUser));
  }, [registeredUser, user]);

  const handleReviewAdded = (newReview: CustomerReview) => {
    const updated = {
      ...dashboardData,
      reviews: [newReview, ...dashboardData.reviews],
    };
    setDashboardData(updated);
    ownerDashboardService.saveDashboardData(dashboardData.storageKey, updated);
  };

  const telemetryForComponents: StoreTelemetry = {
    storeId: `store-${dashboardData.storageKey}`,
    storeName: dashboardData.businessName,
    ownerName: dashboardData.ownerName,
    category: dashboardData.businessType,
    city: dashboardData.city,
    locality: dashboardData.location,
    sizeSqft: dashboardData.landAreaSqft,
    monthlyRent: dashboardData.monthlyRent,
    monthlyRevenue: dashboardData.monthlyRevenue,
    dailyFootfall: dashboardData.dailyFootfall,
    conversionRate: dashboardData.conversionRate,
    rentToRevenueRatio: dashboardData.rentToRevenueRatio,
    hourlyTraffic: dashboardData.walkInTrends.hours24.map(h => ({
      hour: h.label,
      weekday: h.patrons,
      weekend: Math.round(h.patrons * 1.3),
    })),
    nearbyCompetitors: dashboardData.nearbyCompetitors,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* First-Entry Onboarding Modal */}
      <BusinessRegistrationModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onComplete={() => {
          setDashboardData(ownerDashboardService.getDashboardData(registeredUser));
        }}
      />

      {/* Store Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-card shadow-sm">
        <div className="space-y-2">
          {/* Header Meta Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Verification Badge */}
            {dashboardData.isVerified ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 size={13} className="text-emerald-400" />
                Verified by VyaparMap
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <AlertCircle size={13} className="text-amber-400" />
                Not Verified by VyaparMap
              </span>
            )}

            <Badge variant="gold" className="font-mono text-[10px] uppercase">
              {dashboardData.businessType}
            </Badge>

            <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/60">
              Storage: <strong>{dashboardData.storageKey}</strong>
            </span>
          </div>

          {/* Business Name */}
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground flex items-center gap-3">
            <span>{dashboardData.businessName}</span>
            {dashboardData.isVerified && (
              <span className="text-xs font-sans font-medium px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Live Audited
              </span>
            )}
          </h1>

          {/* Business Location & Proprietor Details */}
          <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-gold-400">
              <MapPin size={13} />
              <span>{dashboardData.location}</span>
            </span>
            <span>•</span>
            <span>{dashboardData.landAreaSqft} sq ft floor plate</span>
            <span>•</span>
            <span>Proprietor: {dashboardData.ownerName}</span>
            <span>•</span>
            <span>Contact: {dashboardData.businessPhone}</span>
          </p>
        </div>

        {/* Action Button: Edit / Re-register */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRegisterModal(true)}
            className="text-xs gap-1.5 border-border/80"
          >
            <Edit3 size={13} /> Edit Store Profile
          </Button>
        </div>
      </div>

      {/* Top Store KPIs */}
      <StoreKPICards data={dashboardData} />

      {/* Customer Walk-ins Chart with 24hrs / 7 days / 30 days toggle */}
      <FootfallTrends data={dashboardData} />

      {/* Customer Reviews & Predictive Insights */}
      <CustomerReviewsSection data={dashboardData} onAddReview={handleReviewAdded} />

      {/* Grid: Competitor Radar & Rent Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CompetitorRadar telemetry={telemetryForComponents} />
        <RevenueMatrix telemetry={telemetryForComponents} />
      </div>
    </div>
  );
}
