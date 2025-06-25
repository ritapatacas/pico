# Configuração do Stripe

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# PayPal Configuration (opcional)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
```

## Como obter as chaves do Stripe

1. Aceda ao [Dashboard do Stripe](https://dashboard.stripe.com/)
2. Crie uma conta ou faça login
3. Vá para "Developers" > "API keys"
4. Copie as chaves de teste (test keys):
   - **Publishable key**: começa com `pk_test_`
   - **Secret key**: começa com `sk_test_`

## Configuração do Webhook

Para processar eventos do Stripe em tempo real:

1. No Dashboard do Stripe, vá para "Developers" > "Webhooks"
2. Clique em "Add endpoint"
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Eventos a escutar:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copie o "Signing secret" (começa com `whsec_`) e adicione à variável `STRIPE_WEBHOOK_SECRET`

## Teste de Pagamento

Use estes cartões de teste do Stripe:

- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

## Funcionalidades Implementadas

✅ API route para criar sessões de checkout (`/api/checkout_sessions`)
✅ API route para webhooks (`/api/webhooks/stripe`)
✅ Componente de pagamento com tratamento de erros
✅ Página de sucesso após pagamento (`/success`)
✅ Loading states e validações
✅ Suporte a MB WAY (através do Stripe)
✅ Moeda em EUR
✅ Localização em português
✅ Tratamento de erros robusto

## Estrutura dos Arquivos

```
app/
├── api/
│   ├── checkout_sessions/
│   │   └── route.ts          # Cria sessões de checkout
│   └── webhooks/
│       └── stripe/
│           └── route.ts      # Processa eventos do Stripe
├── success/
│   └── page.tsx              # Página de sucesso
└── ...
components/
└── PaymentStep.tsx           # Componente de pagamento melhorado
```

## Próximos Passos

1. Configure as variáveis de ambiente no `.env.local`
2. Teste o fluxo de pagamento com cartões de teste
3. Configure webhooks para processar eventos em tempo real
4. Implemente notificações por email
5. Adicione logs de transações
6. Configure o domínio de produção no Stripe
7. Atualize as URLs de sucesso/cancelamento para produção 