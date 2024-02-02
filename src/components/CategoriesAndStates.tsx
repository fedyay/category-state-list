import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Grid,
  Paper,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface State {
  id: number;
  name: string;
  color?: string;
  frameColor?: string;
}

interface Category {
  id: number;
  name: string;
  color?: string;
  states: State[];
}

const unsortedStatesCategory: Category = {
  id: -1,
  name: "Unsorted States",
  color: "#CCCCCC",
  states: [
    { id: 5, name: "Unsorted 1" },
    { id: 6, name: "Unsorted 2" },
  ],
};

const CategoriesAndStates: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 2,
      name: "Galactic Outposts",
      color: "#FFD700",
      states: [
        { id: 3, name: "Nebula Nexus", color: "#FFD700" },
        { id: 4, name: "Starlight Station", color: "#FFD700" },
      ],
    },
    {
      id: 5,
      name: "Celestial Seas",
      color: "#4682B4",
      states: [
        { id: 9, name: "Sirens Cove", color: "#4682B4", frameColor: "#4B0082" },
        {
          id: 10,
          name: "Mermaid Lagoon",
          color: "#4682B4",
          frameColor: "#00FF00",
        },
      ],
    },
    {
      id: 3,
      name: "Empty category",
      color: "#32CD32",
      states: [],
    },
    {
      id: 1,
      name: "Aqua Ventures",
      color: "#00CED1",
      states: [
        { id: 1, name: "Mystic Lagoon", color: "#00CED1" },
        { id: 2, name: "Sunken Treasure", color: "#00CED1" },
      ],
    },
    {
      id: 4,
      name: "Mystical Mountains",
      color: "#8A2BE2",
      states: [
        {
          id: 7,
          name: "Dragons Peak",
          color: "#8A2BE2",
          frameColor: "#FFD700",
        },
        {
          id: 8,
          name: "Griffins Lair",
          color: "#8A2BE2",
          frameColor: "#FF8C00",
        },
      ],
    },
    unsortedStatesCategory,
  ]);

  const sortById = <T extends { id: number }>(items: T[]): T[] => {
    return [...items].sort((a, b) => a.id - b.id);
  };
  const [selectedStates, setSelectedStates] = useState<State[]>([]);
  const [sortedStates, setSortedStates] = useState<State[]>([]);
  const sortedCategories = sortById(categories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    sortedCategories[0] || null
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    sortedCategories[0]?.id || null
  );
  const [isStateSelected, setIsStateSelected] = useState<boolean>(false);
  const [isAddStateMode, setIsAddStateMode] = useState<boolean>(false);
  const [newStateName, setNewStateName] = useState<string>("");
  const [newStateId, setNewStateId] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  const [selectedMoveCategoryId, setSelectedMoveCategoryId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (selectedCategory) {
      setSortedStates(selectedCategory.states);
    }
  }, [selectedCategory]);

  useEffect(() => {
    setIsStateSelected(selectedStates.length > 0);
  }, [selectedStates]);

  useEffect(() => {
    setIsAddStateMode(false);
    setNewStateName("");
    setNewStateId("");
    setErrorText("");
  }, [selectedCategory]);

  const toggleStateSelection = (state: State) => {
    if (selectedStates.includes(state)) {
      setSelectedStates((prev) => prev.filter((s) => s !== state));
    } else {
      setSelectedStates((prev) => [...prev, state]);
    }

    setIsStateSelected(selectedStates.length > 0);
  };

  const handleCategoryClick = (targetCategoryId: number) => {
    if (selectedStates.length > 0) {
      // Do nothing here. States will only move when confirmed.
    } else {
      setSelectedCategory(
        categories.find((cat) => cat.id === targetCategoryId) || null
      );
      setSelectedCategoryId(targetCategoryId);
    }
  };

  const moveStatesToCategory = (targetCategoryId: number) => {
    const targetCategory = categories.find(
      (cat) => cat.id === targetCategoryId
    );

    if (targetCategory) {
      const targetColor = targetCategory.color;

      const updatedCategories = categories.map((cat) => {
        if (cat.id === targetCategoryId) {
          const updatedStates = selectedStates.map((state) => ({
            ...state,
            color: targetColor,
          }));
          return {
            ...cat,
            states: [...cat.states, ...updatedStates],
          };
        }
        if (cat.id === selectedCategory?.id) {
          return {
            ...cat,
            states: cat.states.filter(
              (state) => !selectedStates.includes(state)
            ),
          };
        }
        return cat;
      });

      setCategories(updatedCategories);
      setSelectedStates([]);

      const movedCategory = updatedCategories.find(
        (cat) => cat.id === targetCategoryId
      );
      if (movedCategory) {
        setSelectedCategory(movedCategory);
        setSelectedCategoryId(targetCategoryId);
      }

      setSortedStates(movedCategory?.states || []);
    }
  };

  const handleConfirmMove = () => {
    if (selectedMoveCategoryId && selectedStates.length > 0) {
      moveStatesToCategory(selectedMoveCategoryId);
      setSelectedStates([]);
      setSelectedMoveCategoryId(null);
    }
  };

  const handleCategorySelect = (targetCategoryId: number) => {
    setSelectedMoveCategoryId(targetCategoryId);
  };

  const handleMoveStates = () => {
    if (selectedStates.length > 0) {
      return (
        <div>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            <div style={{ marginRight: "10px" }}>
              <Select
                value={selectedMoveCategoryId || ""}
                label={"New"}
                onChange={(e) => handleCategorySelect(Number(e.target.value))}
              >
                {sortedCategories
                  .filter((category) => selectedCategory?.id !== category.id)
                  .map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            marginRight: "8px",
                            backgroundColor: category.color,
                          }}
                        />
                        {category.name}
                      </div>
                    </MenuItem>
                  ))}
              </Select>
            </div>
            <div>
              <Button
                variant="contained"
                color="success"
                onClick={handleConfirmMove}
                disabled={!selectedMoveCategoryId}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      );
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newSortedStates = Array.from(sortedStates);
    const [movedState] = newSortedStates.splice(result.source.index, 1);
    newSortedStates.splice(result.destination.index, 0, movedState);

    setSortedStates(newSortedStates);

    const updatedCategories = categories.map((cat) => {
      if (cat.id === selectedCategoryId) {
        return {
          ...cat,
          states: newSortedStates,
        };
      }
      return cat;
    });

    setCategories(updatedCategories);
  };

  const handleAddStateClick = () => {
    setIsAddStateMode(true);
  };

  const handleConfirmAddState = () => {
    if (!newStateName || !newStateId.trim()) {
      setErrorText("Please fill both fields.");
      return;
    }

    const newId = newStateId.trim();

    if (!/^\d+$/.test(newId)) {
      setErrorText("State ID must contain only digits (0-9).");
      return;
    }

    const numericId = parseInt(newId);

    const idConflict = categories.some((cat) =>
      cat.states.some((state) => state.id === numericId)
    );

    if (idConflict) {
      setErrorText("State ID already exists.");
      return;
    }

    const category = selectedCategory;

    if (category) {
      const newState: State = {
        id: numericId,
        name: newStateName,
        color: category.color,
      };

      const nameConflict = categories.some((cat) =>
        cat.states.some((state) => state.name === newStateName)
      );

      if (nameConflict) {
        setErrorText("State name must be unique.");
        return;
      }

      const updatedCategory = {
        ...category,
        states: [...category.states, newState],
      };

      const updatedCategories = categories.map((cat) =>
        cat.id === category.id ? updatedCategory : cat
      );

      setCategories(updatedCategories);
      setIsAddStateMode(false);
      setNewStateName("");
      setNewStateId("");
      setErrorText("");
    }
  };

  const handleCancelAddState = () => {
    setIsAddStateMode(false);
    setNewStateName("");
    setNewStateId("");
    setErrorText("");
  };

  return (
    <Grid container spacing={2} style={{ width: "100%", margin: "0" }}>
      <Grid item xs={4}>
        {sortedCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
          >
            <Paper
              elevation={3}
              style={{
                padding: "8px",
                maxWidth: "500px",
                margin: "auto",
                marginBottom: "4px",
                backgroundColor:
                  selectedCategoryId === category.id
                    ? "#e6f7ff"
                    : isStateSelected
                    ? "#f5f5f5"
                    : "inherit",
                border:
                  selectedCategoryId === category.id
                    ? "2px solid #4a90e2"
                    : "1px solid #ccc",
                cursor: "pointer",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  marginRight: "10px",
                  backgroundColor: category.color,
                }}
              />
              <Typography variant="h6">{category.name}</Typography>
              <div style={{ flex: 1 }} />
              <Typography variant="body2" color="textSecondary">
                id: {category.id}
              </Typography>
            </Paper>
          </div>
        ))}
      </Grid>

      <Grid item xs={8}>
        <Paper
          elevation={3}
          style={{
            padding: "10px",
            maxWidth: "800px",
            margin: "auto",
            marginBottom: "4px",
          }}
        >
          {selectedCategory ? (
            <div>
              {sortedStates.length > 0 ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="state-list" type="STATES">
                    {(provided, snapshot) => (
                      <List
                        dense
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {sortedStates.map((state, index) => (
                          <Draggable
                            key={state.id}
                            draggableId={state.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <ListItem
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                  }}
                                >
                                  <Checkbox
                                    checked={selectedStates.includes(state)}
                                    onChange={() => toggleStateSelection(state)}
                                  />
                                  <div
                                    style={{
                                      width: "16px",
                                      height: "16px",
                                      borderRadius: "50%",
                                      marginRight: "10px",
                                      backgroundColor: state.color,
                                      border: state.frameColor
                                        ? `2px solid ${state.frameColor}`
                                        : "none",
                                    }}
                                  />
                                  <ListItemText primary={state.name} />
                                  <ListItemSecondaryAction>
                                    <Typography
                                      variant="body2"
                                      style={{ marginRight: "10px" }}
                                    >
                                      id: {state.id}
                                    </Typography>
                                  </ListItemSecondaryAction>
                                </div>
                              </ListItem>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {handleMoveStates()}
                      </List>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <Typography variant="body1">
                  This category has no states.
                </Typography>
              )}
            </div>
          ) : (
            <Typography variant="body1">
              Select a category to view its states.
            </Typography>
          )}
          {!isAddStateMode && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddStateClick}
              style={{ marginTop: "10px" }}
            >
              Add New State
            </Button>
          )}
          {isAddStateMode && (
            <div style={{ marginTop: "10px", display: "flex" }}>
              <TextField
                label="State Name"
                value={newStateName}
                onChange={(e) => setNewStateName(e.target.value)}
                style={{ marginRight: "10px", flex: 1 }}
              />
              <TextField
                label="State ID"
                value={newStateId}
                onChange={(e) => {
                  const sanitizedValue = e.target.value.replace(/\s/g, "");
                  setNewStateId(sanitizedValue);
                }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmAddState}
                style={{ marginLeft: "10px" }}
              >
                Confirm
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelAddState}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </Button>
            </div>
          )}
          <Typography
            variant="caption"
            color="error"
            style={{ marginTop: "10px" }}
          >
            {errorText}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CategoriesAndStates;
