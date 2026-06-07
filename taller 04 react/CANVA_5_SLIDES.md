# 📱 5 DIAPOSITIVAS PARA CANVA - COPY/PASTE

---

# DIAPOSITIVA 1

## TÍTULO:
```
React Native: Puente Nativo a Android
```

## CONTENIDO DE TEXTO:
```
Objetivo: Implementar un CRUD Visual

React Native = Puente entre JavaScript y Componentes Nativos Android

✓ <Button> = android.widget.Button real
✓ <FlatList> = RecyclerView real
✓ ToastAndroid.show() = Toast.makeText() nativo
```

## CÓDIGO A MOSTRAR:
```tsx
import {
  FlatList,       // RecyclerView
  TextInput,      // EditText
  Modal,          // AlertDialog
  Switch,         // android.widget.Switch
  ToastAndroid,   // Toast.makeText()
} from "react-native";
```

---

# DIAPOSITIVA 2

## TÍTULO:
```
3 Pantallas del CRUD
```

## CONTENIDO DE TEXTO:
```
PANTALLA 1: LISTADO
• FlatList con items
• TAP = Editar
• LONG PRESS = Eliminar
• FAB [+] = Crear

PANTALLA 2: FORMULARIO
• TextInput (titulo, subtitulo)
• Switch (estado)
• Pressable Chips (fecha)

PANTALLA 3: CONFIRMACIÓN
• Modal de eliminación
• Toast de éxito
```

## CÓDIGO A MOSTRAR:
```
(No código, solo diagramas)
```

---

# DIAPOSITIVA 3

## TÍTULO:
```
Tipos de Datos (TypeScript)
```

## CONTENIDO DE TEXTO:
```
Definimos 2 tipos principales:
Item = Objeto de la lista
FormState = Objeto del formulario
```

## CÓDIGO A MOSTRAR:
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

const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
const [screen, setScreen] = useState<"list" | "form">("list");
const [form, setForm] = useState<FormState>(EMPTY_FORM);
const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
```

---

# DIAPOSITIVA 4

## TÍTULO:
```
Componentes Nativos: FlatList, TextInput, Modal
```

## CONTENIDO DE TEXTO:
```
Componente 1: FlatList (RecyclerView)
Muestra items con Tap y Long Press

Componente 2: Formulario
TextInput, Switch, Pressable Chips

Componente 3: Modal (AlertDialog)
Confirmar eliminación
```

## CÓDIGO A MOSTRAR:
```tsx
// FlatList con TAP y LONG PRESS
<FlatList
  data={items}
  renderItem={({ item }) => (
    <Pressable
      onPress={() => openEdit(item)}
      onLongPress={() => askDelete(item)}
    >
      <Image source={{ uri: item.image }} />
      <Text>{item.title}</Text>
      <Text>{item.subtitle}</Text>
    </Pressable>
  )}
/>

// TextInput (EditText)
<TextInput
  value={form.title}
  onChangeText={(text) => setForm({ ...form, title: text })}
  placeholder="Escribe un titulo"
/>

// Switch (Material 3)
<Switch
  value={form.enabled}
  onValueChange={(val) => setForm({ ...form, enabled: val })}
  trackColor={{ false: "#2c3647", true: "#6f9ef8" }}
/>

// Modal (AlertDialog)
<Modal visible={deleteTarget !== null} transparent>
  <View style={styles.modalBackdrop}>
    <View style={styles.modalCard}>
      <Text>Confirmar eliminación</Text>
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

# DIAPOSITIVA 5

## TÍTULO:
```
Toast + Flujos CRUD
```

## CONTENIDO DE TEXTO:
```
Toast = Toast.makeText() nativo del sistema

Flujos:
CREATE → Guardar → Toast "Creado"
UPDATE → Guardar → Toast "Actualizado"
DELETE → Confirmar → Toast "Eliminado"
```

## CÓDIGO A MOSTRAR:
```tsx
// Toast nativo del sistema Android
const toast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }
  Alert.alert("Info", message);
};

// CREATE
const openCreate = () => {
  setEditingId(null);
  setForm(EMPTY_FORM);
  setScreen("form");
};

// DELETE
const confirmDelete = () => {
  if (!deleteTarget) return;
  setItems((current) => 
    current.filter((item) => item.id !== deleteTarget.id)
  );
  setDeleteTarget(null);
  toast("Elemento eliminado con exito");
};

// COMPONENTES MAPEADOS
FlatList → RecyclerView
TextInput → EditText
Switch → android.widget.Switch
Modal → AlertDialog.Builder
ToastAndroid → Toast.makeText()
```

---

## ✅ LISTO PARA CANVA

Copia cada sección (TÍTULO + CONTENIDO + CÓDIGO) a cada diapositiva en Canva.
