# 📱 5 DIAPOSITIVAS COMPLETAS - PÁRRAFO + CÓDIGO

---

# DIAPOSITIVA 1

## TÍTULO:
**React Native: Puente Nativo a Android**

## PÁRRAFO:
React Native es un framework que funciona como un puente entre JavaScript y los componentes nativos de Android. A diferencia de las aplicaciones híbridas (que usan WebView), en React Native cada componente JSX se mapea directamente a un widget Android real. Esto significa que cuando escribimos código en JavaScript, se compila y se convierte en componentes nativos verdaderos que corren directamente en el sistema operativo. El objetivo de este taller es implementar un CRUD Visual (Create, Read, Update, Delete) que demuestre cómo React Native interactúa con componentes nativos como RecyclerView, EditText, AlertDialog y Toast del sistema Android.

## CÓDIGO:
```tsx
import {
  FlatList,       // RecyclerView
  TextInput,      // EditText
  Modal,          // AlertDialog
  Switch,         // android.widget.Switch
  ToastAndroid,   // Toast.makeText()
  Pressable,      // ClickListener
} from "react-native";
```

---

# DIAPOSITIVA 2

## TÍTULO:
**Las 3 Pantallas del CRUD Visual**

## PÁRRAFO:
Nuestra aplicación CRUD está dividida en tres pantallas principales que representan las operaciones fundamentales de gestión de datos. La primera pantalla es el Listado, donde mostramos todos los elementos en una FlatList (que internamente es un RecyclerView nativo). El usuario puede hacer tap en un item para editarlo o long press para eliminarlo. La segunda pantalla es el Formulario, donde el usuario ingresa datos mediante TextInputs, selecciona fechas con Pressable chips, activa o desactiva el estado con un Switch y finalmente guarda o cancela. La tercera pantalla es el Diálogo de Confirmación, una Modal nativa que pide confirmación antes de eliminar un elemento, y al confirmar muestra un Toast (mensaje flotante del sistema) indicando que la acción fue exitosa.

## CÓDIGO:
```
PANTALLA 1 - LISTADO (READ):
[📷] Proyecto Mobile          [Eliminar]
     Entrega en la semana 4
     Hoy | Activo

Acciones: TAP = Editar | LONG PRESS = Eliminar | [+] FAB = Crear

PANTALLA 2 - FORMULARIO (CREATE/UPDATE):
Titulo          [________________]
Subtitulo       [_____long text__]
Fecha           [Hoy] [Mañana] [Fin de semana]
Estado          [  |●  ] ←→
                [Cancelar] [Guardar]

PANTALLA 3 - CONFIRMACIÓN (DELETE):
┌─────────────────────────────┐
│ ⚠️ Confirmar eliminación    │
│ Vas a eliminar "Proyecto   │
│ Mobile". No se puede       │
│ deshacer.                   │
│ [Cancelar] [Eliminar]      │
└─────────────────────────────┘
✓ Toast: "Elemento eliminado con éxito"
```

---

# DIAPOSITIVA 3

## TÍTULO:
**Tipos de Datos y Estado (TypeScript)**

## PÁRRAFO:
Para garantizar seguridad de tipos y claridad en la estructura de datos, definimos dos tipos principales en TypeScript. El tipo "Item" representa cada elemento que se muestra en la lista, con propiedades como id, título, subtítulo, etiqueta de fecha, estado (enabled) e imagen. El tipo "FormState" representa el estado actual del formulario durante la creación o edición. Además, creamos varios estados usando useState hooks: items (lista de elementos), screen (controla si mostramos listado o formulario), form (estado actual del formulario), deleteTarget (elemento a eliminar), y editingId (para saber si estamos editando). Esta arquitectura nos permite mantener el estado separado y reaccionar a cambios de manera eficiente.

## CÓDIGO:
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
const [editingId, setEditingId] = useState<string | null>(null);
const [form, setForm] = useState<FormState>(EMPTY_FORM);
const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
```

---

# DIAPOSITIVA 4

## TÍTULO:
**Componentes Nativos Clave: FlatList, TextInput y Modal**

## PÁRRAFO:
La pantalla de listado utiliza FlatList, que internamente se compila a un RecyclerView nativo de Android. Cada item es un Pressable que detecta dos gestos: onPress (tap simple para editar) y onLongPress (presión larga para eliminar). Esto demuestra cómo React Native permite interacción táctil nativa. En el formulario, utilizamos TextInput para los campos de texto (que se mapean a EditText), un Switch para el estado (que es un android.widget.Switch Material 3), y Pressable chips para seleccionar fechas. Finalmente, la Modal de confirmación es un AlertDialog.Builder nativo que aparece cuando el usuario quiere eliminar, con botones para cancelar o confirmar. Cada uno de estos componentes es real y nativo, no una simulación en JavaScript.

## CÓDIGO:
```tsx
// FlatList → RecyclerView (Lista con Tap y Long Press)
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <Pressable
      onPress={() => openEdit(item)}
      onLongPress={() => askDelete(item)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
    </Pressable>
  )}
/>

// TextInput → EditText (Campo de texto)
<TextInput
  value={form.title}
  onChangeText={(text) => setForm((current) => ({ ...current, title: text }))}
  placeholder="Escribe un titulo"
  style={styles.input}
/>

// Switch → android.widget.Switch (Material 3)
<Switch
  value={form.enabled}
  onValueChange={(value) => setForm((current) => ({ ...current, enabled: value }))}
  trackColor={{ false: "#2c3647", true: "#6f9ef8" }}
  thumbColor={form.enabled ? "#ffffff" : "#d5dbe5"}
/>

// Modal → AlertDialog.Builder (Diálogo de confirmación)
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
**Toast Nativo y Flujos CRUD Completos**

## PÁRRAFO:
El Toast es un componente nativo del sistema Android que muestra mensajes flotantes de corta duración. En nuestro CRUD, utilizamos ToastAndroid.show() para mostrar mensajes de éxito después de cada operación. El flujo CREATE comienza cuando el usuario presiona el botón flotante (FAB), lo que abre el formulario vacío. Al guardar, validamos que los campos obligatorios no estén vacíos y luego creamos un nuevo Item con un ID único. El flujo UPDATE se activa cuando el usuario hace tap en un item existente, cargando sus datos en el formulario para edición. El flujo DELETE requiere confirmación: el usuario hace long press o presiona el botón rojo, se muestra la Modal, y al confirmar eliminamos el elemento y mostramos un Toast. Esta arquitectura garantiza que todas las operaciones sean validadas y el usuario reciba feedback inmediato del sistema a través de componentes nativos reales.

## CÓDIGO:
```tsx
// Toast → Toast.makeText() nativo del sistema Android
const toast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }
  Alert.alert("Info", message);
};

// CREATE: Abrir formulario vacío
const openCreate = () => {
  setEditingId(null);
  setForm(EMPTY_FORM);
  setScreen("form");
};

// Guardar (CREATE o UPDATE)
const saveItem = () => {
  if (!form.title.trim() || !form.subtitle.trim()) {
    Alert.alert("Validacion", "Completa titulo y subtitulo");
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
    setItems((current) => [
      { id: createId(), ...form, image: imageUrl },
      ...current,
    ]);
    toast("Elemento creado con exito");
  }
  setScreen("list");
};

// UPDATE: Cargar formulario con datos
const openEdit = (item: Item) => {
  setEditingId(item.id);
  setForm({ title: item.title, subtitle: item.subtitle, 
            dateLabel: item.dateLabel, enabled: item.enabled });
  setScreen("form");
};

// DELETE: Confirmar eliminación
const confirmDelete = () => {
  if (!deleteTarget) return;
  setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
  setDeleteTarget(null);
  toast("Elemento eliminado con exito");
};

// MAPEO DE COMPONENTES
FlatList → RecyclerView (lista virtualizada)
TextInput → EditText (campo de texto nativo)
Switch → android.widget.Switch (toggle Material 3)
Modal → AlertDialog.Builder (diálogo del sistema)
ToastAndroid → Toast.makeText() (mensaje flotante nativo)
```

---

## ✅ LISTO PARA CANVA
Copia cada TÍTULO + PÁRRAFO + CÓDIGO a cada diapositiva en Canva.
