import React, {Component} from "react";
import "./entry.css"

class Entry extends React.Component<{id: number, get: (id: number) => {key: string, value: string}, set: (id: number, key: string, value: string) => void}, { popup: boolean, key: string}> {
    state = { popup: false, key: "test"};

    setKey(key: string){
        this.setState({popup: this.state.popup, key: key});
        this.props.set(this.props.id, key, "");
    }

    public getKey(){
        return this.state.key;
    }

    render(): React.ReactNode {
        return <div className="entry">
            <input type="text" name="key" placeholder="key" id="" value={this.props.get(this.props.id).key} 
            onChange={s => this.setKey(s.currentTarget.value)} />
            <button className="open-popup">open popup</button>
            <div className={`popup-bg ${this.state.popup ? "" : "hidden"}`}>

            </div>
        </div>
    }
}


export default Entry;