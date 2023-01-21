import React, { useReducer, createContext } from "react";
import Index from "./pages/Index";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

export const ThemeContext = createContext()

export default function App() {
  const initialState = {
    page: 1,
    darkMode: true,
    searchMode: false,
    postLimit: 10,
    postTotal: 0,
    postType: 1, // 1 means saved, 2 means voted
    postSearch: '',
    postTags: [],
    posts: [],
  }

  const ACTIONS = {
    SET_REDUCER: 'SET_REDUCER'
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
    <ThemeContext.Provider value={{ ACTIONS, state, dispatch }}>
      <Router>
        <Routes>
          <Route exact path="/" element={<Index />} />
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}