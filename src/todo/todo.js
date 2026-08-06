import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  IconButton,
  InputAdornment,
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
import ClearIcon from "@mui/icons-material/Clear";
import useDebouncer from "../common/useDebouncer";

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

  // Search functionality
  // using debouncer to delay the search query update to avoid excessive filtering on every keystroke
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncer(searchQuery, 300); // 300ms delay

  const filteredTodos = todos.filter(
    (
      todo, // use filteredTodos instead of todos in the map function to display only the filtered todos based on the search query
    ) => todo.text.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
  );
  const clearSearch = () => {
    setSearchQuery("");
  };
  // pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Number of todos per page
  const totalPages = Math.ceil(filteredTodos.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const lastIndex = startIndex + pageSize;
  const currentTodos = filteredTodos.slice(startIndex, lastIndex);

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
          <div style={{ marginTop: "16px", position: "relative" }}>
            <TextField
              fullWidth
              placeholder="Search todos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  paddingRight: searchQuery ? "48px" : "14px",
                },
              }}
            />
            {searchQuery && (
              <IconButton
                onClick={clearSearch}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "text.secondary",
                  "&:hover": {
                    color: "error.main",
                  },
                }}
                size="small"
              >
                <ClearIcon />
              </IconButton>
            )}
          </div>
          <List>
            {currentTodos.map((todo) => (
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
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              {filteredTodos.length === 0 && (
                <Typography variant="body1" color="text.secondary">
                  No todos found.
                </Typography>
              )}
            </div>
          </List>
          {filteredTodos.length > 0 && (
            <Stack direction="row" spacing={2} mt={4} alignItems="center">
              <Button
                variant="contained"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>

              <Typography>
                Page {currentPage} of {totalPages}
              </Typography>

              <Button
                variant="contained"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>

              <Typography sx={{ ml: "auto" }}>
                Total Todos: {filteredTodos.length}
              </Typography>
            </Stack>
          )}
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
