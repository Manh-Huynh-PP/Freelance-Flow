"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DatabaseStatusWidget } from "./database-status-widget";
import { 
  ChevronDown, 
  ChevronUp, 
  Code2, 
  Database, 
  Server, 
  Activity,
  Settings
} from "lucide-react";

const NODE_ENV = process.env.NODE_ENV || 'development';

interface DeveloperPanelProps {
  className?: string;
  isConnected?: boolean;
  channels?: any[];
}

export function DeveloperPanel({ className, isConnected = false, channels = [] }: DeveloperPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development or when explicitly enabled
  const showPanel = NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SHOW_DEV_PANEL === 'true';
  
  if (!showPanel) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="mb-2 bg-background/95 backdrop-blur"
          >
            <Code2 className="h-4 w-4 mr-2" />
            Dev Panel
            {isOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Card className="w-80 bg-background/95 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Development Status
              </CardTitle>
              <CardDescription className="text-xs">
                Supabase real-time configuration
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Environment Info */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Environment:</span>
                  <Badge variant={NODE_ENV === 'production' ? 'destructive' : 'secondary'}>
                    {NODE_ENV}
                  </Badge>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Database:</span>
                  <Badge variant="default">Supabase</Badge>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Real-time:</span>
                  <div className="flex items-center space-x-1">
                    <Activity className={`h-3 w-3 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={isConnected ? 'text-green-700' : 'text-red-700'}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Channels:</span>
                  <Badge variant="outline">{channels.length}</Badge>
                </div>
              </div>

              {/* Database Status Widget */}
              <DatabaseStatusWidget />

              {/* Quick Actions */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Quick Actions:</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-8"
                    onClick={() => window.location.reload()}
                  >
                    <Server className="h-3 w-3 mr-1" />
                    Reload
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-8"
                    onClick={() => console.clear()}
                  >
                    <Database className="h-3 w-3 mr-1" />
                    Clear Console
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}