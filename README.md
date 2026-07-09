# Motion Playground

Projeto React para experimentar animações com [Motion](https://motion.dev) (motion.dev).

## Começar

```bash
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

## Demo ao vivo (GitHub Pages)

O projeto está publicado em:

**https://mesquita-dev.github.io/animation-practice/**

O deploy roda automaticamente via GitHub Actions a cada push na branch `main`. O workflow gera o build e publica na branch `gh-pages`.

### Configuração (uma vez)

1. Repositório → **Settings** → **Pages**
2. Em **Build and deployment**, escolha **Source: Deploy from a branch**
3. Branch: **`gh-pages`** · Folder: **`/ (root)`**

> **Importante:** não use a branch `main` como source. A `main` tem o código-fonte de desenvolvimento (`/src/main.tsx`), que deixa a página em branco no GitHub Pages.

### Por que a página ficava em branco?

O GitHub Pages estava servindo o `index.html` de desenvolvimento da branch `main`, com `<script src="/src/main.tsx">`. O navegador não executa TypeScript/React diretamente — o site precisa do build de produção (`dist/`).

O workflow publica só o conteúdo de `dist/` na branch `gh-pages`. Para projetos em `username.github.io/nome-do-repo/`, o Vite usa `base: '/animation-practice/'` (já configurado no `vite.config.ts`).

## Estrutura

- `src/demos/SandboxDemo.tsx` — área principal para seus testes
- `src/demos/` — exemplos de referência (básico, variants, gestos, layout, presence)
- `src/App.tsx` — navegação entre os demos

## Uso do Motion

```tsx
import { motion } from 'motion/react'

function MeuComponente() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    />
  )
}
```

## Scripts

| Comando         | Descrição              |
| --------------- | ---------------------- |
| `npm run dev`   | Servidor de desenvolvimento |
| `npm run build` | Build de produção      |
| `npm run preview` | Preview do build     |
