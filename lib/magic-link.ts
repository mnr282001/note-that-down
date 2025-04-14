import { createClient } from '@/lib/supabase/server'

interface MagicLinkData {
    userId: string
    formType: 'questions' | 'suggestions'
    expiresAt: number
}

export async function validateMagicLink(token: string): Promise<MagicLinkData | null> {
    const supabase = await createClient()

    // Query the magic_links table to find the token
    const { data, error } = await supabase
        .from('magic_links')
        .select('*')
        .eq('token', token)
        .single()

    if (error || !data) {
        return null
    }

    // Check if the link has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return null
    }

    // Return the magic link data
    return {
        userId: data.user_id,
        formType: data.form_type,
        expiresAt: new Date(data.expires_at).getTime()
    }
} 