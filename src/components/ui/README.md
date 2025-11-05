# Componentes shadcn/ui

Este directorio contiene los componentes de [shadcn/ui](https://ui.shadcn.com/docs/components) utilizados en el proyecto.

## Componentes Disponibles

### 🎨 Avatar
Componente para mostrar avatares de usuario con fallback.

**Ubicación:** `components/ui/avatar.tsx`

**Uso:**
```tsx
import { Avatar, AvatarFallback } from '../ui/avatar';

<Avatar>
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### 🏷️ Badge
Componente para mostrar etiquetas o badges con diferentes variantes.

**Ubicación:** `components/ui/badge.tsx`

**Variantes:** `default`, `secondary`, `destructive`, `outline`

**Uso:**
```tsx
import { Badge } from '../ui/badge';

<Badge variant="destructive">Nuevo</Badge>
```

### 🔘 Button
Componente de botón con múltiples variantes y tamaños.

**Ubicación:** `components/ui/button.tsx`

**Variantes:** `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Tamaños:** `default`, `sm`, `lg`, `icon`

**Uso:**
```tsx
import { Button } from '../ui/button';

<Button variant="outline" size="lg">Click me</Button>
```

### 📦 Card
Componente para crear tarjetas con estructura consistente.

**Ubicación:** `components/ui/card.tsx`

**Componentes:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

**Uso:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>Contenido</CardContent>
</Card>
```

### 📊 Chart
Componentes para gráficos basados en Recharts con soporte para temas.

**Ubicación:** `components/ui/chart.tsx`

**Componentes:** `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`

**Uso:**
```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { BarChart, Bar } from 'recharts';

<ChartContainer config={chartConfig}>
  <BarChart data={data}>
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="value" />
  </BarChart>
</ChartContainer>
```

### 📋 Dropdown Menu
Menú desplegable con animaciones y soporte para submenús.

**Ubicación:** `components/ui/dropdown-menu.tsx`

**Componentes:** `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`

**Uso:**
```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### ➖ Separator
Componente para crear líneas separadoras.

**Ubicación:** `components/ui/separator.tsx`

**Orientación:** `horizontal` (default), `vertical`

**Uso:**
```tsx
import { Separator } from '../ui/separator';

<Separator />
<Separator orientation="vertical" />
```

## Dependencias

Estos componentes requieren las siguientes dependencias:

- `@radix-ui/react-avatar` - Para Avatar
- `@radix-ui/react-dropdown-menu` - Para Dropdown Menu
- `@radix-ui/react-separator` - Para Separator
- `@radix-ui/react-slot` - Para Button
- `class-variance-authority` - Para variantes de Button y Badge
- `clsx` y `tailwind-merge` - Para utilidades de clases
- `lucide-react` - Para iconos
- `recharts` - Para Chart

## Utilidades

### `cn()` - Función de utilidad
Función helper para combinar clases de Tailwind CSS de forma segura.

**Ubicación:** `lib/utils.ts`

**Uso:**
```tsx
import { cn } from '../lib/utils';

<div className={cn("base-class", condition && "conditional-class")} />
```

## Referencias

- [Documentación oficial de shadcn/ui](https://ui.shadcn.com/docs/components)
- [Radix UI](https://www.radix-ui.com/) - Componentes primitivos sin estilos
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS utility-first

## Notas

- Todos los componentes son completamente personalizables ya que el código fuente está en tu proyecto
- Los componentes soportan dark mode automáticamente
- Los componentes son accesibles por defecto gracias a Radix UI
- Puedes agregar más componentes ejecutando `npx shadcn@latest add [component-name]`

