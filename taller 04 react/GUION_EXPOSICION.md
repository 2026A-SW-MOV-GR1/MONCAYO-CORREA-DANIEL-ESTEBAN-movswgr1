# 📝 GUIÓN DE EXPOSICIÓN - 5 DIAPOSITIVAS

---

## 🎯 DIAPOSITIVA 1: React Native - Puente Nativo

**TIEMPO: 1 minuto**

### QUÉ DECIR:

"Hola, voy a presentar un CRUD Visual implementado en **React Native con Expo**.

React Native **no es híbrido** como Ionic o Cordova. No usa WebView. Es un **puente nativo** entre JavaScript y componentes Android reales.

Cuando escribo en JavaScript, cada componente se mapea a un widget Android verdadero:
- Un `<Button>` en React Native = `android.widget.Button` real
- Un `<FlatList>` = `RecyclerView` real
- Un `ToastAndroid.show()` = `Toast.makeText()` del sistema

**El objetivo** es demostrar que esta integración realmente funciona.

*[Señala el código de imports]*

Aquí importamos los componentes nativos que usaremos en toda la app."

---

## 📋 DIAPOSITIVA 2: Las 3 Pantallas

**TIEMPO: 1.5 minutos**

### QUÉ DECIR:

"Nuestro CRUD tiene **tres pantallas principales**:

**Primera pantalla - LISTADO:**
- Mostramos los elementos en una `FlatList`, que internamente es un `RecyclerView` nativo
- El usuario puede hacer **tap en un item** para editar (UPDATE)
- **Long press** para eliminar (DELETE)
- **Botón flotante [+]** para crear nuevo (CREATE)

**Segunda pantalla - FORMULARIO:**
- El usuario ingresa título y subtítulo en `TextInputs` (que son `EditText` nativos)
- Selecciona una fecha con chips (usando `Pressable` components)
- Activa o desactiva con un `Switch` (que es un `android.widget.Switch` Material Design)
- Guarda o cancela

**Tercera pantalla - CONFIRMACIÓN:**
- Cuando intenta eliminar, aparece una `Modal` nativa (que es un `AlertDialog.Builder`)
- Muestra un mensaje de confirmación
- Al confirmar, se elimina el elemento y aparece un **Toast** (mensaje flotante del sistema Android)"

---

## 💾 DIAPOSITIVA 3: Tipos de Datos

**TIEMPO: 1 minuto**

### QUÉ DECIR:

"Usamos **TypeScript** para tener seguridad de tipos.

Definimos dos tipos principales:

**Tipo Item:**
- `id`: identificador único
- `title` y `subtitle`: datos del elemento
- `dateLabel`: la fecha seleccionada
- `enabled`: si está activo o inactivo
- `image`: URL de la imagen

**Tipo FormState:**
- Contiene los mismos campos pero sin el `id` ni la imagen
- Este tipo es solo para el estado del formulario mientras edita o crea

*[Señala los useState]*

Y creamos 5 estados principales:
- `items`: la lista de elementos
- `screen`: controla si mostramos listado o formulario
- `form`: los datos actuales del formulario
- `deleteTarget`: qué elemento se va a eliminar
- `editingId`: si estamos editando, guardamos el ID"

---

## 🛠️ DIAPOSITIVA 4: Componentes Nativos

**TIEMPO: 2 minutos**

### QUÉ DECIR:

"Aquí mostramos los **tres componentes nativos clave** de nuestra app.

**Componente 1: FlatList → RecyclerView**

*[Señala el FlatList]*

La `FlatList` recibe la lista de items y renderiza cada uno como un `Pressable`. El `Pressable` es importante porque:
- `onPress`: detecta un tap simple → editar el item
- `onLongPress`: detecta presión larga → mostrar opción de eliminar

Internamente, React Native compila esto a un `RecyclerView` nativo con optimización (virtualización).

**Componente 2: Formulario - TextInput, Switch y Pressable Chips**

*[Señala TextInput]*

El `TextInput` es un campo de texto que mapea a `EditText` nativo. Cuando el usuario escribe, actualizamos el estado `form`.

*[Señala Switch]*

El `Switch` es un toggle que mapea a `android.widget.Switch` de Material Design. Cuando cambia, actualizamos `enabled`.

*[Señala los Pressable chips]*

Los chips son `Pressable` components estilizados. El seleccionado tiene un color diferente.

**Componente 3: Modal → AlertDialog**

*[Señala Modal]*

La `Modal` es transparente y aparece solo cuando `deleteTarget` no es null. Muestra un `AlertDialog` nativo con:
- Botón Cancelar: cierra la modal sin hacer nada
- Botón Eliminar: ejecuta la eliminación"

---

## 🔔 DIAPOSITIVA 5: Toast y Flujos CRUD

**TIEMPO: 1.5 minutos**

### QUÉ DECIR:

"Ahora el **corazón de la app**: los flujos CRUD con feedback nativo.

**Toast Nativo:**

*[Señala la función toast]*

`ToastAndroid.show()` es la API nativa de Android para mostrar mensajes flotantes. Es real, viene del sistema operativo. No es un div flotante en JavaScript.

Después de cada operación (crear, editar, eliminar), mostramos un Toast con un mensaje.

**Flujo CREATE:**
1. Usuario presiona el FAB [+]
2. `openCreate()` limpia el formulario y cambia a pantalla 'form'
3. Usuario llena los campos
4. Presiona Guardar → `saveItem()`
5. Se crea un nuevo `Item` con ID único
6. Mostramos Toast: "Elemento creado con éxito"
7. Volvemos a la pantalla de listado

**Flujo UPDATE:**
1. Usuario hace tap en un item
2. `openEdit()` carga los datos del item en el formulario
3. Usuario edita los campos
4. Presiona Guardar → `saveItem()` detecta que `editingId` no es null
5. Actualiza el item existente
6. Mostramos Toast: "Elemento actualizado con éxito"
7. Volvemos a listado

**Flujo DELETE:**
1. Usuario hace long press en un item
2. `askDelete()` asigna ese item a `deleteTarget`
3. Modal aparece automáticamente
4. Usuario presiona Eliminar → `confirmDelete()`
5. Eliminamos el item de la lista
6. Mostramos Toast: "Elemento eliminado con éxito"
7. Modal cierra automáticamente

**Lo importante:** Todo esto usa **componentes nativos reales**. No es simulado en JavaScript."

---

## ✅ CONCLUSIÓN (30 segundos)

### QUÉ DECIR:

"En resumen, React Native demuestra que **con JavaScript podemos acceder a componentes Android nativos reales**.

Los componentes que mostramos:
- FlatList → RecyclerView (lista virtualizada)
- TextInput → EditText (campo de texto)
- Switch → android.widget.Switch (toggle)
- Pressable → ClickListener (interacción)
- Modal → AlertDialog (diálogo)
- ToastAndroid → Toast.makeText() (mensaje)

**Todo esto es nativo**, no un simulacro en JavaScript. Es el puente que hace única a React Native.

Gracias."

---

## ⏱️ TIEMPO TOTAL: 7-8 MINUTOS

---

## 🎤 TIPS PARA EXPONER:

✅ **Habla lentamente** - No apures
✅ **Señala el código** - Muestra en la pantalla mientras hablas
✅ **Dale énfasis a "nativo"** - Es el punto clave
✅ **Usa ejemplos reales** - "Cuando presionas long press aparece..."
✅ **No te pierdas en detalles** - Mantén el hilo principal
✅ **Practica antes** - Lee este guión 2-3 veces
✅ **Mira al profesor** - No solo la pantalla
✅ **Sonríe** - Demuestra seguridad

---

## 📱 SI TE PREGUNTAN...

**"¿Por qué usas React Native y no Flutter?"**
→ "Porque quería aprender cómo funciona el puente nativo entre JavaScript y componentes Android. React Native es más cercano a esto."

**"¿Qué es el Bridge?"**
→ "Es la capa que traduce JavaScript a código nativo. Cuando hago ToastAndroid.show(), el Bridge envía eso a Java/Kotlin que ejecuta Toast.makeText()."

**"¿Podría hacerse en Kotlin puro?"**
→ "Sí, pero requeriría mucho más código. React Native permite hacerlo en JavaScript y mapear a Android."

**"¿Por qué usas Expo?"**
→ "Expo facilita el desarrollo. Maneja la compilación automática. Sin Expo, tendría que compilar código nativo manualmente."

