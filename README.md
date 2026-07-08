# Motion Playground

Projeto React para experimentar animações com [Motion](https://motion.dev) (motion.dev).

## Começar

```bash
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

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
