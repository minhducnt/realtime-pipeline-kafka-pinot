# Component Architecture - Atomic Design

This directory follows the **Atomic Design** methodology by Brad Frost, organizing components into a hierarchical structure that promotes reusability, consistency, and maintainability.

## 📁 Directory Structure

```
presentation/components/
├── atoms/           # 🧬 Basic building blocks
├── molecules/       # 🧪 Component combinations
├── organisms/       # 🦠 Complex UI components
└── templates/       # 📄 Page-level layouts
```

## 🧬 Atoms

**Location**: `atoms/`

Basic, indivisible UI elements that cannot be broken down further. These are the foundational building blocks of your design system.

**Examples**:
- `button.tsx` - Reusable button component with variants
- `badge.tsx` - Status indicators and labels
- `loading.tsx` - Loading spinners and states

**Characteristics**:
- No dependencies on other components in this project
- Highly reusable across the entire application
- Simple, focused functionality
- Usually map to basic HTML elements or simple interactions

## 🧪 Molecules

**Location**: `molecules/`

Groups of atoms that work together as a unit. These are simple combinations of atoms that form more complex, reusable components.

**Examples**:
- `card.tsx` - Card system with header, content, footer, and title components

**Characteristics**:
- Composed of atoms only
- Serve a specific, limited purpose
- More complex than atoms but still focused
- Often used within organisms

## 🦠 Organisms

**Location**: `organisms/`

Complex components that combine molecules and/or atoms to form distinct sections of an interface. These are the meat of your UI.

**Examples**:
- `KpiCard.tsx` - KPI display with card, badges, and formatting
- `TimeSeriesChart.tsx` - Complex chart component with tooltips
- `sidebar.tsx` - Navigation sidebar with menu items
- `header.tsx` - Application header with branding and controls

**Characteristics**:
- Can contain atoms, molecules, and other organisms
- Serve specific business or UI purposes
- Often contain their own state and logic
- May be used in multiple templates/pages

## 📄 Templates

**Location**: `templates/`

Page-level layouts that organize organisms into coherent page structures. These define the overall layout and arrangement of content.

**Examples**:
- `MainLayout.tsx` - Main application layout with sidebar and header

**Characteristics**:
- Rarely contain atoms or molecules directly
- Focus on layout and structure
- May contain multiple organisms
- Define the skeleton of pages

## 📄 Pages

**Location**: `../pages/`

Actual page implementations that use templates and may include data fetching logic. These are specific instances of templates with real content.

**Examples**:
- `Dashboard.tsx` - Dashboard page implementation
- `Transactions.tsx` - Transactions listing page with data fetching

**Characteristics**:
- May contain data fetching logic
- Specific implementations of templates
- Often contain page-specific business logic

## 🔄 Import Guidelines

When importing components, follow these paths:

```typescript
// From organisms to molecules/atoms
import { Card } from '../molecules/card'
import { Button } from '../atoms/button'

// From templates to organisms
import { Sidebar } from '../organisms/sidebar'

// From pages to templates/organisms
import { MainLayout } from '../components/templates/MainLayout'
import { KpiCard } from '../components/organisms/KpiCard'
```

## 🎯 Benefits of This Structure

1. **Reusability**: Components are organized by complexity level, making them easier to find and reuse
2. **Maintainability**: Clear separation of concerns makes components easier to modify and test
3. **Scalability**: New components naturally fit into the hierarchy
4. **Design System**: Promotes consistency across the application
5. **Developer Experience**: Easier to understand component relationships and dependencies

## 🚀 Best Practices

1. **Start Small**: Always consider if a component can be broken down into smaller atoms/molecules
2. **Single Responsibility**: Each component should have one clear purpose
3. **Composition over Inheritance**: Build complex components by composing simpler ones
4. **Consistent Naming**: Use descriptive, consistent naming conventions
5. **Documentation**: Keep this README updated as the design system evolves

## 📚 Further Reading

- [Atomic Design by Brad Frost](https://bradfrost.com/blog/post/atomic-web-design/)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/chapter-2/)
- [Component-Based Architecture](https://www.componentdriven.org/)
