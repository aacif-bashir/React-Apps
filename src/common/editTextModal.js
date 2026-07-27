import React, { useState, useEffect } from "react";

export default function EditTextModal({
  open,
  title = "",
  label = "Text",
  initialValue = "",
  onClose,
  onSave,
}) {
  const [value, setValue] = useState(initialValue);

  // Sync local state whenever the modal opens with a new initialValue
  useEffect(() => {
    if (open) {
      setValue(initialValue);
    }
  }, [open, initialValue]);

  const handleSave = () => {
    if (value.trim() !== "") {
      onSave(value.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onClose();
  };

  if (!open) return null;

  return (
    <div
      // onClose prop is a function that will be called when the user clicks outside the modal. it is used to close the modal
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      {/* Modal box — stop click from closing when clicking inside */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "24px",
          width: "100%",
          maxWidth: "360px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        {/* Title */}
        <h2 style={{ margin: "0 0 16px", fontSize: "18px" }}>{title}</h2>

        {/* Input */}
        <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>
          {label}
        </label>
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            padding: "8px 10px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxSizing: "border-box",
            outline: "none",
          }}
        />

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              background: "#fff",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={value.trim() === ""}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              background: value.trim() === "" ? "#aaa" : "#1976d2",
              color: "#fff",
              cursor: value.trim() === "" ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
