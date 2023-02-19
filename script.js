/***
 * Title : Scoreboard Application.
 * Author : Atik Ullah Khan.
 * Description : Manage states using 'redux' and vanilla javascript.
 * Date : 19/02/2023.
 ***/

// select dom elements
const allMatchesEl = document.querySelector(".all-matches");
const addMatchEl = document.querySelector(".lws-addMatch");
const resetScoreEl = document.querySelector(".lws-reset");

// action identifiers.
const RESET = "reset";
const ADD_MATCH = "add";
const DELETE_MATCH = "remove";
const INCREMENT = "increment";
const DECREMENT = "decrement";

// action creators.
const addMatch = () => {
  return {
    type: ADD_MATCH,
    payload: {
      total: 0,
    },
  };
};

const deleteMatch = (matchId) => {
  return {
    type: DELETE_MATCH,
    payload: {
      id: matchId,
    },
  };
};

const increment = (matchId, value) => {
  return {
    type: INCREMENT,
    payload: {
      id: matchId,
      value,
    },
  };
};

const decrement = (matchId, value) => {
  return {
    type: DECREMENT,
    payload: {
      id: matchId,
      value,
    },
  };
};

const resetScore = () => {
  return {
    type: RESET,
  };
};

// initial state.
const initialState = {
  uuid: 2,
  matches: [{ id: 1, total: 0 }],
};

// create reducer function.
const scoreboardReducer = (state = initialState, action) => {
  switch (action.type) {
    // add a new match.
    case ADD_MATCH: {
      const prevState = structuredClone(state);

      const newMatch = {
        id: prevState.uuid,
        total: action.payload.total,
      };

      const updatedMatches = [...prevState.matches, newMatch];

      const updatedState = {
        ...prevState,
        uuid: prevState.uuid + 1,
        matches: updatedMatches,
      };

      return updatedState;
    }

    // delete a single match.
    case DELETE_MATCH: {
      const matchId = action.payload.id;
      const prevState = structuredClone(state);

      const updatedMatches = prevState.matches.filter(
        (match) => match.id !== matchId
      );

      const updatedState = {
        ...prevState,
        matches: updatedMatches,
      };

      return updatedState;
    }

    // increment the score of a single match.
    case INCREMENT: {
      const matchId = action.payload.id;
      const value = action.payload.value;
      const prevState = structuredClone(state);

      const updatedMatches = prevState.matches.map((match) => {
        if (match.id === matchId) {
          return {
            ...match,
            total: match.total + value,
          };
        } else return { ...match };
      });

      const updatedState = {
        ...prevState,
        matches: updatedMatches,
      };

      return updatedState;
    }

    // decrement the score of a single match.
    case DECREMENT: {
      const matchId = action.payload.id;
      const value = action.payload.value;
      const prevState = structuredClone(state);

      const updatedMatches = prevState.matches.map((match) => {
        if (match.id === matchId) {
          return {
            ...match,
            total: Math.max(match.total - value, 0),
          };
        } else return { ...match };
      });

      const updatedState = {
        ...prevState,
        matches: updatedMatches,
      };

      return updatedState;
    }

    // reset score of all matches.
    case RESET: {
      const prevState = structuredClone(state);
      const updatedMatches = prevState.matches.map((match) => ({
        ...match,
        total: 0,
      }));

      const updatedState = {
        ...prevState,
        matches: updatedMatches,
      };

      return updatedState;
    }
    default: {
      return state;
    }
  }
};

// create store.
const store = Redux.createStore(scoreboardReducer);

// add event listener to delete, increment and decrement DOM elements.
const attachEventsListener = () => {
  const deleteMatchEls = document.querySelectorAll(".lws-delete");
  const incrementFormEls = document.querySelectorAll(".incrementForm");
  const decrementFormEls = document.querySelectorAll(".decrementForm");

  Array.from(deleteMatchEls).forEach((element) => {
    element.addEventListener("click", function () {
      const matchId = Number(this.dataset.matchId);

      store.dispatch(deleteMatch(matchId));
    });
  });

  Array.from(incrementFormEls).forEach((element) => {
    element.addEventListener("submit", function (e) {
      e.preventDefault();

      const matchId = Number(this.dataset.matchId);
      const value = Number(this.elements.increment.value);
      const absValue = Math.abs(value);

      store.dispatch(increment(matchId, absValue));
    });
  });

  Array.from(decrementFormEls).forEach((element) => {
    element.addEventListener("submit", function (e) {
      e.preventDefault();

      const matchId = Number(this.dataset.matchId);
      const value = Number(this.elements.decrement.value);
      const absValue = Math.abs(value);

      store.dispatch(decrement(matchId, absValue));
    });
  });
};

// template for creating a new match.
const matchTemplate = (match) => {
  const { id, total } = match;

  return `<div class="match">
          <div class="wrapper" >
            <button class="lws-delete" data-match-id="${id}">
              <img src="./image/delete.svg" alt="" />
            </button>
            <h3 class="lws-matchName">Match ${id}</h3>
          </div>
          <div class="inc-dec">
            <form class="incrementForm" data-match-id="${id}">
              <h4>Increment</h4>
              <input type="number" name="increment" class="lws-increment" />
            </form>
            <form class="decrementForm" data-match-id="${id}">
              <h4>Decrement</h4>
              <input type="number" name="decrement" class="lws-decrement" />
            </form>
          </div>
          <div class="numbers">
            <h2 class="lws-singleResult">${total}</h2>
          </div>
        </div>
      </div>`;
};

// generate HTML string for updating UI.
const generateHtmlString = (matches) => {
  return matches.map((match) => matchTemplate(match)).join();
};

// update the UI.
const render = () => {
  const state = store.getState();
  const matches = state.matches;

  const htmlString = generateHtmlString(matches);
  allMatchesEl.innerHTML = htmlString;

  attachEventsListener();
};

render();

store.subscribe(render);

addMatchEl.addEventListener("click", () => store.dispatch(addMatch()));
resetScoreEl.addEventListener("click", () => store.dispatch(resetScore()));
