import { useState } from 'react';
import { Star, MessageSquare, Sparkles, Plus, CheckCircle2 } from 'lucide-react';
import type { StoreDashboardData, CustomerReview } from '../backend/ownerDashboard.db';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export function CustomerReviewsSection({
  data,
  onAddReview,
}: {
  data: StoreDashboardData;
  onAddReview?: (rev: CustomerReview) => void;
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const avgRating =
    data.reviews.length > 0
      ? (data.reviews.reduce((acc, r) => acc + r.rating, 0) / data.reviews.length).toFixed(1)
      : '4.8';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      sentiment: newRating >= 4 ? 'positive' : 'neutral',
    };

    if (onAddReview) {
      onAddReview(newRev);
    }
    setNewAuthor('');
    setNewComment('');
    setShowAddModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Reviews Column */}
      <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-border/80 bg-card shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <MessageSquare size={18} className="text-gold-400" />
              {data.isVerified ? 'Verified Patron Reviews' : 'Customer Reviews & Feedback'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {data.isVerified
                ? 'Direct feedback gathered from in-store WiFi and QR payment terminals.'
                : 'Corridor feedback and preliminary visitor sentiments.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gold-500/10 px-2.5 py-1 rounded-xl border border-gold-500/20 text-xs font-bold text-gold-300">
              <Star size={13} className="fill-gold-400 text-gold-400" />
              <span>{avgRating}</span>
              <span className="text-muted-foreground font-normal">({data.reviews.length})</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddModal(!showAddModal)}
              className="text-xs gap-1 border-border/70"
            >
              <Plus size={13} /> Add Review
            </Button>
          </div>
        </div>

        {/* Add Review Form inline */}
        {showAddModal && (
          <form onSubmit={handleCreate} className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-3 animate-fade-in">
            <div className="font-semibold text-xs text-foreground">Log New Patron Review</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                required
                placeholder="Patron name (e.g. Rajesh S.)"
                value={newAuthor}
                onChange={e => setNewAuthor(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Rating:</span>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={16}
                      className={star <= newRating ? 'fill-gold-400 text-gold-400' : 'text-muted-foreground'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Input
              required
              placeholder="Write feedback comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="gold" size="sm" type="submit">
                Submit Review
              </Button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-3">
          {data.reviews.map(rev => (
            <div
              key={rev.id}
              className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-2 hover:border-gold-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground">{rev.author}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className={i < rev.rating ? 'fill-gold-400 text-gold-400' : 'text-muted-foreground/40'}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{rev.date}</span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Predictive Insights Column */}
      <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl border border-border/80 bg-card shadow-sm space-y-5">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Sparkles size={18} className="text-gold-400" />
            {data.isVerified ? 'Operational Intelligence' : 'Predictive Corridor Insights'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {data.isVerified
              ? 'Real-time telemetry takeaways powered by VyaparMap AI.'
              : 'Machine learning forecasts comparing nearby commercial clusters.'}
          </p>
        </div>

        <div className="space-y-3">
          {data.predictiveInsights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-xs text-foreground/90 flex items-start gap-2.5"
            >
              <CheckCircle2 size={16} className="text-gold-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{insight}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-1">
          <div className="font-semibold text-foreground">Storage Location:</div>
          <code className="font-mono text-[11px] text-gold-400 block bg-background/60 p-2 rounded-lg border border-border/50">
            {data.storageKey}
          </code>
          <span className="text-[10px] text-muted-foreground block pt-1">
            Data updates persist automatically in client storage across reloads.
          </span>
        </div>
      </div>
    </div>
  );
}
