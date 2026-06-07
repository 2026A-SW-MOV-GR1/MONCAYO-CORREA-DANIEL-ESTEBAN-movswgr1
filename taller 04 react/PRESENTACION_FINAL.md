# 📱 TALLER 04: CRUD REACT NATIVE - 5 SLIDES CLAVE

---

## 🎯 SLIDE 1: Objetivo + ¿Qué es React Native?

### Objetivo
Implementar un **CRUD Visual** donde cada componente JSX se mapea a un **widget Android nativo**.

### React Native = Puente Nativo
```
JSX (JavaScript)  →  React Native Bridge  →  Componentes Android NATIVOS
```

### NO es híbrido (NO WebView)
- ✅ `<Button>` = `android.widget.Button` real
- ✅ `<FlatList>` = `RecyclerView` real
- ✅ `ToastAndroid.show()` = `Toast.makeText()` del sistema

### Imports principales:
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

## 📋 SLIDE 2: Las 3 Pantallas

### Pantalla 1: LISTADO (Read)
```
[📷] Proyecto Mobile          [Eliminar]
     Entrega en semana 4
     Hoy | Activo
     
[📷] Tarea UI                 [Eliminar]
     Revisar Material 3
     Mañana | Inactivo
```
- **Tap** = Editar
- **Long Press** = Eliminar
- **[+] FAB** = Crear nuevo

### Pantalla 2: FORMULARIO (Create/Update)
```
Titulo          [_______________]
Subtitulo       [_____long text_]
Fecha           [Hoy] [Mañana] [Fin de semana]
Estado          [  |●  ] ←→
                [Cancelar] [Guardar]
```

### Pantalla 3: CONFIRMACIÓN (Delete)
```
┌─────────────────────────────┐
│ ⚠️  Confirmar eliminación    │
│                             │
│ Vas a eliminar "Proyecto   │
│ Mobile". No se puede       │
│ deshacer.                   │
│                             │
│ [Cancelar] [Eliminar]      │
└─────────────────────────────┘

✓ Toast: "Elemento eliminado con éxito"
```

---

## 💾 SLIDE 3: Tipos de Datos + Estado

### Estructura TypeScript:
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
```

### Estado de la app:
```tsx
const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
const [screen, setScreen] = useState<"list" | "form">("list");
const [editingId, setEditingId] = useState<string | null>(null);
const [form, setForm] = useState<FormState>(EMPTY_FORM);
const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
```

---

## 🛠️ SLIDE 4: 3 Componentes Clave

### 1️⃣ FlatList → RecyclerView
```tsx
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <Pressable
      onPress={() => openEdit(item)}        // ← TAP
      onLongPress={() => askDelete(item)}   // ← LONG PRESS
    >
      <Image source={{ uri: item.image }} />
      <Text>{item.title}</Text>
      <Text>{item.subtitle}</Text>
    </Pressable>
  )}
/>
```

### 2️⃣ TextInput + Switch + Presable → EditText + Switch + Chips
```tsx
// TextInput (EditText)
<TextInput
  value={form.title}
  onChangeText={(text) => setForm({ ...form, title: text })}
  placeholder="Escribe un titulo"
/>

// Switch (android.widget.Switch - Material 3)
<Switch
  value={form.enabled}
  onValueChange={(val) => setForm({ ...form, enabled: val })}
  trackColor={{ false: "#2c3647", true: "#6f9ef8" }}
/>

// Pressable Chips (Selector fecha)
{DATE_OPTIONS.map((option) => (
  <Pressable
    onPress={() => setForm({ ...form, dateLabel: option })}
    style={[styles.chip, form.dateLabel === option && styles.chipActive]}
  >
    <Text>{option}</Text>
  </Pressable>
))}
```

### 3️⃣ Modal → AlertDialog.Builder
```tsx
<Modal visible={deleteTarget !== null} transparent animationType="fade">
  <View style={styles.modalBackdrop}>
    <View style={styles.modalCard}>
      <Text>Confirmar eliminación</Text>
      <Text>Vas a eliminar "{deleteTarget?.title}"</Text>
      
      <Pressable onPress={() => setDeleteTarget(null)}>
        <Text>Cancelar</Text>
      </Pressable>
      
      <Pressable onPress={confirmDelete}>
        <Text>Eliminar</Text>
      </Pressable>
    </View>
  </View>
</Modal>
```

---

## 🔔 SLIDE 5: Toast + Lógica CRUD

### Toast → Toast.makeText() del Sistema
```tsx
const toast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);  // ← NATIVO
    return;
  }
  Alert.alert("Info", message);
};
```

### Flujos CRUD:

**CREATE:**
```tsx
saveItem() → toast("Elemento creado con exito") → setScreen("list")
```

**UPDATE:**
```tsx
openEdit(item) → setEditingId(item.id) → saveItem() → toast("Actualizado") → setScreen("list")
```

**DELETE:**
```tsx
askDelete(item) → Modal aparece → confirmDelete() → toast("Eliminado") → Modal cierra
```

### Validación:
```tsx
if (!form.title.trim() || !form.subtitle.trim()) {
  Alert.alert("Validacion", "Completa todos los campos");
  return;
}
```

---

## 📊 Resumen: Mapeo JSX → Android Nativo

| Componente RN | Widget Android | En la app |
|---|---|---|
| `<FlatList>` | RecyclerView | Lista scrollable |
| `<TextInput>` | EditText | Campos de formulario |
| `<Switch>` | android.widget.Switch | Toggle Material 3 |
| `<Pressable>` | Button / ClickListener | Botones interactivos |
| `<Modal>` | AlertDialog.Builder | Diálogo confirmación |
| `ToastAndroid` | Toast.makeText() | Mensajes feedback |
| `<Image>` | ImageView | Avatar items |

---

## ✅ Conclusión

**React Native demuestra el puente nativo:**
- Código en JavaScript/JSX
- Se compila a componentes Android 100% nativos
- Sin WebView, sin Canvas como Flutter
- Acceso directo a APIs del sistema (Toast, Dialog, etc)

**Reto logrado:** CRUD Visual con componentes base de React Native integrados con Android.

