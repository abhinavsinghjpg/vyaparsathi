import React from 'react';
import { Lock, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/system/auth/frontend/AuthContext';
import { Button } from './Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { Link } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isOwner, loginAsDemoOwner } = useAuth();

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] p-6 animate-fade-in">
        <Card className="max-w-md w-full border-gold-500/30 bg-card/95 shadow-2xl text-center p-6">
          <CardHeader className="pb-4 items-center">
            <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-2">
              <Lock size={32} />
            </div>
            <CardTitle className="text-xl font-bold text-foreground">
              Business Owner Access Required
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-2">
              The Owner Dashboard is private and exclusively reserved for registered business owners to track their store telemetry, footfall conversion, and competitor radar.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-left text-muted-foreground flex items-start gap-2.5">
              <ShieldAlert size={16} className="text-gold-400 shrink-0 mt-0.5" />
              <span>
                Guests and visitors can browse all public features (AI Advisor, Live Map, Franchises, Properties, and Analytics). To unlock this dashboard, activate Business Owner Mode.
              </span>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Button
                variant="gold"
                size="lg"
                onClick={() => loginAsDemoOwner()}
                className="w-full flex items-center justify-center gap-2"
              >
                <Sparkles size={16} /> Sign In as Demo Owner (Abhinav)
              </Button>
              <Link to="/login" className="w-full">
                <Button variant="outline" size="md" className="w-full">
                  Sign In with Credentials <ArrowRight size={14} className="ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

