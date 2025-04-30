"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, Download } from "lucide-react";

export default function LogsPage() {
  const [rawData, setRawData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/borrow/logs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        setRawData(data);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
        router.push("/admin");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(rawData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderLogCard = (log, index) => (
    <Card key={index} className="mb-4 shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle>Log #{index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-700 space-y-1">
        {Object.entries(log).map(([key, value]) => (
          <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <span className="font-medium text-gray-600">{key}:</span>
            <span className="text-gray-800 break-words sm:ml-2">{String(value)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={handleDownload}
          className="flex items-center"
          disabled={!rawData}
        >
          <Download className="mr-2 h-4 w-4" /> Export Raw Data
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : rawData && Array.isArray(rawData) && rawData.length > 0 ? (
        rawData.map((log, index) => renderLogCard(log, index))
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Logs Found</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-500">There are currently no log records to display.</CardContent>
        </Card>
      )}
    </div>
  );
}
