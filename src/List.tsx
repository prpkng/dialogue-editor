import React, { useEffect, useState } from 'react'
import "./list.css"
import Entry from './Entry';
import saveAsObject from './saving';
import { download, getCookie, setCookie } from './App';

const height = document.body.clientHeight;
const width = document.body.clientWidth;


const _reorderListForward = <T,>(l: T[], start: number, end: number) => {
    const temp = l[start];

    for (let i = start; i < end; i++) {
        l[i] = l[i + 1];
    }
    l[end - 1] = temp;

    return l;
};
const _reorderListBackward = <T,>(l: T[], start: number, end: number) => {
    const temp = l[start];

    for (let i = start; i > end; i--) {
        l[i] = l[i - 1];
    }

    l[end] = temp;

    return l;
};
const reorderList = <T,>(l: T[], start: number, end: number) => {
    if (start < end) return _reorderListForward([...l], start, end);
    else if (start > end) return _reorderListBackward([...l], start, end);

    return l; // if start == end
};

const handleChange = (id: number, key: string, value: string) => {
    data[id] = { key: key, value: value };
    if(items.length < data.length){
        for (var i = 0; i < items.length - data.length; i++){
            items.push(<Entry id={items.length} set={handleChange} get={getData} />)
        }
    }
    setCookie("data", JSON.stringify(data), 30);
}
function getData(id: number) {
    return data[id];
}

var data = [{ key: "key1", value: "" }];
var items = [<Entry id={0} set={handleChange} get={getData} />]

const addItem = () => {
    items.push(<Entry id={items.length} set={handleChange} get={getData} />)
    data.push({ key: `key${items.length + 1}`, value: "" })
    setCookie("data", JSON.stringify(data), 30);
}

if (getCookie("data") != "") {
    data = JSON.parse(getCookie("data"))
    while (data.length > items.length){
        items.push(<Entry id={items.length} set={handleChange} get={getData} />)
    }
}


const List = () => {

    





    //Store the index to the current dragged item
    const [dragged, setDragged] = useState<number | null>(null);


    const [mouse, setMouse] = useState<[number, number]>([0, 0]);

    // get mouse coordenates
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            setMouse([e.x, e.y]);
        };

        document.addEventListener("mousemove", handler);

        return () => document.removeEventListener("mousemove", handler);
    }, []);

    const [dropZone, setDropZone] = useState(0);

    // get closest drop zone
    useEffect(() => {
        if (dragged !== null) {
            // get all drop-zones
            const elements = Array.from(document.getElementsByClassName("drop-zone"));
            // get all drop-zones' y-axis position
            // if we were using a horizontally-scrolling list, we would get the .left property
            const positions = elements.map((e) => e.getBoundingClientRect().top);
            // get the difference with the mouse's y position
            const absDifferences = positions.map((v) => Math.abs(v - mouse[1]));

            // get the item closest to the mouse
            let result = absDifferences.indexOf(Math.min(...absDifferences));

            // if the item is below the dragged item, add 1 to the index
            if (result > dragged) result += 1;

            setDropZone(result);
        }
    }, [dragged, mouse]);


    //Drop item
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dragged !== null) {
                e.preventDefault();
                setDragged(null);

                items = reorderList([...items], dragged, dropZone);
            }
        };

        document.addEventListener("mouseup", handler);
        return () => document.removeEventListener("mouseup", handler);
    })




    const save = () => {
        console.log(data)
        var text = JSON.stringify(saveAsObject(data))
        
        download(text, "dialogue.json", "json");
    }


    return (
        <div className="container">


            <button className="save" onClick={save}>
                Save <span className="material-symbols-outlined">save</span>
            </button>

            {/* ----------FLOATING ITEM---------- */}
            {dragged !== null && (
                <div className="floating list-item"
                    style={{
                        left: `${mouse[0]}px`,
                        top: `${mouse[1]}px`,
                    }}
                >{items[dragged]}</div>
            )}

            {/* ----------MAIN LIST---------- */}
            <div className="list">
                {/* <div className={`dragging full ${dragged === null ? "hidden" : ""}`}></div> */}
                <div className={`list-item drop-zone ${dragged === null || dropZone !== 0 ? "hidden" : ""}`}></div>
                {items.map((value, index) => (
                    <>
                        {dragged !== index && (
                            <>
                                <div
                                    key={value.key}
                                    className="list-item"
                                >
                                    <div className="drag-area material-symbols-outlined" onMouseDown={(e) => {
                                        e.preventDefault();
                                        setDragged(index);
                                    }}>drag_indicator</div>
                                    {value}
                                </div>
                                <div className={`list-item drop-zone ${dragged === null ||
                                    dropZone !== index + 1 ? "hidden" : ""}`}></div>

                            </>
                        )}
                    </>
                ))}
                <div className="list-item-entry" onClick={addItem}>
                    <span className=''>+</span>
                </div>
            </div>
        </div>
    )



}

export default List;