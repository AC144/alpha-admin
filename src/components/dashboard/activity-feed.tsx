
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials, formatDateTime } from '@/lib/utils'
import type { Activity } from '@/types'

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user?.avatar} />
            <AvatarFallback className="text-xs">
              {activity.user ? getInitials(activity.user.name) : '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm">
              {activity.user && (
                <span className="font-medium">{activity.user.name}</span>
              )}{' '}
              {activity.description}
              {activity.company && (
                <span className="text-muted-foreground">
                  {' '}
                  • {activity.company.name}
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(activity.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
