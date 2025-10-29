import { supabase } from "./supabase";
import { CrewMember, Location } from "../types";

/**
 * SUPABASE DATABASE SCHEMA (for reference)
 *
 * crews TABLE:
 * - id: text (primary key, e.g., "harvest-2024")
 * - created_at: timestamptz
 *
 * members TABLE:
 * - id: uuid (primary key, references auth.users.id)
 * - crew_id: text (foreign key to crews.id)
 * - name: text
 * - color: text
 * - current_location: jsonb ({ lat: number, lng: number })
 * - path: jsonb[] (array of location objects)
 * - speed: float8
 * - last_update: timestamptz
 *
 * ROW LEVEL SECURITY (RLS) recommended for production:
 * - Make sure to enable RLS on both tables.
 * - Allow authenticated users to read all members of their own crew.
 * - Allow a user to update only their own member row.
 * - Allow authenticated users to create new crews and members.
 */

// Function to generate a more readable random crew ID
const generateCrewId = () => {
    const adjectives = ["quick", "blue", "green", "happy", "fast", "silent"];
    const nouns = ["river", "truck", "field", "squad", "unit", "crew"];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `${randomAdj}-${randomNoun}-${randomNum}`;
}

export const subscribeToCrew = (
    crewId: string,
    callback: (crew: CrewMember[]) => void,
    errorCallback?: (error: string) => void
): (() => void) => {
    const channel = supabase
        .channel(`crew-${crewId}`)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'members', filter: `crew_id=eq.${crewId}` },
            (payload) => {
                // This is a simple refetch on any change. For more performance, you could
                // intelligently merge the `payload.new` data into the existing state.
                fetchCrew(crewId)
                    .then(callback)
                    .catch(err => {
                        console.error("Error fetching crew update:", err);
                        if (errorCallback) errorCallback(err.message || 'Failed to fetch crew updates');
                    });
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIPTION_ERROR') {
                if (errorCallback) errorCallback('Failed to connect to real-time updates');
            } else if (status === 'TIMED_OUT') {
                if (errorCallback) errorCallback('Connection timed out');
            } else if (status === 'CLOSED') {
                if (errorCallback) errorCallback('Connection closed');
            }
        });

    // Initial fetch
    fetchCrew(crewId)
        .then(callback)
        .catch(err => {
            console.error("Initial crew fetch error:", err);
            if (errorCallback) errorCallback(err.message || 'Failed to load crew');
        });

    return () => {
        supabase.removeChannel(channel);
    };
};

export const fetchCrew = async (crewId: string): Promise<CrewMember[]> => {
    const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('crew_id', crewId);
    
    if (error) {
        console.error("Error fetching crew:", error);
        return [];
    }
    return data as CrewMember[];
}

export const updateCrewMemberLocation = async (
  crewId: string,
  memberId: string,
  location: Location,
  speed: number | null
): Promise<void> => {
  const { error } = await supabase
    .from('members')
    .update({
      current_location: location,
      speed: speed ?? 0,
      last_update: new Date().toISOString()
    })
    .eq('id', memberId);

  if (error) {
    console.error("Error updating location:", error);
    throw new Error(`Failed to update location: ${error.message}`);
  }
};

export const createCrew = async (memberId: string, memberName: string, color: string) => {
    const crewId = generateCrewId();
    // 1. Create the crew entry
    const { error: crewError } = await supabase.from('crews').insert({ id: crewId });
    if(crewError) throw new Error(crewError.message);

    // 2. Create the member entry
    const { data: member, error: memberError } = await supabase
        .from('members')
        .insert({
            id: memberId,
            crew_id: crewId,
            name: memberName,
            color,
            last_update: new Date().toISOString()
        })
        .select()
        .single();
    
    if(memberError) throw new Error(memberError.message);

    return { crewId, member: member as CrewMember };
};

export const joinCrew = async (crewId: string, memberId: string, memberName: string): Promise<CrewMember | null> => {
    // 1. Check if crew exists
    const { data: crew, error: crewError } = await supabase
        .from('crews')
        .select('id')
        .eq('id', crewId)
        .single();

    if (crewError || !crew) {
        console.error("Crew not found");
        return null;
    }

    // 2. Upsert (update or insert) the member
    const { data: member, error: memberError } = await supabase
        .from('members')
        .upsert({
            id: memberId,
            crew_id: crewId,
            name: memberName,
            last_update: new Date().toISOString()
        }, { onConflict: 'id' })
        .select()
        .single();
    
    if(memberError) throw new Error(memberError.message);

    return member as CrewMember;
}

export const leaveCrew = async (crewId: string, memberId: string) => {
    const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId)
        .eq('crew_id', crewId);

    if (error) console.error("Error leaving crew:", error);
}