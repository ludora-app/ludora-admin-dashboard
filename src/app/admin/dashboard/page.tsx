"use client";

import { MetricCard } from "@/components/metric-card";
import { Users, Calendar, MapPin, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { usePrometheusMetric } from "@/hooks/use-prometheus-metrics";
import { ActivityChart } from "@/components/charts/activity-chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  // const { data: usersData, isLoading: isLoadingUsers } = usePrometheusMetric("total_users");
  const { data: sessionsData, isLoading: isLoadingSessions } =
    usePrometheusMetric("active_sessions");
  // const { data: terrainsData, isLoading: isLoadingTerrains } = usePrometheusMetric("total_terrains");

  const getMetricValue = (data: any, fallback: string) => {
    if (data?.data?.result?.[0]?.value?.[1]) {
      return parseInt(data.data.result[0].value[1], 10).toLocaleString();
    }
    return fallback;
  };

  return (
    <div className="flex flex-col gap-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-2">
          Tableau de bord
        </h1>
        <p className="text-text-secondary font-medium">
          Bienvenue, voici un aperçu de l'activité de Ludora aujourd'hui.
        </p>
      </div>

      {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoadingUsers ? (
          <Skeleton className="h-32 rounded-2xl" />
        ) : (
          <MetricCard
            title="Utilisateurs"
            value={getMetricValue(usersData, "1 248")}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
        )}
        {isLoadingSessions ? (
          <Skeleton className="h-32 rounded-2xl" />
        ) : (
          <MetricCard
            title="Sessions"
            value={getMetricValue(sessionsData, "452")}
            icon={Calendar}
            trend={{ value: 8, isPositive: true }}
          />
        )}
        {isLoadingTerrains ? (
          <Skeleton className="h-32 rounded-2xl" />
        ) : (
          <MetricCard
            title="Terrains"
            value={getMetricValue(terrainsData, "86")}
            icon={MapPin}
            trend={{ value: 2, isPositive: false }}
          />
        )}
        <MetricCard
          title="Activités"
          value="2.4k"
          icon={Activity}
          trend={{ value: 24, isPositive: true }}
        />
      </div> */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Aperçu de l'activité</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ActivityChart />
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
                <div className="text-xs text-text-muted font-bold">Il y a {i * 2}m</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
