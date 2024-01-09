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
} from "@mui/material";

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
  const [selectedMoveCategory, setSelectedMoveCategory] =
    useState<Category | null>(null);
  const [isStateSelected, setIsStateSelected] = useState<boolean>(false);

  useEffect(() => {
    if (selectedCategory) {
      const sorted = sortById(selectedCategory.states);
      setSortedStates(sorted);
    }
  }, [selectedCategory]);

  useEffect(() => {
    setIsStateSelected(selectedStates.length > 0);
  }, [selectedStates]);

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
      setSortedStates(
        sortById(
          updatedCategories.find((cat) => cat.id === selectedCategoryId)
            ?.states || []
        )
      );
    }
  };

  const [isMoveStatesModalOpen, setIsMoveStatesModalOpen] = useState(false);

  const handleMoveStates = () => {
    setIsMoveStatesModalOpen(true);
  };

  const handleConfirmMove = () => {
    if (selectedMoveCategory && selectedStates.length > 0) {
      moveStatesToCategory(selectedMoveCategory.id);
      setSelectedStates([]);
      setIsMoveStatesModalOpen(false);
    }
  };

  const handleCategorySelect = (targetCategoryId: number) => {
    const category =
      categories.find((cat) => cat.id === targetCategoryId) || null;
    setSelectedMoveCategory(category);
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

        {isMoveStatesModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
              }}
            >
              <h4>Select a category to move the states to:</h4>
              <div>
                {sortedCategories.map((category) => {
                  if (category.id === selectedCategory?.id) return null;
                  return (
                    <div
                      key={category.id}
                      onClick={() => {
                        setSelectedMoveCategory(category);
                        handleCategorySelect(category.id);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        cursor: "pointer",
                        backgroundColor:
                          selectedMoveCategory?.id === category.id
                            ? "#e6f7ff"
                            : "inherit",
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
                      <Typography variant="body1">{category.name}</Typography>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleConfirmMove}
                >
                  Confirm
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setIsMoveStatesModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
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
                <List dense>
                  {sortedStates.map((state) => (
                    <ListItem key={state.id}>
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
                    </ListItem>
                  ))}
                  {selectedStates.length > 0 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleMoveStates}
                      style={{ marginTop: "10px" }}
                    >
                      Move Selected States
                    </Button>
                  )}
                </List>
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
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CategoriesAndStates;
