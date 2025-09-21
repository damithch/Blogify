'use client'

interface AdminAlertsProps {
  stats: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
}

export default function AdminAlerts({ stats }: AdminAlertsProps) {
  const alerts = []

  // High pending count alert
  if (stats.pending > 10) {
    alerts.push({
      type: 'warning',
      message: `${stats.pending} posts are waiting for review`,
      action: 'Review pending posts',
      priority: 'high'
    })
  } else if (stats.pending > 5) {
    alerts.push({
      type: 'info',
      message: `${stats.pending} posts need review`,
      action: 'Review posts',
      priority: 'medium'
    })
  }

  // Low approval rate alert
  const approvalRate = stats.total > 0 ? (stats.approved / stats.total) * 100 : 0
  if (stats.total > 10 && approvalRate < 50) {
    alerts.push({
      type: 'warning',
      message: `Low approval rate: ${Math.round(approvalRate)}%`,
      action: 'Review content guidelines',
      priority: 'medium'
    })
  }

  // High rejection rate alert
  const rejectionRate = stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0
  if (stats.total > 10 && rejectionRate > 30) {
    alerts.push({
      type: 'error',
      message: `High rejection rate: ${Math.round(rejectionRate)}%`,
      action: 'Check quality standards',
      priority: 'high'
    })
  }

  // All clear message
  if (alerts.length === 0 && stats.pending === 0) {
    alerts.push({
      type: 'success',
      message: 'All posts reviewed! No pending items.',
      action: 'Great work!',
      priority: 'low'
    })
  }

  if (alerts.length === 0) return null

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return '⚠️'
      case 'warning':
        return '📋'
      case 'success':
        return '✅'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className="mb-6 space-y-3">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`border rounded-lg p-4 ${getAlertStyles(alert.type)}`}
        >
          <div className="flex items-start space-x-3">
            <span className="text-lg">{getAlertIcon(alert.type)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium">{alert.message}</p>
                {alert.priority === 'high' && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Priority
                  </span>
                )}
              </div>
              <p className="text-sm opacity-75 mt-1">{alert.action}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}