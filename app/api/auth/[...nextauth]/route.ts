// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { createClient } from '@supabase/supabase-js'

// Estrutura sugerida para a tabela 'clients' na Supabase:
// CREATE TABLE clients (
//   email text PRIMARY KEY,
//   name text,
//   mobile text,
//   address text,
//   provider text,
//   provider_id text,
//   image_url text,
//   given_name text,
//   family_name text,
//   locale text,
//   verified_email boolean,
//   last_login_at timestamp
// );

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Integração com tabela 'clients' (em vez de 'users')
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('NextAuth signIn callback triggered');
      console.log('User data:', { email: user.email, name: user.name, image: user.image });
      console.log('Account data:', { provider: account?.provider, providerAccountId: account?.providerAccountId });
      console.log('Profile data:', { given_name: (profile as any)?.given_name, family_name: (profile as any)?.family_name });
      
      // Mapeamento dos campos do Google para a tabela clients
      if (user && user.email) {
        const clientData = {
          email: user.email,
          name: user.name,
          mobile: null, // Campo para telemóvel (será preenchido pelo usuário)
          address: null, // Campo para morada (será preenchido pelo usuário)
          provider: account?.provider,
          provider_id: account?.providerAccountId,
          image_url: user.image,
          given_name: (profile as any)?.given_name,
          family_name: (profile as any)?.family_name,
          locale: (profile as any)?.locale,
          verified_email: (profile as any)?.email_verified ?? true,
          last_login_at: new Date().toISOString(),
        };
        
        console.log('Attempting to upsert client data:', clientData);
        
        const { data, error } = await supabase
          .from('clients')
          .upsert(clientData, { onConflict: 'email' })
          .select();
        
        if (error) {
          console.error('Error upserting client:', error);
        } else {
          console.log('Client upserted successfully:', data);
        }
      } else {
        console.log('No user or email provided');
      }
      return true
    },
  },
})

export { handler as GET, handler as POST }