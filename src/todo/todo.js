import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CustomDeleteModal from "../common/deleteModal";
import EditTextModal from "../common/editTextModal";

function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = localStorage.getItem("todos");
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (e) {
      return [];
    }
  });

  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      text: input,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInput("");
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, text: newText };
        }
        return todo;
      }),
    );
  };
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  // Code of more option button
  const [anchorEl, setAnchorEl] = useState(null);
  // Stores the todo on which the user clicked so the Menu knows which todo to operate on.
  const [selectedTodo, setSelectedTodo] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, todo) => {
    setAnchorEl(event.currentTarget);
    setSelectedTodo(todo);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedTodo(null);
  };

  // Custom delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(null);
  useEffect(() => {
    try {
      // Save todos to localStorage whenever they change
      // stringify changes the array into a string so that it can be stored in localStorage
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (e) {
      console.warn("Storage restricted");
    }
  }, [todos]);

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            color="primary"
            fontWeight="bold"
            mb={4}
          >
            📝 Todo App
          </Typography>
          <Stack direction="row" spacing={2} mb={4}>
            <TextField
              fullWidth
              label="Enter Todo"
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addTodo}
            >
              Add
            </Button>
          </Stack>
          <List>
            {todos.map((todo) => (
              <Paper
                key={todo.id}
                elevation={2}
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <ListItem
                  disableGutters
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      textDecoration: todo.completed ? "line-through" : "none",
                      color: todo.completed ? "text.secondary" : "text.primary",
                    }}
                  >
                    {todo.text}
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={(e) => handleClick(e, todo)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Stack>
                </ListItem>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem
                    onClick={() => {
                      setEditModalOpen(selectedTodo);
                      setAnchorEl(null);
                    }}
                  >
                    <ListItemIcon>
                      <EditIcon />
                    </ListItemIcon>
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      deleteTodo(selectedTodo?.id);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <DeleteIcon color="error" />
                    </ListItemIcon>
                    Delete
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      toggleTodo(selectedTodo?.id);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      {selectedTodo?.completed ? (
                        <CheckCircleIcon />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </ListItemIcon>
                    {selectedTodo?.completed
                      ? "Mark as Incomplete"
                      : "Mark as Complete"}
                  </MenuItem>
                </Menu>
              </Paper>
            ))}
          </List>
          {/* Render a single Menu outside the list instead of creating one Menu for each todo.  */}
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem
              onClick={() => {
                setEditModalOpen(selectedTodo);
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                setDeleteModalOpen(selectedTodo);
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <DeleteIcon color="error" />
              </ListItemIcon>
              Delete
            </MenuItem>
            <MenuItem
              onClick={() => {
                toggleTodo(selectedTodo?.id);
                handleClose();
              }}
            >
              <ListItemIcon>
                {selectedTodo?.completed ? (
                  <CheckCircleIcon />
                ) : (
                  <RadioButtonUncheckedIcon />
                )}
              </ListItemIcon>
              {selectedTodo?.completed
                ? "Mark as Incomplete"
                : "Mark as Complete"}
            </MenuItem>
          </Menu>
        </Paper>
      </Container>

      <CustomDeleteModal
        id={deleteModalOpen?.id}
        title="Delete Todo"
        message={`Are you sure you want to delete "${deleteModalOpen?.text}"?`}
        open={Boolean(deleteModalOpen)}
        onClose={() => setDeleteModalOpen(null)}
        onDelete={(id) => {
          deleteTodo(id);
          setDeleteModalOpen(null);
        }}
        loading={false}
        type="Delete"
      />
      <EditTextModal
        open={Boolean(editModalOpen)}
        title="Edit Todo"
        label="Todo text"
        initialValue={editModalOpen?.text ?? ""}
        onClose={() => setEditModalOpen(null)}
        onSave={(newText) => {
          editTodo(editModalOpen?.id, newText);
          setEditModalOpen(null);
        }}
      />
    </>
  );
}

export default App;
