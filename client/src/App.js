import React, { useReducer, createContext } from "react";
import Index from "./pages/Index";
import Authors from "./pages/Authors";
import Navigation from "./components/Navigation";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

export const ThemeContext = createContext()

export default function App() {
  const initialState = {
    page: 1,
    chunk: 5, // used as limit document
    postTotal: 0,
    postType: 1, // 1 means saved, 2 means voted
    searchType: 'title',
    search: '',
    darkMode: true,
    tags: [],
    posts: [],
    authors: [],
    toasts: []
  }

  const ACTIONS = {
    SET_REDUCER: 'setReducer'
  }

  const reducer = (state, action) => {
    const { type, payload } = action
    switch (type) {
      case ACTIONS.SET_REDUCER:
        return { ...state, ...payload }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <ThemeContext.Provider value={{ state, ACTIONS, dispatch }}>
      <Router>
        <Navigation />
        <Routes>
          <Route exact path="/" element={<Index />} />
          <Route path="/authors" element={<Authors />} />
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}