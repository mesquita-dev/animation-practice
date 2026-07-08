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

O deploy é feito automaticamente via GitHub Actions ao dar push na branch `main`.

### Configuração (uma vez)

1. Repositório → **Settings** → **Pages**
2. Em **Build and deployment**, escolha **Source: GitHub Actions**

### Por que a página ficava em branco?

O GitHub Pages estava servindo o código-fonte (`/src/main.tsx`) em vez do build de produção (`dist/`). Navegadores não executam TypeScript/React diretamente — é preciso rodar `npm run build` e publicar a pasta `dist/`.

Para projetos em `username.github.io/nome-do-repo/`, o Vite também precisa do `base: '/animation-practice/'` (já configurado no `vite.config.ts`).

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
