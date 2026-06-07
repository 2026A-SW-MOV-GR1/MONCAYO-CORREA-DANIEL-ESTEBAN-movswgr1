# ✏️ EXACTO QUÉ PONER EN CADA SLIDE

---

## 🎯 SLIDE 1: Objetivo + ¿Qué es React Native?

### TEXTO A PONER:
```
TÍTULO: "React Native: Puente Nativo a Android"

CONTENIDO:
• Objetivo: Implementar un CRUD Visual
• React Native = Puente entre JavaScript y Componentes Nativos Android
• NO es híbrido (NO usa WebView como Ionic)
• Cada componente JSX se mapea a un widget Android REAL

Ejemplo:
  <Button> = android.widget.Button real
  <FlatList> = RecyclerView real
  ToastAndroid.show() = Toast.makeText() del sistema
```

### CÓDIGO A PONER:
```tsx
import {
  FlatList,       // ← RecyclerView
  TextInput,      // ← EditText
  Modal,          // ← AlertDialog
  Switch,         // ← android.widget.Switch
  ToastAndroid,   // ← Toast.makeText()
  Pressable,      // ← ClickListener
} from "react-native";
```

---

## 📋 SLIDE 2: Las 3 Pantallas del CRUD

### TEXTO A PONER:
```
TÍTULO: "Arquitectura: 3 Pantallas"

PANTALLA 1 - LISTADO (READ):
┌─────────────────────────────┐
│ [📷] Proyecto Mobile        │
│ Entrega en la semana 4      │
│ Hoy | Activo        [Elim]  │
├─────────────────────────────┤
│ [📷] Tarea UI               │
│ Revisar Material 3          │
│ Mañana | Inactivo   [Elim]  │
└─────────────────────────────┘

Acciones:
• TAP en item = Abrir formulario EDIT
• LONG PRESS = Mostrar Modal de confirmación
• [+] FAB = Ir a formulario CREATE


PANTALLA 2 - FORMULARIO (CREATE/UPDATE):
┌─────────────────────────────┐
│ Título      [_______________]
│ Subtítulo   [___long text___]
│ Fecha       [Hoy][Mañana][Fin]
│ Estado      [  |●  ] ←→
│             [Cancelar][Guardar]
└─────────────────────────────┘


PANTALLA 3 - CONFIRMACIÓN (DELETE):
┌─────────────────────────────┐
│ ⚠️  Confirmar eliminación    │
│                             │
│ Vas a eliminar "Proyecto  │
│ Mobile"                     │
│ Esta acción no se puede    │
│ deshacer.                   │
│                             │
│ [Cancelar]   [Eliminar]    │
└─────────────────────────────┘
     ↓
✓ Toast: "Elemento eliminado con éxito"
```

### CÓDIGO A PONER:
(Solo diagrama, sin código)

---

## 💾 SLIDE 3: Tipos de Datos + Estado

### TEXTO A PONER:
```
TÍTULO: "TypeScript: Modelos de Datos"

Definimos 2 tipos principales:
1. Item = Objeto que se muestra en la lista
2. FormState = Objeto del formulario
```

### CÓDIGO A PONER:
```tsx
// Tipo para cada item de la lista
type Item = {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  enabled: boolean;
  image: string;
};

// Tipo para el estado del formulario
type FormState = {
  title: string;
  subtitle: string;
  dateLabel: string;
  enabled: boolean;
};

// Estado de la aplicación
const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
const [screen, setScreen] = useState<"list" | "form">("list");
const [editingId, setEditingId] = useState<string | null>(null);
const [form, setForm] = useState<FormState>(EMPTY_FORM);
const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
```

---

## 🛠️ SLIDE 4: Componentes Clave (FlatList, TextInput, Modal)

### TEXTO A PONER:
```
TÍTULO: "3 Componentes Nativos Clave"

1. FlatList → RecyclerView (lista scrollable)
2. TextInput + Switch + Pressable → EditText + Switch + Chips (formulario)
3. Modal → AlertDialog (diálogo confirmación)
```

### CÓDIGO A PONER:

#### PARTE A: FlatList (Listado con Tap y Long Press)
```tsx
// FlatList = RecyclerView nativo
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <Pressable
      onPress={() => openEdit(item)}        // TAP = EDIT
      onLongPress={() => askDelete(item)}   // LONG PRESS = DELETE
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        <Text style={styles.metaChip}>{item.dateLabel}</Text>
      </View>
      <Pressable onPress={() => askDelete(item)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </Pressable>
    </Pressable>
  )}
/>
```

#### PARTE B: TextInput + Switch + Pressable (Formulario)
```tsx
// TextInput = EditText nativo
<TextInput
  value={form.title}
  onChangeText={(text) => setForm((current) => ({ ...current, title: text }))}
  placeholder="Escribe un titulo"
  style={styles.input}
/>

// Switch = android.widget.Switch (Material 3)
<Switch
  value={form.enabled}
  onValueChange={(value) => setForm((current) => ({ ...current, enabled: value }))}
  trackColor={{ false: "#2c3647", true: "#6f9ef8" }}
  thumbColor={form.enabled ? "#ffffff" : "#d5dbe5"}
/>

// Pressable Chips = Selector de fecha
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
```

#### PARTE C: Modal (Diálogo de confirmación)
```tsx
// Modal = AlertDialog.Builder nativo
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
```

---

## 🔔 SLIDE 5: Toast + Flujos CRUD

### TEXTO A PONER:
```
TÍTULO: "Toast Nativo + Flujos CRUD"

ToastAndroid = Toast.makeText() del sistema Android
(Mensajes flotantes nativos)
```

### CÓDIGO A PONER:

#### PARTE A: Toast Nativo
```tsx
// Toast = Toast.makeText() nativo del sistema Android
const toast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);  // ← NATIVO
    return;
  }
  Alert.alert("Info", message); // Fallback para iOS
};
```

#### PARTE B: Flujos CRUD
```tsx
// ===== CREATE =====
const openCreate = () => {
  setEditingId(null);
  setForm(EMPTY_FORM);
  setScreen("form");  // Mostrar formulario vacío
};

const saveItem = () => {
  // Validar
  if (!form.title.trim() || !form.subtitle.trim()) {
    Alert.alert("Validacion", "Completa titulo y subtitulo");
    return;
  }
  
  // Si es creación
  if (!editingId) {
    setItems((current) => [
      { id: createId(), ...form, image: `https://picsum.photos/seed/${form.title}/200/200` },
      ...current,
    ]);
    toast("Elemento creado con exito");  // ← Toast
  }
  
  // Volver al listado
  setScreen("list");
};

// ===== UPDATE =====
const openEdit = (item: Item) => {
  setEditingId(item.id);
  setForm({ title: item.title, subtitle: item.subtitle, dateLabel: item.dateLabel, enabled: item.enabled });
  setScreen("form");  // Mostrar formulario con datos
};

// Guardar (mismo saveItem de arriba pero detecta editingId)

// ===== DELETE =====
const askDelete = (item: Item) => {
  setDeleteTarget(item);  // Abre Modal
};

const confirmDelete = () => {
  if (!deleteTarget) return;
  
  setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
  setDeleteTarget(null);
  toast("Elemento eliminado con exito");  // ← Toast
};
```

---

## 📊 TABLA FINAL (Opcional en Slide 5)

```
Componente RN      | Widget Android Nativo  | En la app
─────────────────────────────────────────────────────
<FlatList>         | RecyclerView           | Listado de items
<TextInput>        | EditText               | Campos formulario
<Switch>           | android.widget.Switch  | Toggle Material 3
<Pressable>        | Button/ClickListener    | Botones
<Modal>            | AlertDialog.Builder    | Diálogo confirmación
ToastAndroid       | Toast.makeText()       | Mensajes feedback
<Image>            | ImageView              | Avatar items
```

---

## ✅ COPY-PASTE DIRECTO

**Slide 1:** Texto + Import
**Slide 2:** Texto + Diagramas (sin código)
**Slide 3:** Texto + Types + useState
**Slide 4:** Texto + 3 fragmentos (FlatList, FormInputs, Modal)
**Slide 5:** Texto + toast() + Flujos CRUD + Tabla (opcional)

