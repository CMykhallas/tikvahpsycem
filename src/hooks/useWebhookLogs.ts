
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

interface WebhookLog {
  id: string
  endpoint: string
  method: string
  headers: Record<string, any>
  payload: Record<string, any>
  response_status: number
  processing_time_ms: number
  error_message?: string
  ip_address: string
  user_agent: string
  created_at: string
}

export const useWebhookLogs = (limit: number = 100) => {
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['webhook-logs', limit],
    queryFn: async () => {
      // Since webhook_logs table doesn't exist, return empty array
      // This can be implemented when the table is created
      return [] as WebhookLog[]
    },
  })

  const getLogStats = () => {
    if (!logs) return null

    const totalRequests = logs.length
    const successfulRequests = logs.filter(log => log.response_status < 400).length
    const errorRequests = logs.filter(log => log.response_status >= 400).length
    const averageProcessingTime = logs.reduce((acc, log) => acc + (log.processing_time_ms || 0), 0) / totalRequests

    return {
      totalRequests,
      successfulRequests,
      errorRequests,
      successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
      averageProcessingTime: Math.round(averageProcessingTime) || 0
    }
  }

  return {
    logs,
    isLoading,
    error,
    stats: getLogStats()
  }
}
