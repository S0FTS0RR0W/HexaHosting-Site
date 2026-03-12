"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface ServiceStatus {
  id: string;
  name: string;
  status: "operational" | "degraded" | "down";
  uptime: number;
  responseTime: number;
  lastChecked: string;
}

const mockServices: ServiceStatus[] = [
  {
    id: "api-1",
    name: "Main API Server",
    status: "operational",
    uptime: 99.98,
    responseTime: 45,
    lastChecked: new Date().toISOString(),
  },
  {
    id: "database",
    name: "Database Server",
    status: "operational",
    uptime: 99.95,
    responseTime: 120,
    lastChecked: new Date().toISOString(),
  },
  {
    id: "cdn",
    name: "CDN Service",
    status: "operational",
    uptime: 99.99,
    responseTime: 15,
    lastChecked: new Date().toISOString(),
  },
  {
    id: "auth",
    name: "Authentication Service",
    status: "operational",
    uptime: 99.97,
    responseTime: 65,
    lastChecked: new Date().toISOString(),
  },
  {
    id: "storage",
    name: "Storage Service",
    status: "operational",
    uptime: 99.94,
    responseTime: 200,
    lastChecked: new Date().toISOString(),
  },
  {
    id: "email",
    name: "Email Service",
    status: "operational",
    uptime: 99.91,
    responseTime: 500,
    lastChecked: new Date().toISOString(),
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "operational":
      return "bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-400";
    case "degraded":
      return "bg-yellow-500/20 border-yellow-500/50 text-yellow-700 dark:text-yellow-400";
    case "down":
      return "bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-400";
    default:
      return "bg-gray-500/20 border-gray-500/50 text-gray-700 dark:text-gray-400";
  }
};

const getStatusDot = (status: string) => {
  switch (status) {
    case "operational":
      return "bg-green-500";
    case "degraded":
      return "bg-yellow-500";
    case "down":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getUptimeColor = (uptime: number) => {
  if (uptime >= 99.9) return "text-green-600 dark:text-green-400";
  if (uptime >= 99.5) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call to /api/status
    // const fetchStatus = async () => {
    //   try {
    //     const response = await fetch('/api/status');
    //     const data = await response.json();
    //     setServices(data.services);
    //   } catch (error) {
    //     console.error('Failed to fetch status:', error);
    //     setServices(mockServices);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // For now, use mock data
    setServices(mockServices);
    setLoading(false);
  }, []);

  const overallUptime =
    services.length > 0
      ? (
          services.reduce((sum, s) => sum + s.uptime, 0) / services.length
        ).toFixed(2)
      : "0.00";

  const operationalCount = services.filter(
    (s) => s.status === "operational",
  ).length;
  const degradedCount = services.filter((s) => s.status === "degraded").length;
  const downCount = services.filter((s) => s.status === "down").length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 sm:p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">System Status</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Real-time monitoring of HexaHosting services
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Operational
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              {operationalCount}/{services.length}
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-yellow-500">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Degraded
            </div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
              {degradedCount}
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-red-500">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Down
            </div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
              {downCount}
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Overall Uptime
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {overallUptime}%
            </div>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-6">Services</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                Loading status...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className={`p-6 border-l-4 border-l-${getStatusDot(service.status)} transition-all hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${getStatusDot(service.status)}`}
                        />
                        <h3 className="text-lg font-semibold">
                          {service.name}
                        </h3>
                      </div>
                      <p
                        className={`mt-1 text-sm font-medium capitalize ${getStatusColor(service.status)}`}
                      >
                        {service.status}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Uptime
                      </div>
                      <div
                        className={`text-2xl font-bold mt-1 ${getUptimeColor(service.uptime)}`}
                      >
                        {service.uptime}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Response
                      </div>
                      <div className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">
                        {service.responseTime}
                        <span className="text-sm ml-1">ms</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Last Check
                      </div>
                      <div className="text-sm font-medium mt-1 text-slate-900 dark:text-slate-100">
                        {new Date(service.lastChecked).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold">Last Updated:</span>{" "}
            {new Date().toLocaleString()} • Data refreshes automatically • For
            detailed history, check our
            <span className="font-semibold"> incidents page</span>
          </p>
        </div>
      </div>
    </main>
  );
}
