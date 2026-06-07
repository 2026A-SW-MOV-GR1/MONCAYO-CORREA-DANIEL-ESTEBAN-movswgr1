# 📝 GUIÓN SIMPLE DE EXPOSICIÓN

---

## SLIDE 1: INTRODUCCIÓN

"Hola, voy a presentar un CRUD Visual hecho en React Native con Expo.

React Native NO es híbrido como Ionic. No usa WebView.

React Native es un PUENTE NATIVO entre JavaScript y Android. 

Cuando escribo `<Button>` en React Native, se convierte en un `android.widget.Button` real.
Cuando escribo `<FlatList>`, se convierte en `RecyclerView` real.
Cuando llamo `ToastAndroid.show()`, se ejecuta `Toast.makeText()` del sistema Android.

Eso es lo importante: todo esto es NATIVO, no simulado.

Aquí importamos los componentes nativos que usaremos: FlatList, TextInput, Modal, Switch, ToastAndroid, Pressable."

---

## SLIDE 2: LAS 3 PANTALLAS

"Nuestro CRUD tiene 3 pantallas:

PANTALLA 1 - LISTADO:
- Mostramos items en una FlatList (que es RecyclerView nativo)
- Si haces TAP en un item: lo editas
- Si haces LONG PRESS: lo eliminas
- El botón [+] flotante: crea nuevo

PANTALLA 2 - FORMULARIO:
- Escribes título y subtítulo en TextInputs (son EditText nativos)
- Seleccionas fecha con chips (usando Pressable)
- Activas/desactivas con Switch (es android.widget.Switch)
- Guardas o cancelas

PANTALLA 3 - CONFIRMACIÓN:
- Aparece una Modal (que es AlertDialog nativo)
- Te pide que confirmes antes de eliminar
- Si confirmas, desaparece y muestra un Toast del sistema"

---

## SLIDE 3: TIPOS DE DATOS

"Usamos TypeScript para seguridad.

Creamos el tipo ITEM con:
- id: identificador único
- title: nombre del elemento
- subtitle: descripción
- dateLabel: la fecha
- enabled: si está activo o no
- image: URL de imagen

Creamos el tipo FORMSTATE con los mismos campos pero sin id e image.
Eso es solo para el formulario mientras editas.

Luego creamos 5 estados:
- items: la lista de elementos
- screen: dice si estamos en listado o formulario
- form: los datos del formulario actual
- deleteTarget: qué elemento vamos a eliminar
- editingId: si estamos editando, guarda el ID"

---

## SLIDE 4: COMPONENTES NATIVOS

"Aquí están los 3 componentes clave:

COMPONENTE 1 - FLATLIST:
La FlatList es RecyclerView nativo. 
Cada item es un Pressable que detecta:
- onPress: tap simple = editar
- onLongPress: presión larga = eliminar
React Native lo compila a RecyclerView verdadero.

COMPONENTE 2 - FORMULARIO:
TextInput es EditText nativo. Cuando escribes, actualiza el estado.
Switch es android.widget.Switch Material Design. Cuando cambias, actualiza enabled.
Los chips son Pressable estilizados. El seleccionado tiene otro color.

COMPONENTE 3 - MODAL:
Modal es AlertDialog nativo.
Aparece solo cuando quieres eliminar algo.
Tiene 2 botones: Cancelar (cierra) y Eliminar (ejecuta eliminación)"

---

## SLIDE 5: TOAST Y FLUJOS CRUD

"El Toast es Toast.makeText() del sistema Android. 
Es real, viene del SO. No es JavaScript simulando.

FLUJO CREATE:
1. Presionas [+] FAB
2. Se abre formulario vacío
3. Llenas los campos
4. Presionas Guardar
5. Se crea nuevo Item con ID único
6. Aparece Toast: 'Elemento creado con éxito'
7. Vuelves al listado

FLUJO UPDATE:
1. Haces tap en un item
2. Se carga en el formulario
3. Editas los campos
4. Presionas Guardar
5. Se actualiza el item existente
6. Aparece Toast: 'Elemento actualizado con éxito'
7. Vuelves al listado

FLUJO DELETE:
1. Haces long press en un item
2. Aparece Modal
3. Presionas Eliminar
4. Se elimina el item
5. Aparece Toast: 'Elemento eliminado con éxito'
6. Modal desaparece

TODO ESTO USA COMPONENTES NATIVOS REALES."

---

## CONCLUSIÓN

"En resumen:

React Native demuestra que con JavaScript puedes acceder a componentes Android nativos reales.

Los componentes que usamos:
- FlatList → RecyclerView
- TextInput → EditText
- Switch → android.widget.Switch
- Pressable → ClickListener
- Modal → AlertDialog
- ToastAndroid → Toast.makeText()

TODO ES NATIVO, NO SIMULADO.

Eso es lo especial de React Native.

Gracias."

---

## TIEMPO TOTAL: 7-8 MINUTOS
