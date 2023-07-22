import React from "react"
import "./app.css"
import List from "./List";

function App(){

    return (
        <div className="App">
            <div className="board">
                <h1>Dialogue Editor</h1>
                <List />
            </div>
        </div>
    );
}


export default App;