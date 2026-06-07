# 📱 Taller 04: CRUD Visual en React Native
## Arquitectura de Componentes Visuales y Renderizado Multiplataforma

---

## 🎯 SLIDE 1: Objetivo del Taller

### Objetivo Principal
Diseñar una interfaz funcional de **gestión de datos (CRUD Visual)** analizando cómo **React Native interactúa con los componentes nativos de Android**.

### Propósito Educativo
- Entender el **puente entre JavaScript/JSX y widgets Android nativos**
- Contrastar: ¿Qué es React Native vs Flutter vs NativeScript?
- Demostrar que un `<Button>` de React Native = `android.widget.Button` real

### Institución
- **Escuela Politécnica Nacional**
- **Materia:** Aplicaciones Móviles
- **Framework Asignado:** React Native + Expo + TypeScript

---

## 🎨 SLIDE 2: El Desafío - Las 3 Pantallas

### Requerimiento: Implementar 3 Pantallas CRUD

#### 📋 Pantalla 1: LISTADO (Read)
```
┌─────────────────────────────┐
│ 📷 | Proyecto Mobile         │
│    │ Entrega en la semana 4  │  ← FlatList (RecyclerView)
│    │ Hoy | Activo            │
│    │          [Eliminar]     │ ← Long press o botón rojo
├─────────────────────────────┤
│ 📷 | Tarea UI               │
│    │ Revisar Material 3      │
│    │ Mañana | Inactivo       │
└─────────────────────────────┘
         Tap = Edit
         Long Press = Delete
              [+] FAB
```

#### ➕ Pantalla 2: FORMULARIO (Create/Update)
```
┌─────────────────────────────┐
│ 📝 CREAR / ACTUALIZAR        │
├─────────────────────────────┤
│ Titulo         [TextInput]   │ ← android:EditText
│ Subtitulo      [TextArea]    │
│ Fecha          [O] [O] [O]   │ ← Presnable Chips
│ Estado         [  |● ] ←-→   │ ← Switch (Material 3)
├─────────────────────────────┤
│ [Cancelar]  [Guardar]       │
└─────────────────────────────┘
```

#### ❌ Pantalla 3: CONFIRMACIÓN (Delete)
```
┌──────── MODAL DIALOG ────────┐
│ ⚠️  Confirmar eliminación     │
│                              │
│ Vas a eliminar "Proyecto    │ ← Modal Nativo
│ Mobile". Esta acción no se  │
│ puede deshacer.              │
│                              │
│ [Cancelar]  [Eliminar]      │
└──────────────────────────────┘

✓ Toast: "Elemento eliminado con éxito"
  (Toast.makeText() nativo de Android)
```

---

## 🚀 SLIDE 3: React Native - Análisis del Framework

### ¿Qué es React Native?

**React Native es un PUENTE NATIVO**

```
         JavaScript (JSX)
              ↓
    React Native Bridge
              ↓
    Componentes Android NATIVOS
```

### Naturaleza de React Native
- ✅ Usa componentes **100% nativos** (no DOM)
- ✅ Un `<Button>` → `android.widget.Button` real
- ✅ Un `<FlatList>` → `RecyclerView` real
- ✅ Acceso directo a APIs del sistema (Toast, Dialog, Vibration)
- ❌ No es híbrido (no WebView)
- ❌ No dibuja píxeles como Flutter

### El Reto Nativo en React Native
```tsx
// Usar componentes NATIVOS de Expo/React Native:
import {
  Modal,           // → AlertDialog.Builder
  ToastAndroid,    // → Toast.makeText()
  FlatList,        // → RecyclerView
  TextInput,       // → EditText
  Switch           // → android.widget.Switch
} from "react-native";

// NO usar librerías externas (ej: React Native Paper)
// Entender la abstracción: JSX → Android Widgets
```

---

## 📊 SLIDE 4: Matriz de Requerimientos - React Native

| Elemento UI | Componente React Native | Widget Android Nativo | Estado en App |
|---|---|---|---|
| **Lista** | `<FlatList>` | `RecyclerView` | ✅ Implementado |
| **Inputs** | `<TextInput>` | `EditText` | ✅ Implementado |
| **Selector** | `<Pressable>` + Chips | `RadioButton` / `ChipGroup` | ✅ Pressable (custom) |
| **Toggle** | `<Switch>` | `android.widget.Switch` | ✅ Implementado |
| **Diálogo** | `<Modal>` | `AlertDialog.Builder` | ✅ Implementado |
| **Feedback** | `ToastAndroid.show()` | `Toast.makeText()` | ✅ Implementado |
| **Navegación** | State (lista ↔ form) | Intent Implícito | ✅ Stack simple |

### Especificación de Interacciones

```
Flujo CREATE:
  [+] FAB → setScreen("form") → Guardar → Toast → setScreen("list")

Flujo UPDATE:
  Tap Item → openEdit() → Editar → Guardar → Toast → setScreen("list")

Flujo DELETE:
  Long Press / [Eliminar] → setDeleteTarget() → Modal aparece 
  → Confirmar → confirmDelete() → Toast → Modal cierra

Validación:
  - Campos obligatorios (title, subtitle)
  - Alert.alert() si hay error
  - Solo guardar si válido
```

---

## 💻 SLIDE 5: Implementación - Código Clave

### 1️⃣ Estructura de Datos (TypeScript)
```tsx
type Item = {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  enabled: boolean;
  image: string;
};

type FormState = {
  title: string;
  subtitle: string;
  dateLabel: string;
  enabled: boolean;
};

// Estado global
const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
const [screen, setScreen] = useState<"list" | "form">("list");
const [editingId, setEditingId] = useState<string | null>(null);
const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
```

### 2️⃣ Pantalla de Listado (FlatList → RecyclerView)
```tsx
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={renderListItem}
  ItemSeparatorComponent={() => <View style={styles.separator} />}
  showsVerticalScrollIndicator={false}
/>

// Cada item es un Pressable con interacción:
const renderListItem = ({ item }: { item: Item }) => (
  <Pressable
    onPress={() => openEdit(item)}      // TAP = EDIT
    onLongPress={() => askDelete(item)} // LONG PRESS = DELETE
    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
  >
    <Image source={{ uri: item.image }} style={styles.avatar} />
    <View style={styles.cardBody}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      <View style={styles.cardMetaRow}>
        <Text style={styles.metaChip}>{item.dateLabel}</Text>
        <Text style={[styles.metaChip, item.enabled ? styles.metaOn : styles.metaOff]}>
          {item.enabled ? "Activo" : "Inactivo"}
        </Text>
      </View>
    </View>
    <Pressable onPress={() => askDelete(item)} style={styles.deleteButton}>
      <Text style={styles.deleteButtonText}>Eliminar</Text>
    </Pressable>
  </Pressable>
);
```

### 3️⃣ Formulario (TextInput + Switch + Pressable)
```tsx
// TextInput → EditText nativo
<TextInput
  value={form.title}
  onChangeText={(text) => setForm((current) => ({ ...current, title: text }))}
  placeholder="Escribe un titulo"
  placeholderTextColor="#7f8ea6"
  style={styles.input}
/>

// Selector con Pressable (sin librerías):
<View style={styles.optionRow}>
  {DATE_OPTIONS.map((option) => (
    <Pressable
      key={option}
      onPress={() => setForm((current) => ({ ...current, dateLabel: option }))}
      style={[styles.optionChip, form.dateLabel === option && styles.optionChipActive]}
    >
      <Text style={styles.optionChipText}>{option}</Text>
    </Pressable>
  ))}
</View>

// Switch → android.widget.Switch (Material 3)
<Switch
  value={form.enabled}
  onValueChange={(value) => setForm((current) => ({ ...current, enabled: value }))}
  trackColor={{ false: "#2c3647", true: "#6f9ef8" }}
  thumbColor={form.enabled ? "#ffffff" : "#d5dbe5"}
/>

// Guardar con validación
const saveItem = () => {
  if (!form.title.trim() || !form.subtitle.trim()) {
    Alert.alert("Validacion", "Completa titulo y subtitulo antes de guardar.");
    return;
  }
  
  if (editingId) {
    setItems((current) =>
      current.map((item) =>
        item.id === editingId ? { ...item, ...form } : item
      )
    );
    toast("Elemento actualizado con exito");
  } else {
    setItems((current) => [{ id: createId(), ...form, image: imageUrl }, ...current]);
    toast("Elemento creado con exito");
  }
  setScreen("list");
};
```

### 4️⃣ Diálogo de Eliminación (Modal Nativo)
```tsx
// Modal → AlertDialog.Builder nativo
<Modal 
  transparent 
  visible={deleteTarget !== null} 
  animationType="fade" 
  onRequestClose={() => setDeleteTarget(null)}
>
  <View style={styles.modalBackdrop}>
    <View style={styles.modalCard}>
      <Text style={styles.modalTitle}>Confirmar eliminacion</Text>
      <Text style={styles.modalText}>
        {deleteTarget ? `Vas a eliminar "${deleteTarget.title}". Esta accion no se puede deshacer.` : ""}
      </Text>
      <View style={styles.modalActions}>
        <Pressable onPress={() => setDeleteTarget(null)} style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </Pressable>
        <Pressable onPress={confirmDelete} style={[styles.actionButton, styles.dangerButton]}>
          <Text style={styles.dangerButtonText}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>

// Confirmar y mostrar Toast
const confirmDelete = () => {
  if (!deleteTarget) return;
  
  setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
  setDeleteTarget(null);
  toast("Elemento eliminado con exito"); // ← Toast.makeText() nativo
};
```

### 5️⃣ Toast Nativo (ToastAndroid API)
```tsx
// Toast → Toast.makeText() del sistema Android
const toast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }
  Alert.alert("Info", message); // Fallback iOS
};

// Se llama después de cada acción:
toast("Elemento creado con exito");
toast("Elemento actualizado con exito");
toast("Elemento eliminado con exito");
```

### 6️⃣ FAB con Animación (Bonus - Pressable + Animated)
```tsx
const pulse = useMemo(() => new Animated.Value(1), []);

<Pressable onPress={openCreate} style={styles.fab}>
  <Animated.Text style={[styles.fabText, { transform: [{ scale: pulse }] }]}>+</Animated.Text>
</Pressable>

// Efecto: botón con escala animada
```

---

## 🔍 Resumen Técnico

### Componentes React Native → Android Nativos

| RN Component | Android Native | En la App |
|---|---|---|
| `<FlatList>` | `RecyclerView` | Lista con scroll virtual |
| `<TextInput>` | `EditText` | Campos de formulario |
| `<Modal>` | `AlertDialog` | Dialog de confirmación |
| `<Switch>` | `Switch` | Toggle Material 3 |
| `<Pressable>` | `Button` / `ClickListener` | Botones interactivos |
| `ToastAndroid` | `Toast.makeText()` | Mensajes de feedback |
| `Image` | `ImageView` | Avatar del item |
| `ScrollView/FlatList` | `ScrollView`/`RecyclerView` | Contenedores |

### Material Design 3 en React Native
- ✅ Border radius redondeado (18-28dp)
- ✅ Elevación y sombras (elevation)
- ✅ Colores azul (#6f9ef8) y rojo (#ff5c5c)
- ✅ Espaciado consistente (padding/gap)
- ✅ Interacciones tactiles (pressed state con scale)
- ✅ Tema oscuro (#0b1220)

---

## 📋 Matriz de Entregables

| Requerimiento | ¿Cumplido? | Evidencia |
|---|---|---|
| Pantalla de Listado (READ) | ✅ | FlatList con items clickeables |
| Pantalla de Formulario (CREATE/UPDATE) | ✅ | TextInput, Switch, Pressable chips |
| Flujo de Eliminación (DELETE) | ✅ | Modal nativo + Toast |
| Interacción Tap → Edit | ✅ | `onPress={() => openEdit(item)}` |
| Interacción Long Press → Delete | ✅ | `onLongPress={() => askDelete(item)}` |
| Validación de campos | ✅ | Alert.alert() si vacío |
| Toast de éxito | ✅ | `ToastAndroid.show()` |
| Material 3 Styling | ✅ | Colores, sombras, rounded corners |
| Componentes base (NO librerías externas) | ✅ | Solo React Native base |
| TypeScript | ✅ | Types para Item, FormState |

---

## 🎓 Conclusión

### React Native: Puente Nativo
En React Native, cada componente JSX se mapea a un widget Android **real y nativo**:

```
JSX Code             Bridge             Android Runtime
─────────────────────────────────────────────────────
<FlatList> ───────→ RecyclerView ───→ Scroll virtual
<TextInput> ───────→ EditText ────→ Teclado nativo
<Modal> ───────────→ AlertDialog ─→ Dialog del sistema
ToastAndroid.show() ─→ Toast.makeText() ─→ Mensaje flotante
```

**Reto Educativo Logrado:** 
✅ Implementamos un CRUD que integra componentes nativos de Android a través de JavaScript, demostrando cómo funciona el puente ReactNative.
