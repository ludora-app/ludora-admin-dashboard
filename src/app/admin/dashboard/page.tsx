import { MetricCard } from "@/components/metric-card";
import { Users, Calendar, MapPin, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-2">Tableau de bord</h1>
        <p className="text-text-secondary font-medium">Bienvenue, voici un aperçu de l'activité de Ludora aujourd'hui.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Utilisateurs"
          value="1 248"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Sessions"
          value="452"
          icon={Calendar}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Terrains"
          value="86"
          icon={MapPin}
          trend={{ value: 2, isPositive: false }}
        />
        <MetricCard
          title="Activités"
          value="2.4k"
          icon={Activity}
          trend={{ value: 24, isPositive: true }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Aperçu de l'activité</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center border-2 border-dashed border-secondary rounded-xl bg-surface-secondary/50">
            <p className="text-text-muted font-medium italic">Graphique d'activité en cours de préparation...</p>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Inscriptions récentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 transition-all hover:translate-x-1">
                <div className="size-10 rounded-full bg-violet-principal/10 flex items-center justify-center text-violet-principal font-bold text-xs shadow-card">
                  JD
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-bold text-text-primary leading-none">John Doe {i}</p>
                  <p className="text-xs text-text-muted font-medium">john.doe{i}@example.com</p>
                </div>
                <div className="text-xs text-text-muted font-bold">Il y a {i*2}m</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
