# Projeto Frontend – Next.js

Este projeto segue um conjunto de **convenções técnicas e organizacionais** pensadas para manter escalabilidade, legibilidade e previsibilidade desde o MVP até produção.

---

## 🧱 Stack

- **Next.js** (versão `latest`)
- **TypeScript**
- **Tailwind CSS**
- **React Query**
- **Shadcn UI**
- **Clerk** (autenticação)
- **Supabase** (backend / banco)

---

## 📁 Estrutura de Pastas

```
/components
  /pages
  /ui        # componentes do shadcn
  /common

/lib
```

### Observações importantes

- **Não utilizar `/app/api`**
- As APIs devem ficar **junto das páginas** relacionadas

---

## 🧩 Componentes

### Padrões

- Cada componente deve conter:
  - Arquivo principal (`.tsx`)
  - Pasta de testes obrigatória

### Testes

- Todo componente deve ter testes
- Padrão de localização:

```
components/nome-do-componente/
  nome-do-componente.tsx
  __test__/
    nome-do-componente.test.tsx
```

- Extensões permitidas: `.test.tsx` ou `.test.ts`

---

## 🧠 Hooks e Lógica

- Componentes devem ser **preferencialmente declarativos**
- Quando a lógica crescer ou ficar complexa:
  - Extrair para um arquivo separado no padrão:

```
nome-do-componente.hooks.ts
```

---

## 🔐 Autenticação e Backend

### Clerk

- Seguir **exclusivamente** o tutorial oficial de setup
- Não customizar fluxo antes de validar o funcionamento padrão

### Supabase

- Seguir o **guia oficial** para configuração
- Utilizar boas práticas de segurança e acesso

---

## 🌍 Roteamento e Estado

- Priorizar **URL Params** sempre que possível
- Benefícios:
  - Melhor cache
  - URLs compartilháveis
  - Debug mais simples

---

## 🌐 Internacionalização (i18n)

- i18n deve ser configurado **desde o início do projeto**
- **Todo texto deve vir do i18n**
  - Proibido texto hardcoded em componentes

---

## ✅ Boas Práticas Gerais

- Manter componentes pequenos e focados
- Evitar lógica duplicada
- Preferir composição ao invés de herança
- Testes não são opcionais

---

## 📌 Observação Final

Este README é parte do contrato técnico do projeto.
Se algo não estiver descrito aqui, **não assuma** — documente ou discuta antes de implementar.
