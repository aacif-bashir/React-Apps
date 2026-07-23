/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material";

export default function CustomDeleteModal({
  id,
  title,
  message,
  onClose,
  open,
  onDelete,
  loading,
  type,
  zIndex,
}) {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      sx={{
        zIndex: zIndex ?? theme.zIndex.modal,
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        className: "rounded-lg",
      }}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      {message && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button disabled={loading} onClick={onClose} className="capitalize">
          Cancel
        </Button>
        <Button
          disabled={loading}
          variant="contained"
          onClick={() => onDelete(id)}
          color="error"
          className="capitalize"
        >
          {loading ? (
            <div className="flex gap-2 items-center">
              <CircularProgress size={14} color="inherit" />
              <div>{type.endsWith("e") ? type.slice(0, -1) : type}ing...</div>
            </div>
          ) : (
            type
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
