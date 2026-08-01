import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Returns the signed-in user plus whether they hold the admin role. */
export function useAdmin() {
  return useQuery({
    queryKey: ["admin-session"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user ?? null;
      if (!user) return { user: null, isAdmin: false };
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (error) return { user, isAdmin: false };
      return { user, isAdmin: Boolean(data) };
    },
    staleTime: 30_000,
  });
}
