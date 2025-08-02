import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronUp, UserPlus, Store, Gift, Target, Bell, RefreshCw } from 'lucide-react';
import { useActivityFeed, ActivityItem } from '@/hooks/useActivityFeed';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const iconMap = {
  UserPlus,
  Store,
  Gift,
  Target,
  Bell,
};

const colorMap = {
  blue: 'bg-blue-50 dark:bg-blue-950/20 border-l-blue-500',
  green: 'bg-green-50 dark:bg-green-950/20 border-l-green-500',
  purple: 'bg-purple-50 dark:bg-purple-950/20 border-l-purple-500',
  orange: 'bg-orange-50 dark:bg-orange-950/20 border-l-orange-500',
  teal: 'bg-teal-50 dark:bg-teal-950/20 border-l-teal-500',
};

const dotColorMap = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  teal: 'bg-teal-500',
};

interface ActivityFeedProps {
  className?: string;
}

export function ActivityFeed({ className }: ActivityFeedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: activities = [], isLoading, refetch, isFetching } = useActivityFeed();

  const displayedActivities = isExpanded ? activities : activities.slice(0, 3);
  const hasMoreActivities = activities.length > 3;

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return 'Agora mesmo';
    }
  };

  const getActivityIcon = (activity: ActivityItem) => {
    const IconComponent = iconMap[activity.icon as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  return (
    <Card className={`shadow-lg border-0 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl">Atividade Recente</CardTitle>
          <CardDescription>
            Últimas ações importantes no sistema
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {activities.length} atividades
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 animate-pulse">
                <div className="w-3 h-3 bg-muted rounded-full mt-1.5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma atividade recente encontrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            <ScrollArea className={isExpanded ? "h-96" : "h-auto"}>
              <div className="space-y-3">
                {displayedActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-sm ${
                      colorMap[activity.color as keyof typeof colorMap]
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${dotColorMap[activity.color as keyof typeof dotColorMap]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <div className="text-muted-foreground mt-0.5">
                          {getActivityIcon(activity)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm leading-tight">
                            {activity.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTimestamp(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {hasMoreActivities && (
              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full flex items-center gap-2 text-sm"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Mostrar menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Ver mais {activities.length - 3} atividades
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}