import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SecurityIncident {
  id: string;
  created_at: string;
  incident_type: string;
  severity: string;
  ip_address: string;
  user_agent?: string;
  endpoint?: string;
  user_id?: string;
  details?: any;
}

export interface IPBlacklist {
  id: string;
  ip_address: string;
  reason: string;
  blocked_at: string;
  expires_at?: string;
  metadata?: any;
}

export interface SecurityStats {
  total_incidents: number;
  critical_incidents: number;
  unique_ips: number;
  blocked_ips: number;
  price_tampering_attempts: number;
  rate_limit_violations: number;
}

export const useSecurityIncidents = () => {
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<IPBlacklist[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async (filters?: {
    severity?: string;
    incidentType?: string;
    limit?: number;
  }) => {
    try {
      let query = supabase
        .from('security_incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }

      if (filters?.incidentType) {
        query = query.eq('incident_type', filters.incidentType);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      } else {
        query = query.limit(100);
      }

      const { data, error } = await query;

      if (error) throw error;
      setIncidents(data || []);
    } catch (error: any) {
      console.error('Error fetching incidents:', error);
      toast.error('Erro ao carregar incidentes de segurança');
    }
  };

  const fetchBlockedIPs = async () => {
    try {
      const { data, error } = await supabase
        .from('ip_blacklist')
        .select('*')
        .order('blocked_at', { ascending: false });

      if (error) throw error;
      setBlockedIPs(data || []);
    } catch (error: any) {
      console.error('Error fetching blocked IPs:', error);
      toast.error('Erro ao carregar IPs bloqueados');
    }
  };

  const fetchStats = async (timeWindow: string = '24 hours') => {
    try {
      const { data, error } = await supabase.rpc('get_security_stats', {
        time_window: timeWindow
      });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast.error('Erro ao carregar estatísticas');
    }
  };

  const subscribeToIncidents = () => {
    const channel = supabase
      .channel('security_incidents_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_incidents'
        },
        (payload) => {
          console.log('New security incident:', payload);
          setIncidents(prev => [payload.new as SecurityIncident, ...prev]);
          toast.warning('Novo incidente de segurança detectado!');
          
          // Refresh stats when new incident
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const subscribeToBlacklist = () => {
    const channel = supabase
      .channel('ip_blacklist_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ip_blacklist'
        },
        (payload) => {
          console.log('IP blocked:', payload);
          setBlockedIPs(prev => [payload.new as IPBlacklist, ...prev]);
          toast.error(`IP ${(payload.new as IPBlacklist).ip_address} bloqueado!`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchIncidents(),
        fetchBlockedIPs(),
        fetchStats()
      ]);
      setLoading(false);
    };

    loadData();

    // Enable realtime subscriptions
    const unsubscribeIncidents = subscribeToIncidents();
    const unsubscribeBlacklist = subscribeToBlacklist();

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchIncidents();
      fetchBlockedIPs();
      fetchStats();
    }, 30000);

    return () => {
      unsubscribeIncidents();
      unsubscribeBlacklist();
      clearInterval(interval);
    };
  }, []);

  return {
    incidents,
    blockedIPs,
    stats,
    loading,
    fetchIncidents,
    fetchBlockedIPs,
    fetchStats
  };
};
