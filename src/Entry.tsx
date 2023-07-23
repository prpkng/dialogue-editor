import React, {Component} from "react";
import "./entry.css"

class Entry extends React.Component<{id: number, get: (id: number) => {key: string, value: string}, set: (id: number, key: string, value: string) => void}, { popup: boolean }> {
    state = { popup: false};

    setKey(key: string){
        this.props.set(this.props.id, key, this.props.get(this.props.id).value);
        this.setState(this.state)
    }
    setValue(value: string){
        this.props.set(this.props.id, this.props.get(this.props.id).key, value);
        this.setState(this.state)
    }

    setPopup(value: boolean) {
        this.setState({ popup: value })
    }
    
    isEmpty(){ return this.props.get(this.props.id).value == ""; }

    getVal() {
        const val = this.props.get(this.props.id).value
        if (val == "")
            return "[empty]"
        return val;
    }

    render(): React.ReactNode {
        return <div className="entry">
            <input type="text" name="key" placeholder="key" id="" value={this.props.get(this.props.id).key} 
            onChange={s => this.setKey(s.currentTarget.value)} />
            <button className={`${this.isEmpty() ? "empty" : ""} open-popup`} onClick={() => this.setPopup(true)}>
                {this.getVal()}
            </button>
            <div className={`full popup-bg ${this.state.popup ? "" : "hidden"}`}>
                <div className="popup-card">
                    <button className="cross material-symbols-outlined" onClick={() => this.setPopup(false)}>close</button>
                    <h1>Edit Dialogue</h1>
                    <textarea placeholder="Start writing some text..." name="value" cols={45} rows={12} value={this.props.get(this.props.id).value} onChange={s => this.setValue(s.target.value)}></textarea>
                </div>
            </div>
        </div>
    }
}




export default Entry;