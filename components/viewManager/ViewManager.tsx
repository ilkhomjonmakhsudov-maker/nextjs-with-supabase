"use client";
import { useState } from "react";
import { GridView, ColumnStateItem, SortModelItem } from "@/shared/types";
import {
  Save,
  Plus,
  Trash2,
  RotateCcw,
  AlertCircle,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface ViewManagerProps {
  tableName: "orders" | "invoices";
  views: GridView[];
  activeView: GridView | null;
  hasUnsavedChanges: boolean;
  currentState: {
    columnState: ColumnStateItem[];
    filterModel: Record<string, unknown>;
    sortModel: SortModelItem[];
  };
  onSelectView: (view: GridView | null) => void;
  onCreateView: (name: string) => Promise<void>;
  onSaveView: () => Promise<void>;
  onDeleteView: (id: string) => Promise<void>;
  onResetDefault: () => void;
  loading?: boolean;
}

export default function ViewManager({
  views,
  activeView,
  hasUnsavedChanges,
  onSelectView,
  onCreateView,
  onSaveView,
  onDeleteView,
  onResetDefault,
}: ViewManagerProps) {
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveView();
      showFeedback("View saved");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!newViewName.trim()) return;
    setSaving(true);
    try {
      await onCreateView(newViewName.trim());
      setNewViewName("");
      setNameModalOpen(false);
      showFeedback("View created");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e: Event, id: string) => {
    e.preventDefault(); // prevent dropdown closing
    if (!confirm("Delete this view?")) return;
    await onDeleteView(id);
    showFeedback("View deleted");
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-2">
      {/* ── View Selector ── */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-3 border border-border hover:border-border-bright text-sm text-white/80 transition-all min-w-[160px] outline-none focus-visible:ring-1 focus-visible:ring-accent">
            <span className="flex-1 text-left truncate">
              {activeView ? activeView.name : "Default View"}
            </span>
            <ChevronsUpDown size={14} className="text-white/40 shrink-0" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={4}
            className="w-64 bg-accent border border-border rounded-xl shadow-2xl z-50 overflow-hidden p-1 animate-in fade-in-0 zoom-in-95"
          >
            <DropdownMenu.Item
              onSelect={() => onSelectView(null)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer outline-none text-white/70 data-[highlighted]:bg-surface-4 data-[highlighted]:text-white transition-colors"
            >
              <span>Default View</span>
              {!activeView && (
                <Check size={12} className="text-accent-bright" />
              )}
            </DropdownMenu.Item>

            {views.length > 0 && (
              <>
                <DropdownMenu.Separator className="h-px bg-border mx-2 my-1" />
                {views.map((v) => (
                  <DropdownMenu.Item
                    key={v.id}
                    onSelect={() => onSelectView(v)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer outline-none text-white/70 data-[highlighted]:bg-surface-4 data-[highlighted]:text-white transition-colors group"
                  >
                    <span className="flex-1 truncate">{v.name}</span>
                    <div className="flex items-center gap-1">
                      {activeView?.id === v.id && (
                        <Check size={12} className="text-accent-bright" />
                      )}
                      {/* Delete — separate Item to stop propagation */}
                      <DropdownMenu.Item
                        onSelect={(e) => handleDelete(e, v.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-red-400 hover:text-red-300 outline-none data-[highlighted]:bg-transparent transition-all"
                      >
                        <Trash2 size={13} />
                      </DropdownMenu.Item>
                    </div>
                  </DropdownMenu.Item>
                ))}
              </>
            )}

            <DropdownMenu.Separator className="h-px bg-border mx-2 my-1" />

            <DropdownMenu.Item
              onSelect={(e) => {
                e.preventDefault();
                setNameModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer outline-none text-white/50 data-[highlighted]:bg-surface-4 data-[highlighted]:text-white/80 transition-colors"
            >
              <Plus size={13} />
              Save as new view
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* ── Unsaved indicator ── */}
      {hasUnsavedChanges && (
        <div className="flex items-center gap-1.5 text-amber-400 text-xs">
          <AlertCircle size={13} />
          <span>Unsaved changes</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 ml-auto">
        <button
          onClick={onResetDefault}
          title="Reset to default"
          className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-surface-3 transition-all"
        >
          <RotateCcw size={15} />
        </button>

        {activeView ? (
          <button
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-dim disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-all"
          >
            <Save size={13} />
            {saving ? "Saving…" : "Save View"}
          </button>
        ) : (
          <button
            onClick={() => setNameModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-medium transition-all"
          >
            <Plus size={13} />
            Save View
          </button>
        )}
      </div>

      {/* ── New View Dialog ── */}
      <Dialog.Root open={nameModalOpen} onOpenChange={setNameModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-surface-2 border border-border rounded-2xl p-6 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95">
            <Dialog.Title className="text-white font-semibold mb-1">
              Save as New View
            </Dialog.Title>
            <VisuallyHidden.Root>
              <Dialog.Description>
                Enter a name for your new view
              </Dialog.Description>
            </VisuallyHidden.Root>

            <input
              autoFocus
              type="text"
              placeholder="View name…"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="w-full px-3 py-2 rounded-lg bg-surface-3 border border-border focus:border-accent outline-none text-white text-sm mb-4 mt-4 transition-colors"
            />

            <div className="flex gap-2 justify-end">
              <Dialog.Close asChild>
                <button
                  onClick={() => setNewViewName("")}
                  className="px-3 py-1.5 rounded-lg text-sm text-white/50 hover:text-white/80 transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleCreate}
                disabled={!newViewName.trim() || saving}
                className="px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-dim disabled:opacity-40 text-white text-sm font-medium transition-all"
              >
                {saving ? "Creating…" : "Create"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ── Feedback toast ── */}
      {feedback && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-surface-3 border border-border px-4 py-2.5 rounded-xl text-sm text-white/80 shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2">
          <Check size={14} className="text-green-400" />
          {feedback}
        </div>
      )}
    </div>
  );
}
