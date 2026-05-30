
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { sanitizeInput, validateEmail } from '@/utils/security'
import { toast } from 'sonner'

interface Lead {
  id: string
  email: string
  name?: string
  phone?: string
  campaign_id?: string
  ad_group_id?: string
  keyword?: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

interface CreateLeadData {
  email: string
  name?: string
  phone?: string
  campaign_id?: string
  ad_group_id?: string
  keyword?: string
  metadata?: Record<string, any>
}

export const useLeads = () => {
  const queryClient = useQueryClient()

  const { data: leads, isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching leads:', error)
        throw error
      }

      return data as Lead[]
    },
  })

  const createLead = useMutation({
    mutationFn: async (leadData: CreateLeadData) => {
      // Sanitize and validate input
      const sanitizedData = {
        email: sanitizeInput(leadData.email.toLowerCase()),
        name: leadData.name ? sanitizeInput(leadData.name) : null,
        phone: leadData.phone ? sanitizeInput(leadData.phone) : null,
        campaign_id: leadData.campaign_id ? sanitizeInput(leadData.campaign_id) : null,
        ad_group_id: leadData.ad_group_id ? sanitizeInput(leadData.ad_group_id) : null,
        keyword: leadData.keyword ? sanitizeInput(leadData.keyword) : null,
        metadata: leadData.metadata || {}
      }

      // Validate email
      if (!validateEmail(sanitizedData.email)) {
        throw new Error('Invalid email format')
      }

      const { data, error } = await supabase
        .from('leads')
        .insert(sanitizedData)
        .select()

      if (error) {
        console.error('Error creating lead:', error)
        throw error
      }

      return data[0] as Lead
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      toast.success('Lead created successfully')
    },
    onError: (error) => {
      console.error('Failed to create lead:', error)
      toast.error('Failed to create lead')
    },
  })

  const updateLeadStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Lead['status'] }) => {
      const { data, error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id)
        .select()

      if (error) {
        console.error('Error updating lead status:', error)
        throw error
      }

      return data[0] as Lead
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      toast.success('Lead status updated')
    },
    onError: (error) => {
      console.error('Failed to update lead status:', error)
      toast.error('Failed to update lead status')
    },
  })

  return {
    leads,
    isLoading,
    error,
    createLead,
    updateLeadStatus,
  }
}
