"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, Cloud, Wifi, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DatabaseStatusProps {
  className?: string;
}

export function DatabaseStatusWidget({ className }: DatabaseStatusProps) {
  const { toast } = useToast();

  const handleViewSettings = () => {
    toast({
      title: "Supabase Configuration",
      description: "Check your environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
      duration: 5000,
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
          </div>
          <Badge variant="outline" className="text-green-700 border-current">
            <Cloud className="h-4 w-4" />
            <span className="ml-1">Supabase</span>
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Cloud-based real-time database
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Connection Status */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Connection:</span>
            <div className="flex items-center space-x-1">
              <Wifi className="h-3 w-3 text-green-500" />
              <span className="text-green-700">Supabase</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Features:</span>
            <div className="flex flex-wrap gap-1">
              {["PostgreSQL", "Real-time sync", "RLS Security", "Multi-user"].map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Configuration Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewSettings}
            className="w-full text-xs"
          >
            <Settings className="h-3 w-3 mr-1" />
            View Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}