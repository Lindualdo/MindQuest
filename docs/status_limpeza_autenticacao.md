# Status da Limpeza de Autenticação - v1.3.2

**Data:** 2024-11-22

---

## ✅ 1. Autenticação (authService.ts) - LIMPO

**Status:** ✅ **CONCLUÍDO**

```typescript
interface AuthResponse {
  success: boolean;
  user?: {
    id: string;                       // ✅ USADO
    nome: string;                      // ✅ USADO
    nome_preferencia: string;          // ✅ USADO
    cronotipo_detectado: string | null; // ✅ USADO
  };
  error?: string;
}
```

**Removido:**
- ❌ `status_onboarding` - removido
- ❌ `whatsapp_numero` - removido
- ❌ `criado_em` - removido

---

## ❌ 2. DashboardApiResponse (apiService.ts) - NÃO LIMPO

**Status:** ❌ **PRECISA SER REMOVIDO COMPLETAMENTE**

**Problema:** Interface `DashboardApiResponse` ainda existe com todos os dados legados:

```typescript
interface DashboardApiResponse {
  user: {
    whatsapp_numero: string;          // ❌ REMOVER
    status_onboarding: string;         // ❌ REMOVER
    criado_em: string;                 // ❌ REMOVER
  };
  proxima_jornada?: { ... };          // ❌ REMOVER COMPLETO
  gamificacao: {
    xp_total: ...;                     // ❌ REMOVER
    xp_proximo_nivel: ...;            // ❌ REMOVER
    nivel_atual: ...;                  // ❌ REMOVER
    titulo_nivel: ...;                 // ❌ REMOVER
    conquistas_desbloqueadas: ...;    // ❌ REMOVER
    conquistas_proximas: ...;          // ❌ REMOVER
    quest_diaria_*: ...;               // ❌ REMOVER
    total_xp_ganho_hoje: ...;         // ❌ REMOVER
    ultima_conquista_*: ...;           // ❌ REMOVER
    streak_protecao_*: ...;            // ❌ REMOVER
    melhor_streak: ...;                // ❌ REMOVER
    total_reflexoes: ...;              // ❌ REMOVER
    criado_em: ...;                    // ❌ REMOVER
  };
  sabotador: {
    total_deteccoes: ...;              // ❌ REMOVER
    intensidade_media: ...;            // ❌ REMOVER
    total_conversas: ...;               // ❌ REMOVER
  };
  // ... outros dados que devem ir para APIs separadas
}
```

**Métodos a remover:**
- ❌ `getDashboardData()` - não deve mais existir
- ❌ `refreshDashboardData()` - não deve mais existir
- ❌ `extractDashboardPayload()` - não deve mais existir

---

## ❌ 3. dataAdapter.ts - NÃO LIMPO

**Status:** ❌ **PRECISA SER LIMPO**

**Problema:** Ainda processa dados legados:

- ❌ `proxima_jornada` - processado mas não usado
- ❌ `gamificacao.xp_total`, `nivel_atual`, `conquistas_*` - processados mas não usados
- ❌ Campos de `sabotador` não usados (`total_deteccoes`, `intensidade_media`, `total_conversas`)
- ❌ Campos de `user` não usados (`whatsapp_numero`, `status_onboarding`, `criado_em`)

---

## ❌ 4. useStore.ts - AINDA USA getDashboardData()

**Status:** ❌ **PRECISA SER REMOVIDO**

**Problema:** `loadDashboardData()` ainda chama `getDashboardData()`:

```typescript
const apiData = await apiService.getDashboardData(); // ❌ REMOVER
```

**Solução:** Remover `loadDashboardData()` completamente ou refatorar para não usar `getDashboardData()`.

---

## 📋 Resumo

### ✅ Limpo
1. `authService.ts` - AuthResponse limpo

### ❌ Precisa Limpar
1. `apiService.ts` - Remover `DashboardApiResponse` e métodos relacionados
2. `dataAdapter.ts` - Remover processamento de dados legados
3. `useStore.ts` - Remover uso de `getDashboardData()`

---

## 🎯 Ações Necessárias

1. **Remover `DashboardApiResponse` e métodos relacionados:**
   - `getDashboardData()`
   - `refreshDashboardData()`
   - `extractDashboardPayload()`

2. **Limpar `dataAdapter.ts`:**
   - Remover processamento de `proxima_jornada`
   - Remover campos não usados de `gamificacao`
   - Remover campos não usados de `sabotador`
   - Remover campos não usados de `user`

3. **Atualizar `useStore.ts`:**
   - Remover `loadDashboardData()` ou refatorar para não usar `getDashboardData()`

---

**Status Geral:** ⚠️ **PARCIALMENTE LIMPO** - AuthService OK, mas ainda há código legado em apiService, dataAdapter e useStore.

