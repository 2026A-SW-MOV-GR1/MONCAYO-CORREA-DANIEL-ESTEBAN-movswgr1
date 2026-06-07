import { useMemo, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

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

const DATE_OPTIONS = ["Hoy", "Mañana", "Fin de semana"];

const INITIAL_ITEMS: Item[] = [
  {
    id: "1",
    title: "Proyecto Mobile",
    subtitle: "Entrega en la semana 4",
    dateLabel: "Hoy",
    enabled: true,
    image: "https://picsum.photos/seed/mobile-a/200/200",
  },
  {
    id: "2",
    title: "Tarea UI",
    subtitle: "Revisar Material 3",
    dateLabel: "Mañana",
    enabled: false,
    image: "https://picsum.photos/seed/mobile-b/200/200",
  },
  {
    id: "3",
    title: "Expo Demo",
    subtitle: "Validacion en Android",
    dateLabel: "Fin de semana",
    enabled: true,
    image: "https://picsum.photos/seed/mobile-c/200/200",
  },
];

const EMPTY_FORM: FormState = {
  title: "",
  subtitle: "",
  dateLabel: DATE_OPTIONS[0],
  enabled: true,
};

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const toast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }
  Alert.alert("Info", message);
};

export default function App() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [screen, setScreen] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const pulse = useMemo(() => new Animated.Value(1), []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setScreen("form");
  };

  const openEdit = (item: Item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      subtitle: item.subtitle,
      dateLabel: item.dateLabel,
      enabled: item.enabled,
    });
    setScreen("form");
  };

  const saveItem = () => {
    if (!form.title.trim() || !form.subtitle.trim()) {
      Alert.alert("Validacion", "Completa titulo y subtitulo antes de guardar.");
      return;
    }

    if (editingId) {
      setItems((current) =>
        current.map((item) =>
          item.id === editingId
            ? { ...item, ...form, title: form.title.trim(), subtitle: form.subtitle.trim() }
            : item,
        ),
      );
      toast("Elemento actualizado con exito");
    } else {
      setItems((current) => [
        {
          id: createId(),
          title: form.title.trim(),
          subtitle: form.subtitle.trim(),
          dateLabel: form.dateLabel,
          enabled: form.enabled,
          image: `https://picsum.photos/seed/${encodeURIComponent(form.title.trim() || "new")}/200/200`,
        },
        ...current,
      ]);
      toast("Elemento creado con exito");
    }

    setScreen("list");
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const askDelete = (item: Item) => {
    setDeleteTarget(item);
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast("Elemento eliminado con exito");
  };

  const renderListItem = ({ item }: { item: Item }) => (
    <Pressable
      onPress={() => openEdit(item)}
      onLongPress={() => askDelete(item)}
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" />

      <View style={styles.backgroundGlowLeft} />
      <View style={styles.backgroundGlowRight} />

      <View style={styles.shell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>Taller 04</Text>
            <Text style={styles.title}>CRUD Visual</Text>
            <Text style={styles.subtitle}>
              Lista, formulario y confirmacion nativa para Android.
            </Text>
          </View>
        </View>

        {screen === "list" ? (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Listado</Text>
              <Text style={styles.sectionHint}>Tap para editar, long press para borrar</Text>
            </View>

            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={renderListItem}
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              showsVerticalScrollIndicator={false}
            />

            <Pressable onPress={openCreate} style={styles.fab}>
              <Animated.Text style={[styles.fabText, { transform: [{ scale: pulse }] }]}>+</Animated.Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{editingId ? "Actualizar" : "Crear"}</Text>
              <Text style={styles.sectionHint}>Usa los campos base de React Native</Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.inputLabel}>Titulo</Text>
              <TextInput
                value={form.title}
                onChangeText={(text) => setForm((current) => ({ ...current, title: text }))}
                placeholder="Escribe un titulo"
                placeholderTextColor="#7f8ea6"
                style={styles.input}
              />

              <Text style={styles.inputLabel}>Subtitulo</Text>
              <TextInput
                value={form.subtitle}
                onChangeText={(text) => setForm((current) => ({ ...current, subtitle: text }))}
                placeholder="Escribe un subtitulo"
                placeholderTextColor="#7f8ea6"
                style={[styles.input, styles.textArea]}
                multiline
              />

              <Text style={styles.inputLabel}>Selector de fecha</Text>
              <View style={styles.optionRow}>
                {DATE_OPTIONS.map((option) => {
                  const selected = form.dateLabel === option;

                  return (
                    <Pressable
                      key={option}
                      onPress={() => setForm((current) => ({ ...current, dateLabel: option }))}
                      style={[styles.optionChip, selected && styles.optionChipActive]}
                    >
                      <Text style={[styles.optionChipText, selected && styles.optionChipTextActive]}>
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.inputLabel}>Estado</Text>
                  <Text style={styles.switchHint}>{form.enabled ? "Elemento activo" : "Elemento inactivo"}</Text>
                </View>
                <Switch
                  value={form.enabled}
                  onValueChange={(value) => setForm((current) => ({ ...current, enabled: value }))}
                  trackColor={{ false: "#2c3647", true: "#6f9ef8" }}
                  thumbColor={form.enabled ? "#ffffff" : "#d5dbe5"}
                />
              </View>

              <View style={styles.formActions}>
                <Pressable onPress={() => setScreen("list")} style={[styles.actionButton, styles.secondaryButton]}>
                  <Text style={styles.secondaryButtonText}>Cancelar</Text>
                </Pressable>
                <Pressable onPress={saveItem} style={[styles.actionButton, styles.primaryButton]}>
                  <Text style={styles.primaryButtonText}>{editingId ? "Actualizar" : "Guardar"}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>

      <Modal transparent visible={deleteTarget !== null} animationType="fade" onRequestClose={() => setDeleteTarget(null)}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b1220",
  },
  shell: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backgroundGlowLeft: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: "rgba(111, 158, 248, 0.22)",
    top: -60,
    left: -70,
  },
  backgroundGlowRight: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: "rgba(255, 127, 80, 0.15)",
    top: 120,
    right: -60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  kicker: {
    color: "#8ba6d8",
    textTransform: "uppercase",
    letterSpacing: 1.4,
    fontSize: 12,
    marginBottom: 6,
  },
  title: {
    color: "#f5f7fb",
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: "#a9b8d1",
    marginTop: 6,
    maxWidth: 300,
    lineHeight: 20,
  },
  /* badge removed */
  content: {
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#f5f7fb",
    fontSize: 20,
    fontWeight: "700",
  },
  sectionHint: {
    color: "#8ea2c2",
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 120,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(12, 20, 36, 0.92)",
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(150, 174, 214, 0.16)",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    marginRight: 14,
    backgroundColor: "#213048",
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    color: "#f5f7fb",
    fontSize: 17,
    fontWeight: "700",
  },
  cardSubtitle: {
    color: "#9db0cb",
    marginTop: 4,
    lineHeight: 18,
  },
  cardMetaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
  },
  metaChip: {
    color: "#dce6ff",
    backgroundColor: "rgba(111, 158, 248, 0.16)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    overflow: "hidden",
  },
  metaOn: {
    backgroundColor: "rgba(72, 190, 140, 0.18)",
  },
  metaOff: {
    backgroundColor: "rgba(247, 122, 122, 0.18)",
  },
  deleteButton: {
    marginLeft: 12,
    backgroundColor: "#ff5c5c",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  separator: {
    height: 12,
  },
  fab: {
    position: "absolute",
    right: 4,
    bottom: 28,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#6f9ef8",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
    marginTop: -2,
  },
  formCard: {
    backgroundColor: "rgba(12, 20, 36, 0.94)",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(150, 174, 214, 0.16)",
  },
  inputLabel: {
    color: "#dce6ff",
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: "#132036",
    color: "#f5f7fb",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(150, 174, 214, 0.18)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionChip: {
    backgroundColor: "#132036",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(150, 174, 214, 0.18)",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  optionChipActive: {
    backgroundColor: "rgba(111, 158, 248, 0.22)",
    borderColor: "rgba(111, 158, 248, 0.6)",
  },
  optionChipText: {
    color: "#9db0cb",
    fontWeight: "600",
  },
  optionChipTextActive: {
    color: "#f5f7fb",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
  },
  switchHint: {
    color: "#8ea2c2",
    marginTop: 4,
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#1b2a41",
    borderWidth: 1,
    borderColor: "rgba(150, 174, 214, 0.18)",
  },
  secondaryButtonText: {
    color: "#dce6ff",
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: "#6f9ef8",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  dangerButton: {
    backgroundColor: "#ff5c5c",
  },
  dangerButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(5, 10, 18, 0.72)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#101a2c",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(150, 174, 214, 0.18)",
  },
  modalTitle: {
    color: "#f5f7fb",
    fontSize: 18,
    fontWeight: "800",
  },
  modalText: {
    color: "#a9b8d1",
    marginTop: 10,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
});